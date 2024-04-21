import { z } from "zod";


export const SummarySchema = z.object({
    status: z.enum([ "N", "D" ]),
    startDate: z.string(),
    endDate: z.string(),
    mode: z.string(),
    facultyId: z.number()
});

export type SummarySchemaType = z.infer<typeof SummarySchema>