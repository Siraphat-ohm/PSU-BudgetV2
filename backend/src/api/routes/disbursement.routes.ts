import { Router } from "express";
import { asyncHandler } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { 
    createDisbursement,
    disburseFunds, 
    fetchAllDisbursements, 
    fetchDisbursementById, 
    fetchDisbursementPages, 
    fetchHistoriesByPage, 
    removeDisbursementById, 
    updateDisbursement 
} from "../controllers/disbursement.controller";

const router = Router();

router.post(
    '/disburse',
    authenticateRequest(),
    asyncHandler( disburseFunds )
)

router.post( 
    '/',
    authenticateRequest(),
    asyncHandler(createDisbursement)
);

router.put( 
    '/:id',
    authenticateRequest(),
    asyncHandler(updateDisbursement)
);

router.get(
    "/",
    authenticateRequest(),
    asyncHandler( fetchAllDisbursements )
)

router.get(
    "/histories",
    authenticateRequest(),
    asyncHandler( fetchHistoriesByPage )
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