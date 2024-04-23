import { FiscalYear, Prisma } from "@prisma/client";
import { prisma } from "../../utils/db";

export const upsertFiscalYear = async ( id: number, data: Prisma.FiscalYearCreateInput ): Promise<FiscalYear> => {
    try {
        return await prisma.fiscalYear.upsert({
            where: { id },
            update: data,
            create: data
        });
    } catch (e) {
        throw e;
    }
}