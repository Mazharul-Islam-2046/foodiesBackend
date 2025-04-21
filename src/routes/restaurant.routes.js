import { Router } from "express";
import {
    getAllRestaurants,
    getRestaurant
} from "../controllers/restaurant.controller.js";




const restaurantRouter = Router();


restaurantRouter.route("/getAllRestaurants").get(getAllRestaurants);
restaurantRouter.route("/getRestaurant/:id").get(getRestaurant);


export default restaurantRouter;