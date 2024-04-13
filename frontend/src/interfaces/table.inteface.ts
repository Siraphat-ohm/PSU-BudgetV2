import { TableSchema, RowItem, RowItemCategory, RowProduct, RowPlan, RowDisItem, RowFiscalYear, RowFaculty } from "@/schemas/table.schema"
import { z } from "zod";

export type TableSchemaType = z.infer<typeof TableSchema>;

export type RowItemType = z.infer<typeof RowItem>;

export type RowItemCategoryType = z.infer<typeof RowItemCategory>;

export type RowProductType = z.infer<typeof RowProduct>;

export type RowPlanType = z.infer<typeof RowPlan>;

export type RowDisItemType = z.infer<typeof RowDisItem>;

export type RowFiscalYearType = z.infer<typeof RowFiscalYear>;

export type RowFacultyType = z.infer<typeof RowFaculty>;

export interface RowUser {
    id: number,
    firstName: string,
    lastName: string,
    username?: string,
    faculties: RowFacultyType[]
}

export interface IHeaderMappings {
    [key: string]: any
}
