import mongoose from "mongoose";
import { z } from "zod";

import { IUserId } from "./user.interface";

const ISurgeryData = z
  .object({
    name: z.string({ required_error: "name is required" }),
    procedure: z.string({ required_error: "procedure is required" }),
    email: z.string().email(),
    result: z.string().optional(),
    description: z.string().optional(),
    conductedBy:z.custom<mongoose.Schema.Types.ObjectId>().optional()
  })
  .strict();

const ISurgery = ISurgeryData.merge(IUserId);

type ISurgery = z.infer<typeof ISurgery>;
type ISurgeryData = z.infer<typeof ISurgeryData>;

export { ISurgery, ISurgeryData };
