import { z } from "zod";

export const ItemTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export type ItemType = z.infer<typeof ItemTypeSchema>;