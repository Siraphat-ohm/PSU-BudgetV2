import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { signIn, getUsers } from "../controllers/user"
import { authenticateRequest } from "../../middlewares/auth";

const route = Router();

route.post( 
    '/signIn',
    asyncHandler( signIn ),
);

route.get( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( getUsers )
);

export default route;