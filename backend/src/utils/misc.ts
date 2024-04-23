import { Prisma } from "@prisma/client";

export const isDevEnvironment = ():boolean => {
    return process.env["MODE"]  === "dev";
}

