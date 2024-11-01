import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { MenuItem } from "../models/menuItem.model.js"


// Get menu item by id
export const getMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id)
    if (!menuItem) {
        throw new ApiError("Food item not found", 404);
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                foodItem,
                "Food item retrieved successfully"
            ));
})


// Get all menu items
export const getAllMenuItems = asyncHandler(async (req, res) => {
    const menuItems = await MenuItem.find()
    if (menuItems.length > 0) {
        throw new ApiError("No food items found", 404);
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                menuItems,
                "Food items retrieved successfully"
            ));
})


// filter menu items
export const filterMenuItems = asyncHandler(async (req, res) => {
    const { category, minPrice, maxPrice, freeDelivery, isHealthy } = req.query;

    const query = {};

    if (category) {
        query.category = category;
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) {
            query.price.$gte = minPrice;
        }
        if (maxPrice) {
            query.price.$lte = maxPrice;
        }
    }
    if (freeDelivery) {
        query.freeDelivery = freeDelivery;
    }
    if (isHealthy) {
        query.healthy = true;
    }

    const menuItems = await MenuItem.find(query);

    if (!menuItems.length > 0) {
        throw new ApiError("No food items found", 404);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                menuItems,
                "Food items retrieved successfully"
            )
        )
})


// Search menu items by name
export const searchMenuItems = asyncHandler(async (req, res) => {
    const { name } = req.query;
    const menuItems = await MenuItem.find({ name: { $regex: name, $options: 'i' } });
    if (!menuItems.length > 0) {
        throw new ApiError("No food items found", 404);
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                menuItems,
                "Food items retrieved successfully"
            )
        )
})




// Create menu item
export const createMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.create(req.body)
    if (!menuItem) {
        throw new ApiError("Failed to create menu item", 500);
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                menuItem,
                "Menu item created successfully"
            )
        )
})


// Update menu item
export const updateMenuItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Menu item id is required", 400);
    }

    // Validate that at least one field is being updated
    if (Object.keys(req.body).length === 0) {
        throw new ApiError("Please provide at least one field to update", 400);
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
    )
    if (!menuItem) {
        throw new ApiError("Menu item not found", 404);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                menuItem,
                "Menu item updated successfully"
            )
        )
})



// Delete menu item
export const deleteMenuItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Menu item id is required", 400);
    }
    const menuItem = await MenuItem.findByIdAndDelete(id)
    if (!menuItem) {
        throw new ApiError("Menu item not found", 404);
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                menuItem,
                "Menu item deleted successfully"
            )
        )
})
