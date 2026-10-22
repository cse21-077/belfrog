const BUCKET = 'site-assets';
const ALLOWED_MIME: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/avif': 'avif',
	'image/gif': 'gif'
};

const supabaseUrl = () => (process.env.SUPABASE_URL ?? '').replace(/\/$/, '');
const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export function storageConfigured(): boolean {
	return Boolean(supabaseUrl() && serviceKey());
}

async function storageFetch(path: string, init: RequestInit = {}) {
	const headers = new Headers(init.headers);
	headers.set('apikey', serviceKey());
	headers.set('authorization', `Bearer ${serviceKey()}`);
	return fetch(`${supabaseUrl()}/storage/v1${path}`, { ...init, headers });
}

export async function ensureBucket(): Promise<void> {
	// Supabase reports a missing bucket as HTTP 400 + NoSuchBucket and a duplicate
	// bucket as HTTP 400 wrapping statusCode 409 — so create blindly and accept
	// either success signal from the response body.
	const res = await storageFetch('/bucket', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true })
	});
	if (res.ok) return;
	const body = await res.text().catch(() => '');
	if (/BucketAlreadyExists|"statusCode"\s*:\s*409/.test(body)) return;
	throw new Error(`Could not create storage bucket: HTTP ${res.status} ${body.slice(0, 200)}`);
}

export async function uploadImage(file: File, folder: string): Promise<{ url: string }> {
	const ext = ALLOWED_MIME[file.type];
	if (!ext) throw new Error('Only image files (JPEG, PNG, WebP, AVIF, GIF) are allowed.');
	if (file.size > 8 * 1024 * 1024) throw new Error('Image is too large (max 8MB).');

	await ensureBucket();

	const path = `${folder}/${crypto.randomUUID()}.${ext}`;
	const res = await storageFetch(`/object/${BUCKET}/${path}`, {
		method: 'POST',
		headers: { 'content-type': file.type, 'x-upsert': 'false' },
		body: file
	});

	if (!res.ok) {
		throw new Error(`Upload failed: HTTP ${res.status}`);
	}

	return { url: `${supabaseUrl()}/storage/v1/object/public/${BUCKET}/${path}` };
}

export async function deleteImageByUrl(url: string): Promise<void> {
	const marker = `/object/public/${BUCKET}/`;
	const idx = url.indexOf(marker);
	if (idx === -1) return; // not one of ours — leave it alone
	const path = url.slice(idx + marker.length);
	await storageFetch(`/object/${BUCKET}/${path}`, { method: 'DELETE' });
}
