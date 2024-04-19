import { Router } from "express";
import { authenticateRequest } from "../../middlewares/auth";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { fetchFaculties, fetchFacultiesOptions, fetchItemcodes, fetchItemcodesOpts, handleDisbursedItem, handleFaculty, handleFiscalYear, handleItem, handleItemType, handlePlan, handleProduct, } from "../controllers/table.controller";

const route = Router();

route.get(
    "/faculties",
    authenticateRequest(),
    asyncHandler( fetchFaculties )
);

route.get(
    "/fauclties/options",
    authenticateRequest(),
    asyncHandler( fetchFacultiesOptions )
)

route.get(
    "/codes",
    authenticateRequest(),
    asyncHandler( fetchItemcodes )
);

route.get(
    "/codes/:facultyId/options",
    authenticateRequest(),
    asyncHandler( fetchItemcodesOpts )
);

route.post( 
    "/items" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( handleItem )  
);

route.post( 
    "/faculties" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( handleFaculty )  
);

route.post( 
    "/itemTypes" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( handleItemType ) 
);

route.post( 
    "/plans" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( handlePlan )
);

route.post( 
    "/products" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( handleProduct )  
);

route.post( 
    "/disbursedItems" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( handleDisbursedItem )  
);

route.post( 
    "/fiscalYears" , 
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( handleFiscalYear )
);

export default route;