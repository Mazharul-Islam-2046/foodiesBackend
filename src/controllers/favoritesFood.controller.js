import asyncHandler from "express-async-handler";
import { Favorite } from "../models/favorite.model";

// Get all favorites by user id
export const getFavorites = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("User id is required", 400);
    }
    const favorites = await Favorite.find({ user: id }).populate("menuItem");
    if (!favorites.length > 0) {
        throw new ApiError("No favorites found", 404);
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            favorites, 
            "Favorites retrieved successfully"
        ));
});


// Add a favorite
export const addFavorite = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("User id is required", 400);
    }
    const favorite = await Favorite.create({ user: id, menuItem: req.body.menuItem });
    if (!favorite) {
        throw new ApiError("Failed to add favorite", 500);
    }
    return res
    .status(201)
    .json(
        new ApiResponse(
            201, 
            favorite, 
            "Favorite added successfully"
        ));
});

// Delete a favorite
export const deleteFavorite = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Favorite id is required", 400);
    }
    const favorite = await Favorite.findByIdAndDelete(id);
    if (!favorite) {
        throw new ApiError("Favorite not found", 404);
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            favorite, 
            "Favorite deleted successfully"
        ));
});


// Delete all favorites by user id
export const deleteAllFavorites = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("User id is required", 400);
    }
    const favorites = await Favorite.deleteMany({ user: id });
    if (!favorites.length > 0) {
        throw new ApiError("No favorites found", 404);
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            favorites, 
            "All favorites deleted successfully"
        ));
});
