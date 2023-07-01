import { Schema, model } from "mongoose";

import { IStatus } from "../utils/interface/status.interface";

const statusSchema = new Schema<IStatus>({
  name: {
    type: String,
    required: [true, "Status name is required"],
    unique: true,
    enum: ["Active", "Inactive", "Suspended", "Leave of Absence", "Processing", "Busy"],
  },
});

const Status = model("status", statusSchema);

export default Status;
