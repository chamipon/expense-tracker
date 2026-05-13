import { Router } from "express";
import {
  createHousehold,
  deleteHousehold,
  getHouseholds,
  listHouseholds,
  updateHousehold,
} from "../controllers/householdController";

const router = Router();

router.get("/", listHouseholds);

router.post("/", createHousehold);

router.get("/:id", getHouseholds);

router.put("/:id", updateHousehold);

router.delete("/:id", deleteHousehold);

export default router;