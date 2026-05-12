import { Router } from "express";
import {
  createExpense,
  getExpenses,
} from "../controllers/expenseController";

const router = Router();

router.post("/", createExpense);

router.get("/:householdId", getExpenses);

export default router;