import { z } from "zod";

export const ItemcodeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  totalAmount: z.number(),
  balance: z.number(),
  status: z.enum(["N", "D"]),
  facultyId: z.number(),
  productId: z.number(),
  typeId: z.number(),
  fiscalYearId: z.number(),
});

export type Itemcode = z.infer<typeof ItemcodeSchema>;