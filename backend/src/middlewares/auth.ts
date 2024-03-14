import { Handler, NextFunction, Response } from "express";
import PsuError from "../utils/error";
import { verifyToken } from "../utils/token";
import Logger from "../utils/logger";

function authenticateWithAuthHeader(
    authHeader: string
) : any {
    if (!authHeader) {
        throw new PsuError(
            401,
            "Missing authentication header",
        );
    }

    const [authScheme, token] = authHeader.split( " " );

    if ( !authScheme )
        throw new PsuError( 
            401,
            "Missing authentication scheme",
        );

    if ( !token )
        throw new PsuError(
            401,
            "Missing authentication token",
        )
    
    const decodedToken = verifyToken( token );
    return decodedToken;
}


function authenticateRequest(): Handler {
    return async (
        req: PsuTypes.Request,
        _req: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            let token: PsuTypes.DecodedToken;
            const { authorization: authHeader } = req.headers;
            console.log( authHeader );
            if ( authHeader)
                token = authenticateWithAuthHeader( authHeader)
            else
                throw new PsuError(
                    401,
                    "Unauthorized",
                );
            req.ctx = {
                ...req.ctx,
                decodedToken: token
            }
            next()
        } catch (e) {
            return next(e);
        }

    }
}

export { authenticateRequest };