import { z } from "zod";

import { IUserId } from "./user.interface";

const IVitalData = z.object({
  name: z.string({ required_error: "name is required" }),
  note: z.string({ required_error: "short note is required" }),
});

const IVital = IVitalData.merge(IUserId);

type IVital = z.infer<typeof IVital>;

export { IVital, IVitalData };
