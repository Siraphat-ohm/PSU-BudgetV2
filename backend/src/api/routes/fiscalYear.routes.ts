import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { changeFiscalYearStatus, createFiscalYears, fetchAllFicalYears } from "../controllers/fiscalYear.controllers";

const router = Router();

router.post( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(createFiscalYears)
);

router.get(
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(fetchAllFicalYears)
)

router.put(
    '/change-status/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(changeFiscalYearStatus)
)

export default router;