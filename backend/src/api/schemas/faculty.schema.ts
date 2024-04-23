import { z } from "zod";

export const FacultySchema = z.object({
    body: z.object({
        id: z.number({
            invalid_type_error: "Faculty ID must be a number.",
            required_error: "Faculty ID is required."
        }),
        name: z.string({
            required_error: "Faculty name is required."
        }),
        userId: z.number().optional()
    }).array()
});