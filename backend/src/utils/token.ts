import jwt from "jsonwebtoken";
import "dotenv/config";
import PsuError from "./error";
import Logger from "./logger";

const generateAccessToken = ( payload: PsuTypes.UserPayload ) => {
    return jwt.sign( payload, process.env["JWT_SECRET"]! , { expiresIn: "30d" } )
}

const verifyToken = ( token: string ) => {
    try {
        return jwt.verify( token, process.env["JWT_SECRET"]! );
    } catch (e) {
        Logger.error( e.message );
        throw new PsuError( 403, "Invalid Token" );
    }
}


export { generateAccessToken, verifyToken };