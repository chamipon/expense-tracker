import { Request, Response } from "express";
import mongoose from "mongoose";
import Expense from "../models/expense";
import { pathParamId } from "../helpers/pathParamId";

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