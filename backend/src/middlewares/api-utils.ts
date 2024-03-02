import { NextFunction, RequestHandler, Response } from "express";
import { PsuResponse, handlePsuResponse } from "../utils/psu-response";

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

export {
    asyncHandler
}