import express, { urlencoded, json } from "express";
import cors from "cors";
import errorHandlingMiddleware from "./middlewares/error";
import addApiRoutes from "./api/routes";
import helmet from "helmet";
import { limiter } from "./middlewares/api-utils";

const buildApp = () => {
    const app = express();

    app.use( json() );
    app.use( urlencoded( { extended: true }) );
    app.use( cors(
        {
            origin: "*",
            methods: "GET,POST,PUT,DELETE",
            allowedHeaders: "Content-Type, Authorization",
        }
    ));

    app.use( helmet(
        {
            contentSecurityPolicy: false,
        }
    ));

    app.use( limiter );

    addApiRoutes( app );

    app.get( "/", ( req, res ) => { 
        
        res.json( { message: "Welcome to the API" } );
    })
    
    app.use( errorHandlingMiddleware );

    return app
}

export default buildApp();
