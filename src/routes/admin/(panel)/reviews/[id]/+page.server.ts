import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

const SOURCES = ['AIRBNB', 'BOOKINGCOM', 'GOOGLE', 'MANUAL'];

export const load: PageServerLoad = async ({ params }) => {
	const isNew = params.id === 'new';
	const review = isNew
		? {
				id: '',
				author: '',
				location: '',
				rating: 5,
				text: '',
				date: new Date().toISOString().slice(0, 10),
				source: 'AIRBNB',
				sortOrder: 0,
				active: true
			}
		: await prisma.review.findUnique({ where: { id: params.id } });

	if (!review) error(404, 'Review not found');
	return { review, isNew, sources: SOURCES };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const isNew = params.id === 'new';
		const form = await request.formData();

		const author = String(form.get('author') ?? '').trim();
		const location = String(form.get('location') ?? '').trim();
		const rating = Number(form.get('rating'));
		const text = String(form.get('text') ?? '').trim();
		const date = String(form.get('date') ?? '');
		const source = String(form.get('source'));
		const sortOrder = Number(form.get('sortOrder') ?? 0);
		const active = form.get('active') === 'on';

		if (!author || !text) return fail(400, { message: 'Author and review text are required.' });
		if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail(400, { message: 'Rating must be 1–5.' });
		if (Number.isNaN(Date.parse(date))) return fail(400, { message: 'Invalid date.' });

		const data = {
			author,
			location,
			rating,
			text,
			source: SOURCES.includes(source) ? source : 'MANUAL',
			sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
			active
		};

		if (isNew) {
			await prisma.review.create({ data: { ...data, date: new Date(`${date}T00:00:00Z`) } });
		} else {
			await prisma.review.update({
				where: { id: params.id },
				data: { ...data, date: new Date(`${date}T00:00:00Z`) }
			});
		}

		redirect(303, '/admin/reviews');
	},

	delete: async ({ params }) => {
		if (params.id === 'new') redirect(303, '/admin/reviews');
		await prisma.review.delete({ where: { id: params.id } });
		redirect(303, '/admin/reviews');
	}
};
