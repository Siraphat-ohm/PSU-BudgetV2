import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { fetchOtherUsers, fetchUserById, removeUser, signInUser, signUpUser, updateUser } from "../controllers/user.ts.controller";

const route = Router();

route.post( 
    '/signIn',
    asyncHandler( signInUser ),
);

route.post(
    '/signUp',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( signUpUser )
)

route.put( 
    '/:id',
    authenticateRequest(),
    asyncHandler( updateUser )
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