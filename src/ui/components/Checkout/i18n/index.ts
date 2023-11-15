import { ClubsI18nParts } from '../../../../i18n'

export const Strings = {
	PermissionRequired: {
		en: 'Permission required',
		ja: '',
	},
	ConnectWalletVerification: {
		en: `Connect wallet to check you're verified`,
		ja: '',
	},
	Verifying: {
		en: 'Now checking the verification status',
		ja: '',
	},
	Verified: {
		en: 'Verified',
		ja: '',
	},
	Unverified: {
		en: 'Not verified',
		ja: '',
	},
	Approved: {
		en: "You've already approved",
		ja: '',
	},
	Unapproved: {
		en: 'Sign with wallet and approve',
		ja: '',
	},
	ApprovalPending: {
		en: 'Waiting for approving to complete...',
		ja: '',
	},
	TxConfirmationPending: {
		en: 'Awaiting transaction confirmation on wallet...',
		ja: '',
	},
	StakePending: {
		en: 'Just a few minutes until your item is minted...',
		ja: '',
	},
	PayWith: {
		en: ([currency]) => `Pay with ${currency}`,
		ja: ([currency]) => ``,
	},
	Minted: {
		en: 'Minted',
		ja: '',
	},
	AutomaticStaking: {
		en: ([amount]) => `${amount} DEV will be staked automatically.`,
		ja: ([amount]) => ``,
	},
} satisfies ClubsI18nParts
