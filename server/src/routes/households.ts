import { Router } from "express";
import {
  createHousehold,
  getHouseholds,
} from "../controllers/householdController";

const router = Router();

router.post("/", createHousehold);

router.get("/:householdId", getHouseholds);

export default router;