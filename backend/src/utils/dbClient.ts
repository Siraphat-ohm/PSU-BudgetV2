import { PrismaClient } from "@prisma/client";
import PsuError from "./error";

const handleDatabaseError = async( model:any, query:any, args:any ) => {
    try {
        return await query(args);
    } catch (error: any) {
        if ( error.code == 'P2025' || error.code == 'P2003' ) {
            throw new PsuError( 404, `${model} Not Found.` );
        };
        if ( error.code == 'P2002' ) {
            throw new PsuError( 400 , `${model} Already Exists.` );
        }
        throw error;
    }
}

export const prisma = (new PrismaClient()).$extends({
    query: {
        $allModels: {
            async findFirstOrThrow({ model, query, args }){
                return await handleDatabaseError( model, query, args );
            },
            async findUniqueOrThrow({ model, query, args }){
                args = { ...args }
                return await handleDatabaseError( model, query, args );
            },
            async createMany( { model, query, args }) {
                return await handleDatabaseError( model, query, args );
            },
            async create( { model, query, args }) {
                return await handleDatabaseError( model, query, args );
            },
        },
    }
});
