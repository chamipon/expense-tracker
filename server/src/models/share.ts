import mongoose, { Schema, Document, Model } from "mongoose";
import { refExistsValidator } from "../validators/refExists";
import User from "./user";

export interface IShare {
  userId: mongoose.Types.ObjectId;

  // What this user should owe for the expense
  owedCents: number;

  // What this user actually paid toward the expense
  paidCents: number;

  // paid - owed
  // Positive = others owe them
  // Negative = they owe others
  netCents: number;
}

export const ShareSchema = new Schema<IShare>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: refExistsValidator(User, "userId"),
    },

    owedCents: {
      type: Number,
      required: true,
      min: 0,
    },

    paidCents: {
      type: Number,
      required: true,
      min: 0,
    },

    netCents: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);