<script lang="ts">
	import { onMount } from 'svelte'
	import { JsonRpcProvider } from 'ethers'
	import { isAdmin } from '../authenticate'
	import { decode } from '../decode'
	import { ClubsEvents, ClubsPreferredColorScheme } from '../types'
	import { getPreferredColorScheme } from '../fixtures'

	export let encodedClubsConfiguration: string

	const config = decode(encodedClubsConfiguration)

	const watchUpdateTheme = () => {
		const theme: ClubsPreferredColorScheme = getPreferredColorScheme()
		const handler = (t: ClubsPreferredColorScheme) => {
			if (t === ClubsPreferredColorScheme.System) {
				document.documentElement.removeAttribute('hashi-theme')
			} else {
				document.documentElement.setAttribute('hashi-theme', t)
			}
		}

		handler(theme)
		document.body.addEventListener(
			ClubsEvents.UpdatePreferredColorScheme,
			() => {
				const next = getPreferredColorScheme()
				handler(next)
			}
		)
	}

	watchUpdateTheme()

	onMount(() => {
		const header = document.getElementById('__clubs:header__')!
		const navMobile = document.getElementById('__clubs:nav-mobile__')!
		document
			.getElementById('__clubs:sidebar-open__')
			?.addEventListener('click', () => {
				header.classList.toggle('hidden')
			})

		document
			.getElementById('__clubs:sidebar-close__')
			?.addEventListener('click', () => {
				header.classList.toggle('hidden')
			})

		let lastKnownScrollPosition = 0
		let timer: NodeJS.Timeout

		const toggleNavMobile = (scrollPos: number) => {
			const shown = navMobile.classList.contains('nav-mobile--hide') === false
			const update =
				(shown && scrollPos > lastKnownScrollPosition) ||
				(!shown && scrollPos < lastKnownScrollPosition)
			if (update) navMobile.classList.toggle('nav-mobile--hide')
			lastKnownScrollPosition = scrollPos
		}

		const onScroll = () => {
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => toggleNavMobile(window.scrollY), 80)
		}

		const onInit = () => {
			if (window.innerWidth < 1024) {
				document.addEventListener('scroll', onScroll)
			} else {
				document.removeEventListener('scroll', onScroll)
			}
		}

		window.addEventListener('resize', onInit)
		document.addEventListener('DOMContentLoaded', onInit)
	})

	onMount(async () => {
		if (config.adminPageVisibility !== 'private') return

		function handleAccessDenied() {
			const targetDiv = document.getElementById('__clubs:non-admin-message__')
			if (targetDiv) {
				targetDiv.innerHTML =
					"<p>🚀 Whoops! It looks like you've stumbled into a secret space mission reserved for our Club Admins! While we appreciate your adventurous spirit, this area is off-limits to non-admin explorers. But don't worry, your own mission awaits back on familiar territory. Click <u><a href='https://clubs.place/domain'>here</a></u> to create your own club. Your future club might become the shining star that guides others to their own club-creating journey! 🌟 Keep exploring and may the stars align for your club-building adventure!</p>"
			}
			console.error('Access denied or error fetching data')
		}
		function toggleLoading() {
			const loading = document.getElementById(
				'__clubs:non-admin-message-loading__'
			)
			if (loading) loading.classList.toggle('invisible')
		}

		const mainContainer = document.getElementById('__clubs:main-container__')
		const provider = new JsonRpcProvider(config.rpcUrl)
		const { connection } = await import('../connection')

		connection().account.subscribe(async (address) => {
			if (!address) return handleAccessDenied()

			toggleLoading()

			const access = await isAdmin({
				address,
				previousConfiguration: config,
				provider,
			})

			toggleLoading()

			console.log('access:', access)
			if (mainContainer && access) {
				mainContainer.dataset.showContent = 'true'
			} else {
				handleAccessDenied()
			}
		})
	})
</script>
