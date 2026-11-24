<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import horizonLogo from '$lib/assets/Home - Helicopter Horizons/logo_horizon.png';
	import riverside from '$lib/assets/riverside_beldftog.jpg';
	import type { SiteSettings } from '$lib/cms';

	let { settings }: { settings: SiteSettings } = $props();
</script>

<section id="experiences" class="bg-white px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="Adventures" title="Experiences" />

		<div class="grid gap-8 lg:grid-cols-2">
			<div class="rounded-3xl bg-stone-50 p-8 ring-1 ring-stone-100 md:p-10">
				<h3 class="mb-4 text-2xl font-semibold text-stone-900">Mokoro Trips</h3>
				<p class="leading-relaxed text-stone-700">
					After a light breakfast, grab a wide-brimmed hat and a packed lunch. We’ll arrange pickup directly
					from your accommodation and take you gliding through the tranquil waterways of the Okavango Delta,
					surrounded by rich biodiversity.
				</p>
				<div class="mt-6 flex flex-wrap gap-3">
					<a
						href="https://wa.me/{settings.whatsapp}"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center rounded-full bg-brand px-6 py-3 font-semibold text-white shadow transition hover:bg-brand-700"
					>
						Arrange a Mokoro trip
					</a>
					<a
						href="#rates"
						class="inline-flex items-center rounded-full border-2 border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand hover:text-white"
					>
						See 2026 rates
					</a>
				</div>
			</div>

			<div class="rounded-3xl bg-stone-50 p-8 ring-1 ring-stone-100 md:p-10">
				<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
					<img src={horizonLogo} alt="Helicopter Horizons" class="h-12 sm:h-16 w-auto object-contain" />
					<div>
						<h3 class="text-2xl font-semibold text-stone-900">Doors-Off Helicopter Flights</h3>
						<p class="text-sm text-stone-500">Departing from The Bell Frog</p>
					</div>
				</div>
				<p class="leading-relaxed text-stone-700">
					We’ve partnered with Helicopter Horizons for an incredible scenic flight over the south-western
					Okavango Delta. Doors are removed for unrestricted views, headsets keep you in touch with expert
					pilots, and you’ll soar above palm islands and lagoons. Choose from direct flight transfers,
					30 &amp; 45-minute doors-off scenic flights, or the Elephant Havens and Xhoo Community
					experiences — all listed in our 2026 rates.
				</p>
				<a
					href="#rates"
					class="mt-6 inline-flex items-center rounded-full border-2 border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand hover:text-white"
				>
					Helicopter rates & packages
				</a>
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

		<div class="relative mt-8 overflow-hidden rounded-3xl bg-stone-900 text-white">
			<img src={riverside} alt="Springbok and riverside" class="absolute inset-0 h-full w-full object-cover md:hidden" />
			<video
				autoplay
				muted
				loop
				playsinline
				preload="metadata"
				poster={riverside}
				class="absolute inset-0 h-full w-full object-cover hidden md:block"
			>
				<source
					src="https://gigv2mtom7.ufs.sh/f/nNcvyTvVcPZi1yyw8SHPWxvZGtuEVPC3OINLApgyrwqafK78"
					type="video/mp4"
				/>
			</video>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
			<div class="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-8">
				<h4 class="mb-2 text-lg font-semibold">Sit back and relax — watch nature</h4>
			</div>
		</div>
	</div>
</section>
