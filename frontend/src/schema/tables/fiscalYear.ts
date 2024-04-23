import { z } from "zod";

export const FiscalYearSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type FiscalYear = z.infer<typeof FiscalYearSchema>;