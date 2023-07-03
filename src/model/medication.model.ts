import { Schema, Types, model } from "mongoose";

import { IMedicaton } from "../utils/interface/medication.interface";

const medicationSchema = new Schema<IMedicaton>(
  {
    patientId: { type: Types.ObjectId, ref: "user" },
    treatment: { type: String, required: [true, "treatment is required"] },
    drugsAndDosage: { type: String, required: [true, "drugsAndDosage is required"] },
    duration: { type: String, required: [true, "duration is required"] },
    frequency: { type: String, required: [true, "frequency is required"] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

medicationSchema.index({ patientId: 1 });

const Medication = model("medication", medicationSchema);

export default Medication;
