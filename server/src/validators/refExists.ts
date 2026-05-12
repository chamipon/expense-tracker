import mongoose, { Model } from "mongoose";

export function refExistsValidator(
  model: Model<any>,
  fieldName: string
) {
  return {
    validator: async function (
      value: mongoose.Types.ObjectId
    ) {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return false;
      }

      const exists = await model.exists({
        _id: value,
      });

      return !!exists;
    },

    message: `${fieldName} does not reference an existing document ${model.modelName}`,
  };
}