import { ClubsI18nParts } from '../../../../i18n'

export const Strings = {
	Close: {
		en: 'Close',
		ja: '近い',
	},
	PermissionRequired: {
		en: 'Permission required',
		ja: 'アクセス許可が必要です',
	},
	ConnectWalletVerification: {
		en: `Connect wallet to check you're verified`,
		ja: '右上のサインインボタンをクリックして、Clubsにログインしてください',
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
		en: 'Verification Required',
		ja: '認証が必要です',
	},
	Approved: {
		en: "You've already approved",
		ja: '既に承認が完了しています',
	},
	Unapproved: {
		en: 'Sign with wallet and approve',
		ja: 'ログインして承認してください',
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
		ja: () => `次の貨幣で支払う：`,
	},
	Minted: {
		en: 'Minted',
		ja: '発行されました',
	},
	AutomaticStaking: {
		en: ([amount]) => `${amount} DEV will be staked automatically.`,
		ja: ([amount]) => `${amount} DEVは自動的にステーキングされます。`,
	},
	AutomaticEarned: {
		en: ([amount, currency]) =>
			`${amount} ${currency} will be directly earned by the owner!`,
		ja: ([amount, currency]) =>
			`${amount} ${currency} はオーナーに直接支払われます！`,
	},
	Passport: {
		en: 'Passport',
		ja: 'Passport',
	},
	Home: {
		en: 'Home',
		ja: 'Home',
	},
	SignIn: {
		en: 'Sign in',
		ja: ' サインイン',
	},
	SignedInAs: {
		en: `Signed in as:`,
		ja: `サインインしているユーザー:`,
	},
} satisfies ClubsI18nParts
