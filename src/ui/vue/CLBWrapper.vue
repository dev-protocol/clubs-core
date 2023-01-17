<template>
	<slot />
</template>

<script lang="ts">
// const root: Element | null = document.querySelector(':root');

export default {
	name: 'CLBWrapper',
	/// TODO: Theming API (low prio)
	// props: {
	// 	'theme': { type: Object }
	// },
	// data() {
	// 	return {
	// 		initTheme: getComputedStyle(root ? root : document.body),
	// 	}
	// },
	// methods: {
	// 	sanitizeThemeProp(propName: string): string {
	// 		return `--hs-theme-${propName}`;
	// 	}
	// }
}
</script>

<style lang="scss">
@use '../globals/clubs.theme' as clubs;
@use '@devprotocol/hashi' with (
	$theme: clubs.$theme
);
@use '@devprotocol/hashi/hs-button' with (
	$theme: clubs.$button-theme
);
@use '@devprotocol/hashi/hs-form-field' with (
	$theme: clubs.$form-field-theme
);
@use '@devprotocol/hashi/hs-link' with (
	$theme: clubs.$link-theme
);
@use '@devprotocol/hashi/hs-select-field' with (
	$theme: clubs.$select-field-theme
);
@use '@devprotocol/hashi/hs-tick-field' with (
	$theme: clubs.$tick-field-theme
);

@include hashi.init() {
	@include hs-button.render();
	@include hs-button.extend('small') {
		@include hs-button.shape(
			(
				padding: (
					'xs',
					'sm',
				),
			)
		);
		@include hs-button.typography(
			(
				size: 14px,
			)
		);
	}
	@include hs-button.extend('large') {
		@include hs-button.shape(
			(
				padding: (
					'sm',
					'lg',
				),
			)
		);
	}
	@include hs-form-field.render();
	@include hs-link.render();
	@include hs-select-field.render();
	@include hs-tick-field.render();
}
</style>
