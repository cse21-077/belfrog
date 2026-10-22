<script lang="ts">
	import { resolve } from '$app/paths';
	import { btnPrimary, cardCls } from '$lib/admin/ui';
	import type { RateCategory } from '$lib/cms';

	let { data } = $props();

	const categoryTitles: Record<RateCategory, string> = {
		GLAMPING: 'Glamping Accommodation',
		EXCURSION: 'Delta Excursions',
		BOAT: 'Boat Cruises',
		TRANSFER: 'Transfers',
		HELICOPTER: 'Helicopter Flights',
		SPECIAL: 'Special Requests'
	};

	const groups = $derived(
		(['GLAMPING', 'EXCURSION', 'BOAT', 'TRANSFER', 'HELICOPTER', 'SPECIAL'] as RateCategory[])
			.map((category) => ({
				category,
				items: data.rates.filter((r) => r.category === category)
			}))
			.filter((g) => g.items.length > 0)
	);
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold text-stone-900">Rates</h1>
	<a href={resolve('/admin/rates/new')} class={btnPrimary}>+ New rate</a>
</div>

<div class="space-y-8">
	{#each groups as group (group.category)}
		<div class="{cardCls} overflow-hidden p-0">
			<div class="border-b border-stone-100 bg-stone-50 px-6 py-4">
				<h2 class="font-semibold text-stone-900">{categoryTitles[group.category]}</h2>
			</div>
			<table class="w-full">
				<tbody class="divide-y divide-stone-100">
					{#each group.items as rate (rate.id)}
						<tr>
							<td class="px-6 py-3">
								<p class="text-sm font-medium text-stone-900">{rate.name}</p>
								{#if rate.details}
									<p class="mt-0.5 line-clamp-1 text-xs text-stone-500">{rate.details}</p>
								{/if}
							</td>
							<td class="px-6 py-3 text-right text-sm text-stone-700">
								{#if rate.unit === 'COMPLIMENTARY'}
									Complimentary
								{:else if rate.unit === 'ON_REQUEST'}
									On request
								{:else}
									{#each rate.prices as price (price.id)}
										<div>
											{price.amount != null ? `${price.currency === 'BWP' ? 'P' : price.currency === 'USD' ? '$' : '€'}${price.amount}` : '—'}
											<span class="text-xs text-stone-500">{price.label}</span>
										</div>
									{/each}
								{/if}
							</td>
							<td class="px-6 py-3 text-right">
								<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold {rate.active ? 'bg-brand/10 text-brand' : 'bg-stone-200 text-stone-500'}">
									{rate.active ? 'Live' : 'Hidden'}
								</span>
								<a href={resolve(`/admin/rates/${rate.id}`)} class="ml-3 text-sm font-semibold text-brand underline hover:text-brand-700">Edit</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/each}
</div>
