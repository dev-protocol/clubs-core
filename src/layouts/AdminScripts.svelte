<script lang="ts">
	import { onMount } from 'svelte'

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
</script>
