import { z } from "zod";

const IRole = z.object({
  name: z.enum(["Admin", "Doctor", "Nurse", "Patient"]),
});

type IRole = z.infer<typeof IRole>;

export { IRole };
