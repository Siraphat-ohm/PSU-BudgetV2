import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { ItemTypeSchema } from "../schemas/itemType.schema";

export const createItemTypes = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {

        const { body: itemType } = zParse(ItemTypeSchema, req);

        if ( !itemType || itemType.length === 0 ) {
            throw new PsuError(400, "No item types to import");
        }

        await prisma.itemType.createMany({
            data: itemType
        });


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