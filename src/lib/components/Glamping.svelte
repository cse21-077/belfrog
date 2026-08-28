<script lang="ts">
	import { AIRBNB_URL } from '$lib/booking';
	import SectionHeading from './SectionHeading.svelte';

	const tents = [
		{
			name: 'Jackalberry',
			localName: 'Mokhothombo',
			sleeps: 3,
			image: '/jackalberry.jpg'
		},
		{
			name: 'Leadwood',
			localName: 'Motswiri',
			sleeps: 3,
			image: '/leadwood.jpg'
		},
		{
			name: 'Fig Tree',
			localName: 'Mochaba',
			sleeps: 3,
			image: '/fig-tree.jpg'
		},
		{
			name: 'Knobthorn',
			localName: 'Mokhutshomo',
			sleeps: 4,
			image: '/knobthorn.jpg'
		}
	];
</script>

<section id="glamping" class="bg-stone-50 px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="Tents" title="Glamping Accommodation" />

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each tents as tent (tent.name)}
				<article class="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
					<div class="aspect-[4/3] overflow-hidden">
						<img
							src={tent.image}
							alt="{tent.name} glamping tent"
							class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
						/>
					</div>
					<div class="p-6">
						<h3 class="text-lg font-semibold text-stone-900">{tent.name}</h3>
						<p class="text-sm text-stone-500">/ {tent.localName}</p>
						<div class="mt-5 flex items-center justify-between">
							<span class="text-sm font-medium text-stone-600">Sleeps up to {tent.sleeps}</span>
							<a
								href={AIRBNB_URL}
								target="_blank"
								rel="external noopener noreferrer"
								class="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-700"
							>
								Book
							</a>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
