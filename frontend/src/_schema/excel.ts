export interface Item {
    id: number,
    code: string,
    name: string,
    totalAmount: number,
    balance: number,
    status: string,
    facultyId: number,
    productId: number,
    typeId: number,
    fiscalYearId: string
}

export interface FiscalYear {
    id: string,
    name: string
}

export interface Plan {
    id: number,
    name: string
}

export interface Product {
    id: number,
    name: string,
    planId: number
}

export interface itemType  {
    id: number,
    name: string
}

export interface  Faculty { 
    id: number,
    name: string,
    userId: string
}

export interface DisbursedItem {
    id: number,
    itemcode: string,
    withdrawalAmount: number,
    psuCode: string,
    date: string,
    note?: string,
    userId: string
}
