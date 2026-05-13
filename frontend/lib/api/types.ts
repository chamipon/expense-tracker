export type CurrencyCode = "CAD" | "USD";

export type SplitMethod = "equal" | "percentage" | "custom" | "shares";

export interface ExpensePayment {
	userId: string;
	amountCents: number;
}

export interface ExpenseShare {
	userId: string;
	owedCents: number;
	paidCents: number;
	netCents: number;
}

export interface Household {
	_id: string;
	name: string;
}

export interface User {
	_id: string;
	name: string;
}

export interface Expense {
	_id: string;
	householdId: string;
	description: string;
	notes?: string;
	category?: string;
	amountCents: number;
	currency: CurrencyCode;
	splitMethod: SplitMethod;
	payments: ExpensePayment[];
	shares: ExpenseShare[];
	tags?: string[];
	expenseDate: string;
	createdBy: string;
	version: number;
	isDeleted: boolean;
	deletedAt?: string;
	deletedBy?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateExpenseInput {
	householdId: string;
	description: string;
	notes?: string;
	category?: string;
	amountCents: number;
	currency: CurrencyCode;
	splitMethod: SplitMethod;
	payments: ExpensePayment[];
	shares: ExpenseShare[];
	tags?: string[];
	expenseDate: string;
	createdBy: string;
}

export type UpdateExpenseInput = Omit<CreateExpenseInput, "createdBy"> & {
	version: number;
};

export interface HealthResponse {
	status: string;
}
