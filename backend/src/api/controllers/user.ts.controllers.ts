import { hash } from "../../utils/hash";
import { PsuResponse } from "../../utils/psu-response";
import { fetchUserByIdSchema, removeUserSchema, signInSchema, signUpSchema, updateUserSchema } from "../schemas/user.schema";
import { generateAccessToken } from "../../utils/token";
import PsuError from "../../utils/error";
import { Prisma } from "@prisma/client";
import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";
import { createUser, getAllUsers, getUserById, remvoeUserById, signIn, updateUserById } from "../services/user.services";

export const signInUser = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { username, password } } = zParse(signInSchema, req);

        const user = await signIn( username, password );
        if ( user ) {
            const { password, ...rest } = user
            const accessToken = generateAccessToken({ ...rest });
            Logger.info(`User "${username}" signed in successfully.`);
            return new PsuResponse("success", { ...rest, accessToken });
        }
        throw new PsuError(404, "User not found or incorrect password.");
    } catch (e) {
        Logger.error(`Error signing in user: ${ JSON.stringify( e )}`);
        throw e;
    }
}

export const signUpUser = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { firstName, lastName, password, username, faculties } } = zParse(signUpSchema, req);

        const user: Prisma.UserCreateInput = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hash(password),
            faculties: {
                connect: faculties ? faculties?.map(({ id }) => ({ id })) : [],
            },
        };
        await createUser( user );
        Logger.info(`User "${username}" signed up successfully.`);

        return new PsuResponse("Create user successfully.", {});
    } catch (e) {
        Logger.error(`Error signing up user: ${ JSON.stringify( e )}`);
        throw e;
    }
};

export const fetchAllUsers = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const users = await getAllUsers();
        Logger.info("All users fetched successfully.");
        return new PsuResponse("success", users);
    } catch (e) {
        Logger.error(`Error fetching all users: ${JSON.stringify( e )}`);
        throw e;
    }
}

export const fetchUserById = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { params: { id } } = zParse(fetchUserByIdSchema, req);

        const user = await getUserById( +id )

        Logger.info(`Successfully fetched user with ID: ${id}`);

        return new PsuResponse("User found.", user);
    } catch (e) {
        Logger.error( `Error fetching user: ${JSON.stringify( e )}`);
        throw e;
    }
}

export const removeUser = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { params: { id } } = zParse(removeUserSchema, req);

        const { role } = await getUserById( +id );
        if ( role === "ADMIN" ) {
            throw new PsuError(403, "Cannot delete admin user.");
        }

        await remvoeUserById( +id );

        Logger.info(`User with ID ${id} deleted successfully.`);

        return new PsuResponse("success", {});

    } catch (e) {
        Logger.error(`Error from removing user ${JSON.stringify( e )}`)
        throw e;
    }
}

export const updateUser = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { firstName, lastName, password, username, faculties }, params: { id } } = zParse(updateUserSchema, req);

        const updateData: Prisma.UserUpdateInput = {}
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (username) updateData.username = username;
        if (password) updateData.password = hash(password);

        if ( faculties )
            updateData.faculties = faculties!.length > 0 ? { connect: faculties?.map(({ id }) => { return { id: +id } }) } : { set: [] }

        await updateUserById( +id, updateData );

        Logger.info(`User with ID ${id} updated successfully.`);

        return new PsuResponse("Update user successfully.", {}, 204);
    } catch (e) {
        Logger.error(`Error from update user ${e.message}`)
        throw e;
    }
}