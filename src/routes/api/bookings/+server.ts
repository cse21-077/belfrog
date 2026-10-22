import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { createBooking } from '$lib/server/bookings';
import { getSettings } from '$lib/server/settings';
import { autoReplyGuest, notifyBooking } from '$lib/server/mail';

const schema = z.object({
	checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	guests: z.number().int().min(1).max(8),
	name: z.string().trim().min(2).max(100),
	email: z.string().trim().email().max(200),
	phone: z.string().trim().max(30).optional().default(''),
	notes: z.string().trim().max(2000).optional().default('')
});

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Invalid JSON body' }, { status: 400 });
	}

	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return json(
			{ message: parsed.error.issues[0]?.message ?? 'Invalid booking details' },
			{ status: 400 }
		);
	}

	const input = parsed.data;
	const checkIn = new Date(`${input.checkIn}T00:00:00Z`);
	const checkOut = new Date(`${input.checkOut}T00:00:00Z`);

	if (checkOut <= checkIn) {
		return json({ message: 'Check-out must be after check-in' }, { status: 400 });
	}

	const result = await createBooking({
		guestName: input.name,
		email: input.email,
		phone: input.phone,
		checkIn,
		checkOut,
		guests: input.guests,
		notes: input.notes
	});

	if (!result.ok) {
		return json({ message: 'Dates unavailable', conflicts: result.conflicts }, { status: 409 });
	}

	const settings = await getSettings();
	const mailPayload = {
		code: result.booking.code,
		guestName: input.name,
		email: input.email,
		phone: input.phone,
		checkIn: input.checkIn,
		checkOut: input.checkOut,
		guests: input.guests,
		notes: input.notes
	};

	await Promise.allSettled([
		notifyBooking(mailPayload, settings.notificationEmail),
		autoReplyGuest(mailPayload, settings.contactEmail)
	]);

	return json({ code: result.booking.code }, { status: 201 });
};
