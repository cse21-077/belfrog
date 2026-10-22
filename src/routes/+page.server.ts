import { getRates, getReviews, getTents } from '$lib/server/cms';
import { getSettings } from '$lib/server/settings';
import { syncIfStale } from '$lib/server/ical';

export const load = async () => {
	const [, tents, rates, reviews, settings] = await Promise.all([
		syncIfStale(),
		getTents(),
		getRates(),
		getReviews(),
		getSettings()
	]);

	return { tents, rates, reviews, settings };
};
