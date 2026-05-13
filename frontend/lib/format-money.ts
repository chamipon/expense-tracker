import type { CurrencyCode } from "@/lib/api/types";

export function formatMoney(cents: number, currency: CurrencyCode): string {
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency,
	}).format(cents / 100);
}

export function formatExpenseDate(iso: string): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) {
		return iso;
	}
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
	}).format(d);
}
