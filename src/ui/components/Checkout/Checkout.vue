<script lang="ts" setup>
import { onMounted, onUnmounted, ref, type ComputedRef, computed } from 'vue'
import { createErc20Contract } from '@devprotocol/dev-kit'
import {
	positionsCreate,
	positionsCreateWithEth,
} from '@devprotocol/dev-kit/agent'
import { connection as getConnection } from '../../../connection'
import {
	isNotError,
	type UndefinedOr,
	whenDefined,
	whenDefinedAll,
	whenNotError,
} from '@devprotocol/util-ts'
import {
	type BigNumberish,
	type ContractRunner,
	JsonRpcProvider,
	MaxUint256,
	formatUnits,
	parseUnits,
} from 'ethers'
import BigNumber from 'bignumber.js'
import { type Subscription, combineLatest } from 'rxjs'
import { CurrencyOption } from '../../../constants/currencyOption'
import { fetchDevForEth, fetchSTokens } from '../../../fixtures/utility'
import Skeleton from '../Skeleton/Skeleton.vue'
import {
	stakeWithAnyTokens,
	mintedIdByLogs,
	getTokenAddress,
} from '../../../fixtures/dev-kit'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Result from './Result.vue'
import { tags, attrs } from '../../../constants/dompurify'
import { ProseTextInherit } from '../../../constants'
import { i18nFactory } from '../../../i18n'
import { Strings } from './i18n'

let providerPool: UndefinedOr<ContractRunner>
let subscriptions: Subscription[] = []
const REGEX_DESC_ACCOUNT = /{ACCOUNT}/g
const REGEX_DESC_EMAIL = /{EMAIL}/g

const i18nBase = i18nFactory(Strings)
let i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(['en']))

type Props = {
	amount?: number
	destination?: string
	currency?: 'USDC' | 'ETH' | 'DEV' | 'MATIC' | Lowercase<CurrencyOption>
	feeBeneficiary?: string
	feePercentage?: number
	payload?: Uint8Array | string
	rpcUrl: string
	description?: string
	useDiscretePaymentFlow?: boolean
	useInjectedTransactionForm?: boolean
	fiatCurrency?: string
	itemImageSrc?: string
	itemName?: string
	accessControlUrl?: string
	accessControlDescription?: string
}
const props = defineProps<Props>()

const stakeSuccessful = ref<boolean>(false)
const account = ref<UndefinedOr<string>>(undefined)
const email = ref<UndefinedOr<string>>(undefined)
const isApproving = ref<boolean>(false)
const isFetchingApproval = ref<UndefinedOr<'progress' | Error>>(undefined)
const isStaking = ref<boolean>(false)
const isWaitingForStaked = ref<boolean>(false)
const feeAmount = ref<UndefinedOr<number>>(undefined)
const chain = ref<UndefinedOr<number>>(undefined)
const previewImageSrc = ref<UndefinedOr<string>>(props.itemImageSrc)
const previewName = ref<UndefinedOr<string>>(props.itemName)
const stakingAmount = ref<UndefinedOr<number>>(undefined)
const directAmount = ref<UndefinedOr<number>>(undefined)
const isCheckingAccessControl = ref<boolean>(false)
const accessControlError = ref<UndefinedOr<Error>>(undefined)
const accessAllowed = ref<UndefinedOr<boolean>>(undefined)
const mintedId = ref<UndefinedOr<bigint>>(undefined)
const insufficientFunds = ref<UndefinedOr<Error>>(undefined)
const isFetchingFunds = ref<UndefinedOr<'progress' | Error>>(undefined)
const stakingError = ref<UndefinedOr<Error>>(undefined)

const verifiedPropsCurrency: ComputedRef<CurrencyOption> = computed(() => {
	return props.currency?.toUpperCase() === 'ETH'
		? CurrencyOption.ETH
		: props.currency?.toUpperCase() === 'USDC'
		? CurrencyOption.USDC
		: props.currency?.toUpperCase() === 'MATIC'
		? CurrencyOption.MATIC
		: CurrencyOption.DEV
})
const usePolygonWETH: ComputedRef<boolean> = computed(() => {
	return (
		verifiedPropsCurrency.value === CurrencyOption.ETH &&
		typeof chain.value === 'number' &&
		(chain.value === 137 || chain.value === 80001)
	)
})
const useEthreumWMATIC: ComputedRef<boolean> = computed(() => {
	return (
		verifiedPropsCurrency.value === CurrencyOption.MATIC &&
		typeof chain.value === 'number' &&
		chain.value === 1
	)
})
const useERC20: ComputedRef<boolean> = computed(() => {
	return (
		(verifiedPropsCurrency.value !== CurrencyOption.ETH &&
			verifiedPropsCurrency.value !== CurrencyOption.MATIC) ||
		usePolygonWETH.value ||
		useEthreumWMATIC.value
	)
})
const approveNeeded = ref<UndefinedOr<boolean>>(useERC20.value)
const htmlDescription: ComputedRef<UndefinedOr<string>> = computed(() => {
	return (
		props.description && DOMPurify.sanitize(marked.parse(props.description))
	)
})
const htmlVerificationFlow: ComputedRef<UndefinedOr<string>> = computed(() => {
	const accountAddress = account.value ?? ''
	const emailAddress = email.value ?? ''
	return (
		props.accessControlDescription &&
		DOMPurify.sanitize(
			marked.parse(
				props.accessControlDescription
					.replace(REGEX_DESC_ACCOUNT, accountAddress)
					.replace(REGEX_DESC_EMAIL, emailAddress)
			),
			{
				ALLOWED_TAGS: [...tags, 'iframe'],
				ALLOWED_ATTR: [
					...attrs,
					'src',
					'frameborder',
					'onmousewheel',
					'width',
					'height',
					'style',
				],
			}
		)
	)
})
const accessControlUrl: ComputedRef<UndefinedOr<URL>> = computed(() => {
	return whenDefinedAll(
		[
			props.accessControlUrl,
			account.value,
			typeof window !== 'undefined' ? window.location.origin : undefined,
		],
		([_accessControl, _account, _viewer]) => {
			const url = _accessControl.startsWith('http')
				? new URL(_accessControl)
				: new URL(_accessControl, _viewer)
			url.searchParams.set('account', _account)
			return url
		}
	)
})
const parsedAmount: ComputedRef<UndefinedOr<bigint>> = computed(() =>
	props.amount && !props.useDiscretePaymentFlow
		? parseUnits(
				props.amount.toString(),
				verifiedPropsCurrency.value === CurrencyOption.ETH ||
					verifiedPropsCurrency.value === CurrencyOption.DEV ||
					verifiedPropsCurrency.value === CurrencyOption.MATIC
					? 18
					: verifiedPropsCurrency.value === CurrencyOption.USDC
					? 6
					: (18 as never)
		  )
		: undefined
)
const isPriced = computed<boolean>(() => props.amount !== undefined)

const approve = function () {
	whenDefinedAll(
		[
			providerPool,
			account.value,
			props.destination,
			parsedAmount.value,
			chain.value,
		],
		async ([_prov, _account, _destination, _amount, _chain]) => {
			const res =
				verifiedPropsCurrency.value === CurrencyOption.DEV
					? await positionsCreate({
							provider: _prov,
							destination: _destination,
							from: _account,
							amount: _amount.toString(),
					  })
					: await stakeWithAnyTokens({
							provider: _prov,
							propertyAddress: _destination,
							from: _account,
							tokenAmount: _amount.toString(),
							currency: verifiedPropsCurrency.value,
							chain: _chain,
					  }).then((res) => res?.create())

			whenDefined(res, async (_res) => {
				const { waitOrSkipApproval } = await _res.approveIfNeeded({
					amount: MaxUint256.toString(),
				})
				isApproving.value = true
				await waitOrSkipApproval()
				console.log('approve res is: ', res)
				isApproving.value = false
				approveNeeded.value = false
			})
		}
	)
}
const checkApproved = async function (
	provider: ContractRunner,
	userAddress: string,
	destination: string,
	amount: BigNumberish,
	chain: number
) {
	isFetchingApproval.value = 'progress'
	const res =
		verifiedPropsCurrency.value === CurrencyOption.DEV
			? await positionsCreate({
					provider,
					destination,
					from: userAddress,
					amount: amount.toString(),
			  }).catch((err: Error) => err)
			: await stakeWithAnyTokens({
					provider,
					propertyAddress: destination,
					from: userAddress,
					tokenAmount: amount.toString(),
					currency: verifiedPropsCurrency.value,
					chain,
			  })
					.then((res) => res?.create().catch((err: Error) => err))
					.catch((err: Error) => err)
	approveNeeded.value = whenDefined(
		res,
		(x) => isNotError(x) && x.approvalNeeded
	)
	isFetchingApproval.value = isNotError(res) ? undefined : res
	console.log({ approveNeeded })
}
const checkBalance = async function (
	provider: JsonRpcProvider,
	userAddress: string,
	chain: number
) {
	isFetchingFunds.value = 'progress'
	const token = getTokenAddress(verifiedPropsCurrency.value, chain)
	const res = useERC20.value
		? await createErc20Contract(provider)(token)
				.balanceOf(userAddress)
				.catch((err: Error) => err)
		: await provider.getBalance(userAddress).catch((err: Error) => err)
	console.log({
		useERC20: useERC20.value,
		token,
		res,
		parsedAmount: parsedAmount.value,
	})
	const insufficient = whenDefined(
		parsedAmount.value,
		(amount) => isNotError(res) && BigInt(res) < BigInt(amount)
	)
	isFetchingFunds.value = isNotError(res) ? undefined : res
	insufficientFunds.value = insufficient
		? new Error(
				`Insufficient token balance. Please check you're using the correct wallet.`
		  )
		: undefined
}
const fetchAccessControl = async (_accessControl: URL) => {
	const res = await fetch(_accessControl).catch((err: Error) => err)
	const result = await whenNotError(res, async (r) =>
		r.ok
			? r
					.text()
					.then((txt: string) => txt)
					.catch((err: Error) => err)
			: new Error('Bad request')
	)
	return result instanceof Error ? result : Number(result) === 1
}
const submitStake = async function () {
	debugger
	;(await whenDefinedAll(
		[
			providerPool,
			account.value,
			props.destination,
			props.amount,
			parsedAmount.value?.toString(),
			chain.value,
		],
		async ([_prov, _account, _destination, _amount, _parsedAmount, _chain]) => {
			const id =
				verifiedPropsCurrency.value === CurrencyOption.ETH &&
				!usePolygonWETH.value
					? await (async () => {
							// handle ETH stake
							const res = await positionsCreateWithEth({
								provider: _prov,
								destination: _destination,
								ethAmount: _parsedAmount,
								gatewayAddress: props.feeBeneficiary ?? undefined,
								gatewayBasisPoints:
									typeof props.feePercentage === 'number'
										? props.feePercentage * 10_000
										: undefined,
								payload: props.payload,
							}).catch((err: Error) => {
								stakingError.value = new Error(
									`Failed to send transaction with ${verifiedPropsCurrency.value}: ${err.message}`
								)
								return undefined
							})
							return whenDefined(res, async (_res) => {
								isStaking.value = true
								const create = await _res.create()
								isWaitingForStaked.value = true
								const res = await create.wait()
								if (!res) return
								const id_ = await mintedIdByLogs(res.logs)
								console.log('res is: ', res)
								console.log({ id_ })
								return id_
							})
					  })()
					: verifiedPropsCurrency.value === CurrencyOption.ETH ||
					  verifiedPropsCurrency.value === CurrencyOption.USDC ||
					  verifiedPropsCurrency.value === CurrencyOption.MATIC
					? await (async () => {
							const res = await stakeWithAnyTokens({
								provider: _prov,
								propertyAddress: _destination,
								tokenAmount: _amount.toString(),
								currency: verifiedPropsCurrency.value,
								gatewayAddress: props.feeBeneficiary ?? undefined,
								gatewayBasisPoints:
									typeof props.feePercentage === 'number'
										? props.feePercentage * 10_000
										: undefined,
								payload: props.payload,
								from: _account,
								chain: _chain,
							}).catch((err: Error) => {
								stakingError.value = new Error(
									`Failed to send transaction with ${verifiedPropsCurrency.value}: ${err.message}`
								)
								return undefined
							})
							return whenDefined(res, async (_res) => {
								isStaking.value = true
								const create = await _res.create()
								const approveIfNeeded = await create?.approveIfNeeded({
									amount: _parsedAmount,
								})
								const waitOrSkipApproval =
									await approveIfNeeded?.waitOrSkipApproval()
								const run = await waitOrSkipApproval?.run()
								isWaitingForStaked.value = true
								const res = await run?.wait()
								if (!res) return
								const id_ = await mintedIdByLogs(res.logs)
								console.log('res is: ', res)
								console.log({ id_ })
								return id_
							})
					  })()
					: await (async () => {
							// handle DEV stake
							const res = await positionsCreate({
								provider: _prov,
								from: _account,
								destination: _destination,
								amount: _parsedAmount,
								payload: props.payload,
							}).catch((err: Error) => {
								stakingError.value = new Error(
									`Failed to send transaction with ${verifiedPropsCurrency.value}: ${err.message}`
								)
								return undefined
							})

							return whenDefined(res, async (_x) => {
								isStaking.value = true
								const approveIfNeeded = await _x.approveIfNeeded()
								const waitOrSkipApproval =
									await approveIfNeeded.waitOrSkipApproval()
								const run = await waitOrSkipApproval.run()
								isWaitingForStaked.value = true
								const res = await run.wait()
								if (!res) return
								const id_ = await mintedIdByLogs(res.logs)
								console.log('res is: ', res)
								console.log({ id_ })
								return id_
							})
					  })()
			onCompleted({ detail: { id } })
			return id
		}
	)) ??
		(() => {
			stakingError.value = new Error('Missing required data.')
		})()
}
const onCompleted = function (ev?: { detail?: { id?: bigint } }) {
	isStaking.value = false
	isWaitingForStaked.value = false
	stakeSuccessful.value = true
	mintedId.value = ev?.detail?.id
}

onMounted(async () => {
	const sub = combineLatest([
		getConnection().provider,
		getConnection().account,
		getConnection().chain,
		getConnection().identifiers,
	]).subscribe(async ([_provider, _account, _chain, _identifiers]) => {
		providerPool = _provider
		account.value = _account
		chain.value = _chain
		email.value = _identifiers?.email
		i18n.value = i18nBase(navigator.languages)
		whenDefinedAll(
			[providerPool, _account, props.destination, props.amount, chain.value],
			async ([_prov, _userAddress, _destination, _amount, _chain]) => {
				useERC20.value &&
					!props.useDiscretePaymentFlow &&
					checkApproved(_prov, _userAddress, _destination, _amount, _chain)
			}
		)
		whenDefinedAll(
			[new JsonRpcProvider(props.rpcUrl), _account, chain.value],
			async ([_prov, _userAddress, _chain]) => {
				checkBalance(_prov, _userAddress, _chain)
			}
		)
	})
	const subAccessControl = getConnection().account.subscribe(async () => {
		whenDefined(accessControlUrl.value, async (_accessControl) => {
			isCheckingAccessControl.value = true
			const polling = setInterval(async () => {
				const res = await fetchAccessControl(_accessControl).catch(
					(err: Error) => err
				)
				accessControlError.value = res instanceof Error ? res : undefined
				accessAllowed.value = typeof res === 'boolean' ? res : undefined
				isCheckingAccessControl.value = false
				if (accessAllowed.value) {
					clearInterval(polling)
				}
			}, 3000)
		})
	})
	subscriptions.push(sub)
	subscriptions.push(subAccessControl)

	const provider = new JsonRpcProvider(props.rpcUrl)
	const chainId = Number((await provider.getNetwork()).chainId)

	whenDefinedAll(
		[props.destination, props.amount, chainId],
		async ([_destination, _amount, _chain]) => {
			const feeDeposit = props.feePercentage
				? new BigNumber(props.feePercentage)
				: 0

			const exactFee = new BigNumber(_amount).times(feeDeposit).toFixed()
			feeAmount.value = new BigNumber(exactFee).dp(6).toNumber()

			const [devAmount] = await Promise.all([
				verifiedPropsCurrency.value === CurrencyOption.DEV
					? props.amount
					: verifiedPropsCurrency.value === CurrencyOption.ETH
					? fetchDevForEth({
							provider,
							tokenAddress: _destination,
							amount: new BigNumber(_amount)
								.times(new BigNumber(1).minus(feeDeposit))
								.toNumber(),
							chain: chainId,
					  }).then(formatUnits)
					: stakeWithAnyTokens({
							provider,
							propertyAddress: _destination,
							tokenAmount: new BigNumber(_amount)
								.times(new BigNumber(1).minus(feeDeposit))
								.toString(),
							currency: verifiedPropsCurrency.value,
							chain: _chain,
					  }).then((res) => formatUnits(res?.estimatedDev ?? 0)),
			])

			stakingAmount.value = !props.useDiscretePaymentFlow
				? new BigNumber(devAmount ?? 0).dp(6).toNumber()
				: undefined

			directAmount.value = !props.useDiscretePaymentFlow
				? new BigNumber(_amount).times(new BigNumber(feeDeposit)).toNumber()
				: undefined

			if (previewImageSrc.value || previewName.value) {
				return
			}

			const sTokens = await fetchSTokens({
				provider,
				tokenAddress: _destination,
				amount: devAmount,
				payload: props.payload,
			}).catch((err) => {
				console.log(err)
				return undefined
			})
			previewImageSrc.value = sTokens?.image
			previewName.value = sTokens?.name
		}
	)
})

onUnmounted(() => {
	for (const sub of subscriptions) {
		sub.unsubscribe()
	}
})
</script>

<template>
	<div
		v-if="!stakeSuccessful"
		class="relative mx-auto mb-12 grid rounded-xl bg-white text-black shadow lg:container lg:mt-12 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-12"
	>
		<section class="flex flex-col gap-6 p-6 lg:row-span-2">
			<div class="rounded-lg border border-black/20 bg-black/10 p-4">
				<img
					v-if="previewImageSrc"
					:src="previewImageSrc"
					class="h-auto w-full rounded object-cover object-center sm:h-full sm:w-full"
				/>
				<Skeleton
					v-if="previewImageSrc === undefined"
					class="mx-auto aspect-square h-full w-full"
				/>
			</div>
			<span>
				<h3 class="text-sm text-black/50">
					<span>{{ previewName }}</span>
				</h3>
				<p v-if="isPriced" class="flex items-center gap-3 text-2xl font-bold">
					{{
						`${
							Number(amount) > 1 ? Number(amount).toLocaleString() : amount
						} ${(fiatCurrency ?? verifiedPropsCurrency).toUpperCase()}`
					}}
					<slot name="after:price"></slot>
				</p>
				<p v-if="stakingAmount" class="text-sm text-black/90">
					{{ i18n('AutomaticStaking', [stakingAmount.toLocaleString()]) }}
				</p>
				<p v-if="directAmount" class="text-sm text-black/90">
					{{
						i18n('AutomaticEarned', [
							directAmount.toLocaleString(),
							verifiedPropsCurrency.toUpperCase(),
						])
					}}
				</p>
			</span>
			<aside
				v-if="htmlDescription"
				v-html="htmlDescription"
				class="prose-hr:my-5 opacity-80 lg:mt-6"
				:class="ProseTextInherit"
			></aside>
		</section>

		<section class="flex flex-col content-start gap-8 empty:hidden lg:gap-12">
			<!-- Transaction form -->
			<slot name="before:transaction-form"></slot>

			<div v-if="props.accessControlUrl" class="grid gap-4 p-5 lg:gap-8">
				<!-- Access control section -->
				<span>
					<p class="mb-2 flex items-center gap-2 font-bold text-dp-white-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
							/>
						</svg>
						{{ i18n('PermissionRequired') }}
					</p>
					<p
						:data-is-loading="isCheckingAccessControl"
						:data-is-valid="accessAllowed"
						:data-is-error="Boolean(accessControlError)"
						class="hs-button is-large is-fullwidth is-outlined pointer-events-none border text-center data-[is-loading=true]:animate-pulse data-[is-valid=false]:border data-[is-error=true]:border-red-600 data-[is-valid=false]:border-neutral-300 data-[is-valid=true]:border-[#43C451] data-[is-valid=false]:bg-white"
					>
						{{
							!account
								? i18n('ConnectWalletVerification')
								: isCheckingAccessControl
								? i18n('Verifying')
								: accessAllowed
								? i18n('Verified')
								: accessControlError
								? accessControlError.message
								: i18n('Unverified')
						}}
					</p>
				</span>

				<div
					v-if="accessAllowed === false && htmlVerificationFlow"
					v-html="htmlVerificationFlow"
					class="prose-hr:my-5"
					:class="ProseTextInherit"
				></div>
			</div>

			<hr v-if="props.accessControlUrl" class="bg-dp-blue-grey-200" />

			<span
				v-if="
					useInjectedTransactionForm &&
					(props.accessControlUrl
						? props.accessControlUrl && accessAllowed
						: true)
				"
				@checkout:completed="onCompleted"
			>
				<slot name="main:transaction-form"></slot>
			</span>

			<span
				v-if="!useInjectedTransactionForm && useERC20"
				class="flex flex-col justify-stretch p-5"
			>
				<!-- Approval -->
				<button
					@click="approve"
					:disabled="
						!account ||
						isApproving ||
						approveNeeded === undefined ||
						approveNeeded === false ||
						Boolean(props.accessControlUrl && !accessAllowed) ||
						!isNotError(isFetchingApproval)
					"
					:data-is-approving="isApproving"
					:data-is-fetching="isFetchingApproval === 'progress'"
					class="hs-button is-large is-fullwidth is-filled data-[is-approving=true]:animate-pulse data-[is-fetching=true]:animate-pulse"
				>
					{{ approveNeeded === false ? i18n('Approved') : i18n('Unapproved') }}
				</button>
				<p
					v-if="!isNotError(isFetchingApproval)"
					class="text-bold mt-2 rounded-md bg-red-600 p-2 text-white"
				>
					{{ isFetchingApproval.message }}
				</p>
			</span>

			<slot name="after:transaction-form"></slot>
		</section>

		<section
			v-if="!useInjectedTransactionForm && isPriced"
			class="sticky bottom-0 flex grow flex-col gap-5 rounded-b-xl border-t border-dp-white-300 bg-white p-5"
			v-bind:class="
				!props.accessControlUrl || (props.accessControlUrl && accessAllowed)
					? 'lg:static lg:border-0 lg:bg-transparent'
					: ''
			"
		>
			<div class="grid gap-5">
				<span class="flex flex-col justify-stretch">
					<!-- Pay -->
					<button
						@click="submitStake"
						:disabled="
							!account ||
							isStaking ||
							approveNeeded !== false ||
							Boolean(props.accessControlUrl && !accessAllowed) ||
							Boolean(insufficientFunds) ||
							!isNotError(isFetchingFunds)
						"
						:data-is-staking="isStaking"
						:data-is-fetching="isFetchingFunds === 'progress'"
						class="hs-button is-large is-filled data-[is-fetching=true]:animate-pulse data-[is-staking=true]:animate-pulse"
						v-bind:class="insufficientFunds ? 'bg-red-600' : ''"
					>
						{{ i18n('PayWith', [verifiedPropsCurrency.toUpperCase()]) }}
					</button>

					<p
						v-if="insufficientFunds"
						class="text-bold mt-2 rounded-md bg-red-600 p-2 text-white"
					>
						{{ insufficientFunds.message }}
					</p>
					<p
						v-if="stakingError"
						class="text-bold mt-2 rounded-md bg-red-600 p-2 text-white"
					>
						{{ stakingError.message }}
					</p>
					<p
						v-if="!isNotError(isFetchingFunds)"
						class="text-bold mt-2 rounded-md bg-red-600 p-2 text-white"
					>
						{{ isFetchingFunds.message }}
					</p>
				</span>

				<span
					v-if="isApproving || isStaking || isWaitingForStaked"
					class="grid justify-center gap-5"
				>
					<div
						role="presentation"
						class="mx-auto h-16 w-16 animate-spin rounded-full border-l border-r border-t border-native-blue-300"
					/>
					<p v-if="isApproving">{{ i18n('ApprovalPending') }}</p>
					<p v-if="isStaking && !isWaitingForStaked">
						{{ i18n('TxConfirmationPending') }}
					</p>
					<p v-if="isWaitingForStaked">
						{{ i18n('StakePending') }}
					</p>
				</span>
			</div>
		</section>
	</div>

	<Result :id="mintedId?.toString()" :rpc-url="rpcUrl" v-if="stakeSuccessful">
		<template #before:preview>
			<slot name="result:before:preview" />
		</template>
	</Result>
</template>
