import { number, z } from "zod";

export const ItemInsertOrUpdateSchema = z.object({
    id: z.number(),
    name: z.string({ required_error: "Name is required.", invalid_type_error: "Name must be a string." }),
    totalAmount: z.number({ required_error: "Total amount is required.", invalid_type_error: "Total amount must be a number." }),
    balance: z.number({ required_error: "Balance is required.", invalid_type_error: "Balance must be a number." }),
    status: z.string({ required_error: "Status is required.", invalid_type_error: "Status must be a string." }),
    facultyId: z.number({ required_error: "Faculty ID is required.", invalid_type_error: "Faculty ID must be a number." }),
    productId: z.number({ required_error: "Product ID is required.", invalid_type_error: "Product ID must be a number." }),
    typeId: z.number({ required_error: "Type ID is required.", invalid_type_error: "Type ID must be a number." }),
    fiscalYearId: z.number({ required_error: "Fiscal year ID is required.", invalid_type_error: "Fiscal year ID must be a number." })
});

export const FacultySchema = z.object({
    id: z.number(),
    name: z.string({ required_error: "Name is required.", invalid_type_error: "Name must be a string." }),
    userId: z.number().optional()
});

export const ItemTypeAndPlanAndFiscalYearSchema = z.object({
    id: z.number(),
    name: z.string({ required_error: "Name is required.", invalid_type_error: "Name must be a string." }),
});


export const DisbursedItemSchema = z.object({
    id: z.number(),
    name: z.string({ required_error: "Name is required.", invalid_type_error: "Name must be a string." }),
});

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string({ required_error: "Name is required.", invalid_type_error: "Name must be a string." }),
    planId: number({  required_error: "planId is required.", invalid_type_error: "planId must be a number."} )
});