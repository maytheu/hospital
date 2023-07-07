import mongoose, { Types } from "mongoose";
import { z } from "zod";

const IUserLogin = z
  .object({
    email: z.string().email({ message: "email is required" }),
    password: z
      .string()
      .min(6, { message: "password cannot be less than size" })
      .regex(/^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/, {
        message: "password should include alphabet, number and special charcters",
      }),
  })
  .strict();

const ICreateNewUser = z
  .object({
    role: z.enum(["Admin", "Doctor", "Nurse", "Patient"]),
    fullname: z.string({ invalid_type_error: "string is required", required_error: "userId is required" }),
    dateOfBirth: z.date({ required_error: "must be yyyy-mm-dd format" }),
    phone: z.string().includes("+", { message: "must include country code" }).min(10),
    email: z.string().email({ message: "email is required" }),
  })
  .strict();

const IUserId = z.object({
  patientId: z.custom<mongoose.Schema.Types.ObjectId>(),
});

const IUserData = z.object({
  role: z.custom<mongoose.Schema.Types.ObjectId>(),
  fullname: z.string({ invalid_type_error: "string is required", required_error: "userId is required" }),
  dateOfBirth: z.date({ required_error: "must be yyyy-mm-dd format" }),
  phone: z.string().includes("+", { message: "must include country code" }),
  status: z.custom<mongoose.Schema.Types.ObjectId>(),
  address: z.string().optional(),
  // healthHistory: z.custom<mongoose.Schema.Types.ObjectId>(),
  // laboratoryTest: z.custom<mongoose.Schema.Types.ObjectId>(),
  // vitalSigns: z.custom<mongoose.Schema.Types.ObjectId>(),
  // progressNote: z.custom<mongoose.Schema.Types.ObjectId>(),
});

const IPasswordChange = z
  .object({
    oldPassword: z.string({ required_error: "oldPassword field is required" }),
    newPassword: z
      .string({ required_error: "newPassword field is required" })
      .min(6, { message: "password cannot be less than 6 characters" })
      .regex(/^(?=.*[A-Z]).{8,}/, {
        message: "password should include alphabet, number and special charcters",
      }),
  })
  .strict();

const IUpdateProfile = z
  .object({
    fullname: z.string({ invalid_type_error: "string is required", required_error: "userId is required" }).optional(),
    dateOfBirth: z.date({ required_error: "must be yyyy-mm-dd format" }).optional(),
    phone: z.string().includes("+", { message: "must include country code" }).min(10).optional(),
    address: z.string().optional(),
  })
  .strict();

const IUser = IUserData.merge(IUserLogin);

type IUser = z.infer<typeof IUser>;
type ICreateNewUser = z.infer<typeof ICreateNewUser>;
type IUserLogin = z.infer<typeof IUserLogin>;
type IPasswordChange = z.infer<typeof IPasswordChange>;
type IUpdateProfile = z.infer<typeof IUpdateProfile>;

export { ICreateNewUser, IUser, IUserLogin, IUserId, IPasswordChange, IUpdateProfile };
