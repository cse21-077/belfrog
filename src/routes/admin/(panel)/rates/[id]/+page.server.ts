import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

const CATEGORIES = ['GLAMPING', 'EXCURSION', 'BOAT', 'TRANSFER', 'HELICOPTER'];
const UNITS = ['PER_NIGHT', 'PER_PERSON', 'PER_TRIP', 'COMPLIMENTARY', 'ON_REQUEST'];
const CURRENCIES = ['BWP', 'USD', 'EUR'];

export const load: PageServerLoad = async ({ params }) => {
	const isNew = params.id === 'new';
	const rate = isNew
		? {
				id: '',
				category: 'EXCURSION' as const,
				name: '',
				details: '',
				minPax: null as number | null,
				maxPax: null as number | null,
				unit: 'PER_PERSON' as const,
				sortOrder: 0,
				active: true,
				prices: [] as { amount: number | null; currency: string; label: string; sortOrder: number }[]
			}
		: await prisma.rate.findUnique({
				where: { id: params.id },
				include: { prices: { orderBy: { sortOrder: 'asc' } } }
			});

	if (!rate) error(404, 'Rate not found');
	return { rate, isNew, categories: CATEGORIES, units: UNITS, currencies: CURRENCIES };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const isNew = params.id === 'new';
		const form = await request.formData();

		const id = String(form.get('id') ?? '').trim();
		const category = String(form.get('category'));
		const name = String(form.get('name') ?? '').trim();
		const details = String(form.get('details') ?? '').trim();
		const minRaw = String(form.get('minPax') ?? '').trim();
		const maxRaw = String(form.get('maxPax') ?? '').trim();
		const unit = String(form.get('unit'));
		const sortOrder = Number(form.get('sortOrder') ?? 0);
		const active = form.get('active') === 'on';

		if (!id || !name) return fail(400, { message: 'ID and name are required.' });
		if (!CATEGORIES.includes(category)) return fail(400, { message: 'Invalid category.' });
		if (!UNITS.includes(unit)) return fail(400, { message: 'Invalid unit.' });

		const parsePax = (raw: string) => {
			if (raw === '') return null;
			const n = Number(raw);
			return Number.isInteger(n) && n > 0 ? n : Number.NaN;
		};
		const minPax = parsePax(minRaw);
		const maxPax = parsePax(maxRaw);
		if (Number.isNaN(minPax) || Number.isNaN(maxPax)) {
			return fail(400, { message: 'Min/max pax must be whole numbers (or empty).' });
		}

		// Parse dynamic price rows: price.<index>.<field>
		const prices: { amount: number | null; currency: string; label: string; sortOrder: number }[] = [];
		const rows = new Map<number, Record<string, string>>();
		for (const [key, value] of form.entries()) {
			const match = /^price\.(\d+)\.(\w+)$/.exec(key);
			if (match) {
				const idx = Number(match[1]);
				if (!rows.has(idx)) rows.set(idx, {});
				rows.get(idx)![match[2]] = String(value);
			}
		}
		for (const idx of [...rows.keys()].sort((a, b) => a - b)) {
			const row = rows.get(idx)!;
			const amountRaw = (row.amount ?? '').trim();
			const amount = amountRaw === '' ? null : Number(amountRaw);
			if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
				return fail(400, { message: `Price row ${idx + 1}: amount must be a positive number (or empty).` });
			}
			const currency = CURRENCIES.includes(row.currency) ? row.currency : 'BWP';
			prices.push({
				amount,
				currency,
				label: (row.label ?? '').trim(),
				sortOrder: Number(row.sortOrder ?? idx) || idx
			});
		}

		const data = {
			category: category as never,
			name,
			details,
			minPax,
			maxPax,
			unit: unit as never,
			sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
			active
		};

		if (isNew) {
			const existing = await prisma.rate.findUnique({ where: { id } });
			if (existing) return fail(400, { message: `A rate with ID "${id}" already exists.` });
			await prisma.rate.create({
				data: {
					id,
					...data,
					prices: { create: prices.map((p) => ({ ...p, currency: p.currency as never })) }
				}
			});
		} else {
			await prisma.rate.update({
				where: { id: params.id },
				data: {
					...data,
					prices: {
						deleteMany: {},
						create: prices.map((p) => ({ ...p, currency: p.currency as never }))
					}
				}
			});
		}

		redirect(303, '/admin/rates');
	},

	delete: async ({ params }) => {
		if (params.id === 'new') redirect(303, '/admin/rates');
		await prisma.rate.delete({ where: { id: params.id } });
		redirect(303, '/admin/rates');
	}
};
