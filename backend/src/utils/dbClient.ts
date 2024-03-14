import { PrismaClient } from "@prisma/client";
import PsuError from "./error";
import { capitalize } from "lodash";

const handleDatabaseError = async( model:any, query:any, args:any ) => {
    try {
        return await query(args);
    } catch (error: any) {
        console.log( error.message )
        if ( error.code == 'P2025' || error.code == 'P2003' ) {
            throw new PsuError( 404, `${capitalize(model).substring(0, model.length)} not found.` );
        };
        if ( error.code == 'P2002' ) {
            throw new PsuError( 400 , `${capitalize(model).substring(0, model.length - 1)} already exists.` );
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
