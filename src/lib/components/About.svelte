<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
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
					In Maun and the Okavango Delta, tourism is vital to our livelihoods. Our Agro-Tourism classification allows us to use up to <strong>50% of our plot for tourism</strong>, featuring a main building with a kitchen, lounge, dining area, and bar; two luxury tents; four standard tents; and a pool bar.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
				<!-- Large feature: pizza & drinks served at the bar (spans 2 cols, 2 rows on desktop) -->
				<div class="col-span-1 sm:col-span-2 sm:row-span-2 overflow-hidden rounded-3xl bg-stone-100">
					<img
						src="/about-serve.jpg"
						alt="Fresh pizza and drinks served at the Bell Frog bar"
						class="h-full w-full object-cover aspect-[4/3] rounded-3xl"
					/>
				</div>

				<!-- Top-right: boat trip boarding -->
				<div class="overflow-hidden rounded-3xl bg-stone-100">
					<img
						src="/about-boat.jpg"
						alt="Guests boarding a boat at the dock"
						class="h-full w-full object-cover aspect-[4/3] rounded-3xl"
					/>
				</div>

				<!-- Middle-right: guests at the lodge table -->
				<div class="overflow-hidden rounded-3xl bg-stone-100">
					<img
						src="/about-table.jpg"
						alt="Guests relaxing together at the lodge"
						class="h-full w-full object-cover aspect-[4/3] rounded-3xl"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
