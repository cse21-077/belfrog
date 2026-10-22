<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { btnPrimary, btnSecondary, cardCls, inputCls, labelCls } from '$lib/admin/ui';

	let { data, form } = $props();
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-stone-900">Blocked Dates</h1>
	<p class="mt-1 text-sm text-stone-500">
		Holds and maintenance blocks. Imported Airbnb / Booking.com blocks appear automatically after a sync.
	</p>
</div>

{#if form?.message}
	<p class="mb-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand ring-1 ring-brand/20">{form.message}</p>
{/if}

<div class="grid gap-6 lg:grid-cols-2">
	<div class="{cardCls}">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-stone-900">Manual blocks</h2>
			<form method="POST" action="?/sync" use:enhance>
				<button type="submit" class={btnSecondary}>
					{data.syncAt ? `Sync now (last: ${data.syncAt.toLocaleString('en-GB')})` : 'Sync calendars now'}
				</button>
			</form>
		</div>

		<form method="POST" action="?/add" use:enhance class="mb-6 grid gap-3 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100 sm:grid-cols-2">
			<div>
				<span class={labelCls}>First blocked night</span>
				<input name="start" type="date" required class={inputCls} />
			</div>
			<div>
				<span class={labelCls}>Last blocked night</span>
				<input name="end" type="date" required class={inputCls} />
			</div>
			<div class="sm:col-span-2">
				<span class={labelCls}>Reason (optional)</span>
				<input name="summary" class={inputCls} placeholder="Maintenance, staff hold, private event…" />
			</div>
			<div class="sm:col-span-2">
				<button type="submit" class={btnPrimary}>Add block</button>
			</div>
		</form>

		{#if data.manual.length === 0}
			<p class="text-sm text-stone-500">No manual blocks.</p>
		{:else}
			<ul class="divide-y divide-stone-100">
				{#each data.manual as block (block.id)}
					<li class="flex items-center justify-between gap-4 py-3">
						<div>
							<p class="text-sm font-medium text-stone-900">
								{block.start.toISOString().slice(0, 10)} → {new Date(block.end.getTime() - 86400000).toISOString().slice(0, 10)}
							</p>
							<p class="text-xs text-stone-500">{block.summary}</p>
						</div>
						<form method="POST" action="?/remove" use:enhance>
							<input type="hidden" name="id" value={block.id} />
							<button type="submit" class="rounded-full bg-accent-700/10 px-3 py-1.5 text-xs font-semibold text-accent-700 hover:bg-accent-700 hover:text-white">
								Remove
							</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="{cardCls}">
		<h2 class="mb-4 text-xl font-semibold text-stone-900">Imported from Airbnb / Booking.com</h2>
		{#if data.imported.length === 0}
			<p class="text-sm text-stone-500">
				Nothing imported yet. Paste your iCal feed URLs in
				<a href={resolve('/admin/settings')} class="font-semibold text-brand underline">Settings</a>
				then sync.
			</p>
		{:else}
			<ul class="divide-y divide-stone-100">
				{#each data.imported as block (block.id)}
					<li class="py-3">
						<p class="text-sm font-medium text-stone-900">
							{block.start.toISOString().slice(0, 10)} → {new Date(block.end.getTime() - 86400000).toISOString().slice(0, 10)}
						</p>
						<p class="text-xs text-stone-500">
							{block.summary || (block.source === 'AIRBNB' ? 'Airbnb reservation' : 'Booking.com reservation')}
							· {block.source === 'AIRBNB' ? 'Airbnb' : 'Booking.com'}
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
