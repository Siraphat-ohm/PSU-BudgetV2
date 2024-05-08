import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { FacultyIdSchema, FacultySchema } from "../schemas/faculty.schema";

export const fetchFaculties = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        Logger.info("Fetching faculties");
        const faculties = await prisma.faculty.findMany({
            orderBy: {
                id: "asc"
            }
        });
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

        const existingFaculties = await prisma.faculty.findMany({ where: { 
            id: { in: faculties.map(f => f.id) }
        } });

        if (existingFaculties.length > 0) {
            const existingIds = existingFaculties.map(faculty => faculty.id);
            throw new PsuError(400, `Faculties with ids ${existingIds.join(', ')} already exist`);
        }

        await prisma.faculty.createMany({ data: faculties });

        Logger.info("Faculties created successfully");
        return new PsuResponse("success", {});
    } catch (e) {
        Logger.info(`Error on creating faculties : ${JSON.stringify(e)}`);
        throw e;
    }
}

export const deleteFaculty = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { params: { id } } = zParse( FacultyIdSchema, req );

        await prisma.faculty.delete({ where: { id: +id } });

        Logger.info(`Deleting faculty with id ${id}`);

        return new PsuResponse("success", {});

    } catch (e) {
        Logger.info(`Error on deleting faculties : ${JSON.stringify(e)}`);
        throw e;
    }
}