import { Application, Response, Router, NextFunction } from "express";
import users from "./users";

const API_ROUTE_MAP = {
    '/users': users
};

const BASE_ROUTES_V1 = "/api/v1";

const addApiRoutes = ( app: Application ) => {

    const router = Router();

    Object.keys( API_ROUTE_MAP ).forEach( key => {
        const apiRoute = `${BASE_ROUTES_V1}${key}`
        app.use( apiRoute, API_ROUTE_MAP[key] );
    });

}

export default addApiRoutes;