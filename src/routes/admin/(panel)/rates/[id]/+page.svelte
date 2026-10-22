<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { btnDanger, btnPrimary, btnSecondary, inputCls, labelCls } from '$lib/admin/ui';

	let { data, form } = $props();
	const rate = $derived(data.rate);

	let priceRows = $state(
		rate.prices.map((p) => ({
			amount: p.amount ?? null,
			currency: p.currency,
			label: p.label,
			sortOrder: p.sortOrder
		}))
	);

	function addRow() {
		priceRows = [
			...priceRows,
			{ amount: null, currency: rate.category === 'HELICOPTER' ? 'USD' : 'BWP', label: '', sortOrder: priceRows.length }
		];
	}

	function removeRow(i: number) {
		priceRows = priceRows.filter((_, idx) => idx !== i);
	}
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold text-stone-900">{data.isNew ? 'New Rate' : `Edit · ${rate.name}`}</h1>
	<a href={resolve('/admin/rates')} class={btnSecondary}>← Back</a>
</div>

{#if form?.message}
	<p class="mb-4 rounded-xl bg-accent-700/10 px-4 py-3 text-sm font-semibold text-accent-700 ring-1 ring-accent-700/20">
		{form.message}
	</p>
{/if}

<form method="POST" action="?/save" use:enhance class="max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label class={labelCls} for="id">ID (slug)</label>
			<input id="id" name="id" class={inputCls} value={rate.id} required disabled={!data.isNew} placeholder="e.g. mokoro-full-day" />
		</div>
		<div>
			<label class={labelCls} for="name">Name</label>
			<input id="name" name="name" class={inputCls} value={rate.name} required placeholder="e.g. Full-Day Mokoro Trip" />
		</div>
		<div>
			<label class={labelCls} for="category">Category</label>
			<select id="category" name="category" class={inputCls}>
				{#each data.categories as c (c)}
					<option value={c} selected={rate.category === c}>{c}</option>
				{/each}
			</select>
		</div>
		<div>
			<label class={labelCls} for="unit">Pricing unit</label>
			<select id="unit" name="unit" class={inputCls}>
				{#each data.units as u (u)}
					<option value={u} selected={rate.unit === u}>{u.replaceAll('_', ' ')}</option>
				{/each}
			</select>
		</div>
		<div>
			<label class={labelCls} for="minPax">Min pax (optional)</label>
			<input id="minPax" name="minPax" type="number" min="1" class={inputCls} value={rate.minPax ?? ''} />
		</div>
		<div>
			<label class={labelCls} for="maxPax">Max pax (optional)</label>
			<input id="maxPax" name="maxPax" type="number" min="1" class={inputCls} value={rate.maxPax ?? ''} />
		</div>
		<div>
			<label class={labelCls} for="sortOrder">Sort order</label>
			<input id="sortOrder" name="sortOrder" type="number" class={inputCls} value={rate.sortOrder} />
		</div>
		<div class="flex items-end pb-2">
			<label class="flex items-center gap-2 text-sm font-medium text-stone-700">
				<input type="checkbox" name="active" class="h-4 w-4 rounded text-brand focus:ring-brand" checked={rate.active} />
				Visible on website
			</label>
		</div>
		<div class="sm:col-span-2">
			<label class={labelCls} for="details">Details & inclusions</label>
			<textarea id="details" name="details" rows="3" class={inputCls} placeholder="Includes park fees, packed lunch…">{rate.details}</textarea>
		</div>
	</div>

	<div class="mt-8">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-stone-900">Price rows</h2>
			<button type="button" onclick={addRow} class={btnSecondary}>+ Add row</button>
		</div>
		{#if rate.unit === 'COMPLIMENTARY' || rate.unit === 'ON_REQUEST'}
			<p class="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
				This unit renders as “{rate.unit === 'COMPLIMENTARY' ? 'Complimentary' : 'On request'}” — price rows are ignored.
			</p>
		{:else}
			<div class="space-y-3">
				{#each priceRows as row, i (i)}
					<div class="flex flex-wrap items-end gap-3 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
						<div class="w-32">
							<span class={labelCls}>Amount</span>
							<input name="price.{i}.amount" type="number" min="0" step="1" class={inputCls} value={row.amount ?? ''} placeholder="2950" />
						</div>
						<div class="w-28">
							<span class={labelCls}>Currency</span>
							<select name="price.{i}.currency" class={inputCls}>
								{#each data.currencies as c (c)}
									<option value={c} selected={row.currency === c}>{c}</option>
								{/each}
							</select>
						</div>
						<div class="min-w-40 flex-1">
							<span class={labelCls}>Label</span>
							<input name="price.{i}.label" class={inputCls} value={row.label} placeholder="Per person · 2+ PAX" />
						</div>
						<div class="w-24">
							<span class={labelCls}>Order</span>
							<input name="price.{i}.sortOrder" type="number" class={inputCls} value={row.sortOrder} />
						</div>
						<button type="button" onclick={() => removeRow(i)} class="rounded-full p-2 text-stone-400 transition hover:bg-accent-700/10 hover:text-accent-700" aria-label="Remove row">
							<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-8 flex items-center justify-between">
		{#if !data.isNew}
			<button type="submit" formaction="?/delete" class={btnDanger}>Delete rate</button>
		{:else}
			<span></span>
		{/if}
		<button type="submit" class={btnPrimary}>Save rate</button>
	</div>
</form>
