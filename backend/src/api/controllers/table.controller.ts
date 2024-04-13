import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";
import { DisbursedItemSchema, FacultySchema, FiscalYearSchema, ItemSchema, ItemTypeSchema, PlanSchema, ProductSchema } from "../schemas/table.schema";
import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";

export const handleItem = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: items } = zParse( ItemSchema, req);

        await Promise.all(items.map(async (item) => await prisma.item.upsert({
            where: { id: item.id },
            create: item,
            update: item
        })));
        return new PsuResponse("Import items successfully", {});
    } catch (e) {
        Logger.error(e.message);
        throw e;
    }
}

export const handleFaculty = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {

        const { body: faculties } = await zParse( FacultySchema, req );

        await Promise.all(faculties.map(async ({ id, name, userId }) => {
            const faculty = { id, name } ;
            if (userId) faculty['userId'] = userId
            return await prisma.faculty.upsert({
                where: { id },
                create: faculty,
                update: faculty
            })
        }));

        return new PsuResponse("Import faculties successfully", {});
    } catch (e) {
        throw e;
    }
}

export const handleItemType = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {

        const { body: itemType } = await zParse( ItemTypeSchema, req );
        await Promise.all(itemType.map(async ( itemType ) => {
            await prisma.itemType.upsert({
                where: { id: itemType.id },
                create: itemType,
                update: itemType
            })
        }));
        return new PsuResponse( "Import itemtype successfully", {} );
    } catch (e) {
        throw e;
    }
}

export const handleFiscalYear = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: fiscalYears } = zParse( FiscalYearSchema , req );
        await Promise.all(fiscalYears.map(async ( fiscalYear ) => {
            await prisma.fiscalYear.upsert({
                where: { id: fiscalYear.id },
                create: fiscalYear,
                update: fiscalYear
            })
        }));
        return new PsuResponse( "Import fiscal year sucessfully", {} )
    } catch (e) {
        throw e;
    }
}

export const handlePlan = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: plans } = await zParse( PlanSchema, req );
        await Promise.all(plans.map(async ( plan ) => {
            await prisma.plan.upsert({
                where: { id: plan.id },
                create: plan,
                update: plan
            })
        }));
        return new PsuResponse( "Import plans successfully", {} )
    } catch (e) {
        Logger.error( `Error on plan importing :${e.message}`)
        throw e;
    }
}

export const handleDisbursedItem = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: DisItems  } = zParse( DisbursedItemSchema , req );
        await Promise.all(DisItems.map(async ( item ) => {
            await prisma.disbursedItem.upsert({
                where: { id: item.id },
                create: item,
                update: item
            })
        }));
        return new PsuResponse( "Import disbursed items successfully", {} )
    } catch (e) {
        throw e;
    }
}

export const handleProduct = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: products } = await zParse( ProductSchema, req );
        await Promise.all(products.map(async ( product ) => {
            await prisma.product.upsert({
                where: { id: product.id },
                create: product,
                update: product
            })
        }));
        return new PsuResponse( "ok", {} )
    } catch (e) {
        Logger.error( `Error on  importing :${e.message}`);
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