import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.model.js";

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
      totalRestaurants,
    };
    return response;
  }

  // Filter Restaurants
  async filterRestaurants({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = { createdAt: -1 },
  }) {
    try {
      const {
        searchName,
        cuisineType,
        category,
        minPrice,
        maxPrice,
        isPopular,
        isHealthy,
        rating,
        dietryPreference,
        spiceLevel,
      } = filters;

      // Build the query for Restaurant collection
      const restaurantQuery = {};

      // Direct restaurant filters
      if (searchName)
        restaurantQuery.name = { $regex: searchName, $options: "i" };
      if (cuisineType) restaurantQuery.cuisineType = cuisineType;
      if (category) restaurantQuery.categories = { $in: [category] };

      // Build menu item query for aggregation
      const menuItemQuery = {};

      // Menu item related filters
      if (isHealthy) menuItemQuery.healthy = true;
      if (dietryPreference) menuItemQuery.dietryPreference = dietryPreference;
      if (spiceLevel) menuItemQuery.spiceLevel = spiceLevel;
      if (minPrice || maxPrice) {
        menuItemQuery.price = {};
        if (minPrice) menuItemQuery.price.$gte = Number(minPrice);
        if (maxPrice) menuItemQuery.price.$lte = Number(maxPrice);
      }

      // For price and popularity filters, we need to use aggregation
      let restaurants;
      let totalFilteredRestaurants;

      // If we have menu item related filters, use aggregation
      if (Object.keys(menuItemQuery).length > 0 || isPopular || rating) {
        // First step: Match restaurants based on restaurant-specific criteria
        const aggregationPipeline = [
          { $match: restaurantQuery },
          // Lookup to get menu items
          {
            $lookup: {
              from: "menuitems",
              localField: "menu",
              foreignField: "_id",
              as: "menuItems",
            },
          },
        ];

        // Apply menu item filters if needed
        if (Object.keys(menuItemQuery).length > 0) {
          aggregationPipeline.push({
            $match: {
              menuItems: { $elemMatch: menuItemQuery },
            },
          });
        }

        // Check for popular restaurants (based on menu item popularity)
        if (isPopular) {
          aggregationPipeline.push({
            $match: {
              "menuItems.popularity": { $gte: 85 },
            },
          });
        }

        // Check for rating
        if (rating) {
          aggregationPipeline.push({
            $lookup: {
              from: "reviews",
              localField: "reviews",
              foreignField: "_id",
              as: "reviewDetails",
            },
          });
          aggregationPipeline.push({
            $addFields: {
              averageRating: { $avg: "$reviewDetails.rating" },
            },
          });
          aggregationPipeline.push({
            $match: {
              averageRating: { $gte: Number(rating) },
            },
          });
        }

        // Count total restaurants matching criteria
        const countPipeline = [...aggregationPipeline];
        countPipeline.push({ $count: "total" });
        const countResult = await Restaurant.aggregate(countPipeline);
        totalFilteredRestaurants =
          countResult.length > 0 ? countResult[0].total : 0;

        // Add sorting, pagination to the main pipeline
        if (sortBy) {
          aggregationPipeline.push({ $sort: sortBy });
        }

        aggregationPipeline.push({ $skip: (page - 1) * limit });
        aggregationPipeline.push({ $limit: limit });

        restaurants = await Restaurant.aggregate(aggregationPipeline);
      } else {
        // Simple query without menu item filters
        totalFilteredRestaurants = await Restaurant.countDocuments(
          restaurantQuery
        );
        restaurants = await Restaurant.find(restaurantQuery)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort(sortBy);
      }

      // Check if page is valid
      const totalPages = Math.ceil(totalFilteredRestaurants / limit);
      if (page > totalPages && totalFilteredRestaurants > 0) {
        throw new ApiError("Page not found", 404);
      }

      // Check if restaurants were found
      if (!restaurants || restaurants.length === 0) {
        throw new ApiError("No restaurants found", 404);
      }

      // Return restaurants with pagination info
      const response = {
        restaurants,
        currentPage: page,
        limit,
        totalPages,
        totalRestaurants: totalFilteredRestaurants,
        nextPage: undefined,
      };

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Error filtering restaurants: ${error.message}`, 500);
    }
  }


//   Get unique categories
  async getUniqueCategories() {
    const uniqueCategories = await Restaurant.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories" } },
      { $sort: { _id: 1 } },
    ]);

    const categories = uniqueCategories.map((item) => item._id);
    return categories;
  }
}
