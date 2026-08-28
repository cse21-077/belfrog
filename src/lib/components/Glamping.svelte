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
				<article class="relative group overflow-hidden rounded-3xl bg-transparent ring-1 ring-stone-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
					<div class="relative aspect-[4/3] overflow-hidden">
						<img
							src={tent.image}
							alt="{tent.name} glamping tent"
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>

						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

							<div class="absolute left-4 bottom-4 right-4 flex flex-col items-start gap-3">
								<div class="text-white">
									<h3 class="text-lg font-semibold leading-tight">{tent.name}</h3>
									<p class="text-sm opacity-90">{tent.localName}</p>
								</div>

								<div class="w-full flex items-center justify-between">
									<span class="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white">Sleeps {tent.sleeps}</span>

									<a
										href={AIRBNB_URL}
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
	</div>
</section>
