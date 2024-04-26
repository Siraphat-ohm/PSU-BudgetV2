import { Itemcode } from "@/schema/tables/Itemcode";
import { DisItem } from "@/schema/tables/disItem";

export interface IHeaderMappings {
    [key: number | string]: any
}

export interface ItemcodeReport {
    id: number;
    code: string;
    name: string;
    totalAmount: string;
    balance: string;
    faculty: string;
    type: string;
    status: string;
    product: string;
    disItems: DisItem[]
}


export interface OverviewReport extends Itemcode {
    faculty: string;
    product: string;
    plan: string;
    type: string;
}