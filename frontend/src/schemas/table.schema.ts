// table.schema.ts
import { z } from "zod";

export const TableSchema = z.object({
    table: z.enum( [ "1", "2", "3", "4", "5", "6", "7" ] )
});

const BaseItemSchema = z.object({
    id: z.number(),
    name: z.string()
});

export const RowItem = BaseItemSchema.merge(z.object({
    code: z.string(),
    totalAmount: z.number(),
    balance: z.number(),
    status: z.string(),
    facultyId: z.number(),
    productId: z.number(),
    typeId: z.number(),
    fiscalYearId: z.number()
}));

export const RowItemCategory = BaseItemSchema;

export const RowProduct = BaseItemSchema.merge(z.object({
    planId: z.number().optional()
}));

export const RowPlan = BaseItemSchema;

export const RowDisItem = z.object({
    id: z.number(),
    itemcode: z.string(),
    withdrawalAmount: z.number(),
    psuCode: z.string(),
    date: z.string(),
    note: z.string().optional(),
    userId: z.number()
});

export const RowFiscalYear = z.object({
    id: z.number(),
    year: z.string()
});

export const RowFaculty = BaseItemSchema.merge(z.object({
    userId: z.number().optional()
}));