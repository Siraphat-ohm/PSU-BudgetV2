import { ItemcodeSchema, } from "@/schema/tables/Itemcode";
import { ProductSchema } from "@/schema/tables/Product";
import { DisItemSchema } from "@/schema/tables/disItem";
import { FacultySchema } from "@/schema/tables/faculty";
import { FiscalYearSchema } from "@/schema/tables/fiscalYear";
import { ItemTypeSchema } from "@/schema/tables/itemType";
import { PlanSchema } from "@/schema/tables/plan";

export const IMPORT_FORM_OPTIONS = [
    { id: "1", name: "Items" },
    { id: "2", name: "Faculties" },
    { id: "3", name: "Item Types" },
    { id: "4", name: "Products" },
    { id: "5", name: "Disbursed Items" },
    { id: "6", name: "Fiscal Years" },
    { id: "7", name: "Plans" }
];

export const IMOPORT_ENDPOINT_MAPPINGS = {
    "1": "/itemcodes",
    "2": "/faculties",
    "3": "/itemTypes",
    "4": "/products",
    "5": "/disbursedItems",
    "6": "/fiscalYears",
    "7": "/plans",
}

export const HEADER_MAPPINGS = {
    "1": ItemcodeSchema,
    "2": FacultySchema,
    "3": ItemTypeSchema,
    "4": ProductSchema,
    "5": DisItemSchema,
    "6": FiscalYearSchema,
    "7": PlanSchema
}

export const MAX_FACULTIES_TO_DISPLAY = 3;

export type ReportedMode = "N" | "D" | "O";

export type ReportedStatus = "N" | "D";

type ModeOption = {
    id: ReportedMode,
    name: string,
}

type StatusOption  = {
    id: ReportedStatus,
    name: string,
}

type EndpointMappings = {
    [key in ReportedMode]: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
    { id: "N", name: "เงินประจำปี" },
    { id: "D", name: "เงินกัน" },
]

export const MODE_OPTIONS: ModeOption[] = [
    { id: "N", name: "รายเงินเงินประจำปี", },
    { id: "D", name: "รายงานเงินกัน", },
    { id: "O", name: "รายงานเงินภาพรวม", },
]

export const ENDPOINT_MODE_MAPPINGS: EndpointMappings = {
    N: "/itemcodes",
    D: "/deprivations",
    O: "/overviews",
}
