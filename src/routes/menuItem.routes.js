import { Router } from "express";
import {
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItem,
    getAllMenuItems,
    filterMenuItems,
    searchMenuItems,
    fetchCategories,
    getMenuItemsByIds,
} from "../controllers/menu.controller.js";


const menuItemRouter = Router();


menuItemRouter.route("/createMenuItem").post(createMenuItem);
menuItemRouter.route("/updateMenuItem/:id").put(updateMenuItem);
menuItemRouter.route("/deleteMenuItem/:id").delete(deleteMenuItem);
menuItemRouter.route("/getMenuItem/:id").get(getMenuItem);
menuItemRouter.route("/getAllMenuItems").get(getAllMenuItems);
menuItemRouter.route("/getFilterMenuItems").get(filterMenuItems);
menuItemRouter.route("/searchMenuItems").get(searchMenuItems);
menuItemRouter.route("/fetchCategories").get(fetchCategories);
menuItemRouter.route("/getMenuItemsByIds").get(getMenuItemsByIds);


export default menuItemRouter;
