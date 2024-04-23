import { z } from "zod";

export const PlanSchema = z.object({
    id: z.string({
        invalid_type_error: "Id must be a number.",
        required_error: "Id is required."
    }),
    name: z.string({
            required_error: "Name is required."
        }),
});

export type Plan = z.infer<typeof PlanSchema>;