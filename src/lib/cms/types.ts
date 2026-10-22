export type Currency = 'BWP' | 'USD' | 'EUR';

export interface Tent {
	id: string;
	name: string;
	localName: string;
	image: string;
	capacity: number;
	pricePerNight: number | null;
	blurb: string | null;
	sortOrder: number;
	active: boolean;
	images: string[];
}

export type RateCategory =
	| 'GLAMPING'
	| 'EXCURSION'
	| 'BOAT'
	| 'TRANSFER'
	| 'HELICOPTER'
	| 'SPECIAL';

export type RateUnit = 'PER_NIGHT' | 'PER_PERSON' | 'PER_TRIP' | 'COMPLIMENTARY' | 'ON_REQUEST';

export interface RatePrice {
	amount: number | null;
	currency: Currency;
	label: string;
	sortOrder: number;
}

export interface Rate {
	id: string;
	category: RateCategory;
	name: string;
	details: string;
	minPax: number | null;
	maxPax: number | null;
	unit: RateUnit;
	prices: RatePrice[];
	sortOrder: number;
	active: boolean;
}

export interface Review {
	id: string;
	author: string;
	location: string;
	rating: number;
	text: string;
	date: string;
	source: 'AIRBNB' | 'BOOKINGCOM' | 'GOOGLE' | 'MANUAL';
	sortOrder: number;
	active: boolean;
}

export interface SiteSettings {
	contactEmail: string;
	notificationEmail: string;
	whatsapp: string;
	airbnbUrl: string;
	bookingcomUrl: string;
	airbnbIcalUrl: string;
	bookingcomIcalUrl: string;
	fxUsd: number;
	fxEur: number;
	reviewsWidgetEmbed: string;
	ratesFootnote: string;
}

export const CURRENCIES: Currency[] = ['BWP', 'USD', 'EUR'];

export const CURRENCY_META: Record<Currency, { symbol: string; code: string; name: string }> = {
	BWP: { symbol: 'P', code: 'BWP', name: 'Pula' },
	USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
	EUR: { symbol: '€', code: 'EUR', name: 'Euro' }
};
