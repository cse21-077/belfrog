import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSession, verifyPassword, SESSION_COOKIE } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.admin) redirect(303, '/admin');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim().toLowerCase();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Enter your email and password.', email });
		}

		const user = await prisma.adminUser.findUnique({ where: { email } });
		if (!user || !verifyPassword(password, user.passwordHash)) {
			return fail(401, { error: 'Invalid email or password.', email });
		}

		const token = await createSession(user.id);
		cookies.set(SESSION_COOKIE, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 86400
		});

		redirect(303, '/admin');
	}
};
