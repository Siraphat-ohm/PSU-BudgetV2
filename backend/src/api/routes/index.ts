import { Application, Router } from "express";
import users from "./users";
import facs from "./facs";
import _ from "lodash";

const API_ROUTE_MAP = {
    "/users": users,
    "/facs" : facs
};

const BASE_ROUTES_V1 = "/api/v1";

const addApiRoutes = ( app: Application ) => {

    _.each(API_ROUTE_MAP, (router: Router, route) => {
        const apiRoute = `${BASE_ROUTES_V1}${route}`;
        app.use(apiRoute, router);
      });


}

export default addApiRoutes;