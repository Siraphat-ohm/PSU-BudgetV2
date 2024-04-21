import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import { editHistory, fetchHistories, fetchHistory, fetchHistoryPages, handleDisbured, handleSummanry, removeDisItem } from "../controllers/budget.controller";

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
    '/histories/pages',
    authenticateRequest(),
    asyncHandler( fetchHistoryPages )
)

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


route.get(
    '/summary/:facultyId',
    authenticateRequest(),
    asyncHandler( handleSummanry )
)

export default route