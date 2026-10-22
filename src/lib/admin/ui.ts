export const inputCls =
	'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-stone-900 ring-1 ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-brand';

export const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500';

export const btnPrimary =
	'rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-700 disabled:opacity-50';

export const btnSecondary =
	'rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100';

export const btnDanger =
	'rounded-full bg-accent-700/10 px-4 py-2 text-sm font-semibold text-accent-700 ring-1 ring-accent-700/30 transition hover:bg-accent-700 hover:text-white';

export const cardCls = 'rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-100';

export const thCls = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500';

export const tdCls = 'px-4 py-3 text-sm text-stone-700';

export const fmtDate = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

export const dateToISO = (d: Date) => {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};
