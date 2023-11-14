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
	// ModalCloseTicketConfirm: {
	// 	en: 'Close',
	// 	ja: '閉じる',
	// },
	// ModalActionTicketConfirm: {
	// 	en: 'Yes',
	// 	ja: 'はい',
	// },
	// ModalMessageNotConnected: {
	// 	en: 'Please connect a wallet first',
	// 	ja: 'ウォレットに接続してください',
	// },
	// ModalCloseNotConnected: {
	// 	en: 'OK',
	// 	ja: 'わかりました',
	// },
	// Expiration: {
	// 	en: ([time]) => `Expiration date is ${time}.`,
	// 	ja: ([time]) => `有効期限: ${time}`,
	// },
	// ModalMessageNotSigned: {
	// 	en: `Can't sign with your wallet? Close this confirmation, and disconnect/reconnect your wallet and try again.`,
	// 	ja: 'ウォレットで署名ができませんか? この確認を閉じてからウォレットを再接続してもう一度試してください。',
	// },
} satisfies ClubsI18nParts
