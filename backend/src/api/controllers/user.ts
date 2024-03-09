import { NextFunction } from "express";
import validateRequest from "../../middlewares/validate";
import { prisma } from "../../utils/dbClient";
import PsuError from "../../utils/error";
import { compare } from "../../utils/hash";
import { PsuResponse } from "../../utils/psu-response";
import { generateAccessToken } from "../../utils/token";
import { UserSchema } from "../schemas/user.model";

export const signIn = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate = await validateRequest( UserSchema, req );
        const { username, password } = validate;
        const user = await prisma.users.findFirstOrThrow( { where : { username } } );
        if ( compare( password, user?.password ) ){
            const { password, ...rest  } = user;
            const accessToken = generateAccessToken( { ...rest, role: "USER" } );
            const userRes = {
                ...rest,
                accessToken,
                role: "USER" 
            }
            return new PsuResponse( "ok" , userRes )
        }
        throw new PsuError( 404, "Incorrect password.")

    } catch( e ) {
        throw e;
    }
}

export const Hello = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {

        return new PsuResponse( "test", { 
            ...req.ctx.decodedToken
        } )

    } catch( e ) {
        throw e;
    }
}

export const getUsers = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { id } = req.ctx.decodedToken;
        const users = await prisma.users.findMany({
            where : {
                id: {
                    not: {
                        equals: id
                    }
                }
            }
        });

        return new PsuResponse( "ok", users );
    } catch (e) {
        throw e; 
    }
}