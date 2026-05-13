import { getApiBaseUrl, joinApiUrl } from "./config";
import { ApiError } from "./errors";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
	/** Serialized as JSON; sets Content-Type when present. Takes precedence over `body`. */
	json?: unknown;
	body?: RequestInit["body"];
};

function parseJsonResponse(text: string): unknown {
	if (!text || !text.trim()) {
		return undefined;
	}
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

/**
 * Typed fetch to the expense API. Uses {@link getApiBaseUrl} for the origin.
 */
export async function apiRequest<T>(
	path: string,
	options: ApiRequestOptions = {},
): Promise<T> {
	const { json, headers: initHeaders, body: rawBody, ...rest } = options;
	const url = joinApiUrl(getApiBaseUrl(), path);
	const headers = new Headers(initHeaders);

	let body: BodyInit | null | undefined = rawBody;
	if (json !== undefined) {
		headers.set("Content-Type", "application/json");
		body = JSON.stringify(json);
	}

	const res = await fetch(url, {
		...rest,
		headers,
		body,
	});

	if (res.status === 204) {
		return undefined as T;
	}

	const text = await res.text();
	const data = parseJsonResponse(text);

	if (!res.ok) {
		const message =
			typeof data === "object" &&
			data !== null &&
			"message" in data &&
			typeof (data as { message: unknown }).message === "string"
				? (data as { message: string }).message
				: res.statusText;
		throw new ApiError(res.status, message, data);
	}

	return data as T;
}
