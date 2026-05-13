import { apiRequest } from "./client";
import type { Household } from "./types";

export interface CreateHouseholdInput {
	name: string;
}

export interface UpdateHouseholdInput {
	name: string;
}

export function listHouseholds(): Promise<Household[]> {
	return apiRequest<Household[]>("/households");
}

export function createHousehold(
	body: CreateHouseholdInput,
): Promise<Household> {
	return apiRequest<Household>("/households", { method: "POST", json: body });
}

export function getHousehold(id: string): Promise<Household> {
	return apiRequest<Household>(`/households/${encodeURIComponent(id)}`);
}

export function updateHousehold(
	id: string,
	body: UpdateHouseholdInput,
): Promise<Household> {
	return apiRequest<Household>(`/households/${encodeURIComponent(id)}`, {
		method: "PUT",
		json: body,
	});
}

export function deleteHousehold(id: string): Promise<void> {
	return apiRequest<void>(`/households/${encodeURIComponent(id)}`, {
		method: "DELETE",
	});
}
