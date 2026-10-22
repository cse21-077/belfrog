<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import poolImage from '$lib/assets/belfrogswimmingpool.jpg';
	import kidsPool from '$lib/assets/kids_inpool.jpg';
	import riverside from '$lib/assets/riverside_beldftog.jpg';
</script>

<section id="about" class="bg-white px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="About Us" title="A little piece of heaven in the Okavango" />

		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div class="space-y-6 text-stone-700 leading-relaxed">
				<p>
					We’re an agro-tourism resort in the Okavango, Botswana, situated <strong>2km from the Buffalo Fence</strong> and <strong>20km from Maun</strong>.
				</p>
				<p>
					Botswana is one of Africa’s most culturally and environmentally rich countries. It’s landlocked, with light soils, an arid to semi-arid climate, summer temperatures averaging over 40°C, and an annual rainfall of around 416mm. This little piece of heaven is where we decided to start farming.
				</p>
				<p>
					In Maun and the Okavango Delta, tourism is vital to our livelihoods. Our Agro-Tourism classification allows us to use up to <strong>50% of our plot for tourism</strong>. We’re currently awaiting the completion of our EMP before lodge construction begins — a main building with kitchen, lounge, dining area and bar; five tree houses, six top-quality double rooms, a pool bar, and quite possibly the only sauna on the Boro River.
				</p>
				<p>
					We also have a small guest marina that can accommodate <strong>nine commercial pleasure craft</strong> at any one time.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
				<!-- Large feature: video (spans 2 cols, 2 rows on desktop) -->
				<div class="col-span-1 sm:col-span-2 sm:row-span-2 overflow-hidden rounded-3xl bg-black">
					<div class="aspect-[4/3] w-full h-full">
						<img src={poolImage} alt="Pool" class="h-full w-full object-cover md:hidden rounded-3xl" />

						<video
							autoplay
							muted
							loop
							playsinline
							poster={poolImage}
							preload="metadata"
							class="hidden md:block h-full w-full object-cover rounded-3xl"
						>
							<source src="/farm.mp4" type="video/mp4" />
						</video>
					</div>
				</div>

				<!-- Top-right: kids in pool -->
				<div class="overflow-hidden rounded-3xl bg-stone-100">
					<img src={kidsPool} alt="Kids in pool" class="h-full w-full object-cover aspect-[4/3] rounded-3xl" />
				</div>

				<!-- Middle-right: riverside wildlife -->
				<div class="overflow-hidden rounded-3xl bg-stone-100">
					<img src={riverside} alt="Riverside" class="h-full w-full object-cover aspect-[4/3] rounded-3xl" />
				</div>
			</div>
		</div>
	</div>
</section>
