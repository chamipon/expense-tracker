import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
} from "../controllers/expenseController";

const router = Router();

router.post("/", createExpense);

router.get("/:id", getExpenses);

router.delete("/:id", deleteExpense);

export default router;