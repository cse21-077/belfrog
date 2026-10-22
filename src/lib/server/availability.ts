import { prisma } from './db';

export interface AvailabilityResult {
	available: boolean;
	conflicts: string[];
}

/**
 * A night-range conflict check with half-open interval semantics:
 * an existing [checkIn, checkOut) conflicts when checkIn < out && checkOut > in.
 */
export async function checkAvailability(checkIn: Date, checkOut: Date): Promise<AvailabilityResult> {
	const [bookingConflicts, blockedConflicts] = await Promise.all([
		prisma.booking.findMany({
			where: {
				status: { in: ['PENDING', 'CONFIRMED'] },
				checkIn: { lt: checkOut },
				checkOut: { gt: checkIn }
			},
			select: { code: true, guestName: true }
		}),
		prisma.blockedDate.findMany({
			where: {
				start: { lt: checkOut },
				end: { gt: checkIn }
			},
			select: { summary: true, source: true }
		})
	]);

	const conflicts = [
		...bookingConflicts.map((b) => `Booking ${b.code} (${b.guestName})`),
		...blockedConflicts.map((b) => b.summary || `Blocked (${b.source.toLowerCase()})`)
	];

	return { available: conflicts.length === 0, conflicts };
}
