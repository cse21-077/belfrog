<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import {
		CURRENCIES,
		CURRENCY_META,
		formatRatePrice,
		type Currency,
		type Rate,
		type RateCategory,
		type SiteSettings
	} from '$lib/cms';

	let { rates, settings }: { rates: Rate[]; settings: SiteSettings } = $props();

	let currency = $state<Currency>('BWP');
	let openCategory = $state<RateCategory | null>('GLAMPING');

	const fx = $derived({ usd: settings.fxUsd, eur: settings.fxEur });

	const CATEGORY_META: Record<RateCategory, { title: string; blurb: string }> = {
		GLAMPING: { title: 'Glamping Accommodation', blurb: 'Per night · includes daily breakfast' },
		EXCURSION: { title: 'Delta Excursions', blurb: 'Mokoro & overnight wilderness trips' },
		BOAT: { title: 'Boat Cruises', blurb: 'Motorboat trips on the Boro River' },
		TRANSFER: { title: 'Road & Boat Transfers', blurb: 'Between Maun and The Bell Frog' },
		HELICOPTER: { title: 'Helicopter Horizons Flights', blurb: 'Partner packages · quoted per person in USD' },
		SPECIAL: { title: 'Special Requests', blurb: 'Tailor-made arrangements' }
	};

	const categoryOrder: RateCategory[] = ['GLAMPING', 'EXCURSION', 'BOAT', 'TRANSFER', 'HELICOPTER', 'SPECIAL'];

	const byCategory = $derived(
		categoryOrder
			.map((category) => ({
				category,
				items: rates.filter((r) => r.category === category)
			}))
			.filter((group) => group.items.length > 0)
	);

	function toggle(category: RateCategory) {
		openCategory = openCategory === category ? null : category;
	}

	function priceText(price: { amount: number | null; currency: Currency }): string {
		return formatRatePrice(price, currency, fx);
	}
</script>

<section id="rates" class="bg-white px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<SectionHeading label="Rates" title="Activities & Transfer Rates 2026" />
			<div class="flex items-center gap-3">
				<span class="text-xs font-semibold uppercase tracking-widest text-stone-400">Currency</span>
				<div class="inline-flex rounded-full bg-stone-100 p-1 ring-1 ring-stone-200" role="group" aria-label="Currency">
					{#each CURRENCIES as c (c)}
						<button
							type="button"
							onclick={() => (currency = c)}
							aria-pressed={currency === c}
							class="rounded-full px-4 py-2 text-sm font-semibold transition {currency === c
								? 'bg-brand text-white shadow'
								: 'text-stone-500 hover:text-stone-900'}"
						>
							{CURRENCY_META[c].symbol} {c}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-4 space-y-4">
			{#each byCategory as group (group.category)}
				{@const isOpen = openCategory === group.category}
				<div class="overflow-hidden rounded-3xl bg-stone-50 ring-1 ring-stone-100">
					<button
						type="button"
						onclick={() => toggle(group.category)}
						aria-expanded={isOpen}
						class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-stone-100/60 md:px-8"
					>
						<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<h3 class="text-xl font-semibold text-stone-900">{CATEGORY_META[group.category].title}</h3>
							<span class="text-xs font-medium uppercase tracking-wider text-stone-400">
								{CATEGORY_META[group.category].blurb}
							</span>
						</div>
						<svg
							class="h-6 w-6 shrink-0 text-brand transition-transform duration-300 {isOpen ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if isOpen}
						<div class="border-t border-stone-200/60 px-6 pb-6 md:px-8">
							<ul class="divide-y divide-stone-200/70">
								{#each group.items as rate (rate.id)}
									<li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
										<div class="max-w-md">
											<p class="font-semibold text-stone-900">{rate.name}</p>
											{#if rate.details}
												<p class="mt-1 text-sm leading-relaxed text-stone-500">{rate.details}</p>
											{/if}
											{#if rate.minPax || rate.maxPax}
												<p class="mt-2 text-xs font-medium text-stone-400">
													{#if rate.minPax}Min {rate.minPax} pax{/if}{#if rate.minPax && rate.maxPax} · {/if}{#if rate.maxPax}Max {rate.maxPax} pax{/if}
												</p>
											{/if}
										</div>

										<div class="shrink-0 sm:text-right">
											{#if rate.unit === 'COMPLIMENTARY'}
												<span class="text-lg font-bold text-accent">Complimentary</span>
											{:else if rate.unit === 'ON_REQUEST'}
												<span class="text-lg font-semibold text-stone-500">On request</span>
											{:else}
												{#each rate.prices as price (price.sortOrder + price.label)}
													<div class="flex items-baseline gap-2 sm:justify-end">
														<span class="text-lg font-bold text-brand">{priceText(price)}</span>
														<span class="text-xs text-stone-500">{price.label}</span>
													</div>
												{/each}
											{/if}
										</div>
									</li>
								{/each}
							</ul>

							{#if group.category === 'HELICOPTER'}
								<p class="mt-4 rounded-2xl bg-white/70 p-4 text-xs leading-relaxed text-stone-500 ring-1 ring-stone-100">
									Partnership packages valid 1 Jan 2026 – 31 Dec 2026. Rates are quoted per person in USD —
									converted to your selected currency above. Flight transfers include a maximum of 20kg of
									luggage per person, strictly in soft-sided bags.
								</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#if settings.ratesFootnote}
			<p class="mt-8 text-center text-sm text-stone-500">{settings.ratesFootnote}</p>
		{/if}
	</div>
</section>
