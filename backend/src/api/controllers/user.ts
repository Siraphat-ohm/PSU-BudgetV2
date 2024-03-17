import validateRequest from "../../middlewares/validate";
import { prisma } from "../../utils/dbClient";
import PsuError from "../../utils/error";
import { compare, hash } from "../../utils/hash";
import { PsuResponse } from "../../utils/psu-response";
import { generateAccessToken } from "../../utils/token";
import { deleteUserSchema, signInSchema, signUpSchema } from "../schemas/user.schema";

export const signIn = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate = await validateRequest( signInSchema, req );
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

export const signUp = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate = await validateRequest( signUpSchema, req );
        const { firstname, lastname, username, password, faculties } = validate;

        await prisma.users.create({
            data: {
                username,
                password: hash(password),
                firstname,
                lastname,
                facs: {
                    connect: faculties.map( id => ( { id: parseInt(id) } ) )
                }
            }
        })
        
        return new PsuResponse( "Create user successfully.", { } )
    } catch ( e ) {
        throw e; 
    }
}

export const getUsers = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { id } = req.ctx.decodedToken;
        const users = await prisma.users.findMany({
            select: { 
                id: true,
                firstname: true,
                lastname: true,
                facs: {
                    select: {
                        fac: true,
                        id: true
                    }
                }
             },
            where: {
                id : {
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

export const deleteUser = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate = await validateRequest( deleteUserSchema, req );
        const { id } = validate;

        await prisma.users.delete({ where: { id: Number( id )  } })
        
        return new PsuResponse("Delete user successfully.",  {} );

    } catch (e) {
        throw e;
    }
}