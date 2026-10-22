import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const reviews = await prisma.review.findMany({ orderBy: { sortOrder: 'asc' } });
	return { reviews };
};

export const actions: Actions = {
	toggle: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) return fail(404, { message: 'Review not found' });
		await prisma.review.update({ where: { id }, data: { active: !review.active } });
		return { message: `Review ${review.active ? 'hidden' : 'published'}.` };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		await prisma.review.delete({ where: { id } }).catch(() => null);
		return { message: 'Review deleted.' };
	}
};
