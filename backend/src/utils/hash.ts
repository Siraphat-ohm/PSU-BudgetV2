import "dotenv/config";
import bcrypt from "bcryptjs";
import Logger from "./logger";

const SALTS = parseInt( process.env["SALTS"] ?? "10" );

export const hash = ( data: string ) => {
    return bcrypt.hashSync( data, SALTS );
}

export const compare = async( data: string, hash: string ): Promise<boolean>  => {

    try {
        return await bcrypt.compare( data, hash );
    } catch (e) {
        Logger.error(`Error comparing hash: ${ JSON.stringify( e )}`);
        throw e;
    }
    
};