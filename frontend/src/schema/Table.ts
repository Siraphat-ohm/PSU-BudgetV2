import { z } from "zod";

export const DisItemSchema = z.object({
    id: z.number(),
    codeId: z.number(),
    psuCode: z.string(),
    withdrawalAmount: z.number(),
    userId: z.number(),
    date: z.string(),
    note: z.string(),
});

export type DisItem = z.infer<typeof DisItemSchema>;

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    planId: z.number()
});

export type Product = z.infer<typeof ProductSchema>;
export const PlanSchema = z.object({
    id: z.number({
        invalid_type_error: "Id must be a number.",
        required_error: "Id is required."
    }),
    name: z.string({
            required_error: "Name is required."
        }),
});

export type Plan = z.infer<typeof PlanSchema>;

export const ItemTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export type ItemType = z.infer<typeof ItemTypeSchema>;


export const ItemcodeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  totalAmount: z.number(),
  balance: z.number(),
  status: z.enum(["N", "D"]),
  facultyId: z.number(),
  productId: z.number(),
  typeId: z.number(),
  fiscalYearId: z.number(),
});

export type Itemcode = z.infer<typeof ItemcodeSchema>;

export const FiscalYearSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type FiscalYear = z.infer<typeof FiscalYearSchema>;

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