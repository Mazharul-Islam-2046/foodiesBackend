import { asyncHandler } from "../utils/asyncHandler.js";
import { RestaurantServices } from "../services/restaurant.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const restaurantService = new RestaurantServices();

// Get Restaurant by id
export const getRestaurant = asyncHandler(async (req, res) => {
    console.log("id: ", req.params.id);
    const restaurant = await restaurantService.getRestaurant(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, restaurant, "Restaurant retrieved successfully"));
})





// Get all Restaurants
export const getAllRestaurants = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const restaurants = await restaurantService.getAllRestaurants(page, limit);
    return res
        .status(200)
        .json(new ApiResponse(200, restaurants, "Restaurants retrieved successfully"));
})




// Fillter Restaurants
export const filterRestaurants = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = req.body;
    const sortBy = req.query.sortBy;



    
    const restaurants = await restaurantService.filterRestaurants({filters, page, limit, sortBy});
    return res
        .status(200)
        .json(new ApiResponse(200, restaurants, "Restaurants retrieved successfully"));
})