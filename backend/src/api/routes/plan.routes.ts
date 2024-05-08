import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { createPlans, deletePlan, fetchAllPlans } from "../controllers/plan.controllers";

const router = Router();

router.post( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(createPlans)
)

router.get(
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( fetchAllPlans )
)

router.delete(
    '/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( deletePlan )
)

export default router;