import { Request, Response } from "express";
import mongoose from "mongoose";
import Expense, { assertExpenseBalances } from "../models/expense";
import { pathParamId } from "../helpers/pathParamId";

const EXPENSE_PUT_ALLOWED_KEYS = new Set([
  "householdId",
  "description",
  "notes",
  "category",
  "amountCents",
  "currency",
  "splitMethod",
  "payments",
  "shares",
  "tags",
  "expenseDate",
  "version",
  "createdBy",
]);

const EXPENSE_PUT_FORBIDDEN_KEYS = new Set([
  "isDeleted",
  "deletedAt",
  "deletedBy",
  "_id",
  "createdAt",
  "updatedAt",
]);

const EXPENSE_PUT_REQUIRED_KEYS = [
  "householdId",
  "description",
  "amountCents",
  "currency",
  "splitMethod",
  "payments",
  "shares",
  "expenseDate",
  "version",
] as const;

export async function createExpense(
  req: Request,
  res: Response
) {
  try {
    const expense = new Expense(req.body);

    await expense.save();

    return res.status(201).json(expense);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function getExpenses(
  req: Request,
  res: Response
) {
  try {
    const id = pathParamId(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid household id" });
    }

    const expenses = await Expense.find({
      householdId: id,
      isDeleted: false,
    })
      .sort({
        expenseDate: -1,
      })
      .lean();

    return res.json(expenses);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const id = pathParamId(req.params.id);
    const body = req.body as Record<string, unknown>;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    if (!body || typeof body !== "object") {
      return res.status(400).json({ message: "JSON body is required" });
    }

    for (const key of EXPENSE_PUT_FORBIDDEN_KEYS) {
      if (key in body) {
        return res.status(400).json({
          message: `Field "${key}" cannot be changed via PUT`,
        });
      }
    }

    const unknownKeys = Object.keys(body).filter(
      (k) => !EXPENSE_PUT_ALLOWED_KEYS.has(k),
    );
    if (unknownKeys.length > 0) {
      return res.status(400).json({
        message: `Unknown fields: ${unknownKeys.join(", ")}`,
      });
    }

    for (const key of EXPENSE_PUT_REQUIRED_KEYS) {
      if (!(key in body)) {
        return res.status(400).json({ message: `Missing required field: ${key}` });
      }
    }

    const clientVersion = Number(body.version);
    if (!Number.isInteger(clientVersion) || clientVersion < 1) {
      return res.status(400).json({ message: "version must be a positive integer" });
    }

    if (!Array.isArray(body.payments) || !Array.isArray(body.shares)) {
      return res.status(400).json({
        message: "payments and shares must be arrays",
      });
    }

    if ("tags" in body && !Array.isArray(body.tags)) {
      return res.status(400).json({ message: "tags must be an array" });
    }

    const existing = await Expense.findById(id).lean();
    if (!existing || existing.isDeleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (existing.version !== clientVersion) {
      return res.status(409).json({ message: "Stale or mismatched version" });
    }

    const notes = "notes" in body ? (body.notes as string | undefined) : existing.notes;
    const category =
      "category" in body ? (body.category as string | undefined) : existing.category;
    const tags = "tags" in body ? (body.tags as string[]) : existing.tags ?? [];

    try {
      assertExpenseBalances(
        body.amountCents as number,
        body.payments as { amountCents: number }[],
        body.shares as { owedCents: number }[],
      );
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }

    const $set = {
      householdId: body.householdId,
      description: body.description,
      notes,
      category,
      amountCents: body.amountCents,
      currency: body.currency,
      splitMethod: body.splitMethod,
      payments: body.payments,
      shares: body.shares,
      tags,
      expenseDate: body.expenseDate,
      version: clientVersion + 1,
    };

    const updated = await Expense.findOneAndUpdate(
      { _id: id, isDeleted: false, version: clientVersion },
      { $set },
      { new: true, runValidators: true },
    );

    if (!updated) {
      const stillThere = await Expense.findById(id).lean();
      if (!stillThere || stillThere.isDeleted) {
        return res.status(404).json({ message: "Expense not found" });
      }
      return res.status(409).json({ message: "Stale or mismatched version" });
    }

    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const id = pathParamId(req.params.id);
    const deletedBy = req.body?.deletedBy as string | undefined;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const expense = await Expense.findById(id);
    if (!expense || expense.isDeleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.isDeleted = true;
    expense.deletedAt = new Date();
    if (deletedBy && mongoose.Types.ObjectId.isValid(deletedBy)) {
      expense.deletedBy = new mongoose.Types.ObjectId(deletedBy);
    }
    await expense.save();

    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}