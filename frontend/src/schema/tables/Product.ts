import { z } from "zod";

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    planId: z.number()
});

export type Product = z.infer<typeof ProductSchema>;