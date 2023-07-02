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

let IUser = z.object({
//   role: z.string().refine((val) => Types.ObjectId.isValid(val)),
  fullname: z.string({ invalid_type_error: "string is required", required_error: "userId is required" }),
  dateOfBirth: z.string().datetime({ message: "must be yyyy-mm-dd format" }),
  phone: z.string().includes("+234", { message: "must include country code" }),
  status: z.custom<mongoose.Types.ObjectId>(),
});

IUser = IUser.merge(IUserLogin);

type IUser = z.infer<typeof IUser>;

export { ICreateNewUser, IUser, IUserLogin };
