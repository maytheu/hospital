import mongoose from "mongoose";
import { z } from "zod";

import { IUserId } from "./user.interface";

const ILaboratoryData = z
  .object({
    name: z.string({ required_error: "name is required" }),
    description: z.string().optional(),
    result: z.string().optional(),
    conductedBy: z.string().optional(),
  })
  .strict();

const ILaboratory = ILaboratoryData.merge(IUserId);

type ILaboratory = z.infer<typeof ILaboratory>;

export { ILaboratory, ILaboratoryData };
