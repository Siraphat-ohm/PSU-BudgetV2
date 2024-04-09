import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { removeUser, fetchUserById, fetchOtherUsers, authenticateUser, registerUser, modifyUser } from "../controllers/user.ts.controller";
import { authenticateRequest } from "../../middlewares/auth";

const route = Router();

route.post( 
    '/signIn',
    asyncHandler( authenticateUser ),
);

route.post(
    '/signUp',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( registerUser )
)

route.put( 
    '/:id',
    authenticateRequest(),
    asyncHandler( modifyUser )
)

route.get(
    '/:id',
    asyncHandler( fetchUserById )
)

route.get( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( fetchOtherUsers )
);

route.delete( 
    '/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( removeUser )
);

export default route;