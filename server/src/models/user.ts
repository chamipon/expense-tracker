import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
	name: string;
}

export const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		ref: "Name",
		required: true,
	},
});

const User: Model<IUser> =
	mongoose.models.User ||
	mongoose.model<IUser>("User", UserSchema);

export default User;
