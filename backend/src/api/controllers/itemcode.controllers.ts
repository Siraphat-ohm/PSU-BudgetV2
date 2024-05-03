import { PsuResponse } from "../../utils/psu-response";
import Logger from "../../utils/logger";
import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import { ItemcodeCreateManySchemea } from "../schemas/itemcode.schema";

export const fetchItemcodes = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { facultyId } = req.params;
        const { fiscalYearId } = req.ctx;
        if (facultyId) {
            const itemcodes = await prisma.itemCode.findMany({
                where: {
                    facultyId: +facultyId,
                    fiscalYearId: fiscalYearId,
                },
                select: {
                    code: true,
                    id: true,
                    balance: true,
                },
            });
            Logger.info(`Fetched item codes for faculty with id ${facultyId}`);
            return new PsuResponse("success", itemcodes.map(({ code, id, balance }) => ({ id, name: code, balance })));
        }
        return new PsuResponse('success', {});
    } catch (e) {
        Logger.error(`Error fetching itemcodes: ${JSON.stringify(e)}`);
        throw e;
    }
}

export const createItems = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: items } = zParse( ItemcodeCreateManySchemea, req);

        if ( !items || items.length === 0 ) {
            throw new PsuError(400, "No items to import");
       }

       await prisma.itemCode.createMany({
        data: items,
       })
        Logger.info("Items imported successfully");
        return new PsuResponse("success", {});
    } catch (e) {
        Logger.error(`Error importing items: ${JSON.stringify(e)}`);
        throw e;
    }
}

export const fetchAllItems = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const items = await prisma.itemCode.findMany();
        Logger.info("Fetched all items");
        return new PsuResponse("success", items);
    } catch (e) {
        Logger.error(`Error fetching all items: ${JSON.stringify(e)}`);
        throw e;
    }
}