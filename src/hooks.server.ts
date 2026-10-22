import { redirect, type Handle } from '@sveltejs/kit';
import { getAdminByToken, SESSION_COOKIE } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE);
	event.locals.admin = await getAdminByToken(token);

	const path = event.url.pathname;
	if (path.startsWith('/admin') && path !== '/admin/login' && !event.locals.admin) {
		redirect(303, '/admin/login');
	}

	return resolve(event);
};
