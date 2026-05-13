import { Request, Response } from "express";
import mongoose from "mongoose";
import Expense from "../models/expense";
import User from "../models/user";
import { pathParamId } from "../helpers/pathParamId";

export async function createUser(req: Request, res: Response) {
	try {
		const user = new User(req.body);

		await user.save();

		return res.status(201).json(user);
	} catch (error: any) {
		return res.status(400).json({
			message: error.message,
		});
	}
}

export async function getUsers(req: Request, res: Response) {
	try {
		const id = pathParamId(req.params.id);

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user id" });
		}

		const user = await User.findById(id).lean();

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.json(user);
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
}

export async function deleteUser(req: Request, res: Response) {
	try {
		const id = pathParamId(req.params.id);

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user id" });
		}

		const userObjectId = new mongoose.Types.ObjectId(id);

		const blockingExpense = await Expense.findOne({
			isDeleted: false,
			$or: [
				{ createdBy: userObjectId },
				{ "payments.userId": userObjectId },
				{ "shares.userId": userObjectId },
			],
		})
			.select("_id")
			.lean();

		if (blockingExpense) {
			return res.status(409).json({
				message:
					"User cannot be deleted while they appear on an active expense",
			});
		}

		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(204).send();
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
}
