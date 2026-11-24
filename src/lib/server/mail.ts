import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const from = () => process.env.EMAIL_FROM || 'The Bell Frog Inn <bookings@thebellfrog.com>';

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
	if (!resend) {
		console.log(`[mail:disabled] to=${to} subject=${subject}`);
		return { id: 'console' };
	}
	return resend.emails.send({ from: from(), to, subject, html });
}

interface BookingMail {
	code: string;
	guestName: string;
	email: string;
	phone: string;
	checkIn: string;
	checkOut: string;
	guests: number;
	notes: string;
}

export async function notifyBooking(booking: BookingMail, notificationEmail: string) {
	return sendMail({
		to: notificationEmail,
		subject: `New booking request ${booking.code} — ${booking.guestName}`,
		html: `
			<h2>New booking request</h2>
			<p><strong>Code:</strong> ${booking.code}</p>
			<p><strong>Guest:</strong> ${booking.guestName}</p>
			<p><strong>Email:</strong> ${booking.email}</p>
			<p><strong>Phone:</strong> ${booking.phone || '—'}</p>
			<p><strong>Dates:</strong> ${booking.checkIn} → ${booking.checkOut}</p>
			<p><strong>Guests:</strong> ${booking.guests}</p>
			<p><strong>Notes:</strong> ${booking.notes || '—'}</p>
		`
	});
}

export async function autoReplyGuest(booking: BookingMail, contactEmail: string) {
	return sendMail({
		to: booking.email,
		subject: `Booking request received — The Bell Frog Inn (${booking.code})`,
		html: `
			<p>Dear ${booking.guestName},</p>
			<p>Thank you for your booking request at The Bell Frog Inn. We have received your inquiry:</p>
			<p><strong>Reference:</strong> ${booking.code}<br/>
			<strong>Check-in:</strong> ${booking.checkIn}<br/>
			<strong>Check-out:</strong> ${booking.checkOut}<br/>
			<strong>Guests:</strong> ${booking.guests}</p>
			<p>We will confirm availability within 24 hours. A 50% non-refundable deposit secures your reservation.</p>
			<p>Warm regards,<br/>The Bell Frog Inn team<br/><a href="mailto:${contactEmail}">${contactEmail}</a></p>
		`
	});
}
