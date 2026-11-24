import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { getSettings, setSetting } from '$lib/server/settings';
import { hashPassword, verifyPassword } from '$lib/server/auth';
import { cleanupExpiredSessions } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	const settings = await getSettings();
	return { settings, adminEmail: locals.admin?.email };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const form = await request.formData();
		const keys = [
			'heroTitle',
			'heroSubtitle',
			'contactEmail',
			'notificationEmail',
			'whatsapp',
			'airbnbUrl',
			'bookingcomUrl',
			'airbnbIcalUrl',
			'bookingcomIcalUrl',
			'fxUsd',
			'fxEur',
			'ratesFootnote',
			'reviewsWidgetEmbed'
		];

		for (const key of keys) {
			const value = String(form.get(key) ?? '').trim();
			if (['contactEmail', 'notificationEmail'].includes(key) && value && !/^\S+@\S+\.\S+$/.test(value)) {
				return fail(400, { message: `${key} must be a valid email address.` });
			}
			if (['fxUsd', 'fxEur'].includes(key) && value && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
				return fail(400, { message: `${key} must be a positive number.` });
			}
			await setSetting(key, value);
		}

		return { message: 'Settings saved.' };
	},

	changePassword: async ({ request, locals }) => {
		const form = await request.formData();
		const current = String(form.get('current') ?? '');
		const next = String(form.get('next') ?? '');
		const confirm = String(form.get('confirm') ?? '');

		if (!locals.admin) return fail(401, { message: 'Not signed in.' });

		const user = await prisma.adminUser.findUnique({ where: { id: locals.admin.id } });
		if (!user || !verifyPassword(current, user.passwordHash)) {
			return fail(400, { message: 'Current password is incorrect.' });
		}
		if (next.length < 10) return fail(400, { message: 'New password must be at least 10 characters.' });
		if (next !== confirm) return fail(400, { message: 'New passwords do not match.' });

		await prisma.adminUser.update({
			where: { id: user.id },
			data: { passwordHash: hashPassword(next) }
		});
		await cleanupExpiredSessions();

		return { message: 'Password changed. Please sign in again.' };
	}
};
