import { Request, Response } from "express";
import mongoose from "mongoose";
import Expense from "../models/expense";
import Household from "../models/household";
import { pathParamId } from "../helpers/pathParamId";

export async function createHousehold(req: Request, res: Response) {
	try {
		const household = new Household(req.body);

		await household.save();

		return res.status(201).json(household);
	} catch (error: any) {
		return res.status(400).json({
			message: error.message,
		});
	}
}

export async function getHouseholds(req: Request, res: Response) {
	try {
		const id = pathParamId(req.params.id);

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid household id" });
		}

		const household = await Household.findById(id).lean();

		if (!household) {
			return res.status(404).json({ message: "Household not found" });
		}

		return res.json(household);
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
}

export async function deleteHousehold(req: Request, res: Response) {
	try {
		const id = pathParamId(req.params.id);

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid household id" });
		}

		const household = await Household.findById(id);
		if (!household) {
			return res.status(404).json({ message: "Household not found" });
		}

		const householdObjectId = new mongoose.Types.ObjectId(id);
		const now = new Date();

		await Expense.updateMany(
			{ householdId: householdObjectId, isDeleted: false },
			{ $set: { isDeleted: true, deletedAt: now } },
		);

		await household.deleteOne();

		return res.status(204).send();
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
}
