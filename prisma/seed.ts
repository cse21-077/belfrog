import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/server/auth';
import { rates, reviews, settings, tents } from '../src/lib/cms/data';

const prisma = new PrismaClient();

async function main() {
	// Remove rows that are no longer part of the curated content (e.g. retired rates),
	// so reseeding brings the database in line with src/lib/cms/data.ts.
	await prisma.rate.deleteMany({ where: { id: { notIn: rates.map((r) => r.id) } } });
	await prisma.tent.deleteMany({ where: { id: { notIn: tents.map((t) => t.id) } } });

	for (const tent of tents) {
		const { id, images, ...data } = tent;
		await prisma.tent.upsert({ where: { id }, update: data, create: { id, ...data } });
		await prisma.tentImage.deleteMany({ where: { tentId: id } });
		await prisma.tentImage.createMany({
			data: images.map((url, i) => ({ tentId: id, url, sortOrder: i }))
		});
	}

	for (const rate of rates) {
		const { id, prices, ...data } = rate;
		await prisma.rate.upsert({ where: { id }, update: data, create: { id, ...data } });
		await prisma.ratePrice.deleteMany({ where: { rateId: id } });
		await prisma.ratePrice.createMany({
			data: prices.map((p) => ({
				rateId: id,
				amount: p.amount,
				currency: p.currency,
				label: p.label,
				sortOrder: p.sortOrder
			}))
		});
	}

	for (const review of reviews) {
		const { id, date, ...data } = review;
		await prisma.review.upsert({
			where: { id },
			update: data,
			create: { id, ...data, date: new Date(`${date}T00:00:00Z`) }
		});
	}

	for (const [key, value] of Object.entries(settings)) {
		await prisma.setting.upsert({
			where: { key },
			update: {},
			create: { key, value: String(value) }
		});
	}

	const email = process.env.ADMIN_EMAIL ?? 'bookings@thebellfrog.com';
	const password = process.env.ADMIN_PASSWORD ?? 'belfrog-admin';
	const existing = await prisma.adminUser.findUnique({ where: { email } });
	if (!existing) {
		await prisma.adminUser.create({
			data: { email, name: 'Admin', passwordHash: hashPassword(password) }
		});
		console.log(`Admin user created: ${email}`);
	} else {
		console.log(`Admin user already exists: ${email}`);
	}

	console.log('Seed complete.');
}

main()
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
