import { Schema, Types, model } from "mongoose";

import { ISurgery } from "../utils/interface/surgery.interface";

const surgerySchema = new Schema<ISurgery>(
  {
    patientId: { type: Types.ObjectId, ref: "user" },
    name: { type: String, required: [true, "Name is required"] },
    procedure: { type: String, required: [true, "procedure is required"] },
    result: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

surgerySchema.index({ patientId: 1 });

const Surgery = model("surgery", surgerySchema);

export default Surgery;
