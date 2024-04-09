import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";
import { ItemInsertOrUpdateSchema, FacultySchema, ItemTypeAndPlanAndFiscalYearSchema, DisbursedItemSchema, ProductSchema } from "../schemas/table.schema";
import validateRequest from "../../middlewares/validate";
import { DisbursedItem, Faculty, FiscalYear, Item, ItemType, Plan, Product } from "@prisma/client";

export const handleItem  = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const validate: Item[] = await validateRequest(ItemInsertOrUpdateSchema, req);

            await Promise.all(validate.map(async ( item ) => await prisma.item.upsert({
                    where: { id: item.id },
                    create: item,
                    update: item 
                })));
        return new PsuResponse("ok", {});
    } catch (e) {
        throw e;
    }
}

export const handleFaculty = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const validate: Faculty[] = await validateRequest(FacultySchema, req);

            await Promise.all(validate.map(async ({ id, name, userId }) => {
                const faculty = { id, name } as Faculty;
                if (userId) faculty['userId'] = userId
                return await prisma.faculty.upsert({
                    where: { id },
                    create: faculty,
                    update: faculty
            })}))

        return new PsuResponse("ok", {});
    } catch (e) {
        throw e;
    }
}

export const handleItemType = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate: ItemType[] = await validateRequest( ItemTypeAndPlanAndFiscalYearSchema, req);
        await Promise.all(validate.map(async ( itemType ) => {
            await prisma.itemType.upsert({
                where: { id: itemType.id },
                create: itemType,
                update: itemType
            })
        }));
        return new PsuResponse( "ok", {} )
    } catch (e) {
        throw e;
    }
}

export const handleFiscalYear = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate: FiscalYear[] = await validateRequest( ItemTypeAndPlanAndFiscalYearSchema, req);
        await Promise.all(validate.map(async ( fiscalYear ) => {
            await prisma.fiscalYear.upsert({
                where: { id: fiscalYear.id },
                create: fiscalYear,
                update: fiscalYear
            })
        }));
        return new PsuResponse( "ok", {} )
    } catch (e) {
        throw e;
    }
}

export const handlePlan = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate: Plan[] = await validateRequest( ItemTypeAndPlanAndFiscalYearSchema, req);
        console.log( req.body );
        await Promise.all(validate.map(async ( plan ) => {
            await prisma.plan.upsert({
                where: { id: plan.id },
                create: plan,
                update: plan
            })
        }));
        return new PsuResponse( "ok", {} )
    } catch (e) {
        throw e;
    }
}

export const handleDisbursedItem = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate: DisbursedItem[] = await validateRequest( DisbursedItemSchema, req);
        await Promise.all(validate.map(async ( item ) => {
            await prisma.disbursedItem.upsert({
                where: { id: item.id },
                create: item,
                update: item
            })
        }));
        return new PsuResponse( "ok", {} )
    } catch (e) {
        throw e;
    }
}

export const handleProduct = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate: Product[] = await validateRequest( ProductSchema, req);
        await Promise.all(validate.map(async ( product ) => {
            await prisma.product.upsert({
                where: { id: product.id },
                create: product,
                update: product
            })
        }));
        return new PsuResponse( "ok", {} )
    } catch (e) {
        throw e;
    }
}

export const fetchFaculties = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const faculties = await prisma.faculty.findMany({ select: { name: true, id: true } });
        return new PsuResponse("ok", faculties);
    } catch (e) {
        throw e;
    }
}

