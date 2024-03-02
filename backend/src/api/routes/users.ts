import { Router } from "express";
import { asyncHandler } from "../../middlewares/api-utils";
import { Hello } from "../controller/user"

const route = Router();

route.get( 
    '/',
    asyncHandler( Hello )
);

export default route;