import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const rates = await prisma.rate.findMany({
		include: { prices: { orderBy: { sortOrder: 'asc' } } },
		orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }]
	});
	return { rates };
};
