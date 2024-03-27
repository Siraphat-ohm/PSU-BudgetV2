import express, { urlencoded, json } from "express";
import cors from "cors";
import errorHandlingMiddleware from "./middlewares/error";
import addApiRoutes from "./api/routes";

const buildApp = () => {
    const app = express();

    app.use( json() );
    app.use( urlencoded( { extended: true }) );
    app.use( cors() );

    addApiRoutes( app );
    
    app.use( errorHandlingMiddleware );

    return app
}

export default buildApp();