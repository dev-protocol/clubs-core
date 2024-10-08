<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { BrowserProvider } from 'ethers'
import type { connection as Connection } from '../../connection'
import { ClubsConnectionSignal } from '../../constants'

const connection = ref<typeof Connection>()
const walletAddress = ref<string | undefined>('')

const handleConnection = async () => {
	const signer = connection.value?.().signer.value
	if (!signer) {
		return
	}

	// get wallet address
	const connectedAddress = await signer.getAddress()
	walletAddress.value = connectedAddress
}
const handleSignal = async (sig?: string) => {
	if (sig === ClubsConnectionSignal.SignInRequest) {
		onClick()
	}
}

onMounted(async () => {
	const connectionModule = await import('../../connection')
	connection.value = connectionModule.connection
	connection.value().signer.subscribe(handleConnection)
	connection.value().signal.subscribe(handleSignal)
})

const truncateEthAddress = computed(() => {
	if (!walletAddress.value) {
		return undefined
	}
	return `${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`
})

const onClick = async () => {
	try {
		const eth = (window as any).ethereum
		await eth.send('eth_requestAccounts')
		connection.value?.().setEip1193Provider(eth, BrowserProvider)
	} catch (error) {
		console.error(error)
	}
}

const disconnect = async () => {
	try {
		connection.value?.().signer.next(undefined)
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<div class="container mx-auto py-8">
		<div class="flex justify-end">
			<button
				v-if="!walletAddress"
				class="hs-button is-filled is-large is-fullwidth"
				@click="onClick"
			>
				Wallet connect
			</button>
			<button
				v-if="truncateEthAddress"
				class="hs-button is-filled is-large is-fullwidth"
				@click="disconnect"
			>
				{{ truncateEthAddress }}
			</button>
		</div>
	</div>
</template>
