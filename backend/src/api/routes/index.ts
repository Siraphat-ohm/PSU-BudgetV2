import { Application, Router } from "express";
import _ from "lodash";
import users from "./user.routes";
import faculties from "./faculty.routes"
import itemcodes from "./itemcode.routes"
import plans from "./plan.routes";
import fiscalYears from "./fiscalYear.routes";
import itemTypes from "./itemType.routes";
import products from "./product.routes";
import disItems from "./disItem.routes"


const API_ROUTE_MAP = {
  "/users": users,
  "/faculties": faculties,
  "/itemcodes": itemcodes,
  "/plans": plans,
  "/fiscalyears": fiscalYears,
  "/itemtypes": itemTypes,
  "/products": products,
  "/disitems": disItems
};

const BASE_ROUTES_V1 = "/api/v1";

const addApiRoutes = ( app: Application ) => {

    _.each(API_ROUTE_MAP, (router: Router, route) => {
        const apiRoute = `${BASE_ROUTES_V1}${route}`;
        app.use(apiRoute, router);
      });


}

export default addApiRoutes;