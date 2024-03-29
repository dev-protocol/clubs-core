import { ClubsI18nParts } from '../../../../i18n'

export const Strings = {
	PermissionRequired: {
		en: 'Permission required',
		ja: 'アクセス許可が必要です',
	},
	ConnectWalletVerification: {
		en: `Connect wallet to check you're verified`,
		ja: 'ウォレットを接続して認証をしてください',
	},
	Verifying: {
		en: 'Now checking the verification status',
		ja: '認証ステータスを確認中',
	},
	Verified: {
		en: 'Verified',
		ja: '認証済み',
	},
	Unverified: {
		en: 'Not verified',
		ja: '認証に失敗',
	},
	Approved: {
		en: "You've already approved",
		ja: '既に承認されたユーザー',
	},
	Unapproved: {
		en: 'Sign with wallet and approve',
		ja: 'ウォレットを接続して承認してください',
	},
	ApprovalPending: {
		en: 'Waiting for approving to complete...',
		ja: '承認プロセスの完了までお待ちください...',
	},
	TxConfirmationPending: {
		en: 'Awaiting transaction confirmation on wallet...',
		ja: 'ウォレットのトランザクションを確認しています...',
	},
	StakePending: {
		en: 'Just a few minutes until your item is minted...',
		ja: '購入したアイテムの発行までもう少々お待ちください...',
	},
	PayWith: {
		en: ([currency]) => `Pay with ${currency}`,
		ja: ([currency]) => `次の貨幣で支払う`,
	},
	Minted: {
		en: 'Minted',
		ja: '発行されました',
	},
	AutomaticStaking: {
		en: ([amount]) => `${amount} DEV will be staked automatically.`,
		ja: ([amount]) => `DEVは自動的にステーキングされます。`,
	},
} satisfies ClubsI18nParts
