import { Router } from "express";
import { asyncHandler } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { 
    ItemcodesReporting, 
    OverviewReporting 
} from "../controllers/report.controllers";

const router = Router();

router.get(
    '/itemcodes',
    authenticateRequest(),
    asyncHandler(ItemcodesReporting)
);

router.get(
    '/overview',
    authenticateRequest(),
    asyncHandler(OverviewReporting)
);

export default router;