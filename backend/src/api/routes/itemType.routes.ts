import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { createItemTypes, deleteItemType, fetchAllItemTypes } from "../controllers/itemType.controllers";

const router = Router();

router.post( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(createItemTypes)
)

router.get(
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( fetchAllItemTypes )
)

router.delete(
    '/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( deleteItemType )
)

export default router;