import { Request, Response } from "express";
import Expense from "../models/expense";

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
    const { householdId } = req.params;

    const expenses = await Expense.find({
      householdId,
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