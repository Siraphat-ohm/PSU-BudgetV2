import { NextFunction, RequestHandler, Response } from "express";
import { PsuResponse, handlePsuResponse } from "../utils/psu-response";
import { prisma } from "../utils/db";
import PsuError from "../utils/error";
import Logger from "../utils/logger";
import { AnyZodObject, ZodError, z } from "zod";

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

const zParse = <T extends AnyZodObject>(
  schema: T,
  req: PsuTypes.Request
): z.infer<T> => {
  try {
    const validate = schema.parse(req);
    return validate
  } catch (error) {
    if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
            path: issue.path[0],
            message: issue.message,
          }));
        console.log(formattedErrors)
        throw new PsuError(400, `Validation failed: ${formattedErrors[0]?.message}`);
    }
    throw error
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
            const user = await prisma.user.findUniqueOrThrow( { where : { id } } );
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
    checkIfUserIsAdmin,
    zParse
}