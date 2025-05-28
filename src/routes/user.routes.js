import { Router } from "express";
import {
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    getFavouriteFoods,
    updateFavouriteFoods
} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const userRouter = Router();


userRouter.route("/auth/register").post(registerUser);
userRouter.route("/auth/login").post(loginUser);



//secure routes
userRouter.route("/profile/updateUser").put(verifyJWT,updateUser);
userRouter.route("/auth/logout").post(verifyJWT,logoutUser);
userRouter.route("/getAllUsers").get(verifyJWT,getAllUsers);
userRouter.route("/getUserById/:id").get(verifyJWT,getUserById);
userRouter.route("/getUserByEmail/:email").get(verifyJWT,getUserByEmail);
userRouter.route("/getFavouriteFoods/:id").get(verifyJWT, getFavouriteFoods);
userRouter.route("/updateFavouriteFoodsList/:id").patch(verifyJWT, updateFavouriteFoods);

export default userRouter;



