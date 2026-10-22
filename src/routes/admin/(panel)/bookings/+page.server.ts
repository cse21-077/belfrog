import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status');
	const where =
		status && ['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status) ? { status: status as never } : {};

	const bookings = await prisma.booking.findMany({
		where,
		include: { tent: { select: { name: true } } },
		orderBy: { createdAt: 'desc' },
		take: 200
	});

	return { bookings, filter: status ?? 'ALL' };
};

export const actions: Actions = {
	setStatus: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const status = String(form.get('status') ?? '');

		if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
			return fail(400, { message: 'Invalid status' });
		}

		const existing = await prisma.booking.findUnique({ where: { id } });
		if (!existing) return fail(404, { message: 'Booking not found' });

		await prisma.booking.update({ where: { id }, data: { status: status as never } });
		return { message: `Booking ${existing.code} is now ${status.toLowerCase()}.` };
	}
};
