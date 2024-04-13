import { compare, hash } from "../../utils/hash";
import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";
import { fetchUserByIdSchema, removeUserSchema, signInSchema, signUpSchema, updateUserSchema } from "../schemas/user.schema";
import { generateAccessToken } from "../../utils/token";
import PsuError from "../../utils/error";
import { Prisma } from "@prisma/client";
import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";

export const signInUser = async  ( req: PsuTypes.Request ) : Promise< PsuResponse > => {
    try {
        const { body: { username, password } } = await zParse( signInSchema, req );
        
        const user = await prisma.user.findFirstOrThrow( { where : { username } } );
        if ( compare( password, user?.password ) ) {
            const { password, ...rest } = user;
            const accessToken = generateAccessToken( { ...rest } );
            return new PsuResponse( "ok", { ...rest, accessToken } );
        }
        throw new PsuError( 404, "Incorrrect password." );
    } catch (e) {
        Logger.error( `Error from signin user ${e.message}`)
        throw e;
    }
}

export const signUpUser = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { firstName, lastName, password, username, faculties } } = await zParse(signUpSchema, req);

        const user: Prisma.UserCreateInput = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hash(password),
            faculties: {
                connect: faculties ? faculties?.map(({ id }) => ({ id })) : [],
            },
        };

        await prisma.user.create({ data: user });

        return new PsuResponse("Create user successfully.", {});
    } catch (e) {
        Logger.error( `Error from signup user ${e.message}`)
        throw e;
    }
};

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
        Logger.error( `Error from fetch user by id ${e.message}`)
        throw e; 
    }
}

export const fetchUserById = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { params:{ id } } = await zParse( fetchUserByIdSchema, req );
        
        const user = await prisma.user.findUniqueOrThrow( { where: { id: +id  },
            select: { 
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                faculties: {
                    select: {
                        id: true,
                        name: true
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
        const { params: { id } }  = await zParse( removeUserSchema, req );
        await prisma.user.delete({ where: { id: +id } } )
        
        return new PsuResponse("Delete user successfully.",  {} );

    } catch (e) {
        Logger.error( `Error from remove user ${e.message}`)
        throw e;
    }
}

export const updateUser = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: { firstName, lastName, password, username, faculties }, params: { id } } = await zParse( updateUserSchema, req );

        const updateData: Prisma.UserUpdateInput = {}
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (username) updateData.username = username;
        if (password) updateData.password = hash( password );

        updateData.faculties = faculties!.length > 0  ? { connect : faculties?.map( ( { id } )=> { return { id : +id }}) } : { set: [] }

        console.log(updateData)

        await prisma.user.update({
            data: updateData,
            where: { id: +id  }
        })
        return new PsuResponse( "Update user successfully.", { }, 204 );
    } catch (e) {
        Logger.error( `Error from update user ${e.message}`)
        throw e;
    }
}