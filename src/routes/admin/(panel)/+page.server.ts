import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { lastSyncAt } from '$lib/server/ical';

export const load: PageServerLoad = async () => {
	const now = new Date();
	const in7Days = new Date(now.getTime() + 7 * 86400000);

	const [pending, arrivals, totalConfirmed, syncAt] = await Promise.all([
		prisma.booking.count({ where: { status: 'PENDING' } }),
		prisma.booking.findMany({
			where: {
				status: { in: ['PENDING', 'CONFIRMED'] },
				checkIn: { gte: new Date(now.toISOString().slice(0, 10)) },
				checkOut: { gt: now }
			},
			orderBy: { checkIn: 'asc' },
			take: 8
		}),
		prisma.booking.count({ where: { status: 'CONFIRMED' } }),
		lastSyncAt()
	]);

	const arrivingThisWeek = arrivals.filter((a) => a.checkIn <= in7Days).length;

	return { pending, arrivingThisWeek, totalConfirmed, arrivals, syncAt };
};
