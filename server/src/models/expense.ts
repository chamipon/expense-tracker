import mongoose, { Schema, Document, Model } from "mongoose";
import { IPayment, PaymentSchema } from "./payment";
import { IShare, ShareSchema } from "./share";
import Household from "./household";
import { refExistsValidator } from "../validators/refExists";

export type CurrencyCode = "CAD" | "USD";

export type SplitMethod = "equal" | "percentage" | "custom" | "shares";

export interface IExpense extends Document {
	householdId: mongoose.Types.ObjectId;

	description: string;
	notes?: string;

	category?: string;

	amountCents: number;
	currency: CurrencyCode;

	splitMethod: SplitMethod;

	payments: IPayment[];
	shares: IShare[];

	tags?: string[];

	expenseDate: Date;

	createdBy: mongoose.Types.ObjectId;

	version: number;

	isDeleted: boolean;
	deletedAt?: Date;
	deletedBy?: mongoose.Types.ObjectId;

	createdAt: Date;
	updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
	{
		householdId: {
			type: Schema.Types.ObjectId,
			ref: "Household",
			required: true,
			index: true,
			validate: refExistsValidator(Household, "householdId"),
		},
		description: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},

		notes: {
			type: String,
			trim: true,
			maxlength: 2000,
		},

		category: {
			type: String,
			trim: true,
			maxlength: 100,
		},

		amountCents: {
			type: Number,
			required: true,
			min: 1,
		},

		currency: {
			type: String,
			required: true,
			enum: ["CAD", "USD"],
			default: "CAD",
		},

		splitMethod: {
			type: String,
			required: true,
			enum: ["equal", "percentage", "custom", "shares"],
		},

		payments: {
			type: [PaymentSchema],
			required: true,
			validate: {
				validator: function (payments: IPayment[]) {
					return payments.length > 0;
				},
				message: "At least one payment is required",
			},
		},

		shares: {
			type: [ShareSchema],
			required: true,
			validate: {
				validator: function (shares: IShare[]) {
					return shares.length > 0;
				},
				message: "At least one share is required",
			},
		},

		tags: {
			type: [String],
			default: [],
		},

		expenseDate: {
			type: Date,
			required: true,
			index: true,
		},

		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		version: {
			type: Number,
			default: 1,
		},

		isDeleted: {
			type: Boolean,
			default: false,
			index: true,
		},

		deletedAt: {
			type: Date,
		},

		deletedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	},
);

/**
 * Compound indexes
 */

ExpenseSchema.index({
	householdId: 1,
	expenseDate: -1,
});

ExpenseSchema.index({
	householdId: 1,
	isDeleted: 1,
});

ExpenseSchema.index({
	"shares.userId": 1,
});

ExpenseSchema.index({
	"payments.userId": 1,
});

/**
 * Validation
 */

export function assertExpenseBalances(
	amountCents: number,
	payments: Pick<IPayment, "amountCents">[],
	shares: Pick<IShare, "owedCents">[],
): void {
	const totalPaid = payments.reduce(
		(sum, payment) => sum + payment.amountCents,
		0,
	);

	const totalOwed = shares.reduce(
		(sum, share) => sum + share.owedCents,
		0,
	);

	if (totalPaid !== amountCents) {
		throw new Error(
			`Payment total (${totalPaid}) does not equal expense amount (${amountCents})`,
		);
	}

	if (totalOwed !== amountCents) {
		throw new Error(
			`Share total (${totalOwed}) does not equal expense amount (${amountCents})`,
		);
	}
}

ExpenseSchema.pre("validate", function () {
	const expense = this as IExpense;
	assertExpenseBalances(
		expense.amountCents,
		expense.payments,
		expense.shares,
	);
});

const Expense: Model<IExpense> =
	mongoose.models.Expense ||
	mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
