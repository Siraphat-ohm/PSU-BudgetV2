import { NextFunction, RequestHandler, Response } from "express";
import { PsuResponse, handlePsuResponse } from "../utils/psu-response";
import { prisma } from "../utils/dbClient";
import PsuError from "../utils/error";

type AsyncHandler = ( req: PsuTypes.Request, res?: Response ) => Promise<PsuResponse>;

const asyncHandler = ( handler: AsyncHandler ): RequestHandler => {
    return async( 
        req: PsuTypes.Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const handlerData = await handler( req, res );
            return handlePsuResponse( handlerData, res );
        } catch (e) {
            next( e );
        }
    }
}

const checkIfUserIsAdmin = (): RequestHandler => {
    return async(
        req: PsuTypes.Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.ctx.decodedToken;
            const user = await prisma.users.findUniqueOrThrow( { where : { id } } );
            if ( user.role !== "ADMIN" )
               throw new PsuError( 403, "You don't have permission to do this.");
            next();
        } catch (e) {
            next( e ) ;
        }
    }
}

export {
    asyncHandler,
    checkIfUserIsAdmin
}