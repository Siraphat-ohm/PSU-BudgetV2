import _ from "lodash";
import { prisma } from "../../utils/dbClient";
import { PsuResponse } from "../../utils/psu-response";

export const getFaculties = async( req : PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const faculties = await prisma.facs.findMany({ select: { fac: true, id: true }});
        return new PsuResponse( "ok", faculties );
    } catch ( e ) {
        throw e; 
    }
}