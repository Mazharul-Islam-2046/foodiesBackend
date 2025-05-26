import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { orderService } from "../services/order.service.js";
import { ApiError } from "../utils/ApiError.js";

// Place an order
export const placeOrder = asyncHandler(async (req, res) => {
  const { items, userId, deliveryAddress } = req.body;

  if (!items?.length || !userId || !deliveryAddress) {
    throw new ApiError("Missing required order details", 400);
  }
  

  const order = await orderService.createOrder({
    items,
    user: userId,
    status: "pending",
    discountApplied: false,
    deliveryAddress,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});
