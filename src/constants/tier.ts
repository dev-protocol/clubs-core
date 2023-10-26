import { CurrencyOption } from './currencyOption'

export type Tier = Readonly<{
	readonly title: string
	readonly id: string
	readonly amount: number | string
	readonly currency: CurrencyOption
	readonly badgeImageDescription?: string
	readonly badgeImageSrc?: string
}>

export type Tiers = ReadonlyArray<Tier>

export type InjectedTier = Tier & { readonly checkoutUrl?: string }

export type InjectedTiers = ReadonlyArray<InjectedTier>
