import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { FiscalYearSchema } from "../schemas/fiscalYear.schema";
import { upsertFiscalYear } from "../services/fiscalYear.servies";

export const createFiscalYears = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: fiscalYears } = zParse( FiscalYearSchema , req );
        await Promise.all(fiscalYears.map(async ( fiscalYear ) => await upsertFiscalYear( fiscalYear.id, fiscalYear )));
        Logger.info( "Import fiscal year sucessfully" );
        return new PsuResponse( "success", {} )
    } catch (e) {
        Logger.error( `Error on fiscal year importing :${JSON.stringify( e )}`);
        throw e;
    }
}