declare module '@devprotocol/hashi/tailwind' {
	export const theme: {
		readonly screens: Record<string, string>,
		readonly colors: Record<string, string>,
		readonly borderRadius: Record<string, string>,
		readonly borderWidth: Record<string, string>,
		readonly gap: Record<string, string>,
		readonly margin: Record<string, string>,
		readonly padding: Record<string, string>,
		readonly outlineWidth: Record<string, string>,
		readonly outlineOffset: Record<string, string>,
		readonly ringOffsetWidth: Record<string, string>,
		readonly ringWidth: Record<string, string>,
		readonly spacing: Record<string, string>,
		readonly fontFamily: Record<string, string>,
		readonly fontSize: Record<string, string>,
		readonly fontWeight: Record<string, string>,
		readonly lineHeight: Record<string, string>,
	}
}

declare module '@devprotocol/hashi/tailwind/extensions' {
	export const hsExtendedColorTokens: Record<string, unknown>;
}
