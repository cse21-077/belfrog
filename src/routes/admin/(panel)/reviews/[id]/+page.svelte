<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { btnDanger, btnPrimary, btnSecondary, inputCls, labelCls } from '$lib/admin/ui';

	let { data, form } = $props();
	const review = $derived(data.review);
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold text-stone-900">{data.isNew ? 'New Review' : `Edit · ${review.author}`}</h1>
	<a href={resolve('/admin/reviews')} class={btnSecondary}>← Back</a>
</div>

{#if form?.message}
	<p class="mb-4 rounded-xl bg-accent-700/10 px-4 py-3 text-sm font-semibold text-accent-700 ring-1 ring-accent-700/20">
		{form.message}
	</p>
{/if}

<form method="POST" action="?/save" use:enhance class="max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label class={labelCls} for="author">Author</label>
			<input id="author" name="author" class={inputCls} value={review.author} required placeholder="Sarah M." />
		</div>
		<div>
			<label class={labelCls} for="location">Location</label>
			<input id="location" name="location" class={inputCls} value={review.location} placeholder="London, UK" />
		</div>
		<div>
			<label class={labelCls} for="rating">Rating (1–5)</label>
			<input id="rating" name="rating" type="number" min="1" max="5" class={inputCls} value={review.rating} required />
		</div>
		<div>
			<label class={labelCls} for="date">Review date</label>
			<input id="date" name="date" type="date" class={inputCls} value={String(review.date).slice(0, 10)} required />
		</div>
		<div>
			<label class={labelCls} for="source">Source</label>
			<select id="source" name="source" class={inputCls}>
				{#each data.sources as s (s)}
					<option value={s} selected={review.source === s}>{s}</option>
				{/each}
			</select>
		</div>
		<div>
			<label class={labelCls} for="sortOrder">Sort order</label>
			<input id="sortOrder" name="sortOrder" type="number" class={inputCls} value={review.sortOrder} />
		</div>
		<div class="sm:col-span-2">
			<label class={labelCls} for="text">Review text</label>
			<textarea id="text" name="text" rows="5" class={inputCls} required placeholder="The mokoro trip was the highlight of our holiday…">{review.text}</textarea>
		</div>
		<div>
			<label class="flex items-center gap-2 text-sm font-medium text-stone-700">
				<input type="checkbox" name="active" class="h-4 w-4 rounded text-brand focus:ring-brand" checked={review.active} />
				Visible on website
			</label>
		</div>
	</div>

	<div class="mt-8 flex items-center justify-between">
		{#if !data.isNew}
			<button type="submit" formaction="?/delete" class={btnDanger}>Delete review</button>
		{:else}
			<span></span>
		{/if}
		<button type="submit" class={btnPrimary}>Save review</button>
	</div>
</form>
