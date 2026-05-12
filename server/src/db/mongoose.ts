import 'dotenv/config';
import { requireEnv } from '../helpers/requireEnv';
import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    console.log("conntecting ot mongo")
    await mongoose.connect(requireEnv('MONGODB_URI'));

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Mongo connection error:", error);

    process.exit(1);
  }
}