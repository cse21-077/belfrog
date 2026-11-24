<script lang="ts">
	import { resolve } from '$app/paths';
	import type { SiteSettings } from '$lib/cms';
	import logo from '$lib/assets/logo.png';

	let { settings }: { settings: SiteSettings } = $props();

	const quickLinks = [
		{ label: 'Accommodation', href: '/#accommodation' },
		{ label: 'Tented Accommodation', href: '/#glamping' },
		{ label: 'Rates', href: '/#rates' },
		{ label: 'About', href: '/#about' },
		{ label: 'Experiences', href: '/#experiences' },
		{ label: 'Reviews', href: '/#reviews' }
	] as const;
</script>

<footer id="contact" class="bg-stone-900 px-6 py-16 text-white">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-1">
				<img
					src={logo}
					alt="The Bell Frog Inn"
					class="mb-4 h-14 w-auto brightness-0 invert"
				/>
				<p class="text-sm leading-relaxed text-stone-400">
					Agro-tourism in the Okavango Delta, Botswana.
				</p>
			</div>

			<div>
				<h4 class="mb-4 font-semibold">Contact</h4>
				<ul class="space-y-3 text-sm text-stone-400">
					<li>
						<a href="mailto:{settings.contactEmail}" class="hover:text-white">{settings.contactEmail}</a>
					</li>
					<li>
						<a href="https://wa.me/{settings.whatsapp}" class="hover:text-white">WhatsApp (+267) 7511 6886</a>
					</li>
					<li>
						<a href="mailto:{settings.notificationEmail}" class="hover:text-white">{settings.notificationEmail}</a>
					</li>
				</ul>
			</div>

			<div>
				<h4 class="mb-4 font-semibold">Location</h4>
				<p class="text-sm leading-relaxed text-stone-400">
					Boro River<br />
					Okavango Delta<br />
					Botswana
				</p>
			</div>

			<div>
				<h4 class="mb-4 font-semibold">Explore</h4>
				<ul class="space-y-3 text-sm text-stone-400">
					{#each quickLinks as link (link.href)}
						<li>
							<a href={resolve(link.href)} class="hover:text-white">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 md:flex-row">
			<p class="text-xs text-stone-500">© 2026 The Bell Frog Inn. All rights reserved.</p>
			<div class="flex gap-3">
				<a
					href={settings.airbnbUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold transition hover:bg-accent-700"
				>
					Book on Airbnb
				</a>
				<a
					href={settings.bookingcomUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="rounded-full border-2 border-stone-500 px-6 py-2.5 text-sm font-semibold text-stone-300 transition hover:border-white hover:text-white"
				>
					Booking.com
				</a>
			</div>
		</div>
	</div>
</footer>
