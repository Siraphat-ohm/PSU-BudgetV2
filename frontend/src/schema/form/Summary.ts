import { z } from "zod";

export const SummarySchema = z.object({
    facultyId: z.number(),
    status: z.string(),
    mode: z.string()
})

export type SummarySchemaType = z.infer<typeof SummarySchema>;