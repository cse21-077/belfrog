<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { btnPrimary, cardCls } from '$lib/admin/ui';

	let { data, form } = $props();
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold text-stone-900">Reviews</h1>
	<a href={resolve('/admin/reviews/new')} class={btnPrimary}>+ New review</a>
</div>

{#if form?.message}
	<p class="mb-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand ring-1 ring-brand/20">{form.message}</p>
{/if}

{#if data.reviews.length === 0}
	<div class="{cardCls}">
		<p class="text-sm text-stone-500">No reviews yet. Add some manually, or paste a widget embed code in Settings.</p>
	</div>
{:else}
	<div class="space-y-4">
		{#each data.reviews as review (review.id)}
			<div class="{cardCls} flex flex-wrap items-start justify-between gap-4">
				<div class="min-w-60 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<p class="font-semibold text-stone-900">{review.author}</p>
						<span class="text-sm tracking-widest text-accent">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
						<span class="text-xs text-stone-400">{review.source} · {review.date.toISOString().slice(0, 10)}</span>
					</div>
					<p class="mt-2 text-sm leading-relaxed text-stone-600">{review.text}</p>
				</div>
				<div class="flex items-center gap-2">
					<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold {review.active ? 'bg-brand/10 text-brand' : 'bg-stone-200 text-stone-500'}">
						{review.active ? 'Live' : 'Hidden'}
					</span>
					<a href={resolve(`/admin/reviews/${review.id}`)} class="text-sm font-semibold text-brand underline hover:text-brand-700">Edit</a>
					<form method="POST" action="?/toggle" use:enhance>
						<input type="hidden" name="id" value={review.id} />
						<button type="submit" class="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200">
							{review.active ? 'Hide' : 'Publish'}
						</button>
					</form>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={review.id} />
						<button type="submit" class="rounded-full bg-accent-700/10 px-3 py-1.5 text-xs font-semibold text-accent-700 hover:bg-accent-700 hover:text-white">
							Delete
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
{/if}
