import { RowDisItemType } from "./table-z.type";


export type HistoriesEditPage =  RowDisItemType & { code: string; balance: string; facultyId: number ; codeId: string };

export type FacultyOption =  { 
        id: number;
        name: string;
        userId: number;
}

export type ItemcodeOption = {
        id: number;
        name: string;
        balance: number;
}

export type HistoriesDisbursement = {
        id: number;
        code: string;
        withdrawalAmount: number;
        userId: number;
        date: string;
        note: string;
        psuCode: string
}

export type EditHitoryDisbursement = {
        id: number;
        code: string;
        withdrawalAmount: number;
        userId: number;
        date: string;
        note: string;
        psuCode: string;
        facultyId: number;
        balance: number;
        codeId: number;
}