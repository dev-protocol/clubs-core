<script lang="ts" setup>
import {
	onMounted,
	onUnmounted,
	ref,
	useTemplateRef,
	type ComputedRef,
	computed,
} from 'vue'
import { createErc20Contract } from '@devprotocol/dev-kit'
import {
	positionsCreate,
	positionsCreateWithEth,
} from '@devprotocol/dev-kit/agent'
import type { connection as Connection } from '../../../connection'
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
import { type Subscription, combineLatest, distinctUntilChanged } from 'rxjs'
import { CurrencyOption } from '../../../constants/currencyOption'
import { fetchDevForEth, fetchSTokens } from '../../../fixtures/utility'
import Skeleton from '../Skeleton/Skeleton.vue'
import {
	stakeWithAnyTokens,
	mintedIdByLogs,
	getTokenAddress,
} from '../../../fixtures/dev-kit'
import Result from './Result.vue'
import { ClubsConnectionSignal, ProseTextInherit } from '../../../constants'
import { i18nFactory } from '../../../i18n'
import { Strings } from './i18n'
import { markdownToHtml } from '../../../markdown'
import type { ClubsProfile } from '../../../types'
import { fetchProfile } from '../../../profile'
import IconSpinner from '../../vue/IconSpinner.vue'
import IconInfo from '../../vue/IconInfo.vue'
import IconCheckCircle from '../../vue/IconCheckCircle.vue'
// @ts-ignore
import VideoFetch from '../../vue/VideoFetch.vue'
import IconBouncingArrowRight from '../../vue/IconBouncingArrowRight.vue'

let providerPool: UndefinedOr<ContractRunner>
let subscriptions: Subscription[] = []
const REGEX_DESC_ACCOUNT = /{ACCOUNT}/g
const REGEX_DESC_EMAIL = /{EMAIL}/g

const i18nBase = i18nFactory(Strings)
let i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(['en']))

const imageRef = useTemplateRef(`imageRef`)

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
	itemVideoSrc?: string
	itemName?: string
	accessControlUrl?: string
	accessControlDescription?: string
	uiMode?: 'standalone' | 'embed'
	base?: string
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
const previewVideoSrc = ref<UndefinedOr<string>>(props.itemVideoSrc)
const onChainPreviewName = ref<UndefinedOr<string>>(props.itemName)
const stakingAmount = ref<UndefinedOr<number>>(undefined)
const directAmount = ref<UndefinedOr<number>>(undefined)
const isCheckingAccessControl = ref<boolean>(false)
const accessControlError = ref<UndefinedOr<Error>>(undefined)
const accessAllowed = ref<UndefinedOr<boolean>>(undefined)
const mintedId = ref<UndefinedOr<bigint>>(undefined)
const insufficientFunds = ref<UndefinedOr<Error>>(undefined)
const isFetchingFunds = ref<UndefinedOr<'progress' | Error>>(undefined)
const stakingError = ref<UndefinedOr<Error>>(undefined)
const clubsProfile = ref<UndefinedOr<ClubsProfile>>(undefined)
const connection = ref<UndefinedOr<typeof Connection>>(undefined)

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
	return props.description && markdownToHtml(props.description)
})
const previewName: ComputedRef<UndefinedOr<string>> = computed(() => {
	return props.itemName ?? onChainPreviewName.value
})
const htmlVerificationFlow: ComputedRef<UndefinedOr<string>> = computed(() => {
	const accountAddress = account.value ?? ''
	const emailAddress = email.value ?? ''
	return (
		props.accessControlDescription &&
		markdownToHtml(
			props.accessControlDescription
				.replace(REGEX_DESC_ACCOUNT, accountAddress)
				.replace(REGEX_DESC_EMAIL, emailAddress)
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
										? parseInt((props.feePercentage * 10_000).toString())
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
										? parseInt((props.feePercentage * 10_000).toString())
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
const signIn = () =>
	connection.value?.().signal.next(ClubsConnectionSignal.SignInRequest)

onMounted(async () => {
	const { connection: _connection } = await import('../../../connection')
	connection.value = _connection

	const sub = combineLatest([
		_connection().provider,
		_connection().account,
		_connection().chain,
		_connection().identifiers,
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
	const sub$2 = _connection()
		.account.pipe(distinctUntilChanged())
		.subscribe(async (account) => {
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
			const profile = await whenDefined(account, fetchProfile)
			console.log({ profile })
			clubsProfile.value = profile?.profile
		})
	subscriptions.push(sub)
	subscriptions.push(sub$2)

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
			onChainPreviewName.value = sTokens?.name
		}
	)
	try {
		if (previewImageSrc.value && imageRef.value) {
			const response = await fetch(previewImageSrc.value)
			const blob = await response.blob()
			const blobDataUrl = URL.createObjectURL(blob)
			imageRef.value.src = blobDataUrl
		}
	} catch (error) {
		console.error('Error loading image:', error)
	}
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
		@checkout:completed="onCompleted"
		class="relative mx-auto"
		:class="
			props.uiMode === 'embed'
				? ''
				: 'mb-12 rounded-xl bg-white text-black shadow'
		"
	>
		<div class="mx-auto max-w-md">
			<section class="flex flex-col gap-4 p-3">
				<div
					class="grid grid-cols-[auto_auto_1fr] items-center justify-between gap-4"
				>
					<span
						v-if="!previewImageSrc && previewVideoSrc"
						class="w-36 rounded-lg border border-black/20 bg-black/10 p-1"
					>
						<VideoFetch
							:url="previewVideoSrc"
							:videoClass="`w-full rounded aspect-square`"
						/>
					</span>

					<span
						v-if="!previewVideoSrc"
						class="size-24 rounded-lg border border-black/20 bg-black/10 p-1"
					>
						<img
							v-if="previewImageSrc"
							ref="imageRef"
							class="h-auto w-full rounded-lg object-cover object-center"
						/>
						<Skeleton
							v-if="previewImageSrc === undefined"
							class="mx-auto aspect-square h-full w-full"
						/>
					</span>
					<h3 class="text-balance break-all font-bold">{{ previewName }}</h3>
					<span class="justify-self-end">
						<span
							v-if="isPriced"
							class="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-purple-500 px-3 py-1.5 font-bold text-white"
						>
							{{
								`${
									Number(amount) > 1 ? Number(amount).toLocaleString() : amount
								} ${(fiatCurrency ?? verifiedPropsCurrency).toUpperCase()}`
							}}
							<slot name="after:price"></slot>
						</span>
					</span>
				</div>
				<aside
					v-if="htmlDescription"
					v-html="htmlDescription"
					class="prose-hr:my-5 opacity-50"
					:class="ProseTextInherit"
				></aside>

				<slot name="after:description"></slot>
			</section>

			<section class="p-3">
				<span v-if="account" class="mb-2 text-xs font-bold text-black/20">{{
					i18n('SignedInAs')
				}}</span>
				<button
					v-if="clubsProfile === undefined"
					class="hs-button is-large is-filled is-fullwidth relative flex items-center gap-2 rounded-md @container/clb_checkout_signin_button"
					@click="signIn"
				>
					<IconBouncingArrowRight
						v-if="account === undefined"
						class="absolute -left-2 @xs/clb_checkout_signin_button:left-5"
					/>
					<IconSpinner v-else class="absolute left-5 size-5" />
					<span class="font-bold">{{ i18n('SignIn') }}</span>
				</button>
				<a
					v-else
					class="hs-button is-small relative flex w-full items-center justify-start gap-2 rounded-md"
					:href="`https://clubs.place/passport/${account}`"
					target="_blank"
					rel="noreferer noopener"
				>
					<div class="flex items-center justify-start gap-2">
						<img
							:src="clubsProfile.avatar"
							class="aspect-square size-8 overflow-hidden rounded-full border border-black/20 object-cover"
						/>
						<span class="text-sm font-bold">{{ clubsProfile.username }}</span>
					</div>
				</a>
				<template v-if="clubsProfile === undefined">
					<slot name="after:sign-in-form"></slot>
				</template>
			</section>

			<section
				v-if="account"
				class="flex animate-[fadeIn_.7s_ease-in-out_forwards] flex-col content-start gap-8 empty:hidden"
			>
				<!-- Transaction form -->
				<slot name="before:transaction-form"></slot>

				<div v-if="props.accessControlUrl" class="grid gap-4 p-5">
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
				>
					<slot name="main:transaction-form"></slot>
				</span>

				<span
					v-if="!useInjectedTransactionForm && useERC20"
					class="flex flex-col justify-stretch p-3"
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
							!isNotError(isFetchingApproval) ||
							isFetchingApproval === 'progress'
						"
						:data-is-approving="isApproving"
						:data-is-fetching="isFetchingApproval === 'progress'"
						class="hs-button is-large is-fullwidth group relative @container/clb_checkout_approval_button"
						:class="
							approveNeeded === false ? 'is-outlined border-[1px]' : 'is-filled'
						"
					>
						<IconSpinner
							v-if="
								approveNeeded &&
								(isApproving || isFetchingApproval === 'progress')
							"
							class="absolute left-5 size-5"
						/>
						<IconCheckCircle
							v-if="approveNeeded === false"
							class="absolute left-5 size-5 text-dp-green-300"
							type="solid"
						/>
						<IconBouncingArrowRight
							class="absolute -left-2 group-disabled:hidden @xs/clb_checkout_approval_button:left-5"
						/>

						{{
							approveNeeded === false ? i18n('Approved') : i18n('Unapproved')
						}}
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
				v-if="account && !useInjectedTransactionForm && isPriced"
				class="sticky bottom-0 flex grow animate-[fadeIn_.7s_ease-in-out_forwards] flex-col gap-5 rounded-b-xl border-t border-dp-white-300 bg-white p-3"
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
								!isNotError(isFetchingFunds) ||
								isFetchingFunds === 'progress'
							"
							:data-is-staking="isStaking"
							:data-is-fetching="isFetchingFunds === 'progress'"
							class="hs-button is-large is-filled group relative @container/clb_checkout_pay_button"
							:class="insufficientFunds ? 'bg-red-600' : ''"
						>
							<IconSpinner
								v-if="isStaking || isFetchingFunds === 'progress'"
								class="absolute left-5 size-5"
							/>
							<IconBouncingArrowRight
								class="absolute -left-2 group-disabled:hidden @xs/clb_checkout_pay_button:left-5"
							/>

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

			<div
				v-if="stakingAmount || directAmount"
				class="m-3 flex animate-[fadeIn_.5s_ease-in-out_forwards] justify-end"
			>
				<details class="group">
					<summary
						class="flex list-none justify-end opacity-50 group-open:opacity-100"
					>
						<IconInfo class="size-4" type="micro" />
					</summary>
					<p v-if="stakingAmount" class="mt-2 text-sm text-black/90">
						{{ i18n('AutomaticStaking', [stakingAmount.toLocaleString()]) }}
					</p>
					<p v-if="directAmount" class="mt-2 text-sm text-black/90">
						{{
							i18n('AutomaticEarned', [
								directAmount.toLocaleString(),
								verifiedPropsCurrency.toUpperCase(),
							])
						}}
					</p>
				</details>
			</div>
		</div>
	</div>

	<Result
		v-if="stakeSuccessful"
		:eoa="account"
		:id="mintedId?.toString()"
		:rpc-url="rpcUrl"
		:stake-successful="stakeSuccessful"
		:name="previewName"
		:description="props.description"
		:image-src="previewImageSrc"
		:video-src="previewVideoSrc"
		:base="props.base"
	>
		<template #before:preview>
			<slot name="result:before:preview" />
		</template>
	</Result>
</template>

<style>
@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 100;
	}
}
</style>
