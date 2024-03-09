import "dotenv/config";
import bcrypt from "bcrypt";

const SALTS = parseInt( process.env["SALTS"] ?? "10" );

export const hash = ( data: string ) => {
    return bcrypt.hashSync( data, SALTS );
}

export const compare = ( data: string, hash: string )  => {
    return bcrypt.compareSync( data, hash );
};