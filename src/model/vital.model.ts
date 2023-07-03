import { Schema, Types, model } from "mongoose";

import { IVital } from "../utils/interface/vital.interface";

const vitalSchema = new Schema<IVital>(
  {
    patientId: { type: Types.ObjectId, ref: "user" },
    name: { type: String, required: [true, "name is required"] },
    note: { type: String, required: [true, "note is required"] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

vitalSchema.index({ patientId: 1 });

const Vital = model("vital", vitalSchema);

export default Vital;
