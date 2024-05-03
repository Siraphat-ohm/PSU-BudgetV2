import { z } from "zod";

export const FiscalYearSchema = z.object({
    body: z.object({
        id: z.number({
            invalid_type_error: "FiscalYear ID must be a number.",
            required_error: "FiscalYear ID is required."
        }),
        name: z.string({
            invalid_type_error: "Year must be a string.",
            required_error: "Year is required."
        })
    }).array()
});
