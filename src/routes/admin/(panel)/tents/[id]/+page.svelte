<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { btnDanger, btnPrimary, btnSecondary, inputCls, labelCls } from '$lib/admin/ui';

	let { data, form } = $props();
	const tent = $derived(data.tent);

	let uploading = $state(false);
	let uploadError = $state<string | null>(null);
	let pendingUrl = $state<string | null>(null);
	let pendingAlt = $state('');

	async function uploadFile(file: File) {
		uploadError = null;
		uploading = true;
		try {
			const body = new FormData();
			body.set('file', file);
			body.set('folder', 'tents');
			const res = await fetch('/admin/uploads', { method: 'POST', body });
			const result = await res.json().catch(() => ({}));
			if (!res.ok) {
				uploadError = result.message ?? 'Upload failed.';
				return;
			}
			pendingUrl = result.url;
			pendingAlt = file.name.replace(/\.[^.]+$/, '');
		} catch {
			uploadError = 'Network error during upload.';
		} finally {
			uploading = false;
		}
	}

	function onFileChosen(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadFile(file);
		input.value = '';
	}

	$effect(() => {
		if (pendingUrl) {
			(document.getElementById('add-image-form') as HTMLFormElement | null)?.requestSubmit();
		}
	});
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold text-stone-900">{data.isNew ? 'New Tent' : `Edit · ${tent.name}`}</h1>
	<a href={resolve('/admin/tents')} class={btnSecondary}>← Back</a>
</div>

{#if form?.message}
	<p class="mb-4 rounded-xl bg-accent-700/10 px-4 py-3 text-sm font-semibold text-accent-700 ring-1 ring-accent-700/20">
		{form.message}
	</p>
{/if}

<form method="POST" action="?/save" use:enhance class="max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label class={labelCls} for="id">ID (slug)</label>
			<input id="id" name="id" class={inputCls} value={tent.id} required disabled={!data.isNew} placeholder="e.g. acacia" />
		</div>
		<div>
			<label class={labelCls} for="name">Name</label>
			<input id="name" name="name" class={inputCls} value={tent.name} required placeholder="e.g. Acacia" />
		</div>
		<div>
			<label class={labelCls} for="localName">Setswana name</label>
			<input id="localName" name="localName" class={inputCls} value={tent.localName} placeholder="e.g. Mooka" />
		</div>
		<div>
			<label class={labelCls} for="image">Image path</label>
			<input id="image" name="image" class={inputCls} value={tent.image} required placeholder="/acacia.jpg" />
		</div>
		<div>
			<label class={labelCls} for="airbnbUrl">Airbnb listing URL (optional)</label>
			<input id="airbnbUrl" name="airbnbUrl" class={inputCls} value={tent.airbnbUrl} placeholder="https://www.airbnb.com/rooms/…" />
		</div>
		<div>
			<label class={labelCls} for="capacity">Capacity (sleeps)</label>
			<input id="capacity" name="capacity" type="number" min="1" max="20" class={inputCls} value={tent.capacity} required />
		</div>
		<div>
			<label class={labelCls} for="pricePerNight">Price per night (Pula)</label>
			<input id="pricePerNight" name="pricePerNight" type="number" min="0" step="1" class={inputCls} value={tent.pricePerNight ?? ''} placeholder="950" />
		</div>
		<div>
			<label class={labelCls} for="sortOrder">Sort order</label>
			<input id="sortOrder" name="sortOrder" type="number" class={inputCls} value={tent.sortOrder} />
		</div>
		<div class="flex items-end pb-2">
			<label class="flex items-center gap-2 text-sm font-medium text-stone-700">
				<input type="checkbox" name="active" class="h-4 w-4 rounded text-brand focus:ring-brand" checked={tent.active} />
				Visible on website
			</label>
		</div>
		<div class="sm:col-span-2">
			<label class={labelCls} for="blurb">Short description (optional)</label>
			<textarea id="blurb" name="blurb" rows="3" class={inputCls} placeholder="Private deck with Delta views…">{tent.blurb ?? ''}</textarea>
		</div>
	</div>

	<div class="mt-8 flex items-center justify-between">
		{#if !data.isNew}
			<button type="submit" formaction="?/delete" class={btnDanger} data-confirm="delete">Delete tent</button>
		{:else}
			<span></span>
		{/if}
		<button type="submit" class={btnPrimary}>Save tent</button>
	</div>
</form>

{#if !data.isNew}
	<div class="mt-8 max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
		<h2 class="mb-1 text-xl font-semibold text-stone-900">Photo gallery</h2>
		<p class="mb-6 text-sm text-stone-500">
			These photos power the tent card slideshow on the website. The first photo is also the card's
			fallback image.
		</p>

		{#if tent.images.length === 0}
			<p class="mb-6 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
				No gallery photos yet — the card uses the main image path above.
			</p>
		{:else}
			<ul class="mb-6 space-y-3">
				{#each tent.images as image, i (image.id)}
					<li class="flex items-center gap-4 rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-100">
						<img src={image.url} alt={image.alt || tent.name} class="h-16 w-24 rounded-xl object-cover" />
						<div class="min-w-0 flex-1">
							<p class="truncate text-xs text-stone-500">{image.url}</p>
							{#if image.alt}<p class="text-sm font-medium text-stone-900">{image.alt}</p>{/if}
						</div>
						<div class="flex items-center gap-1">
							{#if i > 0}
								<form method="POST" action="?/moveImage" use:enhance>
									<input type="hidden" name="imageId" value={image.id} />
									<input type="hidden" name="dir" value="-1" />
									<button type="submit" class="rounded-full p-2 text-stone-500 hover:bg-stone-200" aria-label="Move up">↑</button>
								</form>
							{/if}
							{#if i < tent.images.length - 1}
								<form method="POST" action="?/moveImage" use:enhance>
									<input type="hidden" name="imageId" value={image.id} />
									<input type="hidden" name="dir" value="1" />
									<button type="submit" class="rounded-full p-2 text-stone-500 hover:bg-stone-200" aria-label="Move down">↓</button>
								</form>
							{/if}
							<form method="POST" action="?/removeImage" use:enhance>
								<input type="hidden" name="imageId" value={image.id} />
								<button type="submit" class="rounded-full p-2 text-accent-700 hover:bg-accent-700/10" aria-label="Remove image">
									<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</form>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="mb-6">
			<label class={btnSecondary} class:opacity-50={uploading}>
				{uploading ? 'Uploading…' : 'Upload image (Supabase Storage)'}
				<input type="file" accept="image/*" class="hidden" disabled={uploading} onchange={onFileChosen} />
			</label>
			{#if uploadError}
				<p class="mt-2 text-sm font-semibold text-accent-700">{uploadError}</p>
			{/if}
		</div>

		<form id="add-image-form" method="POST" action="?/addImage" use:enhance class="grid gap-3 sm:grid-cols-[1fr_220px_auto]">
			<div>
				<span class={labelCls}>Image URL (auto-filled after upload, or paste your own)</span>
				{#if pendingUrl}
					<input type="hidden" name="url" value={pendingUrl} />
					<input class={inputCls} value={pendingUrl} disabled />
				{:else}
					<input name="url" class={inputCls} placeholder="/knobthorn-detail.jpg or https://…" />
				{/if}
			</div>
			<div>
				<span class={labelCls}>Alt text (optional)</span>
				<input name="alt" class={inputCls} bind:value={pendingAlt} placeholder="Knobthorn tent deck" />
			</div>
			<div class="flex items-end">
				<button type="submit" class={btnPrimary} disabled={uploading}>{pendingUrl ? 'Add uploaded image' : 'Add image'}</button>
			</div>
		</form>
	</div>
{/if}
