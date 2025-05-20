import { Router } from "express";
import {
    getAllRestaurants,
    getFilterRestaurants,
    getRestaurant,
    getUniqueCategories
} from "../controllers/restaurant.controller.js";




const restaurantRouter = Router();


restaurantRouter.route("/getAllRestaurants").get(getAllRestaurants);
restaurantRouter.route("/getRestaurant/:id").get(getRestaurant);
restaurantRouter.route("/getFilterRestaurants").get(getFilterRestaurants);
restaurantRouter.route("/getUniqueCategories").get(getUniqueCategories);


export default restaurantRouter;