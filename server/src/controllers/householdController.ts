import { Request, Response } from "express";
import Household from "../models/household";

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
		const { id } = req.params;

		const household = await Household.findOne({
			id,
		}).lean();

		return res.json(household);
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
}
