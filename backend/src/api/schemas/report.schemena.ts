import { z } from "zod";

export const ReportSchema = z.object({
    query: z.object({
        facultyId: z.string().default("0"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        status: z.enum(["N", "D"]).default("N").optional()
    }),
});