<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import type { Review, SiteSettings } from '$lib/cms';

	let { reviews, settings }: { reviews: Review[]; settings: SiteSettings } = $props();

	let index = $state(0);
	let timer: ReturnType<typeof setInterval> | null = null;

	const count = $derived(reviews.length);
	const current = $derived(reviews[index]);
	const dotIndexes = $derived(Array.from({ length: count }, (unused, i) => i));

	function go(next: number) {
		if (count === 0) return;
		index = (next + count) % count;
	}

	function startAutoAdvance() {
		stopAutoAdvance();
		if (count > 1) {
			timer = setInterval(() => go(index + 1), 7000);
		}
	}

	function stopAutoAdvance() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	startAutoAdvance();

	const stars = (rating: number) => '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating);
</script>

<section id="reviews" class="bg-stone-50 px-6 py-20 md:py-28">
	<div class="mx-auto max-w-4xl">
		<SectionHeading label="Guest Book" title="What Our Guests Say" />

		{#if settings.reviewsWidgetEmbed}
			<div class="overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-stone-100">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html settings.reviewsWidgetEmbed}
			</div>
		{:else if count > 0}
			<div
				class="relative rounded-3xl bg-white p-8 shadow-sm md:p-12"
				onmouseenter={stopAutoAdvance}
				onmouseleave={startAutoAdvance}
				role="region"
				aria-label="Guest reviews"
				aria-roledescription="carousel"
			>
				{#if current}
					<figure aria-live="polite">
						<div class="mb-4 text-xl tracking-widest text-accent" aria-label="{current.rating} out of 5 stars">
							{stars(current.rating)}
						</div>
						<blockquote class="text-xl leading-relaxed text-stone-700 md:text-2xl">
							“{current.text}”
						</blockquote>
						<figcaption class="mt-6 text-sm font-semibold text-stone-900">
							{current.author}
							<span class="ml-2 font-normal text-stone-400">
								{current.location} · {current.source === 'BOOKINGCOM' ? 'Booking.com' : current.source === 'GOOGLE' ? 'Google' : 'Airbnb'} ·
								{new Date(current.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
							</span>
						</figcaption>
					</figure>
				{/if}

				{#if count > 1}
					<div class="mt-8 flex items-center justify-between">
						<div class="flex gap-2">
							{#each dotIndexes as i (i)}
								<button
									type="button"
									aria-label="Go to review {i + 1}"
									onclick={() => go(i)}
									class="h-2.5 rounded-full transition-all {i === index ? 'w-6 bg-brand' : 'w-2.5 bg-stone-300 hover:bg-stone-400'}"
								></button>
							{/each}
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								aria-label="Previous review"
								onclick={() => go(index - 1)}
								class="rounded-full bg-stone-100 p-3 text-stone-600 transition hover:bg-stone-200"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								type="button"
								aria-label="Next review"
								onclick={() => go(index + 1)}
								class="rounded-full bg-stone-100 p-3 text-stone-600 transition hover:bg-stone-200"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>
