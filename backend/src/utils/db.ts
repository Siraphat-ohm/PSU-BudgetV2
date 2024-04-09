import { PrismaClient } from "@prisma/client";
import PsuError from "./error";
import { capitalize } from "lodash";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const handleDatabaseError = async( model:any, query:any, args:any ) => {
    try {
        return await query(args);
    } catch (error: any) {
        console.log( error )
        if ( error instanceof PrismaClientValidationError ){
            const pattern = /Argument `.*?` is missing/g;
            const matches = error.stack?.match(pattern);
            if ( matches )
                throw new PsuError(  404 , `${ matches }` )
        } else if ( error.code == 'P2025' || error.code == 'P2003' ) {
            throw new PsuError( 404, `${capitalize(model).substring(0, model.length)} not found.` );
        } else if ( error.code == 'P2002' ) {
            throw new PsuError( 400 , `${capitalize(model).substring(0, model.length)} already exists.` );
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