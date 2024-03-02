import "dotenv/config"
import app from "./app"
import Logger from "./utils/logger";

const bootServer = (port: number) => {
    Logger.info(`Starting server version 2.0.0`);
    Logger.info(`Starting server in ${process.env["MODE"]} mode`);    

    return app.listen( PORT, () => {
       Logger.success( `API server listening on port ${ port } `);
    }) 
}

const PORT = parseInt( process.env["PORT"] ?? "5005", 10 );

void bootServer(PORT);