import "dotenv/config"
import app from "./app"
import Logger from "./utils/logger";
import { prisma } from "./utils/db";

const bootServer = (port: number) => {

    Logger.info(`Starting server version 2.0.0`);
    Logger.info(`Starting server in ${process.env["MODE"]} mode`);

    prisma.$connect().then(() => {
        Logger.success("Database connected successfully");
    }
    ).catch((err) => {
        Logger.error("Database connection failed");
        console.error(err);
    });

    return app.listen(PORT, () => {
        Logger.success(`API server listening on port ${port} `);
    })
}

const PORT = parseInt(process.env["PORT"] ?? "5005", 10);

void bootServer(PORT);