import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { deleteImageByUrl } from '$lib/server/storage';

export const load: PageServerLoad = async ({ params }) => {
	const isNew = params.id === 'new';
	const tent = isNew
		? {
				id: '',
				name: '',
				localName: '',
				image: '/jackalberry.jpg',
				capacity: 2,
				pricePerNight: null as number | null,
				blurb: '',
				airbnbUrl: '',
				sortOrder: 0,
				active: true,
				images: [] as { id: string; url: string; alt: string; sortOrder: number }[]
			}
		: await prisma.tent.findUnique({
				where: { id: params.id },
				include: { images: { orderBy: { sortOrder: 'asc' } } }
			});

	if (!tent) error(404, 'Tent not found');
	return { tent, isNew };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const isNew = params.id === 'new';
		const form = await request.formData();

		const id = String(form.get('id') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();
		const localName = String(form.get('localName') ?? '').trim();
		const image = String(form.get('image') ?? '').trim();
		const airbnbUrl = String(form.get('airbnbUrl') ?? '').trim();
		const capacity = Number(form.get('capacity'));
		const priceRaw = String(form.get('pricePerNight') ?? '').trim();
		const pricePerNight = priceRaw === '' ? null : Number(priceRaw);
		const blurb = String(form.get('blurb') ?? '').trim();
		const sortOrder = Number(form.get('sortOrder') ?? 0);
		const active = form.get('active') === 'on';

		if (!id || !name || !image) {
			return fail(400, { message: 'ID, name and image are required.' });
		}
		if (!Number.isInteger(capacity) || capacity < 1 || capacity > 20) {
			return fail(400, { message: 'Capacity must be between 1 and 20.' });
		}
		if (pricePerNight !== null && (!Number.isInteger(pricePerNight) || pricePerNight < 0)) {
			return fail(400, { message: 'Price must be a whole number of Pula (or empty).' });
		}
		if (airbnbUrl && !/^https?:\/\//.test(airbnbUrl)) {
			return fail(400, { message: 'Airbnb URL must start with http(s):// (or be left empty).' });
		}

		const data = {
			name,
			localName,
			image,
			capacity,
			pricePerNight,
			blurb: blurb || null,
			airbnbUrl,
			sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
			active
		};

		if (isNew) {
			const existing = await prisma.tent.findUnique({ where: { id } });
			if (existing) return fail(400, { message: `A tent with ID "${id}" already exists.` });
			await prisma.tent.create({ data: { id, ...data } });
		} else {
			await prisma.tent.update({ where: { id: params.id }, data });
		}

		redirect(303, '/admin/tents');
	},

	delete: async ({ params }) => {
		if (params.id === 'new') redirect(303, '/admin/tents');
		await prisma.tent.delete({ where: { id: params.id } });
		redirect(303, '/admin/tents');
	},

	addImage: async ({ params, request }) => {
		if (params.id === 'new') return fail(400, { message: 'Save the tent first, then add images.' });
		const form = await request.formData();
		const url = String(form.get('url') ?? '').trim();
		const alt = String(form.get('alt') ?? '').trim();

		if (!/^https?:\/\//.test(url) && !url.startsWith('/')) {
			return fail(400, { message: 'Image URL must start with http(s):// or /.' });
		}

		const count = await prisma.tentImage.count({ where: { tentId: params.id } });
		await prisma.tentImage.create({ data: { tentId: params.id, url, alt, sortOrder: count } });
		return { message: 'Image added.' };
	},

	removeImage: async ({ params, request }) => {
		const form = await request.formData();
		const imageId = String(form.get('imageId') ?? '');
		const image = await prisma.tentImage.findUnique({ where: { id: imageId } });
		if (!image || image.tentId !== params.id) return fail(404, { message: 'Image not found.' });

		await prisma.tentImage.delete({ where: { id: imageId } });
		// Best-effort: remove the file from Supabase Storage if we uploaded it.
		await deleteImageByUrl(image.url).catch(() => {});
		return { message: 'Image removed.' };
	},

	moveImage: async ({ params, request }) => {
		const form = await request.formData();
		const imageId = String(form.get('imageId') ?? '');
		const dir = Number(form.get('dir'));

		const images = await prisma.tentImage.findMany({
			where: { tentId: params.id },
			orderBy: { sortOrder: 'asc' }
		});
		const idx = images.findIndex((i) => i.id === imageId);
		const swapWith = dir < 0 ? idx - 1 : idx + 1;
		if (idx === -1 || swapWith < 0 || swapWith >= images.length) return { message: 'No change.' };

		const a = images[idx];
		const b = images[swapWith];
		await prisma.$transaction([
			prisma.tentImage.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
			prisma.tentImage.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } })
		]);
		return { message: 'Image order updated.' };
	}
};
