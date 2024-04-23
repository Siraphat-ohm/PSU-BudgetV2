import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { ItemTypeSchema } from "../schemas/itemType.schema";
import { upsertItemType } from "../services/itemType.services";

export const createItemTypes = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {

        const { body: itemType } = zParse( ItemTypeSchema, req );
        await Promise.all(itemType.map(async ( itemType ) => await upsertItemType( itemType.id, itemType )));
        Logger.info("Import itemtype successfully")
        return new PsuResponse( "success", {} );
    } catch (e) {
        Logger.error( `Error on itemtype importing :${JSON.stringify( e )}`)
        throw e;
    }
}