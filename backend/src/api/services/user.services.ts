import { Prisma, User } from "@prisma/client";
import { prisma, prismaExclude } from "../../utils/db";
import { compare } from "../../utils/hash";

export const createUser = async ( data: Prisma.UserCreateInput ): Promise<Partial<User>> => {
    try {
        const user = await prisma.user.create({ data }) 
        return user;
    } catch (e) {
       throw e; 
    }
}

export const getUserById = async ( id: number ): Promise<Partial<User>> => {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id },
            select: {
                ...prismaExclude( 'User', ['password'] ),
                faculties: true
            }
        });

        return user;
    } catch (e) {
        throw e;
    }
}

export const getAllUsers = async() => {
    try {
        const users = await prisma.user.findMany({
            select: {
                ...prismaExclude( 'User', ['password'] ),
                faculties: true
            }
        });

        return users;
    } catch (e) {
        throw e;
    }
}

export const remvoeUserById = async ( id: number )=> {
    try {
        await prisma.user.delete({ where: { id }});
    } catch (e) {
        throw e;
    }
}

export const updateUserById = async ( id: number, data: Prisma.UserUncheckedUpdateInput ): Promise<Partial<User>> => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data
        });

        return user;
    } catch (e) {
        console.error(id, e);
        throw e;
    }

}

export const signIn = async (username: string, password: string): Promise<User| null> => {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { username },
        });

        if (!user) {
            return null;
        }

        const passwordMatch = compare(password, user.password);

        if (!passwordMatch) {
            return null;
        }

        return user;
    } catch (e) {
        throw e;
    }
}
