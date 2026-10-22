import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

const icsDate = (d: Date) =>
	`${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;

const stamp = () => new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Public iCal feed of confirmed bookings + manual blocks — subscribe in Airbnb/Booking.com extranets. */
export const GET: RequestHandler = async () => {
	const [bookings, manualBlocks] = await Promise.all([
		prisma.booking.findMany({
			where: { status: 'CONFIRMED', checkOut: { gte: new Date() } },
			orderBy: { checkIn: 'asc' }
		}),
		prisma.blockedDate.findMany({
			where: { source: 'MANUAL', end: { gte: new Date() } },
			orderBy: { start: 'asc' }
		})
	]);

	const lines: string[] = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//The Bell Frog Inn//Booking Feed//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH'
	];

	for (const booking of bookings) {
		lines.push(
			'BEGIN:VEVENT',
			`UID:booking-${booking.id}@thebellfrog.com`,
			`DTSTAMP:${stamp()}`,
			`DTSTART;VALUE=DATE:${icsDate(booking.checkIn)}`,
			`DTEND;VALUE=DATE:${icsDate(booking.checkOut)}`,
			`SUMMARY:${escape(`Reserved — ${booking.guestName} (${booking.code})`)}`,
			'END:VEVENT'
		);
	}

	for (const block of manualBlocks) {
		lines.push(
			'BEGIN:VEVENT',
			`UID:block-${block.id}@thebellfrog.com`,
			`DTSTAMP:${stamp()}`,
			`DTSTART;VALUE=DATE:${icsDate(block.start)}`,
			`DTEND;VALUE=DATE:${icsDate(block.end)}`,
			`SUMMARY:${escape(block.summary || 'Blocked')}`,
			'END:VEVENT'
		);
	}

	lines.push('END:VCALENDAR');

	return new Response(lines.join('\r\n'), {
		headers: {
			'content-type': 'text/calendar; charset=utf-8',
			'cache-control': 'public, max-age=900'
		}
	});
};
