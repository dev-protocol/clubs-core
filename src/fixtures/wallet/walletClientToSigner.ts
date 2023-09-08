// import { whenDefined, whenDefinedAll } from '@devprotocol/util-ts'
// import { BrowserProvider, JsonRpcSigner } from 'ethers'
// import type { WalletClient } from 'viem'

// export function walletClientToSigner(walletClient: WalletClient) {
// 	const { account, chain, transport } = walletClient
// 	const network = whenDefined(chain, ({ id: chainId, name, contracts }) => ({
// 		chainId,
// 		name,
// 		ensAddress: contracts?.ensRegistry?.address,
// 	}))
// 	const provider = whenDefined(
// 		network,
// 		(net) => new BrowserProvider(transport, net)
// 	)
// 	return whenDefinedAll(
// 		[provider, account],
// 		([prov, { address }]) => new JsonRpcSigner(prov, address)
// 	)
// }
