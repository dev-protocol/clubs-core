import type { CurrencyOption } from '../../../constants/currencyOption'
import type { ClubsPropsPages } from '../../../types'

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
	readonly useDiscretePaymentFlow?: boolean
	readonly useInjectedTransactionForm?: boolean
	readonly itemImageSrc?: string
	readonly itemName?: string
	readonly accessControlUrl?: string
	readonly accessControlDescription?: string
}

export type ResultOptions = {
	readonly id?: string | number
	readonly rpcUrl: string
}

export type CheckoutProps = ClubsPropsPages & CheckoutOptions

export type ResultProps = ClubsPropsPages & ResultOptions
