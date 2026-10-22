<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/logo.png';

	let { form } = $props();
</script>

<svelte:head>
	<title>Admin Login · The Bell Frog Inn</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-stone-100 px-6">
	<div class="w-full max-w-sm">
		<div class="mb-8 flex flex-col items-center text-center">
			<img src={logo} alt="The Bell Frog Inn" class="h-14 w-auto" />
			<h1 class="mt-4 text-2xl font-bold text-stone-900">CMS Admin</h1>
			<p class="mt-1 text-sm text-stone-500">Sign in to manage the website</p>
		</div>

		<form
			method="POST"
			use:enhance
			class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
		>
			{#if form?.error}
				<p class="mb-4 rounded-xl bg-accent-700/10 px-4 py-3 text-sm font-semibold text-accent-700 ring-1 ring-accent-700/20">
					{form.error}
				</p>
			{/if}

			<label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500" for="email">
				Email
			</label>
			<input
				id="email"
				name="email"
				type="email"
				required
				value={form?.email ?? ''}
				class="mb-4 w-full rounded-xl border-0 bg-stone-50 px-4 py-3 text-stone-900 ring-1 ring-stone-200 focus:ring-2 focus:ring-brand"
				placeholder="you@thebellfrog.com"
			/>

			<label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500" for="password">
				Password
			</label>
			<input
				id="password"
				name="password"
				type="password"
				required
				class="mb-6 w-full rounded-xl border-0 bg-stone-50 px-4 py-3 text-stone-900 ring-1 ring-stone-200 focus:ring-2 focus:ring-brand"
				placeholder="••••••••"
			/>

			<button
				type="submit"
				class="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white shadow transition hover:bg-brand-700"
			>
				Sign in
			</button>
		</form>

		<p class="mt-6 text-center">
			<a href={resolve('/')} class="text-sm text-stone-500 underline hover:text-brand">← Back to website</a>
		</p>
	</div>
</div>
