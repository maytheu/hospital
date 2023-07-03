import { Schema, model } from "mongoose";

import { IRole } from "../utils/interface/role.interface";

const roleSchema = new Schema<IRole>({
  name: { type: String, unique: true, required: [true, "Role is required"] },
});
roleSchema.index({ name: 1, _id: 1 });

const Role = model("role", roleSchema);

export default Role;
