import { apiRequest } from "./client";
import type { CreateExpenseInput, Expense, UpdateExpenseInput } from "./types";

export function createExpense(body: CreateExpenseInput): Promise<Expense> {
	return apiRequest<Expense>("/expenses", { method: "POST", json: body });
}

/** `householdId` is the household Mongo id (same as GET /expenses/:id on the server). */
export function getExpensesByHousehold(
	householdId: string,
): Promise<Expense[]> {
	return apiRequest<Expense[]>(
		`/expenses/${encodeURIComponent(householdId)}`,
	);
}

/** `expenseId` is the expense document id (PUT /expenses/:id on the server). */
export function updateExpense(
	expenseId: string,
	body: UpdateExpenseInput,
): Promise<Expense> {
	return apiRequest<Expense>(`/expenses/${encodeURIComponent(expenseId)}`, {
		method: "PUT",
		json: body,
	});
}

export interface DeleteExpenseInput {
	deletedBy?: string;
}

export function deleteExpense(
	expenseId: string,
	body?: DeleteExpenseInput,
): Promise<void> {
	return apiRequest<void>(`/expenses/${encodeURIComponent(expenseId)}`, {
		method: "DELETE",
		json: body && Object.keys(body).length > 0 ? body : undefined,
	});
}
