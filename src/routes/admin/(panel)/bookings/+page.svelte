<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { cardCls } from '$lib/admin/ui';

	let { data, form } = $props();

	const filters = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'];
</script>

<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
	<h1 class="text-3xl font-bold text-stone-900">Bookings</h1>
	<div class="flex gap-2">
		{#each filters as f (f)}
			<a
				href={resolve(f === 'ALL' ? '/admin/bookings' : `/admin/bookings?status=${f}`)}
				class="rounded-full px-4 py-2 text-sm font-semibold transition {data.filter === f
					? 'bg-brand text-white'
					: 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'}"
			>
				{f}
			</a>
		{/each}
	</div>
</div>

{#if form?.message}
	<p class="mb-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand ring-1 ring-brand/20">
		{form.message}
	</p>
{/if}

<div class="{cardCls} overflow-hidden p-0">
	{#if data.bookings.length === 0}
		<p class="p-8 text-sm text-stone-500">No bookings found.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-stone-50">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Code</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Guest</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Dates</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Guests</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Source</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
						<th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-stone-100">
					{#each data.bookings as booking (booking.id)}
						<tr>
							<td class="px-4 py-3 font-mono text-sm text-stone-700">{booking.code}</td>
							<td class="px-4 py-3">
								<p class="text-sm font-medium text-stone-900">{booking.guestName}</p>
								<p class="text-xs text-stone-500">{booking.email}</p>
							</td>
							<td class="px-4 py-3 text-sm text-stone-700">
								{booking.checkIn.toISOString().slice(0, 10)} → {booking.checkOut.toISOString().slice(0, 10)}
							</td>
							<td class="px-4 py-3 text-sm text-stone-700">{booking.guests}</td>
							<td class="px-4 py-3 text-sm text-stone-700">{booking.source}</td>
							<td class="px-4 py-3">
								<span
									class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold {booking.status === 'CONFIRMED'
										? 'bg-brand/10 text-brand'
										: booking.status === 'CANCELLED'
											? 'bg-stone-200 text-stone-500'
											: 'bg-accent-700/10 text-accent-700'}"
								>
									{booking.status}
								</span>
							</td>
							<td class="px-4 py-3">
								<div class="flex justify-end gap-2">
									{#if booking.status !== 'CONFIRMED'}
										<form method="POST" action="?/setStatus" use:enhance>
											<input type="hidden" name="id" value={booking.id} />
											<input type="hidden" name="status" value="CONFIRMED" />
											<button type="submit" class="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white">
												Confirm
											</button>
										</form>
									{/if}
									{#if booking.status !== 'CANCELLED'}
										<form method="POST" action="?/setStatus" use:enhance>
											<input type="hidden" name="id" value={booking.id} />
											<input type="hidden" name="status" value="CANCELLED" />
											<button type="submit" class="rounded-full bg-accent-700/10 px-3 py-1.5 text-xs font-semibold text-accent-700 hover:bg-accent-700 hover:text-white">
												Cancel
											</button>
										</form>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
