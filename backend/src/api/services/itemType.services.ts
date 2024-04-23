import { ItemType, Prisma } from "@prisma/client";
import { prisma } from "../../utils/db";

export const upsertItemType = async ( id: number, data: Prisma.ItemTypeCreateInput ): Promise<ItemType> => {
    try {
        return await prisma.itemType.upsert({
            where: { id },
            update: data,
            create: data
        });
    } catch (e) {
        throw e;
    }
}