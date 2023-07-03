import { z } from "zod";
import { IUserId } from "./user.interface";

const IProgressData = z.object({
  note: z.string(),
});

const IProgress = IProgressData.merge(IUserId);

type IProgress = z.infer<typeof IProgress>;

export { IProgress, IProgressData };
