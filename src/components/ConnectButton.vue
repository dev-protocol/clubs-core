<template>
	<div
		v-bind:class="`hs-wallet${
			truncateWalletAddress &&
			formattedUserBalance.length > 0 &&
			supportedNetwork
				? ' is-connected'
				: ''
		}`"
		class="w-full"
	>
		<HSButton
			type="filled large"
			v-if="
				truncateWalletAddress &&
				formattedUserBalance.length > 0 &&
				supportedNetwork
			"
		>
			{{ truncateWalletAddress }}
		</HSButton>
		<HSButton
			type="filled large"
			v-else-if="
				truncateWalletAddress &&
				formattedUserBalance.length > 0 &&
				!supportedNetwork
			"
		>
			Unsupported Network
		</HSButton>
		<HSButton
			type="filled large"
			v-else
			v-on:click="connect"
			:loading="connection === undefined || modalProvider === undefined"
		>
			Connect Wallet
		</HSButton>
		<ul
			class="hs-wallet__details"
			v-if="
				truncateWalletAddress &&
				formattedUserBalance.length > 0 &&
				supportedNetwork
			"
		>
			<li>Balance: {{ formattedUserBalance }} $DEV</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { type Web3Modal } from '@web3modal/html'
import type { connection as Connection } from '../connection'
import { defineComponent } from 'vue'
import {
	type ContractRunner,
	BrowserProvider,
	Eip1193Provider,
	formatUnits,
} from 'ethers'
import { clientsDev } from '@devprotocol/dev-kit/agent'
import { whenDefined } from '@devprotocol/util-ts'
import { onMountClient } from '../events'
import HSButton from './Primitives/Hashi/HSButton.vue'
import { combineLatest } from 'rxjs'
import { getEthersProvider, getEthersSigner } from '../fixtures/wallet/ethers'
import { EthersProviderFrom } from '../fixtures/wallet'

type Data = {
	modalProvider?: Web3Modal
	truncateWalletAddress: String
	formattedUserBalance: String
	supportedNetwork: boolean
	connection?: typeof Connection
}

export default defineComponent({
	name: 'ConnectButton',
	components: {
		HSButton,
	},
	props: {
		chainId: Number,
	},
	data(): Data {
		return {
			modalProvider: undefined,
			truncateWalletAddress: '',
			formattedUserBalance: '',
			supportedNetwork: false,
			connection: undefined,
		}
	},
	async mounted() {
		onMountClient(async () => {
			const [{ connection }, { GetModalProvider, ReConnectWallet }] =
				await Promise.all([
					import('../connection'),
					import('../fixtures/wallet'),
				])
			this.connection = connection
			this.modalProvider = GetModalProvider()
			combineLatest([connection().chain, connection().account]).subscribe(
				([chainId, acc]) => {
					this.supportedNetwork = chainId === this.chainId
					this.truncateWalletAddress = acc ? this.truncateEthAddress(acc) : ''
				}
			)
			// TODO: fix `EthersProviderFrom` to use new Web3Modal
			const { currentAddress, connectedProvider, provider } =
				await ReConnectWallet(this.chainId || 1)

			if (currentAddress) {
				this.truncateWalletAddress = this.truncateEthAddress(currentAddress)
			}

			if (connectedProvider) {
				this.setSigner(connectedProvider)
			}

			if (currentAddress && provider) {
				this.fetchUserBalance(currentAddress, provider)
			}
		})
	},
	methods: {
		setSigner(provider: Eip1193Provider) {
			this.connection!().setEip1193Provider(provider, BrowserProvider)
		},
		async connect() {
			await this.modalProvider!.openModal()
			this.modalProvider?.subscribeEvents(async (event) => {
				const eventName = event.name

				if (eventName === 'ACCOUNT_CONNECTED') {
					const provider = getEthersProvider({ chainId: this.chainId || 1 })
					const signer = await getEthersSigner({ chainId: this.chainId || 1 })

					// TODO: fix `EthersProviderFrom` to use new Web3Modal
					if (provider) {
						const connectedProvider = (await EthersProviderFrom(provider))
							.connectedProvider
						this.setSigner(connectedProvider)
					}

					const currentAddress = await signer?.getAddress()
					if (currentAddress) {
						this.truncateWalletAddress = this.truncateEthAddress(currentAddress)
					}

					if (provider && currentAddress) {
						this.fetchUserBalance(currentAddress, provider)
					}
				}
			})
		},
		async fetchUserBalance(currentAddress: string, provider: ContractRunner) {
			const [l1, l2] = await clientsDev(provider)
			const balance = await (l1 || l2)?.balanceOf(currentAddress)
			const formatted = formatUnits(balance ?? 0)
			const rounded = Math.round((+formatted + Number.EPSILON) * 100) / 100
			this.formattedUserBalance = rounded.toLocaleString()
		},
		truncateEthAddress(address: string) {
			const match = address.match(
				/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
			)
			if (!match) return address
			return `${match[1]}\u2026${match[2]}`
		},
	},
})
</script>
