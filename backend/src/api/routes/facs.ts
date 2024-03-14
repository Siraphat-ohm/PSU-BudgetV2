import { Router } from "express";
import { authenticateRequest } from "../../middlewares/auth";
import { asyncHandler } from "../../middlewares/api-utils";
import { getFaculties } from "../controllers/fac";

const route = Router();

route.get( 
    "/" , 
    asyncHandler( getFaculties )  
);

export default route;