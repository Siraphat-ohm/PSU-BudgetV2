import { z } from "zod";

export const DisItemSchema = z.object({
    id: z.string(),
    itemcode: z.string(),
    psuCode: z.string(),
    withdrawalAmount: z.number(),
    userId: z.string(),
    date: z.string(),
    note: z.string(),
});

export type DisItem = z.infer<typeof DisItemSchema>;
