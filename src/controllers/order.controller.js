import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Place an order
export const placeOrder = asyncHandler(async (req, res) => {
    const { items, userId, restaurantId } = req.body;
    
    if (!items?.length || !userId || !restaurantId) {
        throw new ApiError("Missing required order details", 400);
    }
    const totalAmount = items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const order = await Order.create({
        items,
        user: userId,
        restaurant: restaurantId,
        totalAmount
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                order,
                "Order created successfully"
            )
        );
});

