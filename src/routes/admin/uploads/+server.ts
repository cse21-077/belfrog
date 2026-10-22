import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { storageConfigured, uploadImage } from '$lib/server/storage';

/** Admin-only image upload → Supabase Storage. Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. */
export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const file = form.get('file');
	const folder = String(form.get('folder') ?? 'misc').replace(/[^a-z0-9-_]/gi, '').slice(0, 40) || 'misc';

	if (!storageConfigured()) {
		return json(
			{ message: 'Storage is not configured yet — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.' },
			{ status: 503 }
		);
	}

	if (!(file instanceof File) || file.size === 0) {
		return json({ message: 'No file received.' }, { status: 400 });
	}

	try {
		const { url } = await uploadImage(file, folder);
		return json({ url }, { status: 201 });
	} catch (err) {
		return json({ message: err instanceof Error ? err.message : 'Upload failed' }, { status: 400 });
	}
};
