import { z } from "zod";

export const FiscalYearSchema = z.object({
    fiscalYearId: z.number(),
})

export type FiscalYearType = z.infer<typeof FiscalYearSchema>