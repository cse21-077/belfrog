<script lang="ts">
	import { resolve } from '$app/paths';
	import { btnPrimary, cardCls } from '$lib/admin/ui';

	let { data } = $props();
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold text-stone-900">Tents</h1>
	<a href={resolve('/admin/tents/new')} class={btnPrimary}>+ New tent</a>
</div>

<div class="{cardCls} overflow-hidden p-0">
	{#if data.tents.length === 0}
		<p class="p-8 text-sm text-stone-500">No tents yet.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-stone-50">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Name</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Setswana name</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Capacity</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Price / night</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
						<th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-500"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-stone-100">
					{#each data.tents as tent (tent.id)}
						<tr>
							<td class="px-4 py-3 text-sm font-medium text-stone-900">{tent.name}</td>
							<td class="px-4 py-3 text-sm text-stone-700">{tent.localName}</td>
							<td class="px-4 py-3 text-sm text-stone-700">Sleeps {tent.capacity}</td>
							<td class="px-4 py-3 text-sm text-stone-700">{tent.pricePerNight ? `P${tent.pricePerNight}` : '—'}</td>
							<td class="px-4 py-3">
								<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold {tent.active ? 'bg-brand/10 text-brand' : 'bg-stone-200 text-stone-500'}">
									{tent.active ? 'Live' : 'Hidden'}
								</span>
							</td>
							<td class="px-4 py-3 text-right">
								<a href={resolve(`/admin/tents/${tent.id}`)} class="text-sm font-semibold text-brand underline hover:text-brand-700">Edit</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
