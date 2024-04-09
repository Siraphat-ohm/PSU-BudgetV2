import { compare, hash } from "../../utils/hash";
import validateRequest from "../../middlewares/validate";
import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";
import { IdUserSchema, signInSchema, signUpSchema, updateSchema } from "../schemas/user.schema";
import { generateAccessToken } from "../../utils/token";
import PsuError from "../../utils/error";
import { Prisma } from "@prisma/client";

export const authenticateUser = async  ( req: PsuTypes.Request ) : Promise< PsuResponse > => {
    try {
        console.log( req.body, "from user.controller.ts");
        
        const validate = await validateRequest( signInSchema, req );
        const { username, password } = validate;
        const user = await prisma.user.findFirstOrThrow( { where : { username } } );
        if ( compare( password, user?.password ) ) {
            const { password, ...rest } = user;
            const accessToken = generateAccessToken( { ...rest } );
            return new PsuResponse( "ok", { ...rest, accessToken } );
        }
        throw new PsuError( 404, "Incorrrect password." );
    } catch (e) {
        throw e;
    }
}

export const registerUser = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate = await validateRequest( signUpSchema, req );
        const { firstName, lastName, username, password, faculties } = validate;

        await prisma.user.create({
            data: {
                username,
                password: hash(password),
                firstName,
                lastName,
                faculties: {
                    connect: faculties.map( id => ( { id: parseInt(id) } ) )
                }
            }
        })
        
        return new PsuResponse( "Create user successfully.", { } )
    } catch ( e ) {
        throw e; 
    }
}

export const fetchOtherUsers = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { id } = req.ctx.decodedToken;
        const users = await prisma.user.findMany({
            select: { 
                id: true,
                firstName: true,
                lastName: true,
                faculties: {
                    select: {
                        name: true,
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

export const fetchUserById = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate = await validateRequest( IdUserSchema, req )
        const { id } = validate;
        const user = await prisma.user.findUniqueOrThrow( { where: { id: Number( id ) },
            select: { 
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                faculties: {
                    select: {
                        id: true,
                    }
                }
             },
    });
        return new PsuResponse( "foundUser", user );
    } catch (e) {
        throw e;
    }
}

export const removeUser = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const validate = await validateRequest( IdUserSchema, req );
        const { id } = validate;

        await prisma.user.delete({ where: { id: Number( id ) } } )
        
        return new PsuResponse("Delete user successfully.",  {} );

    } catch (e) {
        throw e;
    }
}

export const modifyUser = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { id } = req.params
        const validate = await validateRequest( updateSchema, req );
        const { firstName, lastName, username, password, faculties } = validate;
        
        const updateData: Partial<Prisma.UserUpdateInput> = {}
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (username) updateData.username = username;
        if (password) updateData.password = hash( password );
        if ( faculties.length > 0 ) updateData.faculties = {
            connect: faculties.map( ( id ) => ({ id: parseInt( id )}))
        }
        else updateData.faculties = { set: [] }

        await prisma.user.update({
            data: updateData,
            where: { id: Number( id ) }
        })
        return new PsuResponse( "Update user successfully.", { } );
    } catch (e) {
        throw e;
    }
}