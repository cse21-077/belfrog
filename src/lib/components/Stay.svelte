<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';
	import ReservationForm from './ReservationForm.svelte';
	import { formatMoney, type Rate, type SiteSettings, type Tent } from '$lib/cms';

	let {
		tents,
		rates,
		settings
	}: { tents: Tent[]; rates: Rate[]; settings: SiteSettings } = $props();

	const glampingRates = $derived(rates.filter((r) => r.category === 'GLAMPING'));
	const standardTent = $derived(tents[0]);

	const whatsappDisplay = $derived(
		`(${settings.whatsapp.slice(0, 3)}) ${settings.whatsapp.slice(3, 7)} ${settings.whatsapp.slice(7)}`
	);
</script>

<section id="accommodation" class="bg-white px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="Stay" title="Accommodation & Rates" />

		<div class="grid gap-8 lg:grid-cols-2">
			<div class="rounded-3xl bg-stone-50 p-8 md:p-10">
				<h3 class="mb-6 text-2xl font-semibold text-stone-900">Rates & Booking</h3>
				<ul class="space-y-5 text-stone-700">
					{#each glampingRates as rate (rate.id)}
						<li class="flex items-start gap-3">
							<span class="mt-1 h-2 w-2 rounded-full bg-accent"></span>
							<span>
								<strong class="text-stone-900">
									{rate.prices[0]?.amount != null
										? formatMoney(rate.prices[0].amount, 'BWP')
										: 'On request'}
								</strong>
								per night — {rate.name}
								<span class="block text-sm text-stone-500">{rate.details}</span>
							</span>
						</li>
					{/each}
					<li class="flex items-start gap-3">
						<span class="mt-1 h-2 w-2 rounded-full bg-accent"></span>
						<span>Complimentary Wi-Fi access at the bar on request.</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 h-2 w-2 rounded-full bg-accent"></span>
						<span>A 20% non-refundable deposit secures your reservation.</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 h-2 w-2 rounded-full bg-accent"></span>
						<span>Bank card facility available — no cash transactions required.</span>
					</li>
				</ul>

				<div class="mt-8 flex flex-wrap gap-3">
					<a
						href={settings.airbnbUrl}
						target="_blank"
						rel="external noopener noreferrer"
						class="inline-flex items-center rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow transition hover:bg-brand-700"
					>
						Book on Airbnb
					</a>
					<a
						href={settings.bookingcomUrl}
						target="_blank"
						rel="external noopener noreferrer"
						class="inline-flex items-center rounded-full border-2 border-brand px-7 py-3.5 font-semibold text-brand transition hover:bg-brand hover:text-white"
					>
						Book via Booking.com
					</a>
				</div>
				<p class="mt-4 text-sm text-stone-500">
					Prefer to talk? <a href="https://wa.me/{settings.whatsapp}" class="underline hover:text-brand">WhatsApp {whatsappDisplay}</a>
					or <a class="underline hover:text-brand" href="mailto:{settings.contactEmail}">{settings.contactEmail}</a>
				</p>
			</div>

			<div class="grid grid-cols-2 gap-4">
				{#each glampingRates as rate (rate.id)}
					<div class="rounded-3xl p-6 text-white {rate.id === 'luxury-suite' ? 'bg-accent' : 'bg-brand'}">
						<p class="text-4xl font-bold">
							{rate.prices[0]?.amount != null ? formatMoney(rate.prices[0].amount, 'BWP') : '—'}
						</p>
						<p class="mt-1 text-sm font-medium opacity-90">
							{rate.id === 'luxury-suite' ? 'Luxury suite per night' : 'Standard tent per night'}
						</p>
					</div>
				{/each}
				<div class="col-span-2 overflow-hidden rounded-3xl">
					<img
						src={standardTent?.image ?? '/jackalberry.jpg'}
						alt="Tented accommodation at The Bell Frog Inn"
						class="h-64 w-full object-cover"
					/>
				</div>
			</div>
		</div>

		<div class="mt-12">
			<ReservationForm {settings} />
		</div>
	</div>
</section>
