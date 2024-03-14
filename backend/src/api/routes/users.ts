import { Router } from "express";
import { asyncHandler, checkIfUserIsAdmin } from "../../middlewares/api-utils";
import { signUp, signIn, getUsers } from "../controllers/user"
import { authenticateRequest } from "../../middlewares/auth";

const route = Router();

route.post( 
    '/signIn',
    asyncHandler( signIn ),
);

route.post(
    '/signUp',
    authenticateRequest(),
    checkIfUserIsAdmin(),
    asyncHandler( signUp )
)

route.get( 
    '/',
    authenticateRequest(),
    // checkIfUserIsAdmin(),
    asyncHandler( getUsers )
);

route.get( '/test', authenticateRequest() , ( req: PsuTypes.Request, res) => {
    res.json( {
       ...req.ctx.decodedToken 
    })
} )


export default route;