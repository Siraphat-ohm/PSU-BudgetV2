import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { ProductSchema } from "../schemas/product.schema";
import { upsertProduct } from "../services/product.services";

export const createProducts = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: products } = zParse( ProductSchema, req );
        await Promise.all(products.map(async ( product ) => await upsertProduct( product.id, product )));
        return new PsuResponse( "ok", {} )
    } catch (e) {
        Logger.error( `Error on  importing :${JSON.stringify( e )}`);
        throw e;
    }
}