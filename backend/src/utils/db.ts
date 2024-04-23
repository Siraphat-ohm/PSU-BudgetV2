import { Prisma, PrismaClient } from "@prisma/client";
import PsuError from "./error";
import { capitalize } from "lodash";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import Logger from "./logger";

const handleDatabaseError = async( model:any, query:any, args:any ) => {
    try {
        return await query(args);
    } catch (e: any) {
        Logger.error( e );
        if ( e instanceof PrismaClientValidationError ){
            const pattern = /Argument `.*?` is missing/g;
            const matches = e.stack?.match(pattern);
            if ( matches )
                throw new PsuError(  404 , `${ matches }` )
        } else if ( e.code == 'P2025' || e.code == 'P2003' ) {
            throw new PsuError( 404, `${capitalize(model).substring(0, model.length)} not found.` );
        } else if ( e.code == 'P2002' ) {
            throw new PsuError( 400 , `${capitalize(model).substring(0, model.length)} already exists.` );
        } 
        throw e;
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
            async update( { model, query, args }) {
                return await handleDatabaseError( model, query, args );
            },
            async updateMany( { model, query, args }) {
                return await handleDatabaseError( model, query, args );
            },
            async upsert( { model, query, args }) {
                return await handleDatabaseError( model, query, args );
            },
        },
    }
});

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export const prismaExclude = <T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) => {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;

}