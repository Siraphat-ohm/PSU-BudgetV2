import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { ProductSchema } from "../schemas/product.schema";

export const createProducts = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: products } = zParse( ProductSchema, req );

        if ( !products || products.length === 0 ) {
            throw new PsuError( 400, "No products to import" );
        }

        const existingProducts = await prisma.product.findMany({ where: {
            id: { in: products.map( f => f.id ) }
        } });

        if ( existingProducts.length > 0 ) {
            const existingIds = existingProducts.map( product => product.id );
            throw new PsuError( 400, `Products with ids ${existingIds.join(', ')} already exist` );
        }

        await prisma.product.createMany({ data: products });

        return new PsuResponse( "success", {} )
    } catch (e) {
        Logger.error( `Error on  importing :${JSON.stringify( e )}`);
        throw e;
    }
}

export const fetchAllProducts = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const products = await prisma.product.findMany();
        return new PsuResponse( "ok", products );
    } catch (e) {
        Logger.error( `Error fetching all products: ${JSON.stringify( e )}`);
        throw e;
    }
}