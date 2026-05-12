import mongoose, { Schema } from "mongoose";
import { refExistsValidator } from "../validators/refExists";
import User from "./user";

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  amountCents: number;
}

export const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: refExistsValidator(User, "userId"),
    },

    amountCents: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);