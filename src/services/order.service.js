import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";



export class OrderService {

    
    // Count the total number of orders
    async countOrders() {
        return await Order.countDocuments();
    }


    // count the total number of orders for a specific user
    async countOrdersByUser(userId) {
        return await Order.countDocuments({ user: userId });
    }

    // count the total number of orders for a specific restaurant
    async countOrdersByRestaurant(restaurantId) {
        return await Order.countDocuments({ restaurant: restaurantId });
    }

    // get all orders
    async getAllOrders() {
        return await Order.find();
    }

    // get all orders for a specific user
    async getAllOrdersByUser(userId) {
        return await Order.find({ user: userId });
    }

    // get all orders for a specific restaurant
    async getAllOrdersByRestaurant(restaurantId) {
        return await Order.find({ restaurant: restaurantId });
    }

    // get a single order by id
    async getOrderById(id) {
        return await Order.findById(id);
    }

    // count the totalAmount of orders
    async getTotalAmountOfOrders() {
        return await Order.aggregate([{ $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }]);
    }

    // get the totalAmount of orders for a specific user
    async getTotalAmountOfOrdersByUser(userId) {
        return await Order.aggregate([{ $match: { user: userId }, $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }]);
    }

    // get the totalAmount of orders for a specific restaurant
    async getTotalAmountOfOrdersByRestaurant(restaurantId) {
        return await Order.aggregate([{ $match: { restaurant: restaurantId }, $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }]);
    }

    // create a new order
    async createOrder(req) {
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

        return order;
    }
}









