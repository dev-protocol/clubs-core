<script lang="ts" setup>
import {
	getPreferredColorScheme,
	setPreferredColorScheme,
} from '../../fixtures'
import IconSun from '../../ui/vue/IconSun.vue'
import IconMoon from '../../ui/vue/IconMoon.vue'
import IconPhone from '../../ui/vue/IconPhone.vue'
import { ref } from 'vue'
import { ClubsPreferredColorScheme } from '../../types'

const themes: readonly ClubsPreferredColorScheme[] = [
	ClubsPreferredColorScheme.System,
	ClubsPreferredColorScheme.Light,
	ClubsPreferredColorScheme.Dark,
]
const configValue = getPreferredColorScheme()

const open = ref(false)
const theme = ref(configValue)

const onChangeTheme = (t: ClubsPreferredColorScheme) => {
	theme.value = t
	open.value = false
	setPreferredColorScheme(t)
}
</script>

<template>
	<div class="relative">
		<button
			@click="
				() => {
					open = !open
				}
			"
		>
			<span v-if="theme === ClubsPreferredColorScheme.System"
				><IconPhone
			/></span>
			<span v-if="theme === ClubsPreferredColorScheme.Dark"><IconMoon /></span>
			<span v-if="theme === ClubsPreferredColorScheme.Light"><IconSun /></span>
		</button>

		<ul
			class="absolute grid gap-2 rounded bg-surface-200 p-1 shadow"
			:class="`${open ? '' : 'hidden'}`"
		>
			<li v-for="tm in themes" :key="tm" :value="tm" :selected="theme === tm">
				<button
					class="flex w-full items-center gap-2 rounded px-2 py-1 text-sm capitalize transition-colors hover:bg-surface-300"
					:class="theme === tm ? 'bg-surface-300' : ''"
					@click="onChangeTheme(tm)"
				>
					<span v-if="tm === ClubsPreferredColorScheme.System"
						><IconPhone class="h-4 w-4"
					/></span>
					<span v-if="tm === ClubsPreferredColorScheme.Dark"
						><IconMoon class="h-4 w-4"
					/></span>
					<span v-if="tm === ClubsPreferredColorScheme.Light"
						><IconSun class="h-4 w-4"
					/></span>
					{{ tm }}
				</button>
			</li>
		</ul>
	</div>
</template>
