import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { 
    createItems, 
    fetchItemcodes 
} from "../controllers/itemcode.controllers";

const router = Router();

router.get(
    '/:facultyId',
    authenticateRequest(),
    asyncHandler( fetchItemcodes )
);

router.post(
    '/',
    authenticateRequest(),
    asyncHandler( createItems )
)

export default router;