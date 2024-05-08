import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { FiscalYearIdSchema, FiscalYearSchema } from "../schemas/fiscalYear.schema";

export const createFiscalYears = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: fiscalYears } = zParse( FiscalYearSchema , req );

        if ( !fiscalYears || fiscalYears.length === 0 ) {
            throw new PsuError( 400, "No fiscal years to import" );
        }

        const existingFiscalYears = await prisma.fiscalYear.findMany({ where: { 
            id: { in: fiscalYears.map( f => f.id ) }
        } });

        if ( existingFiscalYears.length > 0 ) {
            const existingIds = existingFiscalYears.map( fiscalYear => fiscalYear.id );
            throw new PsuError( 400, `Fiscal years with ids ${existingIds.join(', ')} already exist` );
        }

        await prisma.fiscalYear.createMany({ data: fiscalYears });

        Logger.info( "Import fiscal year sucessfully" );
        return new PsuResponse( "success", {} )
    } catch (e) {
        Logger.error( `Error on fiscal year importing :${JSON.stringify( e )}`);
        throw e;
    }
}

export const fetchAllFicalYears = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const fiscalYears = await prisma.fiscalYear.findMany();
        return new PsuResponse( "success", fiscalYears );
    } catch (e) {
        Logger.error( `Error on fiscal year fetching :${JSON.stringify( e )}`);
        throw e;
    }
}

export const changeFiscalYearStatus = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { params: { id } } = zParse( FiscalYearIdSchema, req );
        await prisma.fiscalYear.update({
            where: { id: +id },
            data: { isActive: true }
        });
        await prisma.fiscalYear.updateMany({
            where: { 
                NOT: { id: +id }
            },
            data: { 
                isActive: { set: false }
            }
        });
        return new PsuResponse( "success", {} );
    } catch (e) {
        Logger.error( `Error on fiscal year status change :${JSON.stringify( e )}`);
        throw e;
    }
}