import mongoose from "mongoose";
import { z } from "zod";

import { IUserId } from "./user.interface";

const ILaboratoryData = z
  .object({
    name: z.string({ required_error: "name is required" }),
    description: z.string().optional(),
    result: z.string().optional(),
  })
  .strict();

const ILaboratoryEmail = z
  .object({
    email: z.string().email(),
  })
  .strict();

const ILaboratoryBy = z.object({
  conductedBy: z.custom<mongoose.Schema.Types.ObjectId>(),
});

const ILaboratoryUpdateData = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    result: z.string()
  })
  .strict();

const ILaboratory = ILaboratoryData.merge(IUserId).merge(ILaboratoryData).merge(ILaboratoryBy);
const ILaboratoryNewData = ILaboratoryData.merge(ILaboratoryEmail);

type ILaboratory = z.infer<typeof ILaboratory>;
type ILaboratoryNewData = z.infer<typeof ILaboratoryNewData>;
type ILaboratoryData = z.infer<typeof ILaboratoryData>;
type ILaboratoryUpdateData = z.infer<typeof ILaboratoryUpdateData>;

export { ILaboratory, ILaboratoryData, ILaboratoryNewData, ILaboratoryUpdateData };
