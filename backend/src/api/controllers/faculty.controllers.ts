import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { FacultySchema } from "../schemas/faculty.schema";
import { getAllFaculty, getFacultiesByUserId, upsertFaculty } from "../services/faculty.services";

export const fetchFaculties = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        Logger.info("Fetching faculties");
        const faculties = await getAllFaculty();
        return new PsuResponse("success", faculties);
    } catch (e) {
        Logger.info( `Error on fetching faculties : ${JSON.stringify( e )}`);
        throw e;
    }
}

export const fetchFacultiesByUserId = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { id } = req.ctx.decodedToken;
        Logger.info("Fetching faculties by user id ");
        const faculties = await getFacultiesByUserId( +id );
        return new PsuResponse("success", faculties);
    } catch (e) {
        Logger.info( `Error on fetching faculties : ${JSON.stringify( e )}`);
        throw e;
    }
}

export const createFaculties = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        
        const { body: faculties } = zParse( FacultySchema, req );

        await Promise.all(faculties.map(async ( faculty ) => await upsertFaculty( faculty.id, faculty ) ));

        Logger.info("Faculties created successfully");
        return new PsuResponse("success", {});
    } catch (e) {
        Logger.info( `Error on creating faculties : ${JSON.stringify( e )}`);
        throw e;
    }
}