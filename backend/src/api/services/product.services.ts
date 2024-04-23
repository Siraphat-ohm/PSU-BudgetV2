import { Prisma, Product } from "@prisma/client";
import { prisma } from "../../utils/db";


export const upsertProduct = async ( id: number, data: Prisma.ProductCreateInput ): Promise<Product> => {
    try {
        return await prisma.product.upsert({
            where: { id },
            update: data,
            create: data
        });
    } catch (e) {
        throw e;
    }
}