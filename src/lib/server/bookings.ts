import { randomBytes } from 'node:crypto';
import { prisma } from './db';
import { checkAvailability } from './availability';

export interface NewBooking {
	guestName: string;
	email: string;
	phone: string;
	checkIn: Date;
	checkOut: Date;
	guests: number;
	notes: string;
}

export type CreateBookingResult =
	| { ok: true; booking: { code: string } }
	| { ok: false; conflicts: string[] };

async function generateCode(): Promise<string> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const code = `BF-${randomBytes(3).toString('hex').toUpperCase()}`;
		const existing = await prisma.booking.findUnique({ where: { code } });
		if (!existing) return code;
	}
	return `BF-${Date.now().toString(36).toUpperCase()}`;
}

export async function createBooking(input: NewBooking): Promise<CreateBookingResult> {
	const availability = await checkAvailability(input.checkIn, input.checkOut);
	if (!availability.available) {
		return { ok: false, conflicts: availability.conflicts };
	}

	const code = await generateCode();
	await prisma.booking.create({
		data: {
			code,
			guestName: input.guestName,
			email: input.email,
			phone: input.phone,
			checkIn: input.checkIn,
			checkOut: input.checkOut,
			guests: input.guests,
			notes: input.notes,
			status: 'PENDING',
			source: 'WEB'
		}
	});

	return { ok: true, booking: { code } };
}
