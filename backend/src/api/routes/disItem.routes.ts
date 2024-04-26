import { Router } from "express";
import { asyncHandler } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { 
    disburseFunds, 
    fetchAllDisbursements, 
    fetchDisbursementById, 
    fetchDisbursementPages, 
    removeDisbursementById, 
    updateDisbursement 
} from "../controllers/disItem.controllers";

const router = Router();

router.post( 
    '/',
    authenticateRequest(),
    asyncHandler(disburseFunds)
);

router.put( 
    '/:id',
    authenticateRequest(),
    asyncHandler(updateDisbursement)
);

router.get(
    "/histories",
    authenticateRequest(),
    asyncHandler( fetchAllDisbursements )
);

router.get(
    "/pages",
    authenticateRequest(),
    asyncHandler( fetchDisbursementPages )
);

router.get(
    "/byId/:id",
    authenticateRequest(),
    asyncHandler( fetchDisbursementById )
);

router.delete(
    "/:id",
    authenticateRequest(),
    asyncHandler( removeDisbursementById )
)

export default router;