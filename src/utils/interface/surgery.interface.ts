import mongoose from "mongoose";
import { z } from "zod";

import { IUserId } from "./user.interface";

const ISurgeryData = z.object({
  name: z.string({ required_error: "name is required" }),
  procedure: z.string({ required_error: "procedure is required" }),
  result: z.string({ required_error: "result is required" }),
});

const ISurgery = ISurgeryData.merge(IUserId)

type ISurgery = z.infer<typeof ISurgery>;

export { ISurgery };
