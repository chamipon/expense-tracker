import mongoose, { Schema, Model } from "mongoose";

export interface IHousehold {
	name: string;
}

export const HouseholdSchema = new Schema<IHousehold>({
	name: {
		type: String,
		ref: "Name",
		required: true,
	},
});

const Household: Model<IHousehold> =
	mongoose.models.Household ||
	mongoose.model<IHousehold>("Household", HouseholdSchema);

export default Household;
