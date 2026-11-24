import { parseICS, type VEvent } from 'node-ical';
import { prisma } from './db';
import { getSettings, setSetting } from './settings';

const FEEDS: { key: 'airbnbIcalUrl' | 'bookingcomIcalUrl'; source: 'AIRBNB' | 'BOOKINGCOM' }[] = [
	{ key: 'airbnbIcalUrl', source: 'AIRBNB' },
	{ key: 'bookingcomIcalUrl', source: 'BOOKINGCOM' }
];

export interface SyncResult {
	source: 'AIRBNB' | 'BOOKINGCOM';
	upserted: number;
	removed: number;
	error?: string;
}

function asDate(value: unknown): Date | null {
	if (value instanceof Date) return value;
	return null;
}

/** node-ical parses date-only values as local midnight — pin them to the same calendar day in UTC. */
function asUtcDay(value: Date, dateOnly: boolean): Date {
	if (!dateOnly) return value;
	return new Date(
		Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
	);
}

function asText(value: unknown): string {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object' && 'val' in value && typeof (value as { val: unknown }).val === 'string') {
		return (value as { val: string }).val;
	}
	return '';
}

async function syncFeed(url: string, source: 'AIRBNB' | 'BOOKINGCOM'): Promise<SyncResult> {
	const result: SyncResult = { source, upserted: 0, removed: 0 };

	let text: string;
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
		if (!res.ok) {
			result.error = `HTTP ${res.status}`;
			return result;
		}
		text = await res.text();
	} catch (err) {
		result.error = err instanceof Error ? err.message : 'fetch failed';
		return result;
	}

	let parsed: ReturnType<typeof parseICS>;
	try {
		parsed = parseICS(text);
	} catch (err) {
		result.error = err instanceof Error ? err.message : 'parse failed';
		return result;
	}

	const seen = new Set<string>();
	const components = Object.values(parsed).flatMap((c) => (Array.isArray(c) ? c : [c]));
	const events = components.filter((c): c is VEvent => c?.type === 'VEVENT');

	for (const event of events) {
		const dateOnly = event.datetype === 'date';
		const startRaw = asDate(event.start);
		const endRaw = asDate(event.end);
		// iCal DTEND is the checkout day (exclusive) — store as-is.
		const start = startRaw ? asUtcDay(startRaw, dateOnly) : null;
		const end = endRaw ? asUtcDay(endRaw, dateOnly) : null;
		const summary = asText(event.summary);
		const uid = event.uid ?? `${start?.toISOString()}-${summary || 'event'}`;
		if (!start || !end || !uid) continue;

		seen.add(uid);
		await prisma.blockedDate.upsert({
			where: { source_externalId: { source, externalId: uid } },
			update: { start, end, summary },
			create: { source, externalId: uid, start, end, summary }
		});
		result.upserted += 1;
	}

	// Remove blocks for this source that no longer exist in the feed.
	const stale = await prisma.blockedDate.findMany({
		where: { source, externalId: { not: null } },
		select: { id: true, externalId: true }
	});
	const staleIds = stale.filter((s) => s.externalId && !seen.has(s.externalId)).map((s) => s.id);
	if (staleIds.length > 0) {
		await prisma.blockedDate.deleteMany({ where: { id: { in: staleIds } } });
		result.removed = staleIds.length;
	}

	return result;
}

export async function syncAll(): Promise<SyncResult[]> {
	const settings = await getSettings();
	const results: SyncResult[] = [];

	for (const feed of FEEDS) {
		const url = settings[feed.key];
		if (url) {
			results.push(await syncFeed(url, feed.source));
		}
	}

	await setSetting('lastIcalSyncAt', new Date().toISOString());
	return results;
}

export async function lastSyncAt(): Promise<Date | null> {
	const row = await prisma.setting.findUnique({ where: { key: 'lastIcalSyncAt' } });
	if (!row) return null;
	const date = new Date(row.value);
	return Number.isNaN(date.getTime()) ? null : date;
}

/** Lazily re-sync when the last successful sync is older than `maxAgeMs`. Never throws — a failed sync must not take down public pages. */
export async function syncIfStale(maxAgeMs = 60 * 60 * 1000): Promise<void> {
	try {
		const last = await lastSyncAt();
		if (!last || Date.now() - last.getTime() > maxAgeMs) {
			await syncAll();
		}
	} catch (err) {
		console.error('iCal sync skipped:', err instanceof Error ? err.message : err);
	}
}
