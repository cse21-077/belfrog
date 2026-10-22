import { prisma } from './db';
import { settings as defaults } from '$lib/cms/data';
import type { SiteSettings } from '$lib/cms/types';

export async function getSettings(): Promise<SiteSettings> {
	try {
		const rows = await prisma.setting.findMany();
		const map = new Map(rows.map((r) => [r.key, r.value]));
		return {
			contactEmail: map.get('contactEmail') ?? defaults.contactEmail,
			notificationEmail: map.get('notificationEmail') ?? defaults.notificationEmail,
			whatsapp: map.get('whatsapp') ?? defaults.whatsapp,
			airbnbUrl: map.get('airbnbUrl') ?? defaults.airbnbUrl,
			bookingcomUrl: map.get('bookingcomUrl') ?? defaults.bookingcomUrl,
			airbnbIcalUrl: map.get('airbnbIcalUrl') ?? '',
			bookingcomIcalUrl: map.get('bookingcomIcalUrl') ?? '',
			fxUsd: Number(map.get('fxUsd') ?? defaults.fxUsd) || defaults.fxUsd,
			fxEur: Number(map.get('fxEur') ?? defaults.fxEur) || defaults.fxEur,
			reviewsWidgetEmbed: map.get('reviewsWidgetEmbed') ?? '',
			ratesFootnote: map.get('ratesFootnote') ?? defaults.ratesFootnote
		};
	} catch {
		return defaults;
	}
}

export async function setSetting(key: string, value: string): Promise<void> {
	await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}
