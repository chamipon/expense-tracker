import { Router } from "express";
import {
  createHousehold,
  deleteHousehold,
  getHouseholds,
} from "../controllers/householdController";

const router = Router();

router.post("/", createHousehold);

router.get("/:id", getHouseholds);

router.delete("/:id", deleteHousehold);

export default router;