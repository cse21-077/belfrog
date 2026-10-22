<script lang="ts">
	import { resolve } from '$app/paths';
	import { cardCls } from '$lib/admin/ui';

	let { data } = $props();

	const stats = [
		{ label: 'Pending requests', value: data.pending, href: '/admin/bookings?status=PENDING' },
		{ label: 'Arriving this week', value: data.arrivingThisWeek, href: '/admin/bookings' },
		{ label: 'Confirmed bookings', value: data.totalConfirmed, href: '/admin/bookings?status=CONFIRMED' }
	] as const;
</script>

<h1 class="mb-8 text-3xl font-bold text-stone-900">Dashboard</h1>

<div class="grid gap-4 sm:grid-cols-3">
	{#each stats as stat (stat.label)}
		<a href={resolve(stat.href)} class="{cardCls} transition hover:shadow-md">
			<p class="text-sm font-medium text-stone-500">{stat.label}</p>
			<p class="mt-2 text-4xl font-bold text-brand">{stat.value}</p>
		</a>
	{/each}
</div>

<div class="mt-4 grid gap-4 sm:grid-cols-1">
	<div class="{cardCls}">
		<p class="text-sm text-stone-500">Last calendar sync (Airbnb / Booking.com iCal)</p>
		<p class="mt-1 font-semibold text-stone-900">
			{data.syncAt ? data.syncAt.toLocaleString('en-GB') : 'Never — add feed URLs in Settings, then sync.'}
		</p>
		<a href={resolve('/admin/settings')} class="mt-3 inline-block text-sm font-semibold text-brand underline hover:text-brand-700">
			Calendar settings →
		</a>
	</div>
</div>

<div class="mt-8 {cardCls}">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold text-stone-900">Upcoming stays</h2>
		<a href={resolve('/admin/bookings')} class="text-sm font-semibold text-brand underline hover:text-brand-700">All bookings →</a>
	</div>
	{#if data.arrivals.length === 0}
		<p class="text-sm text-stone-500">No upcoming stays yet.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-stone-100">
						<th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">Code</th>
						<th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">Guest</th>
						<th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">Check-in</th>
						<th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">Check-out</th>
						<th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-stone-100">
					{#each data.arrivals as booking (booking.id)}
						<tr>
							<td class="px-4 py-3 font-mono text-sm text-stone-700">{booking.code}</td>
							<td class="px-4 py-3 text-sm font-medium text-stone-900">{booking.guestName}</td>
							<td class="px-4 py-3 text-sm text-stone-700">{booking.checkIn.toISOString().slice(0, 10)}</td>
							<td class="px-4 py-3 text-sm text-stone-700">{booking.checkOut.toISOString().slice(0, 10)}</td>
							<td class="px-4 py-3">
								<span
									class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold {booking.status === 'CONFIRMED'
										? 'bg-brand/10 text-brand'
										: 'bg-accent-700/10 text-accent-700'}"
								>
									{booking.status}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
