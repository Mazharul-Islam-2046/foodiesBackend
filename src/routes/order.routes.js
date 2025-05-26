import { Router } from "express";
import {
    placeOrder,
    // getAllOrders,
    // getOrderById,
    // updateOrder,
    // deleteOrder,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const orderRouter = Router();

orderRouter.route("/createOrder").post(verifyJWT, placeOrder);
// orderRouter.route("/getAllOrders").get(verifyJWT, getAllOrders);
// orderRouter.route("/getOrderById/:id").get(verifyJWT, getOrderById);
// orderRouter.route("/updateOrder/:id").put(verifyJWT, updateOrder);
// orderRouter.route("/deleteOrder/:id").delete(verifyJWT, deleteOrder);

export default orderRouter;