<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import logo from '$lib/assets/logo.png';

	let { children, data } = $props();

	const navItems = [
		{ href: '/admin', label: 'Dashboard', exact: true },
		{ href: '/admin/bookings', label: 'Bookings' },
		{ href: '/admin/tents', label: 'Tents' },
		{ href: '/admin/rates', label: 'Rates' },
		{ href: '/admin/reviews', label: 'Reviews' },
		{ href: '/admin/blocks', label: 'Blocked Dates' },
		{ href: '/admin/settings', label: 'Settings' },
		{ href: '/admin/export', label: 'Export Copy (.docx)' }
	] as const;

	const isActive = (href: string, exact = false) =>
		exact ? page.url.pathname === href : page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<title>Admin · The Bell Frog Inn</title>
</svelte:head>

<div class="min-h-screen bg-stone-100 lg:flex">
	<aside class="bg-stone-900 text-white lg:fixed lg:inset-y-0 lg:w-64">
		<div class="flex items-center justify-between px-6 py-5">
			<a href={resolve('/admin')} class="flex items-center gap-3">
				<img src={logo} alt="The Bell Frog Inn" class="h-9 w-auto brightness-0 invert" />
				<span class="text-sm font-bold uppercase tracking-wider">CMS</span>
			</a>
			<a href={resolve('/')} class="text-xs text-stone-400 underline hover:text-white lg:hidden">View site</a>
		</div>
		<nav class="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:px-3">
			{#each navItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class="shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition {isActive(item.href, 'exact' in item && item.exact)
						? 'bg-brand text-white'
						: 'text-stone-300 hover:bg-stone-800 hover:text-white'}"
				>
					{item.label}
				</a>
			{/each}
			<a
				href={resolve('/admin/logout')}
				class="shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 transition hover:bg-stone-800 hover:text-white"
			>
				Sign out
			</a>
		</nav>
	</aside>

	<div class="flex-1 lg:ml-64">
		<header class="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
			<p class="text-sm text-stone-500">
				Signed in as <span class="font-semibold text-stone-900">{data.admin?.email}</span>
			</p>
			<a href={resolve('/')} class="hidden text-sm font-semibold text-brand underline hover:text-brand-700 lg:inline">
				View website →
			</a>
		</header>
		<main class="p-6 lg:p-10">
			{@render children()}
		</main>
	</div>
</div>
