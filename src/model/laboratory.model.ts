import { Schema, Types, model } from "mongoose";

import { ILaboratory } from "../utils/interface/laboratory.interface";

const labSchema = new Schema<ILaboratory>(
  {
    patient: { type: Types.ObjectId, ref: "user" },
    name: { type: String, required: [true, "name is required"] },
    description: String,
    result: String,
    conductedBy: { type: Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

labSchema.index({ patientId: 1 });

const Lab = model("laboratory", labSchema);

export default Lab;
