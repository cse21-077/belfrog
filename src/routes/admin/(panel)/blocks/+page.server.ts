import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { lastSyncAt, syncAll } from '$lib/server/ical';

export const load: PageServerLoad = async () => {
	const [manual, imported, syncAt] = await Promise.all([
		prisma.blockedDate.findMany({
			where: { source: 'MANUAL' },
			orderBy: { start: 'asc' }
		}),
		prisma.blockedDate.findMany({
			where: { source: { in: ['AIRBNB', 'BOOKINGCOM'] } },
			orderBy: { start: 'asc' }
		}),
		lastSyncAt()
	]);

	return { manual, imported, syncAt };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const form = await request.formData();
		const start = String(form.get('start') ?? '');
		const end = String(form.get('end') ?? '');
		const summary = String(form.get('summary') ?? '').trim() || 'Manual hold';

		const startDate = new Date(`${start}T00:00:00Z`);
		// Admin enters the LAST blocked night; store checkout day (exclusive) like iCal does.
		const endDate = new Date(`${end}T00:00:00Z`);
		endDate.setUTCDate(endDate.getUTCDate() + 1);

		if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
			return fail(400, { message: 'Enter a valid date range (end must be on or after start).' });
		}

		await prisma.blockedDate.create({
			data: { source: 'MANUAL', start: startDate, end: endDate, summary }
		});
		return { message: 'Blocked dates added.' };
	},

	remove: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		await prisma.blockedDate.deleteMany({ where: { id, source: 'MANUAL' } });
		return { message: 'Blocked dates removed.' };
	},

	sync: async () => {
		const results = await syncAll();
		const errors = results.filter((r) => r.error);
		if (results.length === 0) {
			return { message: 'No iCal feed URLs configured yet — add them in Settings.' };
		}
		if (errors.length > 0) {
			return fail(502, { message: `Sync issues: ${errors.map((e) => `${e.source}: ${e.error}`).join('; ')}` });
		}
		return {
			message: results
				.map((r) => `${r.source}: ${r.upserted} synced${r.removed ? `, ${r.removed} removed` : ''}`)
				.join(' · ')
		};
	}
};
