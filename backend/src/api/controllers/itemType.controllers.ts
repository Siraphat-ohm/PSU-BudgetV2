import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { ItemTypeSchema } from "../schemas/itemType.schema";

export const createItemTypes = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {

        const { body: itemTypes } = zParse(ItemTypeSchema, req);

        if ( !itemTypes || itemTypes.length === 0 ) {
            throw new PsuError(400, "No item types to import");
        }

        const existingItemTypes = await prisma.itemType.findMany({ where: {
            id: { in: itemTypes.map(f => f.id) }
        } });

        if (existingItemTypes.length > 0) {
            const existingIds = existingItemTypes.map(itemType => itemType.id);
            throw new PsuError(400, `Item types with ids ${existingIds.join(', ')} already exist`);
        }

        await prisma.itemType.createMany({ data: itemTypes });

        Logger.info("Import itemtype successfully")
        return new PsuResponse("success", {});
    } catch (e) {
        Logger.error(`Error on itemtype importing :${JSON.stringify(e)}`)
        throw e;
    }
}

export const fetchAllItemTypes = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const itemTypes = await prisma.itemType.findMany();
        Logger.info("Fetched all item types");
        return new PsuResponse("success", itemTypes);
    } catch (e) {
        Logger.error(`Error fetching all item types: ${JSON.stringify(e)}`);
        throw e;
    }
}