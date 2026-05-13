/**
 * Base URL for API requests (no trailing slash).
 * - Browser: `NEXT_PUBLIC_API_BASE_URL` if set, otherwise same-origin `/api` (proxied by Next).
 * - Server (RSC, route handlers, server actions): `NEXT_PUBLIC_API_BASE_URL` if set, otherwise `API_SERVER_ORIGIN` (direct to Express).
 */
export function getApiBaseUrl(): string {
	const publicUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
	if (publicUrl) {
		return publicUrl;
	}
	if (typeof window !== "undefined") {
		return "/api";
	}
	return (process.env.API_SERVER_ORIGIN ?? "http://127.0.0.1:3001").replace(
		/\/$/,
		"",
	);
}

export function joinApiUrl(base: string, path: string): string {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	if (!base) {
		return normalizedPath;
	}
	return `${base.replace(/\/$/, "")}${normalizedPath}`;
}
