<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import horizonLogo from '$lib/assets/Home - Helicopter Horizons/logo_horizon.png';

	const scenic30 = [
		[1, 560],
		[2, 280],
		[3, 185],
		[4, 240],
		[5, 195],
		[6, 160],
		[7, 195],
		[8, 170],
		[9, 150],
		[10, 175],
		[11, 160],
		[12, 145]
	];

	const scenic45 = [
		[1, 790],
		[2, 395],
		[3, 265],
		[4, 355],
		[5, 285],
		[6, 240],
		[7, 290],
		[8, 250],
		[9, 230],
		[10, 270],
		[11, 245],
		[12, 225]
	];

	const transfers = [
		{ name: 'One way transfer (10 min)', price: 170, min: 2 },
		{ name: 'One way transfer (25 min)', price: 290, min: 2 },
		{ name: 'Return transfer (10 min each direction)', price: 300, min: 2 },
		{ name: 'Return transfer (25 min & 10 min return)', price: 440, min: 2 }
	];

	const combos = [
		{
			price: 530,
			label: 'Elephant Havens Experience & 50 min doors-off scenic',
			min: 2
		},
		{
			price: 480,
			label: 'Mokoro Experience & 35 min doors-off scenic',
			min: 2
		},
		{
			price: 480,
			label: 'Xhoo Community Experience & 35 min doors-off scenic',
			min: 2
		}
	];
</script>

<section id="experiences" class="bg-stone-50 px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="Adventures" title="Experiences" />

		<div class="grid gap-8 lg:grid-cols-2">
			<div class="rounded-3xl bg-white p-8 shadow-sm md:p-10">
				<h3 class="mb-4 text-2xl font-semibold text-stone-900">Mokoro Trips</h3>
				<p class="leading-relaxed text-stone-700">
					After a light breakfast, grab a wide-brimmed hat and a packed lunch. We’ll arrange pickup directly
					from your accommodation and take you gliding through the tranquil waterways of the Okavango Delta,
					surrounded by rich biodiversity.
				</p>
				<a
					href="https://wa.me/26775116886"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 font-semibold text-white shadow transition hover:bg-brand-700"
				>
					Arrange a Mokoro trip
				</a>
			</div>

			<div class="rounded-3xl bg-white p-8 shadow-sm md:p-10">
				<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
					<img src={horizonLogo} alt="Helicopter Horizons" class="h-16 w-auto" />
					<div>
						<h3 class="text-2xl font-semibold text-stone-900">Doors-Off Helicopter Flights</h3>
						<p class="text-sm text-stone-500">Departing from The Bell Frog</p>
					</div>
				</div>
				<p class="leading-relaxed text-stone-700">
					We’ve partnered with Helicopter Horizons for an incredible scenic flight over the south-western
					Okavango Delta. Doors are removed for unrestricted views, headsets keep you in touch with expert
					pilots, and you’ll soar above permanent waterways, palm islands and lagoons.
				</p>
			</div>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="aspect-[4/3] overflow-hidden rounded-3xl sm:col-span-2">
				<img
					src="/heli-flight.jpg"
					alt="Helicopter flying over the Okavango Delta"
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="grid gap-4">
				<div class="aspect-[4/3] overflow-hidden rounded-3xl">
					<img
						src="/heli-landing.jpg"
						alt="Helicopter landing at the lodge"
						class="h-full w-full object-cover"
					/>
				</div>
				<div class="aspect-[4/3] overflow-hidden rounded-3xl">
					<img
						src="/heli-aerial.webp"
						alt="Aerial view of a helicopter over the Delta"
						class="h-full w-full object-cover"
					/>
				</div>
			</div>
		</div>

		<div class="mt-12 grid gap-8 lg:grid-cols-2">
			<div class="rounded-3xl bg-white p-6 shadow-sm md:p-8">
				<h4 class="mb-4 text-lg font-semibold text-stone-900">30 min doors-off scenic flight</h4>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="bg-stone-100 text-xs uppercase text-stone-600">
							<tr>
								<th class="px-4 py-2">People</th>
								<th class="px-4 py-2">Per person</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-stone-100">
							{#each scenic30 as row (row[0])}
								<tr>
									<td class="px-4 py-2">{row[0]}</td>
									<td class="px-4 py-2 font-semibold">${row[1]}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="rounded-3xl bg-white p-6 shadow-sm md:p-8">
				<h4 class="mb-4 text-lg font-semibold text-stone-900">45 min doors-off scenic flight</h4>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead class="bg-stone-100 text-xs uppercase text-stone-600">
							<tr>
								<th class="px-4 py-2">People</th>
								<th class="px-4 py-2">Per person</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-stone-100">
							{#each scenic45 as row (row[0])}
								<tr>
									<td class="px-4 py-2">{row[0]}</td>
									<td class="px-4 py-2 font-semibold">${row[1]}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="mt-8 grid gap-8 lg:grid-cols-2">
			<div class="relative overflow-hidden rounded-3xl bg-stone-900 text-white">
				<video
					autoplay
					muted
					loop
					playsinline
					preload="metadata"
					class="absolute inset-0 h-full w-full object-cover"
				>
					<source
						src="https://gigv2mtom7.ufs.sh/f/nNcvyTvVcPZi1yyw8SHPWxvZGtuEVPC3OINLApgyrwqafK78"
						type="video/mp4"
					/>
				</video>
				<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
				<div class="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-8">
					<h4 class="mb-2 text-lg font-semibold">Remote Champagne Experience</h4>
					<p class="text-4xl font-bold">$50</p>
					<p class="mt-2 text-sm opacity-90">per person, booked with any scenic flight above.</p>
				</div>
			</div>

			<div class="rounded-3xl bg-white p-8 shadow-sm">
				<h4 class="mb-4 text-lg font-semibold text-stone-900">Combo Experiences</h4>
				<p class="mb-4 text-sm text-stone-500">All priced per person with a minimum of 2 guests.</p>
				<ul class="space-y-4">
					{#each combos as combo (combo.label)}
						<li class="flex items-start gap-4 rounded-2xl bg-stone-50 p-4">
							<span class="text-2xl font-bold text-accent">${combo.price}</span>
							<span class="text-sm font-medium text-stone-700">{combo.label}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-8 rounded-3xl bg-white p-8 shadow-sm">
			<h4 class="mb-6 text-lg font-semibold text-stone-900">Maun to The Bell Frog Transfers</h4>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each transfers as t (t.name)}
					<div class="rounded-2xl bg-stone-50 p-5">
						<p class="text-sm font-semibold text-stone-900">{t.name}</p>
						<p class="mt-2 text-2xl font-bold text-brand">${t.price}</p>
						<p class="text-xs text-stone-500">per person, min {t.min}</p>
					</div>
				{/each}
			</div>
			<p class="mt-4 text-sm text-stone-500">
				* Transfer rates include Maun Departure Tax ($20 per person) and 20kg of soft luggage per person.
			</p>
		</div>

		<div class="mt-8 text-center text-sm text-stone-500">
			<p>
				Contact:
				<a href="mailto:tbfi.botswana@gmail.com" class="underline hover:text-brand">tbfi.botswana@gmail.com</a>
				& WhatsApp
				<a href="https://wa.me/26775116886" class="underline hover:text-brand">(+267) 7511 6886</a>
			</p>
			<p class="mt-1">Above rates are on a per person basis | Valid 1 Jan 2024 – 31 Dec 2024</p>
		</div>
	</div>
</section>
