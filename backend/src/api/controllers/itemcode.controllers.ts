import {  PsuResponse } from "../../utils/psu-response";
import { getItemcodesByFacultyId, upsertItemcode } from "../services/itemcode.services";
import Logger from "../../utils/logger"; 
import { zParse } from "../../middlewares/api-utils";
import { ItemSchema } from "../schemas/itemcode.schema";

export const fetchItemcodes = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { facultyId } = req.params;
        if (facultyId) {
            const itemcodes = await getItemcodesByFacultyId(+facultyId);
            Logger.info(`Fetched item codes for faculty with id ${facultyId}`); 
            return new PsuResponse("success", itemcodes.map(({ code, id, balance }) => ({ id, name: code, balance })));
        }
        return new PsuResponse('success', {}); 
    } catch (e) {
        Logger.error(`Error fetching itemcodes: ${ JSON.stringify( e )}`); 
        throw e;
    }
}

export const createItems = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: items } = zParse( ItemSchema, req );

        await Promise.all(items.map(async (item) => await upsertItemcode( item.id, item )));
        Logger.info("Items imported successfully"); 
        return new PsuResponse("success", {});
    } catch (e) {
        Logger.error(`Error importing items: ${JSON.stringify( e )}`);
        throw e;
    }
}