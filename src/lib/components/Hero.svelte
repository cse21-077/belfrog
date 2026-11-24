<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { SiteSettings } from '$lib/cms';
	import logo from '$lib/assets/logo.png';
	import poolImage from '$lib/assets/belfrogswimmingpool.jpg';

	let { settings }: { settings: SiteSettings } = $props();

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	const navLinks = [
		{ label: 'Stay', href: '/#accommodation' },
		{ label: 'Tented Accommodation', href: '/#glamping' },
		{ label: 'Rates', href: '/#rates' },
		{ label: 'About', href: '/#about' },
		{ label: 'Experiences', href: '/#experiences' },
		{ label: 'Contact', href: '/#contact' }
	] as const;

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function handleScroll() {
		scrolled = window.scrollY > 50;
	}

	onMount(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<section id="top" class="relative h-screen min-h-[600px] w-full overflow-hidden">
	<!-- mobile: show a poster image until video is available; desktop: show video -->
	<img
		src={poolImage}
		alt="Pool at The Bell Frog Inn"
		class="absolute inset-0 h-full w-full object-cover md:hidden"
	/>

	<video
		autoplay
		muted
		loop
		playsinline
		poster={poolImage}
		class="absolute inset-0 h-full w-full object-cover hidden md:block"
		preload="metadata"
	>
		<source src="/hero.mp4" type="video/mp4" />
	</video>
	<div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50"></div>

	<header
		class="fixed inset-x-0 top-0 z-50 transition-all duration-300 {scrolled
			? 'bg-white/95 shadow-sm backdrop-blur'
			: 'bg-transparent'}"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href={resolve('/#top')} class="flex items-center">
				<img
					src={logo}
					alt="The Bell Frog Inn"
					class="h-11 md:h-14 w-auto max-w-[180px] object-contain drop-shadow transition duration-300 {scrolled ? '' : 'brightness-0 invert'}"
				/>
			</a>

			<nav class="hidden items-center gap-6 text-sm font-semibold lg:flex {scrolled ? 'text-stone-800' : 'text-white'}">
				{#each navLinks as link (link.href)}
					<a href={resolve(link.href)} class="transition-colors hover:text-brand">{link.label}</a>
				{/each}
				<a
					href={settings.airbnbUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="rounded-full bg-accent px-5 py-2.5 text-white shadow transition hover:bg-accent-700"
				>
					Book Now
				</a>
				<a
					href={settings.bookingcomUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="rounded-full border-2 px-5 py-2.5 shadow transition {scrolled
						? 'border-brand text-brand hover:bg-brand hover:text-white'
						: 'border-white text-white hover:bg-white hover:text-stone-900'}"
				>
					Booking.com
				</a>
			</nav>

			<button
				type="button"
				class="rounded-lg p-2 transition lg:hidden {scrolled ? 'text-stone-800 hover:bg-stone-100' : 'text-white hover:bg-white/10'}"
				aria-label="Open menu"
				aria-expanded={mobileMenuOpen}
				onclick={toggleMenu}
			>
				<svg
					class="h-7 w-7"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>

		{#if mobileMenuOpen}
			<div
				class="absolute inset-x-0 top-full border-t border-white/10 bg-black/90 px-6 pb-6 pt-4 backdrop-blur lg:hidden"
			>
				<nav class="flex flex-col gap-4 text-base font-medium text-white">
					{#each navLinks as link (link.href)}
						<a
							href={resolve(link.href)}
							class="hover:text-brand"
							onclick={() => (mobileMenuOpen = false)}
						>
							{link.label}
						</a>
					{/each}
					<div class="mt-2 flex flex-col gap-3">
						<a
							href={settings.airbnbUrl}
							target="_blank"
							rel="external noopener noreferrer"
							class="rounded-full bg-accent px-5 py-3 text-center font-semibold hover:bg-accent-700"
						>
							Book Now
						</a>
						<a
							href={settings.bookingcomUrl}
							target="_blank"
							rel="external noopener noreferrer"
							class="rounded-full border-2 border-white px-5 py-3 text-center font-semibold hover:bg-white hover:text-stone-900"
						>
							Book via Booking.com
						</a>
					</div>
				</nav>
			</div>
		{/if}
	</header>

	<div class="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
		<p class="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
			The Bell Frog Inn
		</p>
		<h1 class="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
			{settings.heroTitle}
		</h1>
		<p class="mb-10 max-w-xl text-lg font-light leading-relaxed text-white/90 md:text-xl">
			{settings.heroSubtitle}
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a
				href={settings.airbnbUrl}
				target="_blank"
				rel="external noopener noreferrer"
				class="rounded-full bg-accent px-8 py-3.5 text-base font-semibold shadow-lg transition hover:bg-accent-700"
			>
				Book Your Stay
			</a>
			<a
				href="#rates"
				class="rounded-full border-2 border-white px-8 py-3.5 text-base font-semibold transition hover:bg-white hover:text-stone-900"
			>
				See 2026 Rates
			</a>
		</div>
	</div>

	<a
		href="#accommodation"
		class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70 animate-bounce"
		aria-label="Scroll down"
	>
		<svg
			class="h-8 w-8"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</a>
</section>
