import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { createProducts, deleteProduct, fetchAllProducts } from "../controllers/product.controller";

const router = Router();

router.post( 
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler(createProducts)
)

router.get(
    '/',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( fetchAllProducts )
)

router.delete(
    '/:id',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( deleteProduct )
)

export default router;