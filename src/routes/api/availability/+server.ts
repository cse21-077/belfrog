import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAvailability } from '$lib/server/availability';
import { syncIfStale } from '$lib/server/ical';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const GET: RequestHandler = async ({ url }) => {
	const checkIn = url.searchParams.get('checkIn') ?? '';
	const checkOut = url.searchParams.get('checkOut') ?? '';

	if (!DATE_RE.test(checkIn) || !DATE_RE.test(checkOut)) {
		return json({ available: false, message: 'Invalid date range' }, { status: 400 });
	}

	const inDate = new Date(`${checkIn}T00:00:00Z`);
	const outDate = new Date(`${checkOut}T00:00:00Z`);

	if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime()) || outDate <= inDate) {
		return json({ available: false, message: 'Check-out must be after check-in' }, { status: 400 });
	}

	if (outDate.getTime() - inDate.getTime() > 370 * 86400000) {
		return json({ available: false, message: 'Stay is too long' }, { status: 400 });
	}

	await syncIfStale();
	const result = await checkAvailability(inDate, outDate);

	return json({ available: result.available, conflicts: result.conflicts });
};
