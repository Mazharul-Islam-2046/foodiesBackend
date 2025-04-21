import { ApiError } from "../utils/ApiError.js";
import {Restaurant} from '../models/restaurant.model.js'


export class RestaurantServices {
    // Get Restaurant by id
    async getRestaurant(id) {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            throw new ApiError("Restaurant not found", 404);
        }
        return restaurant;
    }

    // Get all Restaurants
    async getAllRestaurants(page, limit) {
        const totalRestaurants = await Restaurant.countDocuments();

        // Validate page and limit
        if (page > Math.ceil(totalRestaurants / limit)) {
            throw new ApiError("Page not found", 404);
        }

        // Find with pagination
        const restaurants = await Restaurant.find()
            .skip((page - 1) * limit)
            .limit(limit);

        // Check if restaurants exist
        if (!restaurants.length > 0) {
            throw new ApiError("No restaurants found", 404);
        }

        // Return restaurants
        const response = {
            restaurants,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalRestaurants / limit),
            totalRestaurants
        };
        return response;
    }
}