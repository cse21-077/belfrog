import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { syncAll } from '$lib/server/ical';

/** Protected endpoint for scheduled re-syncs (cron-job.org, Vercel Cron, …). */
export const POST: RequestHandler = async ({ request }) => {
	const secret = request.headers.get('x-sync-secret');
	const expected = process.env.ICAL_SYNC_SECRET;

	if (!expected || secret !== expected) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const results = await syncAll();
	return json({ results });
};
