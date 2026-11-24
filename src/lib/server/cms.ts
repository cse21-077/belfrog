import { prisma } from './db';
import { rates as staticRates, reviews as staticReviews, tents as staticTents } from '$lib/cms/data';
import type { Currency, Rate, Review, Tent } from '$lib/cms/types';

/** DB-backed CMS getters with static fallback so the site renders even if the DB is unreachable. */

export async function getTents(): Promise<Tent[]> {
	try {
		const rows = await prisma.tent.findMany({
			where: { active: true },
			orderBy: { sortOrder: 'asc' },
			include: { images: { orderBy: { sortOrder: 'asc' } } }
		});
		return rows.map((t) => ({
			id: t.id,
			name: t.name,
			localName: t.localName,
			image: t.image,
			capacity: t.capacity,
			pricePerNight: t.pricePerNight,
			blurb: t.blurb,
			sortOrder: t.sortOrder,
			active: t.active,
			images: t.images.length > 0 ? t.images.map((img) => img.url) : [t.image]
		}));
	} catch {
		return staticTents.filter((t) => t.active);
	}
}

export async function getRates(): Promise<Rate[]> {
	try {
		const rows = await prisma.rate.findMany({
			where: { active: true },
			include: { prices: { orderBy: { sortOrder: 'asc' } } },
			orderBy: [{ sortOrder: 'asc' }]
		});
		return rows.map((r) => ({
			id: r.id,
			// The DB enum still contains the retired SPECIAL value; it is never rendered.
			category: r.category as Rate['category'],
			name: r.name,
			details: r.details,
			minPax: r.minPax,
			maxPax: r.maxPax,
			unit: r.unit,
			sortOrder: r.sortOrder,
			active: r.active,
			prices: r.prices.map((p) => ({
				amount: p.amount,
				currency: p.currency as Currency,
				label: p.label,
				sortOrder: p.sortOrder
			}))
		}));
	} catch {
		return staticRates.filter((r) => r.active);
	}
}

export async function getReviews(): Promise<Review[]> {
	try {
		const rows = await prisma.review.findMany({
			where: { active: true },
			orderBy: { sortOrder: 'asc' }
		});
		return rows.map((r) => ({
			id: r.id,
			author: r.author,
			location: r.location,
			rating: r.rating,
			text: r.text,
			date: r.date.toISOString().slice(0, 10),
			source: (['AIRBNB', 'BOOKINGCOM', 'GOOGLE', 'MANUAL'].includes(r.source)
				? r.source
				: 'MANUAL') as Review['source'],
			sortOrder: r.sortOrder,
			active: r.active
		}));
	} catch {
		return staticReviews.filter((r) => r.active);
	}
}
