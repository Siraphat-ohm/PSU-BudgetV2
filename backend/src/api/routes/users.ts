import { Router } from "express";
import { asyncHandler } from "../../middlewares/api-utils";
import { signIn } from "../controller/user"
import validate from "../../middlewares/validate";
import { UserSchema } from "../../models/user.model";

const route = Router();

route.post( 
    '/signIn',
    asyncHandler( signIn ),
);

export default route;