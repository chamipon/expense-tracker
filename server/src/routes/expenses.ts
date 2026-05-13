import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expenseController";

const router = Router();

router.post("/", createExpense);

router.get("/:id", getExpenses);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

export default router;