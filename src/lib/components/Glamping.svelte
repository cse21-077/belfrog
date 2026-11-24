<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import { formatMoney, type SiteSettings, type Tent } from '$lib/cms';

	let {
		tents,
		settings
	}: { tents: Tent[]; settings: SiteSettings } = $props();

	let activeByTent = $state<Record<string, number>>({});

	const gallery = (tent: Tent) => (tent.images.length > 0 ? tent.images : [tent.image]);
	const dotIndexes = (count: number) => Array.from({ length: count }, (unused, i) => i);
	const current = (tent: Tent) => {
		const images = gallery(tent);
		const idx = activeByTent[tent.id] ?? 0;
		return images[Math.min(idx, images.length - 1)];
	};

	function show(tentId: string, index: number) {
		activeByTent = { ...activeByTent, [tentId]: index };
	}
</script>

<section id="glamping" class="bg-stone-50 px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="Tents" title="Tented Accommodation" />

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each tents as tent (tent.id)}
				{@const images = gallery(tent)}
				<article class="relative group overflow-hidden rounded-3xl bg-transparent ring-1 ring-stone-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
					<div class="relative aspect-[4/3] overflow-hidden">
						<img
							src={current(tent)}
							alt="{tent.name} tented accommodation"
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>

						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

						{#if tent.pricePerNight}
							<span class="absolute right-4 top-4 inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
								{formatMoney(tent.pricePerNight, 'BWP')} / night
							</span>
						{/if}

						{#if images.length > 1}
							<div class="absolute left-1/2 top-3 flex -translate-x-1/2 gap-1.5">
								{#each dotIndexes(images.length) as i (i)}
									<button
										type="button"
										aria-label="Show photo {i + 1} of {tent.name}"
										onclick={() => show(tent.id, i)}
										class="h-1.5 rounded-full transition-all {i === (activeByTent[tent.id] ?? 0)
											? 'w-5 bg-white'
											: 'w-1.5 bg-white/50 hover:bg-white/80'}"
									></button>
								{/each}
							</div>
						{/if}

						<div class="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-3">
							<div class="text-white">
								<h3 class="text-lg font-semibold leading-tight">{tent.name}</h3>
								<p class="text-sm opacity-90">{tent.localName}</p>
							</div>

							<div class="flex w-full items-center justify-between">
								<span class="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
									Sleeps {tent.capacity} · Max {tent.capacity} guests
								</span>

								<a
									href={tent.airbnbUrl || settings.airbnbUrl}
									target="_blank"
									rel="external noopener noreferrer"
									class="inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
								>
									Book
								</a>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<a
				href={settings.airbnbUrl}
				target="_blank"
				rel="external noopener noreferrer"
				class="rounded-full bg-accent px-7 py-3.5 font-semibold text-white shadow transition hover:bg-accent-700"
			>
				Book on Airbnb
			</a>
			<a
				href={settings.bookingcomUrl}
				target="_blank"
				rel="external noopener noreferrer"
				class="rounded-full border-2 border-brand px-7 py-3.5 font-semibold text-brand transition hover:bg-brand hover:text-white"
			>
				Book via Booking.com
			</a>
		</div>
	</div>
</section>
