<script lang="ts">
	import { AIRBNB_URL } from '$lib/booking';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="accommodation" class="bg-white px-6 py-20 md:py-28">
	<div class="mx-auto max-w-7xl">
		<SectionHeading label="Stay" title="Accommodation & Rates" />

		<div class="grid gap-8 lg:grid-cols-2">
			<div class="rounded-3xl bg-stone-50 p-8 md:p-10">
				<h3 class="mb-6 text-2xl font-semibold text-stone-900">Rates & Booking</h3>
				<ul class="space-y-5 text-stone-700">
					<li class="flex items-start gap-3">
						<span class="mt-1 h-2 w-2 rounded-full bg-accent"></span>
						<span>
							<strong class="text-stone-900">950 Pula</strong> per person per night
							<span class="text-sm text-stone-500">(~€65)</span>
						</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="mt-1 h-2 w-2 rounded-full bg-accent"></span>
						<span>
							<strong class="text-stone-900">855 Pula</strong> per person per night for SADC guests
						</span>
					</li>
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
				<a
					href={AIRBNB_URL}
					target="_blank"
					rel="external noopener noreferrer"
					class="mt-8 inline-flex items-center rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow transition hover:bg-brand-700"
				>
					Book on Airbnb
				</a>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="rounded-3xl bg-brand p-6 text-white">
					<p class="text-4xl font-bold">950</p>
					<p class="mt-1 text-sm font-medium opacity-90">Pula / person / night</p>
				</div>
				<div class="rounded-3xl bg-accent p-6 text-white">
					<p class="text-4xl font-bold">855</p>
					<p class="mt-1 text-sm font-medium opacity-90">Pula for SADC guests</p>
				</div>
				<div class="col-span-2 overflow-hidden rounded-3xl">
					<img
						src="/jackalberry.jpg"
						alt="Glamping tent at The Bell Frog Inn"
						class="h-64 w-full object-cover"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
