import { number, string, z } from "zod";

const BaseItemSchema = z.object({
    id: z.number({
        invalid_type_error: "Id must be a number.",
        required_error: "Id is required."
    }),
    name: z.string({
        required_error: "Name is required."
    }),
});

export const DisbursedItemSchema = z.object({
    body: BaseItemSchema.extend({
        codeId: z.number({
            required_error: "Item codeId is required."
        }),
        withdrawalAmount: z.number({
            invalid_type_error: "Withdrawal amount must be a number.",
            required_error: "Withdrawal amount is required."
        }),
        psuCode: z.string(),
        date: z.string(),
        note: z.string().optional(),
        userId: z.string({
            invalid_type_error: "User ID must be a number."
        })
    }).array()
})

export const ItemSchema = z.object({
    body: BaseItemSchema.extend({
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
        status: z.enum(["N", "D"]),
        facultyId: z.number(),
        productId: z.number(),
        typeId: z.number(),
        fiscalYearId: z.number()
    }).array(),
});

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

export const ItemTypeSchema = z.object({
    body: BaseItemSchema.array()
});

export const PlanSchema = z.object({
    body: BaseItemSchema.array()
});

export const FiscalYearSchema = z.object({
    body: z.object({
        id: number({
            invalid_type_error: "FiscalYear ID must be a number.",
            required_error: "FiscalYear ID is required."
        }),
        year: string({
            invalid_type_error: "Year must be a string.",
            required_error: "Year is required."
        })
    }).array()
});

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