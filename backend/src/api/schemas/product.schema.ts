import { z } from "zod";

export const ProductSchema = z.object({
    body: z.object({
        id: z.number({
            invalid_type_error: "Product ID must be a number.",
            required_error: "Product ID is required."
        }),
        name: z.string({
            required_error: "Product name is required."
        }),
        planId: z.number({
            invalid_type_error: "Plan ID must be a number.",
            required_error: "Plan ID is required."
        })
    }).array()
}); 

export const ProductIdSchema = z.object({
    params: z.object({
        id: z.string({
            invalid_type_error: "Product ID must be a number.",
            required_error: "Product ID is required."
        })
    })
});