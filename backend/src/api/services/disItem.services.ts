import { DisbursedItem, Item, Prisma } from "@prisma/client";
import { prisma } from "../../utils/db";


export const createDisItem = async (data: Prisma.DisbursedItemUncheckedCreateInput): Promise<DisbursedItem> => {
    try {
        return await prisma.disbursedItem.create({ data });
    } catch (e) {
        throw e;
    }
}

export const updateDisItem = async (where: Prisma.DisbursedItemWhereUniqueInput, data: Prisma.DisbursedItemUpdateInput): Promise<DisbursedItem> => {
    try {
        return await prisma.disbursedItem.update({ where, data });
    } catch (e) {
        throw e;
    }
}

export const getDisItemById = async (id: number): Promise<DisbursedItem> => {
    try {
        return await prisma.disbursedItem.findFirstOrThrow({ where: { id } })
    } catch (e) {
        throw e;
    }
}

export const getDisItemByIdWithItem = async (id: number): Promise<DisbursedItem & { code: Item }> => {
    try {
        return await prisma.disbursedItem.findFirstOrThrow({
            where: { id },
            include: { code: true }
        });
    } catch (e) {
        throw e;
    }
}

export const getAllDisItem = async (params?: Prisma.DisbursedItemFindManyArgs) => {
    try {
        return await prisma.disbursedItem.findMany(params);
    } catch (e) {
        throw e;
    }
}

export const getAllDisItemWithAllRelation = async (params?: Prisma.DisbursedItemFindManyArgs) => {
    try {
        return await prisma.disbursedItem.findMany({
            ...params,
            include: {
                code: {
                    select: {
                        name: true,
                        code: true,
                        balance: true,
                        totalAmount: true,
                        faculty: {
                            select: { name: true }
                        },
                        product: {
                            select: {
                                name: true,
                                plan: {
                                    select: { name: true }
                                }
                            }
                        },
                        type: {
                            select: { name: true }
                        },
                    }
                }
            }
        });
    } catch (e) {
        throw e;
    }
}

export const countDisItem = async (params?: Prisma.DisbursedItemCountArgs): Promise<number> => {
    try {
        return await prisma.disbursedItem.count(params);
    } catch (e) {
        throw e;
    }
}

export const removeDisbursement = async (id: number): Promise<DisbursedItem> => {
    try {
        return await prisma.disbursedItem.delete({ where: { id } });
    } catch (e) {
        throw e;
    }
}