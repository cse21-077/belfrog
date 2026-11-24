<script lang="ts">
	import { enhance } from '$app/forms';
	import { btnPrimary, btnSecondary, cardCls, inputCls, labelCls } from '$lib/admin/ui';

	let { data, form } = $props();
	const s = $derived(data.settings);
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-stone-900">Settings</h1>
</div>

{#if form?.message}
	<p class="mb-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand ring-1 ring-brand/20">{form.message}</p>
{/if}

<div class="grid max-w-5xl gap-6 lg:grid-cols-2">
	<form method="POST" action="?/save" use:enhance class="{cardCls} space-y-5">
		<h2 class="text-xl font-semibold text-stone-900">Homepage hero</h2>
		<div>
			<span class={labelCls}>Hero title</span>
			<input name="heroTitle" class={inputCls} value={s.heroTitle} />
		</div>
		<div>
			<span class={labelCls}>Hero subtitle</span>
			<input name="heroSubtitle" class={inputCls} value={s.heroSubtitle} />
		</div>

		<h2 class="pt-4 text-xl font-semibold text-stone-900">Contact & bookings</h2>
		<div>
			<span class={labelCls}>Public contact email</span>
			<input name="contactEmail" class={inputCls} value={s.contactEmail} />
		</div>
		<div>
			<span class={labelCls}>Booking notification email (receives form inquiries)</span>
			<input name="notificationEmail" class={inputCls} value={s.notificationEmail} />
		</div>
		<div>
			<span class={labelCls}>WhatsApp number (digits only, with country code)</span>
			<input name="whatsapp" class={inputCls} value={s.whatsapp} placeholder="26775116886" />
		</div>

		<h2 class="pt-4 text-xl font-semibold text-stone-900">Booking links</h2>
		<div>
			<span class={labelCls}>Airbnb listing URL</span>
			<input name="airbnbUrl" class={inputCls} value={s.airbnbUrl} />
		</div>
		<div>
			<span class={labelCls}>Booking.com property URL</span>
			<input name="bookingcomUrl" class={inputCls} value={s.bookingcomUrl} />
		</div>

		<h2 class="pt-4 text-xl font-semibold text-stone-900">Calendar sync (iCal)</h2>
		<p class="text-xs leading-relaxed text-stone-500">
			Paste the secret iCal feed URLs from your Airbnb / Booking.com extranets. We import them to block
			double bookings, and publish your own feed at <code>/api/calendar.ics</code> that you can subscribe
			to back in the extranets.
		</p>
		<div>
			<span class={labelCls}>Airbnb iCal feed URL</span>
			<input name="airbnbIcalUrl" class={inputCls} value={s.airbnbIcalUrl} placeholder="https://www.airbnb.co.uk/calendar/ical/…" />
		</div>
		<div>
			<span class={labelCls}>Booking.com iCal feed URL</span>
			<input name="bookingcomIcalUrl" class={inputCls} value={s.bookingcomIcalUrl} placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?…" />
		</div>

		<h2 class="pt-4 text-xl font-semibold text-stone-900">Currency & display</h2>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<span class={labelCls}>1 BWP = ? USD</span>
				<input name="fxUsd" type="number" step="0.0001" min="0" class={inputCls} value={s.fxUsd} />
			</div>
			<div>
				<span class={labelCls}>1 BWP = ? EUR</span>
				<input name="fxEur" type="number" step="0.0001" min="0" class={inputCls} value={s.fxEur} />
			</div>
		</div>
		<div>
			<span class={labelCls}>Rates footnote</span>
			<input name="ratesFootnote" class={inputCls} value={s.ratesFootnote} />
		</div>
		<div>
			<span class={labelCls}>Reviews widget embed code (optional — overrides CMS reviews)</span>
			<textarea name="reviewsWidgetEmbed" rows="4" class={inputCls} placeholder="<script …>">{s.reviewsWidgetEmbed}</textarea>
		</div>

		<button type="submit" class={btnPrimary}>Save settings</button>
	</form>

	<div class="space-y-6">
		<form method="POST" action="?/changePassword" use:enhance class="{cardCls} space-y-5">
			<h2 class="text-xl font-semibold text-stone-900">Change password</h2>
			<p class="text-xs text-stone-500">Signed in as {data.adminEmail}</p>
			<div>
				<span class={labelCls}>Current password</span>
				<input name="current" type="password" required class={inputCls} autocomplete="current-password" />
			</div>
			<div>
				<span class={labelCls}>New password (min 10 chars)</span>
				<input name="next" type="password" required minlength="10" class={inputCls} autocomplete="new-password" />
			</div>
			<div>
				<span class={labelCls}>Confirm new password</span>
				<input name="confirm" type="password" required minlength="10" class={inputCls} autocomplete="new-password" />
			</div>
			<button type="submit" class={btnSecondary}>Change password</button>
		</form>

		<div class="{cardCls}">
			<h2 class="mb-2 text-xl font-semibold text-stone-900">Your outbound calendar feed</h2>
			<p class="mb-3 text-sm leading-relaxed text-stone-500">
				Subscribe to this iCal URL inside Airbnb / Booking.com so direct bookings block those platforms too:
			</p>
			<code class="block break-all rounded-2xl bg-stone-50 px-4 py-3 text-xs text-stone-700 ring-1 ring-stone-100">
				{typeof window !== 'undefined' ? window.location.origin : ''}/api/calendar.ics
			</code>
		</div>
	</div>
</div>
