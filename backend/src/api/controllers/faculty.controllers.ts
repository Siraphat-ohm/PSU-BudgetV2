import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { FacultySchema } from "../schemas/faculty.schema";

export const fetchFaculties = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        Logger.info("Fetching faculties");
        const faculties = await prisma.faculty.findMany();
        return new PsuResponse("success", faculties);
    } catch (e) {
        Logger.info(`Error on fetching faculties : ${JSON.stringify(e)}`);
        throw e;
    }
}

export const fetchFacultiesByUserId = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { id } = req.ctx.decodedToken;
        Logger.info("Fetching faculties by user id ");
        const faculties = await prisma.faculty.findMany({ where: { userId: id } });
        return new PsuResponse("success", faculties);
    } catch (e) {
        Logger.info(`Error on fetching faculties : ${JSON.stringify(e)}`);
        throw e;
    }
}

export const createFaculties = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {

        const { body: faculties } = zParse(FacultySchema, req);

        if (!faculties || faculties.length === 0) {
            throw new PsuError(400, "No faculties to import");
        }

        await prisma.faculty.createMany({
            data: faculties
        });

        Logger.info("Faculties created successfully");
        return new PsuResponse("success", {});
    } catch (e) {
        Logger.info(`Error on creating faculties : ${JSON.stringify(e)}`);
        throw e;
    }
}