import { rates, reviews, settings, tents } from './data';
import type { Currency, Rate, Review, SiteSettings, Tent } from './types';

export * from './types';

export async function getTents(): Promise<Tent[]> {
	return tents.filter((t) => t.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getRates(): Promise<Rate[]> {
	return rates.filter((r) => r.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getReviews(): Promise<Review[]> {
	return reviews.filter((r) => r.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSettings(): Promise<SiteSettings> {
	return settings;
}

const toBWP = (value: number, currency: Currency, fx: { usd: number; eur: number }) =>
	currency === 'BWP' ? value : currency === 'USD' ? value / fx.usd : value / fx.eur;

export function convert(
	amount: number,
	from: Currency,
	to: Currency,
	fx: { usd: number; eur: number }
): number {
	if (from === to) return amount;
	const bwp = toBWP(amount, from, fx);
	const out = to === 'BWP' ? bwp : to === 'USD' ? bwp * fx.usd : bwp * fx.eur;
	return Math.round(out);
}

export function formatMoney(amount: number | null, currency: Currency): string {
	if (amount === null) return 'On request';
	if (currency === 'BWP') return `P${amount.toLocaleString('en-US')}`;
	const symbol = currency === 'USD' ? '$' : '€';
	return `${symbol}${amount.toLocaleString('en-US')}`;
}

export function formatRatePrice(
	price: { amount: number | null; currency: Currency },
	currency: Currency,
	fx: { usd: number; eur: number }
): string {
	if (price.amount === null) return 'On request';
	return formatMoney(convert(price.amount, price.currency, currency, fx), currency);
}
