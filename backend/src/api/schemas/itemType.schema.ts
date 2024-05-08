import { z } from "zod";

export const ItemTypeSchema = z.object({
    body: z.object({
        id: z.number({
            invalid_type_error: "Id must be a number.",
            required_error: "Id is required."
        }),
        name: z.string({
            required_error: "Name is required."
        }),
    }).array()
});

export const ItemTypeIdSchema = z.object({
    params: z.object({
        id: z.string({
            invalid_type_error: "Id must be a number.",
            required_error: "Id is required."
        })
    })
});