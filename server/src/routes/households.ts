import { Router } from "express";
import {
  createHousehold,
  deleteHousehold,
  getHouseholds,
  updateHousehold,
} from "../controllers/householdController";

const router = Router();

router.post("/", createHousehold);

router.get("/:id", getHouseholds);

router.put("/:id", updateHousehold);

router.delete("/:id", deleteHousehold);

export default router;