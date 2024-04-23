import { z } from "zod";

export const FacultySchema = z.object({
    id: z.number({
        invalid_type_error: "Id must be a number.",
        required_error: "Id is required."
    }),
    name: z.string({
        required_error: "Name is required."
    }),
    userId: z.number({
        invalid_type_error: "User Id must be a number.",
    }).optional(),
});

export type Faculty = z.infer<typeof FacultySchema>;