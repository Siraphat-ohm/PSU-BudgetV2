import { Response, NextFunction } from "express";
import { PsuResponse, handlePsuResponse } from "../utils/psu-response"
import PsuError from "../utils/error";
import Logger from "../utils/logger";


const errorHandlingMiddleware = ( error: Error, req: PsuTypes.Request, res: Response, _next: NextFunction) => {
    try {
        const psuResponse = new PsuResponse();
        psuResponse.status = 500;

        Logger.error( error.message );

        if ( /ECONNREFUSED.*5431/i.test(error.message)) {
            psuResponse.status = 503;
            psuResponse.message = "Could not connect the database. It may be down.";
        } else if ( error instanceof URIError || error instanceof SyntaxError ) {
            psuResponse.status = 400;
            psuResponse.message = "Unprocessable request";    
        } else if ( error instanceof PsuError ) {
            psuResponse.message = error.message;
            psuResponse.status = error.status;
        } else {
            psuResponse.message = "Internal Sever Error";
        }

        return handlePsuResponse( psuResponse, res );

    } catch(e) {
        Logger.error("Error handling middleware failed.");
        Logger.error(e);
    }
    return handlePsuResponse(
        new PsuResponse(
          "Something went really wrong, please contact support.",
          undefined,
          500
        ),
        res
      );
}

export default errorHandlingMiddleware;