import { z } from "zod";

const IStatus = z.object({
  name: z.enum([
    "Active",
    "Inactive",
    "Suspended",
    "Leave of Absence",
    "Processing",
    "Busy",
    "Undetermined",
    "Good",
    "Fair",
    "Serious",
    "Critical",
  ]),
});

type IStatus = z.infer<typeof IStatus>; //interface

export { IStatus };
