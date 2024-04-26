import { Item, Prisma } from "@prisma/client";
import { prisma } from "../../utils/db";

export const getItemcodesByFacultyId = async ( facultyId: number ): Promise<Item[]> => {
    try {
        const itemcodes = await prisma.item.findMany({ where: { facultyId } });
        return itemcodes
    } catch (e) {
        throw e; 
    }
}

export const getItemcodeById = async ( id: number ): Promise<Item> => {
    try {
        const item = await prisma.item.findFirstOrThrow({ where: { id } });
        return item;
    } catch (e) {
        throw e;
    }
}

export const upsertItemcode = async ( id: number, data: Prisma.ItemUncheckedCreateInput ): Promise<Item> => {
    try {
        const item = await prisma.item.upsert({ 
            create: data,
            update: data,
            where: { id }
        });
        return item;
    } catch (e) {
        throw e;        
    }
}

export const updateItemcode = async ( where: Prisma.ItemWhereUniqueInput, data: Prisma.ItemUpdateInput ): Promise<Item> => {
    try {
        const item = await prisma.item.update({ where, data });
        return item;
    } catch (e) {
        throw e;
    }
}

export const getAllItemcodesWithAllRelation = async ( params?: Prisma.ItemFindManyArgs) => {
    try {
        const itemcodes = await prisma.item.findMany( {
            ...params,
            include: {
                disItem: true,
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
                }
            }
        });
        return itemcodes;
    } catch (e) {
        throw e;
    }
}