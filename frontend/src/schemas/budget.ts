import { z } from "zod";

export const DisbursedSchema = z.object({
    facultyId: z.number(),
    codeId: z.number(),
    psuCode: z.string(),
    amount: z.string(),
    date: z.date(),
    note: z.string().optional()
})

export type DisbursedSchemaType = z.infer<typeof DisbursedSchema>;