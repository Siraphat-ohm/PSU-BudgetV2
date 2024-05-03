import { Handler, NextFunction, Response } from "express";
import PsuError from "../utils/error";
import { verifyToken } from "../utils/token";
import { prisma } from "../utils/db";
import { getUserById } from "../api/services/user.services";

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
            if ( authHeader)
                token = authenticateWithAuthHeader( authHeader)
            else
                throw new PsuError(
                    401,
                    "Unauthorized",
                );
            const { id } = token;
            const user = await getUserById( id );
            if ( !user )
                throw new PsuError(
                    401,
                    "Unauthorized",
                );
           const { fiscalYearId } = user;
            req.ctx = {
                ...req.ctx,
                decodedToken: token,
                fiscalYearId: fiscalYearId ? fiscalYearId : 1,
            }
            next()
        } catch (e) {
            return next(e);
        }

    }
}

export { authenticateRequest };