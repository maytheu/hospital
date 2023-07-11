import { z } from "zod";

import { IUserId } from "./user.interface";
import mongoose from "mongoose";

const IMedicatonData = z
  .object({
    treatment: z.string({ required_error: "treatment is required" }),
    drugsAndDosage: z.string(),
    duration: z.string(),
    frequency: z.string(),
  })
  .strict();

const IMedicatonUpdateData = z
  .object({
    treatment: z.string().optional(),
    drugsAndDosage: z.string().optional(),
    duration: z.string().optional(),
    frequency: z.string().optional(),
  })
  .strict();

const IMedicatonBy = z.object({
  conductedBy: z.custom<mongoose.Schema.Types.ObjectId>(),
});

const IMedicalEmail = z.object({ email: z.string().email() }).strict();

const IMedicaton = IMedicatonBy.merge(IUserId).merge(IMedicatonData);
const IMedicatonNewData = IMedicatonData.merge(IMedicalEmail);

type IMedicaton = z.infer<typeof IMedicaton>;
type IMedicatonNewData = z.infer<typeof IMedicatonNewData>;
type IMedicatonUpdateData = z.infer<typeof IMedicatonUpdateData>;

export { IMedicaton, IMedicatonNewData, IMedicatonUpdateData };
