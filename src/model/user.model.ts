import { Schema, Types, model } from "mongoose";

import { IUser } from "../utils/interface/user.interface";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: [true, "Email field is required"] },
    password: { type: String, required: [true, "Password is required"] },
    dateOfBirth: { type: Date },
    fullname: { type: String, required: [true, "fullname is required"] },
    phone: { type: String, min: 10 },
    role: { type: Types.ObjectId, ref: "role" },
    status: { type: Types.ObjectId, ref: "status" },
    address: { type: String, },
    // healthHistory:{type:Types.ObjectId, ref:'history'},
    // laboratoryTest:{type:Types.ObjectId, ref:'laboratory'}
    // progressNote:{type:Types.ObjectId, ref:'progress'}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**create indexes for user collection */
userSchema.index({ email: 1 });

const User = model("user", userSchema);

// class UserClass {
//   @prop({ unique: true, required: true })
//   public email!: string;

//   @prop({ required: true })
//   public password!: string;

//   @prop()
//   public dateOfBirth?: date;

//   @prop({ required: true })
//   public fullname!: string;

//   @prop({ min: 10 })
//   public phone?: string;

//   @prop()
//   public role!: string;

//   @prop()
//   public status!: string;
// }

// const User = getModelForClass(UserClass);

export default User;
