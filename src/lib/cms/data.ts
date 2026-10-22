import type { Rate, Review, SiteSettings, Tent } from './types';

export const tents: Tent[] = [
	{
		id: 'jackalberry',
		name: 'Jackalberry',
		localName: 'Mokhothombo',
		image: '/jackalberry.jpg',
		images: ['/jackalberry.jpg'],
		capacity: 2,
		pricePerNight: 950,
		blurb: null,
		sortOrder: 1,
		active: true
	},
	{
		id: 'leadwood',
		name: 'Leadwood',
		localName: 'Motswiri',
		image: '/leadwood.jpg',
		images: ['/leadwood.jpg'],
		capacity: 2,
		pricePerNight: 950,
		blurb: null,
		sortOrder: 2,
		active: true
	},
	{
		id: 'fig-tree',
		name: 'Fig Tree',
		localName: 'Mochaba',
		image: '/fig-tree.jpg',
		images: ['/fig-tree.jpg'],
		capacity: 2,
		pricePerNight: 950,
		blurb: null,
		sortOrder: 3,
		active: true
	},
	{
		id: 'knobthorn',
		name: 'Knobthorn',
		localName: 'Mokhutshomo',
		image: '/knobthorn.jpg',
		images: ['/knobthorn.jpg'],
		capacity: 2,
		pricePerNight: 950,
		blurb: null,
		sortOrder: 4,
		active: true
	}
];

export const rates: Rate[] = [
	// Glamping accommodation (per night)
	{
		id: 'standard-tent',
		category: 'GLAMPING',
		name: 'Standard Tented Accommodation',
		details: 'Includes daily breakfast. No single supplement.',
		minPax: 1,
		maxPax: 2,
		unit: 'PER_NIGHT',
		prices: [{ amount: 950, currency: 'BWP', label: 'Per night · Sleeps 2', sortOrder: 1 }],
		sortOrder: 1,
		active: true
	},
	{
		id: 'luxury-suite',
		category: 'GLAMPING',
		name: 'Luxury Glamping Tented Suite',
		details:
			'Only 2 exclusive tents (launching end of August). Private outdoor shower, ensuite bathroom, private BBQ area, and complete river-facing privacy. Includes daily breakfast.',
		minPax: 1,
		maxPax: 2,
		unit: 'PER_NIGHT',
		prices: [{ amount: 2950, currency: 'BWP', label: 'Per night · Sleeps 2', sortOrder: 1 }],
		sortOrder: 2,
		active: true
	},

	// Delta excursions
	{
		id: 'mokoro-day',
		category: 'EXCURSION',
		name: 'Mokoro Day Trip',
		details:
			'Includes short guided bush walk, packed lunch, park fees, and qualified Guide/poler.',
		minPax: 1,
		maxPax: null,
		unit: 'PER_TRIP',
		prices: [
			{ amount: 3000, currency: 'BWP', label: 'Solo', sortOrder: 1 },
			{ amount: 4000, currency: 'BWP', label: '2 PAX', sortOrder: 2 }
		],
		sortOrder: 1,
		active: true
	},
	{
		id: 'mokoro-2day',
		category: 'EXCURSION',
		name: '2-Day Mokoro Delta Trip',
		details:
			'Overnight wilderness camp. Includes premium camping equipment, qualified Guide, park fees, and all meals.',
		minPax: 1,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [
			{ amount: 8500, currency: 'BWP', label: 'Solo / 1 Tent', sortOrder: 1 },
			{ amount: 6600, currency: 'BWP', label: 'Per person · 2+ PAX', sortOrder: 2 }
		],
		sortOrder: 2,
		active: true
	},
	{
		id: 'boat-overnight',
		category: 'EXCURSION',
		name: '2-Day Boat Overnight Camp',
		details:
			'Includes private motorboat excursion, packed lunch, park fees, qualified Guide, premium camping gear, and tents.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 15000, currency: 'BWP', label: 'Per person', sortOrder: 1 }],
		sortOrder: 3,
		active: true
	},

	// Boat cruises
	{
		id: 'boat-day',
		category: 'BOAT',
		name: 'Boat Day Trip',
		details:
			'Private motorboat excursion. Includes packed lunch, park fees, and qualified Guide.',
		minPax: 1,
		maxPax: 8,
		unit: 'PER_TRIP',
		prices: [
			{ amount: 6500, currency: 'BWP', label: 'Up to 2 PAX', sortOrder: 1 },
			{ amount: 1000, currency: 'BWP', label: 'Per extra PAX', sortOrder: 2 }
		],
		sortOrder: 1,
		active: true
	},
	{
		id: 'sundowner',
		category: 'BOAT',
		name: 'Sundowner Boat Ride',
		details: 'All staying guests receive a complimentary evening cruise.',
		minPax: null,
		maxPax: null,
		unit: 'COMPLIMENTARY',
		prices: [],
		sortOrder: 2,
		active: true
	},

	// Transfers
	{
		id: 'transfer-4x4-long',
		category: 'TRANSFER',
		name: '4x4 Road Transfer · Stays of 3+ Nights',
		details: 'Free round-trip transfers to/from the Inn.',
		minPax: null,
		maxPax: null,
		unit: 'COMPLIMENTARY',
		prices: [],
		sortOrder: 1,
		active: true
	},
	{
		id: 'transfer-4x4-short',
		category: 'TRANSFER',
		name: '4x4 Road Transfer · Stays of 1–2 Nights',
		details: 'Standard round-trip road transfer.',
		minPax: null,
		maxPax: null,
		unit: 'PER_TRIP',
		prices: [{ amount: 500, currency: 'BWP', label: 'Round trip', sortOrder: 1 }],
		sortOrder: 2,
		active: true
	},
	{
		id: 'transfer-boat-oneway',
		category: 'TRANSFER',
		name: 'Scenic Boat Transfer · One-Way',
		details: 'Beautiful boat transfer directly to the Inn dock.',
		minPax: null,
		maxPax: null,
		unit: 'PER_TRIP',
		prices: [{ amount: 1200, currency: 'BWP', label: 'One way', sortOrder: 1 }],
		sortOrder: 3,
		active: true
	},
	{
		id: 'transfer-boat-return',
		category: 'TRANSFER',
		name: 'Scenic Boat Transfer · Return',
		details: 'Full pick-up and drop-off return service by boat.',
		minPax: null,
		maxPax: null,
		unit: 'PER_TRIP',
		prices: [{ amount: 2400, currency: 'BWP', label: 'Return', sortOrder: 1 }],
		sortOrder: 4,
		active: true
	},

	// Helicopter Horizons (per person, USD)
	{
		id: 'heli-15-oneway',
		category: 'HELICOPTER',
		name: '15-Minute Doors-On Transfer',
		details: 'Maun to The Bell Frog (v.v.) direct transfer.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 115, currency: 'USD', label: 'Per person', sortOrder: 1 }],
		sortOrder: 1,
		active: true
	},
	{
		id: 'heli-25-scenic',
		category: 'HELICOPTER',
		name: '25-Minute Doors-Off Scenic Transfer',
		details: 'Maun to The Bell Frog (v.v.) visual scenic flight.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 270, currency: 'USD', label: 'Per person', sortOrder: 1 }],
		sortOrder: 2,
		active: true
	},
	{
		id: 'heli-15-return',
		category: 'HELICOPTER',
		name: '15-Minute Doors-On Return Transfer',
		details: 'Standard return logic.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 230, currency: 'USD', label: 'Per person', sortOrder: 1 }],
		sortOrder: 3,
		active: true
	},
	{
		id: 'heli-combo',
		category: 'HELICOPTER',
		name: 'Scenic One-Way & Standard Return Combo',
		details:
			'25-minute Doors-Off Scenic Transfer (one way) & 15-minute Doors-On Return Transfer.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 385, currency: 'USD', label: 'Per person', sortOrder: 1 }],
		sortOrder: 4,
		active: true
	},
	{
		id: 'heli-elephant-havens',
		category: 'HELICOPTER',
		name: 'Elephant Havens Experience',
		details:
			'50-Minute Doors-Off Scenic Flight & Elephant Orphanage Visit. Includes a 1-hour experience at the sanctuary and a donation to the organization.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 595, currency: 'USD', label: 'Per person', sortOrder: 1 }],
		sortOrder: 5,
		active: true
	},
	{
		id: 'heli-xhoo',
		category: 'HELICOPTER',
		name: 'Xhoo Community Experience',
		details:
			'35-Minute Doors-Off Scenic Flight & Cultural Village Tour. Includes a 3-hour immersive village life experience with a private guide. 25% of your payment directly supports community initiatives.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 535, currency: 'USD', label: 'Per person', sortOrder: 1 }],
		sortOrder: 6,
		active: true
	},
	{
		id: 'heli-champagne',
		category: 'HELICOPTER',
		name: 'Remote Champagne Experience',
		details:
			'Can be booked in conjunction with any scenic flight. Includes a midway stop on a deserted palm island to enjoy champagne in the wilderness.',
		minPax: 2,
		maxPax: null,
		unit: 'PER_PERSON',
		prices: [{ amount: 50, currency: 'USD', label: 'Per person', sortOrder: 1 }],
		sortOrder: 7,
		active: true
	},

	// Special requests
	{
		id: 'moremi',
		category: 'SPECIAL',
		name: 'Moremi Game Reserve Excursions',
		details: 'Custom-tailored 4x4 game drives. Contact management to book.',
		minPax: null,
		maxPax: null,
		unit: 'ON_REQUEST',
		prices: [],
		sortOrder: 1,
		active: true
	}
];

export const reviews: Review[] = [
	{
		id: 'sample-1',
		author: 'Sarah M.',
		location: 'London, United Kingdom',
		rating: 5,
		text: 'A magical spot on the Boro River. The mokoro trip was the highlight of our Botswana holiday — hippos, elephants and the most peaceful waterways. The pizza back at the inn was an unexpected treat!',
		date: '2025-07-14',
		source: 'AIRBNB',
		sortOrder: 1,
		active: true
	},
	{
		id: 'sample-2',
		author: 'Pieter & Anika',
		location: 'Cape Town, South Africa',
		rating: 5,
		text: 'Slept like babies in the Leadwood tent with the river sounds. The sundowner boat ride is complimentary and absolutely worth it. Friendly staff and great breakfasts.',
		date: '2025-09-02',
		source: 'AIRBNB',
		sortOrder: 2,
		active: true
	},
	{
		id: 'sample-3',
		author: 'Jonas K.',
		location: 'Berlin, Germany',
		rating: 4,
		text: 'Rustic-luxury glamping exactly as described. The helicopter flight over the Delta with Helicopter Horizons was worth every Pula. Transfer from Maun was seamless.',
		date: '2025-10-21',
		source: 'BOOKINGCOM',
		sortOrder: 3,
		active: true
	}
];

export const settings: SiteSettings = {
	contactEmail: 'tbfi.botswana@gmail.com',
	notificationEmail: 'bookings@thebellfrog.com',
	whatsapp: '26775116886',
	airbnbUrl:
		'https://www.airbnb.co.uk/rooms/1088303982104399236?source_impression_id=p3_1709318426_wPi8cIrSJVz9irCr',
	bookingcomUrl: 'https://www.booking.com/',
	airbnbIcalUrl: '',
	bookingcomIcalUrl: '',
	fxUsd: 0.074,
	fxEur: 0.068,
	reviewsWidgetEmbed: '',
	ratesFootnote: 'Above rates are per person unless stated otherwise | Valid 1 Jan 2026 – 31 Dec 2026'
};
