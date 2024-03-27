import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { deleteUser, getUserById, getUsers, signIn, signUp, updateUser } from "../controllers/user.ts.controller";
import { authenticateRequest } from "../../middlewares/auth";

const route = Router();

route.post( 
    '/signIn',
    asyncHandler( signIn ),
);

route.post(
    '/signUp',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( signUp )
)

route.put( 
    '/:id',
    authenticateRequest(),
    asyncHandler( updateUser )
)

route.get(
    '/:id',
    asyncHandler( getUserById )
)

route.get( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( getUsers )
);

route.delete( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( deleteUser )
);

export default route;