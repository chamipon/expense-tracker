import { Request, Response } from "express";
import User from "../models/user";

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
		const { id } = req.params;

		const user = await User.findOne({
			id,
		}).lean();

		return res.json(user);
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
		});
	}
}
