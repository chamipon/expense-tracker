import { apiRequest } from "./client";
import type { User } from "./types";

export interface CreateUserInput {
	name: string;
}

export interface UpdateUserInput {
	name: string;
}

export function createUser(body: CreateUserInput): Promise<User> {
	return apiRequest<User>("/users", { method: "POST", json: body });
}

export function getUser(id: string): Promise<User> {
	return apiRequest<User>(`/users/${encodeURIComponent(id)}`);
}

export function updateUser(id: string, body: UpdateUserInput): Promise<User> {
	return apiRequest<User>(`/users/${encodeURIComponent(id)}`, {
		method: "PUT",
		json: body,
	});
}

export function deleteUser(id: string): Promise<void> {
	return apiRequest<void>(`/users/${encodeURIComponent(id)}`, {
		method: "DELETE",
	});
}
