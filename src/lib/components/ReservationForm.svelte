<script lang="ts">
	import type { SiteSettings } from '$lib/cms';

	let { settings }: { settings: SiteSettings } = $props();

	let engineLive: boolean | null = $state(null);

	let checkIn = $state('');
	let checkOut = $state('');
	let guests = $state(2);
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let notes = $state('');

	let checking = $state(false);
	let availability: boolean | null = $state(null);
	let submitting = $state(false);
	let bookingCode: string | null = $state(null);
	let formError: string | null = $state(null);

	const today = new Date().toISOString().slice(0, 10);
	const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];
	const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

	async function probeEngine() {
		try {
			const res = await fetch(`/api/availability?checkIn=${today}&checkOut=${tomorrow}`);
			engineLive = res.ok;
		} catch {
			engineLive = false;
		}
	}

	async function checkAvailability() {
		if (!checkIn || !checkOut || checkOut <= checkIn) {
			availability = null;
			return;
		}
		checking = true;
		try {
			const res = await fetch(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
			if (res.ok) {
				const data = await res.json();
				availability = data.available === true;
			} else {
				availability = null;
			}
		} catch {
			availability = null;
		} finally {
			checking = false;
		}
	}

	async function submit() {
		formError = null;
		submitting = true;
		try {
			const res = await fetch('/api/bookings', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ checkIn, checkOut, guests, name, email, phone, notes })
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok) {
				bookingCode = data.code ?? 'BF-0000';
			} else if (res.status === 409) {
				availability = false;
				formError = 'Those dates were just taken — please pick another range.';
			} else {
				formError = data.message ?? 'Something went wrong. Please try again or book via Airbnb/Booking.com.';
			}
		} catch {
			formError = 'Network error. Please try again or book via Airbnb/Booking.com.';
		} finally {
			submitting = false;
		}
	}

	probeEngine();

	const inputClass =		'w-full rounded-2xl border-0 bg-white px-4 py-3 text-stone-900 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-brand';
	const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500';
</script>

<div class="rounded-3xl bg-stone-50 p-6 ring-1 ring-stone-100 md:p-8">
	<h3 class="mb-2 text-2xl font-semibold text-stone-900">Request a Booking</h3>
	<p class="mb-6 text-sm text-stone-500">
		Send a direct booking request — we reply within 24 hours. A 20% non-refundable deposit secures
		your reservation.
	</p>

	{#if engineLive === false}
		<div class="rounded-2xl bg-white p-6 text-center ring-1 ring-stone-200">
			<p class="mb-4 text-sm leading-relaxed text-stone-600">
				Our direct booking engine is being switched on. In the meantime, reserve instantly through
				our trusted partners:
			</p>
			<div class="flex flex-wrap justify-center gap-3">
				<a
					href={settings.airbnbUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-700"
				>
					Book on Airbnb
				</a>
				<a
					href={settings.bookingcomUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
				>
					Book via Booking.com
				</a>
			</div>
		</div>
	{:else if bookingCode}
		<div class="rounded-2xl bg-white p-8 text-center ring-1 ring-stone-200">
			<p class="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">Request received</p>
			<p class="mb-3 text-3xl font-bold text-stone-900">{bookingCode}</p>
			<p class="text-sm leading-relaxed text-stone-600">
				Thank you, {name.split(' ')[0] || 'traveller'}! Your request for
				<strong>{checkIn}</strong> → <strong>{checkOut}</strong> is pending. We’ve emailed
				<strong>{email}</strong> a copy and will confirm availability shortly.
			</p>
		</div>
	{:else}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
			class="grid gap-4 sm:grid-cols-2"
		>
			<div>
				<label for="check-in" class={labelClass}>Check-in</label>
				<input
					id="check-in"
					type="date"
					min={today}
					bind:value={checkIn}
					onchange={checkAvailability}
					required
					class={inputClass}
				/>
			</div>
			<div>
				<label for="check-out" class={labelClass}>Check-out</label>
				<input
					id="check-out"
					type="date"
					min={checkIn || today}
					bind:value={checkOut}
					onchange={checkAvailability}
					required
					class={inputClass}
				/>
			</div>

			{#if availability !== null}
				<div class="sm:col-span-2">
					{#if availability}
						<p class="rounded-2xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand ring-1 ring-brand/20">
							Good news — these dates are available.
						</p>
					{:else}
						<p class="rounded-2xl bg-accent-700/10 px-4 py-3 text-sm font-semibold text-accent-700 ring-1 ring-accent-700/20">
							Those dates are fully booked — try adjusting your stay.
						</p>
					{/if}
				</div>
			{:else if checking}
				<p class="text-sm text-stone-400 sm:col-span-2">Checking availability…</p>
			{/if}

			<div>
				<label for="guests" class={labelClass}>Guests</label>
				<select id="guests" bind:value={guests} required class={inputClass}>
					{#each guestOptions as n (n)}
						<option value={n}>{n} guest{n > 1 ? 's' : ''}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="name" class={labelClass}>Full name</label>
				<input id="name" type="text" bind:value={name} required placeholder="Jane Doe" class={inputClass} />
			</div>
			<div>
				<label for="email" class={labelClass}>Email</label>
				<input id="email" type="email" bind:value={email} required placeholder="jane@example.com" class={inputClass} />
			</div>
			<div>
				<label for="phone" class={labelClass}>Phone / WhatsApp <span class="font-normal normal-case text-stone-400">(optional)</span></label>
				<input id="phone" type="tel" bind:value={phone} placeholder="+267 …" class={inputClass} />
			</div>
			<div class="sm:col-span-2">
				<label for="notes" class={labelClass}>Notes <span class="font-normal normal-case text-stone-400">(optional)</span></label>
				<textarea
					id="notes"
					rows="3"
					bind:value={notes}
					placeholder="Tent preference, dietary needs, transfers, helicopter flights…"
					class={inputClass}
				></textarea>
			</div>

			{#if formError}
				<p class="rounded-2xl bg-accent-700/10 px-4 py-3 text-sm font-semibold text-accent-700 ring-1 ring-accent-700/20 sm:col-span-2">
					{formError}
				</p>
			{/if}

			<div class="sm:col-span-2">
				<button
					type="submit"
					disabled={submitting || availability === false}
					class="w-full rounded-full bg-brand px-8 py-4 font-semibold text-white shadow transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{submitting ? 'Sending request…' : 'Send Booking Request'}
				</button>
				<p class="mt-3 text-center text-xs text-stone-400">
					Inquiries go straight to <a class="underline hover:text-brand" href="mailto:{settings.notificationEmail}">{settings.notificationEmail}</a>
				</p>
			</div>
		</form>
	{/if}
</div>
