import { Application, Router } from "express";
import _ from "lodash";
import users from "./user.routes";
import faculties from "./faculty.routes";

const API_ROUTE_MAP = {
  "/users": users,
  "/faculties": faculties
};

const BASE_ROUTES_V1 = "/api/v1";

const addApiRoutes = ( app: Application ) => {

    _.each(API_ROUTE_MAP, (router: Router, route) => {
        const apiRoute = `${BASE_ROUTES_V1}${route}`;
        app.use(apiRoute, router);
      });


}

export default addApiRoutes;