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
import type Web3Modal from 'web3modal'
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
			connection().account.subscribe((acc?: string) => {
				this.truncateWalletAddress = acc ? this.truncateEthAddress(acc) : ''
			})
			const { currentAddress, connectedProvider, provider } =
				await ReConnectWallet(this.modalProvider as Web3Modal)
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
			this.connection!().setEip1193Provider(provider)
		},
		async connect() {
			const connectedProvider = await this.modalProvider!.connect()
			whenDefined(connectedProvider, (p) => {
				this.setSigner(p)
			})
		},
		async fetchUserBalance(currentAddress: string, provider: ContractRunner) {
			const [l1, l2] = await clientsDev(provider)
			this.supportedNetwork = l1 || l2 ? true : false
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
