import { DisItem } from "./Table";

export interface OverviewReport {
    id: number;
    code: string;
    name: string;
    faculty: string;
    plan: string;
    type: string; 
    product: string;
    totalAmount: string;
    status: string;
    count: number;
    balance: number;
}

export interface ItemcodeReport extends OverviewReport {
    disItems: DisItem[]
}
