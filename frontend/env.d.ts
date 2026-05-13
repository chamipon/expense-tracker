declare namespace NodeJS {
	interface ProcessEnv {
		/** When set, fetch uses this origin from the browser (requires CORS on the API). When unset, the browser uses same-origin `/api` (see next.config rewrites). */
		NEXT_PUBLIC_API_BASE_URL?: string;
		/** Express origin for the `/api` rewrite and for server-side fetch when no public URL is set. */
		API_SERVER_ORIGIN?: string;
	}
}
