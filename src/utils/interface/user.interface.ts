import mongoose, { Types } from "mongoose";
import { z } from "zod";

const IUserLogin = z.object({
  email: z.string().email({ message: "email is required" }),
  password: z.string().min(6, { message: "password cannot be less than size" }),
});

const ICreateNewUser = z.object({
  role: z.enum(["Admin", "Doctor", "Nurse", "Patient"]),
  fullname: z.string({ invalid_type_error: "string is required", required_error: "userId is required" }),
  dateOfBirth: z.string().datetime({ message: "must be yyyy-mm-dd format" }),
  phone: z.string().includes("+234", { message: "must include country code" }),
});

const IUserId = z.object({
  patientId: z.custom<mongoose.Schema.Types.ObjectId>(),
});

const IUserData = z.object({
  role: z.custom<mongoose.Schema.Types.ObjectId>(),
  fullname: z.string({ invalid_type_error: "string is required", required_error: "userId is required" }),
  dateOfBirth: z.string().datetime({ message: "must be yyyy-mm-dd format" }),
  phone: z.string().includes("+234", { message: "must include country code" }),
  status: z.custom<mongoose.Schema.Types.ObjectId>(),
  address: z.string(),
  healthHistory: z.custom<mongoose.Schema.Types.ObjectId>(),
  laboratoryTest: z.custom<mongoose.Schema.Types.ObjectId>(),
  vitalSigns: z.custom<mongoose.Schema.Types.ObjectId>(),
  progressNote: z.custom<mongoose.Schema.Types.ObjectId>(),
});

const IUser = IUserData.merge(IUserLogin);

type IUser = z.infer<typeof IUser>;

export { ICreateNewUser, IUser, IUserLogin, IUserId };
