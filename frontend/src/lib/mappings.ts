import { 
    DisItemSchema,
    FacultySchema,
    FiscalYearSchema,
    ItemcodeSchema,
    ItemTypeSchema,
    PlanSchema,
    ProductSchema,
} from "@/schema/Table"

export const IMPORT_FORM_OPTIONS = [
    { id: "1", name: "Itemcode" },
    { id: "2", name: "Faculties - คณะ" },
    { id: "3", name: "Item Types - ประเภทงบประมาณ" },
    { id: "4", name: "Products - ผลผลิต/โครงการ" },
    { id: "5", name: "Disbursed Items - รายการเบิกจ่าย"},
    { id: "6", name: "Fiscal Years - ปีงบประมาณ" },
    { id: "7", name: "Plans - แผนงาน" }
];

type EndpointMappings = {
    [key : string]: string;
}

export const IMOPORT_ENDPOINT_MAPPINGS: EndpointMappings = {
    "1": "/itemcodes",
    "2": "/faculties",
    "3": "/itemTypes",
    "4": "/products",
    "5": "/disItems",
    "6": "/fiscal-year",
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

export type ReportedMode = "N" | "O" ;

export type ReportedStatus = "N" | "D" | "A";

type ModeOption = {
    id: ReportedMode,
    name: string,
}

type StatusOption  = {
    id: ReportedStatus,
    name: string,
}
export const STATUS_OPTIONS: StatusOption[] = [
    { id: "A", name: "ทั้งหมด" },
    { id: "N", name: "เงินประจำปี" },
    { id: "D", name: "เงินกัน" },
]

export const MODE_OPTIONS: ModeOption[] = [
    { id: "N", name: "รายงานสรุป", },
    { id: "O", name: "รายงานภาพรวม", },
]

export const ENDPOINT_MODE_MAPPINGS: EndpointMappings = {
    N: "/itemcodes",
    O: "/overviews",
}
