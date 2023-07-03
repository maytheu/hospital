import { Schema, Types, model } from "mongoose";

import { IProgress } from "../utils/interface/progress.interface";

const progressSchema = new Schema<IProgress>(
  {
    patientId: { type: Types.ObjectId, ref: "user" },
    note: { type: String, required: [true, "note is required"] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

progressSchema.index({ patientId: 1 });

const Progress = model("progress", progressSchema);

export default Progress;
