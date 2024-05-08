import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { 
    createFaculties, 
    deleteFaculty, 
    fetchFaculties, 
    fetchFacultiesByUserId 
} from "../controllers/faculty.controllers";

const router = Router();

router.get(
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(fetchFaculties)
);

router.get(
    '/byUserId',
    authenticateRequest(),
    asyncHandler(fetchFacultiesByUserId)
);

router.post( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(createFaculties)
)

router.delete(
    '/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(deleteFaculty)
)

export default router;