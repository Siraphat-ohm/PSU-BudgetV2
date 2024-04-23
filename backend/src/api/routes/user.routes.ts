import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { 
    fetchAllUsers, 
    fetchUserById, 
    removeUser, 
    signInUser, 
    signUpUser, 
    updateUser 
} from "../controllers/user.ts.controllers";

const router = Router();

router.post('/signIn', asyncHandler(signInUser));
router.post(
    '/signUp',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(signUpUser)
);

router.get(
    '/byId/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(fetchUserById)
);

router.get( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(fetchAllUsers)
);

router.put( 
    '/:id',
    authenticateRequest(),
    asyncHandler(updateUser)
);

router.delete( 
    '/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(removeUser)
);

export default router;