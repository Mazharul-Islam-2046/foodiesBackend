import { asyncHandler } from "../utils/asyncHandler.js"
import { MenuItemService } from "../services/menuItem.service.js"

const menuItemService = new MenuItemService();

// Get menu item by id
export const getMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await menuItemService.getMenuItem(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, menuItem, "Food item retrieved successfully"));
})

// Get all menu items
export const getAllMenuItems = asyncHandler(async (req, res) => {
    const menuItems = await menuItemService.getAllMenuItems();
    return res
        .status(200)
        .json(new ApiResponse(200, menuItems, "Food items retrieved successfully"));
})

// Filter menu items
export const filterMenuItems = asyncHandler(async (req, res) => {
    const menuItems = await menuItemService.filterMenuItems(req.query);
    return res
        .status(200)
        .json(new ApiResponse(200, menuItems, "Food items retrieved successfully"));
})

// Search menu items
export const searchMenuItems = asyncHandler(async (req, res) => {
    const menuItems = await menuItemService.searchMenuItems(req.query.name);
    return res
        .status(200)
        .json(new ApiResponse(200, menuItems, "Food items retrieved successfully"));
})

// Create menu item
export const createMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await menuItemService.createMenuItem(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, menuItem, "Menu item created successfully"));
})

// Update menu item
export const updateMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await menuItemService.updateMenuItem(req.params.id, req.body);
    return res
        .status(200)
        .json(new ApiResponse(200, menuItem, "Menu item updated successfully"));
})

// Delete menu item
export const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await menuItemService.deleteMenuItem(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, menuItem, "Menu item deleted successfully"));
})
