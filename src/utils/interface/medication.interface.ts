import { z } from "zod";

import { IUserId } from "./user.interface";

const IMedicatonData = z.object({
  treatment: z.string({ required_error: "treatment is required" }),
  drugsAndDosage: z.string(),
  duration: z.string(),
  frequency: z.string(),
});

const IMedicaton = IMedicatonData.merge(IUserId);

type IMedicaton = z.infer<typeof IMedicaton>;

export { IMedicaton, IMedicatonData };
