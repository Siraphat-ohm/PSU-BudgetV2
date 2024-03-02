import { prisma } from "../../utils/dbClient";
import { PsuResponse } from "../../utils/psu-response"

export const Hello = async( req: PsuTypes.Request) => {
    const data = await prisma.facs.findMany( {
       include: {
        items:true
       } 
    })
    return new PsuResponse( "test", data );
}