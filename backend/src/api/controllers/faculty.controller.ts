import _ from "lodash";
import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";

export const getFaculties = async( req : PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const faculties = await prisma.faculty.findMany({ select: { name: true, id: true }});
        return new PsuResponse( "ok", faculties );
    } catch ( e ) {
        throw e; 
    }
}