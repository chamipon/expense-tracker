import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);

router.get("/:id", getUsers);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
