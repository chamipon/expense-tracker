import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);

router.get("/:id", getUsers);

router.delete("/:id", deleteUser);

export default router;
