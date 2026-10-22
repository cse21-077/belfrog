import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const tents = await prisma.tent.findMany({ orderBy: { sortOrder: 'asc' } });
	return { tents };
};
