import { z } from "zod";

export const ItemSchema = z.object({
    body: z.object({
        id: z.number({
            invalid_type_error: "Id must be a number.",
            required_error: "Id is required."
        }),
        name: z.string({
            required_error: "Name is required."
        }),
        code: z.string({
            required_error: "Item code is required."
        }),
        totalAmount: z.number({
            invalid_type_error: "Total amount must be a number.",
            required_error: "Total amount is required."
        }),
        balance: z.number({
            invalid_type_error: "Balance must be a number.",
            required_error: "Balance is required."
        }),
        status: z.enum(["N", "D"], {
            required_error: "Status is required."
        }),
        facultyId: z.number({
            required_error: "Faculty ID is required."
        }),
        productId: z.number({
            required_error: "Product ID is required."
        }),
        typeId: z.number({
            required_error: "Type ID is required."
        }),
        fiscalYearId: z.number({
            required_error: "Fiscal Year ID is required."
        })
    }).array(),
});