import { Plan, Prisma } from "@prisma/client";
import { prisma } from "../../utils/db";

export const upsertPlan = async ( id: number, data: Prisma.PlanCreateInput ): Promise<Plan> => {
    try {
        return await prisma.plan.upsert({
            where: { id },
            update: data,
            create: data
        });
    } catch (e) {
        throw e;        
    }
}