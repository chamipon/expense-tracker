import { Request, Response } from "express";
import mongoose from "mongoose";
import Expense from "../models/expense";
import Household from "../models/household";
import { pathParamId } from "../helpers/pathParamId";

export async function listHouseholds(req: Request, res: Response) {
	try {
		const households = await Household.find().sort({ name: 1 }).lean();
		return res.json(households);
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
}

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

export async function updateHousehold(req: Request, res: Response) {
	try {
		const id = pathParamId(req.params.id);
		const body = req.body as Record<string, unknown>;

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid household id" });
		}

		if (!body || typeof body !== "object") {
			return res.status(400).json({ message: "JSON body is required" });
		}

		const keys = Object.keys(body);
		const unknown = keys.filter((k) => k !== "name");
		if (unknown.length > 0) {
			return res.status(400).json({
				message: `Unknown fields: ${unknown.join(", ")}`,
			});
		}

		if (typeof body.name !== "string" || !body.name.trim()) {
			return res.status(400).json({ message: "name is required" });
		}

		const household = await Household.findByIdAndUpdate(
			id,
			{ $set: { name: body.name.trim() } },
			{ new: true, runValidators: true },
		).lean();

		if (!household) {
			return res.status(404).json({ message: "Household not found" });
		}

		return res.json(household);
	} catch (error: any) {
		return res.status(400).json({
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
