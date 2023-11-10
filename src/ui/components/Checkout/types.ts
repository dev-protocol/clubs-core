import type { CurrencyOption } from '../../../constants/currencyOption'

export type CheckoutOptions = {
	readonly amount: number
	readonly propertyAddress: string
	readonly currency?:
		| CurrencyOption
		| Uppercase<CurrencyOption>
		| Lowercase<CurrencyOption>
	readonly fiatCurrency?: string
	readonly rpcUrl: string
	readonly feeBeneficiary?: string
	readonly feePercentage?: number
	readonly payload?: Uint8Array | string
	readonly description?: string
}
