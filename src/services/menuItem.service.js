import { ApiError } from "../utils/ApiError.js"
import { MenuItem } from "../models/menuItem.model.js"

export class MenuItemService {
    // Get menu item by id
    async getMenuItem(id) {
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            throw new ApiError("Food item not found", 404);
        }
        return menuItem;
    }

    // Get all menu items
    async getAllMenuItems(page, limit) {

        const totalMenuItems = await MenuItem.countDocuments();

        // Validate page and limit
        if (page > Math.ceil(totalMenuItems / limit)) {
            throw new ApiError("Page not found", 404);
        }

        // Find with pagination
        const menuItems = await MenuItem.find()
        .skip((page - 1) * limit)
        .limit(limit);

        // Check if menu items exist
        if (!menuItems.length > 0) {
            throw new ApiError("No food items found", 404);
        }

        // Return menu items
        const response = {
            menuItems,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalMenuItems / limit),
            totalMenuItems
        };
        return response;
    }

    // Filter menu items
    async filterMenuItems({page, limit, filters}) {

        console.log(filters)

        const { category, minPrice, maxPrice, freeDelivery, isHealthy } = filters;
        const query = {};

        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }
        if (freeDelivery) query.freeDelivery = freeDelivery;
        if (isHealthy) query.healthy = true;


        console.log(query);

        // Get total menu items with filters
        const totalMenuItems = await MenuItem.countDocuments(query);

        
        // Validate page and limit
        if (page > Math.ceil(totalMenuItems / limit)) {
            throw new ApiError("Page not found", 404);
        }


        // Find with pagination
        const menuItems = await MenuItem.find(query).skip((page - 1) * limit).limit(limit);

        // Check if menu items exist
        if (!menuItems.length > 0) {
            throw new ApiError("No food items found", 404);
        }

        

        const response = {
            menuItems,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalMenuItems / limit),
            totalMenuItems
        };
        return response;
    }

    // Search menu items
    async searchMenuItems(name) {
        const menuItems = await MenuItem.find({ name: { $regex: name, $options: 'i' } });
        if (!menuItems.length > 0) {
            throw new ApiError("No food items found", 404);
        }
        return menuItems;
    }

    // Create menu item
    async createMenuItem(menuItemData) {
        const menuItem = await MenuItem.create(menuItemData);
        if (!menuItem) {
            throw new ApiError("Failed to create menu item", 500);
        }
        return menuItem;
    }

    // Update menu item
    async updateMenuItem(id, updateData) {
        if (!id) {
            throw new ApiError("Menu item id is required", 400);
        }
        if (Object.keys(updateData).length === 0) {
            throw new ApiError("Please provide at least one field to update", 400);
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        if (!menuItem) {
            throw new ApiError("Menu item not found", 404);
        }
        return menuItem;
    }

    // Delete menu item
    async deleteMenuItem(id) {
        if (!id) {
            throw new ApiError("Menu item id is required", 400);
        }
        const menuItem = await MenuItem.findByIdAndDelete(id);
        if (!menuItem) {
            throw new ApiError("Menu item not found", 404);
        }
        return menuItem;
    }
} 