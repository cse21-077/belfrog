import type { RequestHandler } from './$types';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { prisma } from '$lib/server/db';
import { getSettings } from '$lib/server/settings';

const h = (text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2) =>
	new Paragraph({ heading: level, spacing: { before: 320, after: 120 }, children: [new TextRun({ text, bold: true })] });

const p = (text: string, opts: { bold?: string } = {}) =>
	new Paragraph({
		spacing: { after: 120 },
		children: [
			...(opts.bold ? [new TextRun({ text: opts.bold, bold: true })] : []),
			new TextRun({ text })
		]
	});

const ABOUT_COPY = [
	'We’re an agro-tourism resort in the Okavango, Botswana, situated 2km from the Buffalo Fence and 20km from Maun.',
	'Botswana is one of Africa’s most culturally and environmentally rich countries. It’s landlocked, with light soils, an arid to semi-arid climate, summer temperatures averaging over 40°C, and an annual rainfall of around 416mm. This little piece of heaven is where we decided to start farming.',
	'In Maun and the Okavango Delta, tourism is vital to our livelihoods. Our Agro-Tourism classification allows us to use up to 50% of our plot for tourism, featuring a main building with a kitchen, lounge, dining area, and bar; two luxury tents; four standard tents; and a pool bar.'
];

const MORE_INFO_COPY = [
	'The Bell Frog Inn is nestled in the heart of the Okavango Delta, alongside the seasonal Boro River, which originates in the Southern Angolan mountains, courses through the Caprivi strip and winds through the Delta — flowing past our Bar & Restaurant when the annual flood arrives.',
	'Maun has over 55,000 inhabitants but still feels like an old frontier town. It’s an exciting off-road 40-minute drive to us, or — when water levels allow — a pleasant 35-minute boat jaunt in one of our Swamp Cruisers. On the way you’ll pass cattle, goats and donkeys — and if you’re lucky, elephants, hippos, crocodiles and an abundance of birdlife. During flood season, The Bell Frog enjoys 300 metres of beautiful waterfront.',
	'Cool off in our inviting overflow pool while enjoying our renowned artisanal pizza and legendary chicken jalapeño pocket — just ask our bartender.',
	'Each tented room offers a serene bush experience with its own ablution facilities, electricity for charging your devices, and views over the seasonal river when in flood. Wake up to a complimentary breakfast, and let us prepare a packed lunch for your upstream boat excursion or game drive.'
];

const MOKORO_COPY =
	'After a light breakfast, grab a wide-brimmed hat and a packed lunch. We’ll arrange pickup directly from your accommodation and take you gliding through the tranquil waterways of the Okavango Delta, surrounded by rich biodiversity.';

const HELI_COPY =
	'We’ve partnered with Helicopter Horizons for an incredible scenic flight over the south-western Okavango Delta. Doors are removed for unrestricted views, headsets keep you in touch with expert pilots, and you’ll soar above palm islands and lagoons. Choose from direct flight transfers, 30 & 45-minute doors-off scenic flights, or the Elephant Havens and Xhoo Community experiences.';

export const GET: RequestHandler = async () => {
	const [settings, tents, rates, reviewsCount] = await Promise.all([
		getSettings(),
		prisma.tent.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
		prisma.rate.findMany({
			where: { active: true },
			include: { prices: { orderBy: { sortOrder: 'asc' } } },
			orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }]
		}),
		prisma.review.count()
	]);

	const categoryOrder: Record<string, string> = {
		GLAMPING: 'Tented Accommodation',
		EXCURSION: 'Delta Excursions',
		BOAT: 'Boat Cruises',
		TRANSFER: 'Road & Boat Transfers',
		HELICOPTER: 'Helicopter Horizons Flights'
	};

	const children: Paragraph[] = [
		h('The Bell Frog Inn — Website Copy', HeadingLevel.TITLE),
		p(`Exported from the CMS. Reviews managed in the CMS (${reviewsCount} published) are guest content and excluded.`, {}),

		h('Hero'),
		p(settings.heroSubtitle, { bold: `${settings.heroTitle} — ` }),

		h('Stay — Rates & Booking'),
		p('Complimentary Wi-Fi access at the bar on request.'),
		p('A 50% non-refundable deposit secures your reservation.'),
		p('Bank card facility available — no cash transactions required.'),
	];

	for (const tent of tents) {
		children.push(
			p(
				` — Sleeps ${tent.capacity} (maximum ${tent.capacity} guests)${tent.pricePerNight ? `, P${tent.pricePerNight} per night` : ''}${tent.blurb ? `. ${tent.blurb}` : ''}.`,
				{ bold: `${tent.name} (${tent.localName})` }
			)
		);
	}

	children.push(h('Activities & Transfer Rates 2026'));

	for (const [category, title] of Object.entries(categoryOrder)) {
		const items = rates.filter((r) => r.category === category);
		if (items.length === 0) continue;
		children.push(h(title, HeadingLevel.HEADING_3));
		for (const rate of items) {
			const priceText =
				rate.unit === 'COMPLIMENTARY'
					? 'Complimentary'
					: rate.unit === 'ON_REQUEST'
						? 'On request'
						: rate.prices
								.map((pr) => `${pr.amount != null ? `${pr.currency} ${pr.amount}` : ''} ${pr.label}`.trim())
								.join(' | ') || '—';
			children.push(
				p(` — ${priceText}${rate.minPax ? ` (min ${rate.minPax} pax)` : ''}. ${rate.details}`, {
					bold: rate.name
				})
			);
		}
	}

	children.push(
		h('About'),
		...ABOUT_COPY.map((text) => p(text)),
		h('More About Your Stay'),
		...MORE_INFO_COPY.map((text) => p(text)),
		h('Experiences'),
		p(MOKORO_COPY, { bold: 'Mokoro Trips. ' }),
		p(HELI_COPY, { bold: 'Doors-Off Helicopter Flights (Helicopter Horizons). ' }),
		h('Footer / Contact'),
		p(settings.contactEmail, { bold: 'Email: ' }),
		p(`WhatsApp: (+267) ${settings.whatsapp.slice(3, 7)} ${settings.whatsapp.slice(7)}`),
		p('Boro River, Okavango Delta, Botswana', { bold: 'Location: ' }),
		p(settings.ratesFootnote, { bold: 'Rates footnote: ' })
	);

	const doc = new Document({
		sections: [{ children }]
	});

	const buffer = await Packer.toBuffer(doc);

	return new Response(new Uint8Array(buffer), {
		headers: {
			'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'content-disposition': 'attachment; filename="bellfrog-website-copy.docx"'
		}
	});
};
