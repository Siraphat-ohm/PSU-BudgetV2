import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { editHistory, fetchHistories, fetchHistory, handleDisbured, removeDisItem } from "../controllers/budget.controller";

const route = Router();

route.post( 
    '/disbursed',
    authenticateRequest(),
    asyncHandler( handleDisbured ),
);

route.delete(
    '/disbursed/:id',
    authenticateRequest(),
    asyncHandler( removeDisItem )
);

route.get(
    '/histories',
    authenticateRequest(),
    asyncHandler( fetchHistories )
);

route.get(
    '/histories/:id',
    authenticateRequest(),
    asyncHandler( fetchHistory )
);

route.put(
    '/histories/:id',
    authenticateRequest(),
    asyncHandler( editHistory )
);



export default route