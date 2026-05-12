import "dotenv/config";
import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import expenseRoutes from "./routes/expenses";
import householdRoutes from "./routes/households";
import { connectDatabase } from "./db/mongoose";
import router from "./routes/index"

const app = express();
const port = 3000;

app.use(express.json());

app.use(router);

start();

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

async function start() {
	await connectDatabase();
}
