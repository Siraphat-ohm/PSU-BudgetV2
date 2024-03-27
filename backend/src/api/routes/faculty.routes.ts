import { Router } from "express";
import { authenticateRequest } from "../../middlewares/auth";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { getFaculties } from "../controllers/faculty.controller";

const route = Router();

route.get( 
    "/" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( getFaculties )  
);

export default route;