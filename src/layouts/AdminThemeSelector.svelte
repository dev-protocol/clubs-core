<script lang="ts">
	import { decode } from '../decode'
	import { buildConfig, setConfig } from '../events'
	import {
		ClubsEvents,
		type ClubsPlugin,
		type ClubsPropsClubsPlugin,
	} from '../types'
	import AdminThemeCard from './AdminThemeCard.svelte'

	export let encodedConfiguration: string
	export let themes: ClubsPropsClubsPlugin[]
	let config = decode(encodedConfiguration)

	const themeIds = new Set(themes.map(({ id }) => id))

	const isTheme = (id: string) => themeIds.has(id)

	const selectHandler = async (id: string) => {
		const plugins: ClubsPlugin[] = config.plugins.map((plg) =>
			isTheme(plg.id) ? { ...plg, enable: plg.id === id } : plg
		)
		themes = themes.map((thm) => ({ ...thm, enable: thm.id === id }))
		setConfig({ ...config, plugins })
		document.body.addEventListener(
			ClubsEvents.FinishConfiguration,
			(ev: any) => {
				console.log({ ev })
				if (ev.detail.success) {
					window.location.href = '/admin/theme'
				}
			},
			{ once: true }
		)
		buildConfig()
	}
</script>

<div class="grid">
	<ul class="flex gap-2 overflow-x-auto pb-2">
		{#each themes.sort((a, b) => (a.enable ? -1 : 0)) as theme}
			<li>
				<AdminThemeCard
					onClick={selectHandler}
					enable={theme.enable}
					meta={theme.meta}
				/>
			</li>
		{/each}
	</ul>
</div>
