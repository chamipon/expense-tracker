export function pathParamId(
	raw: string | string[] | undefined,
): string | undefined {
	const v = Array.isArray(raw) ? raw[0] : raw;
	return typeof v === "string" && v.length > 0 ? v : undefined;
}
