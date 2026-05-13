import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  listUsers,
} from "../controllers/userController";

const router = Router();

router.get("/", listUsers);

router.post("/", createUser);

router.get("/:id", getUsers);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
