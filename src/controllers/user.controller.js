import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { userService } from "../services/user.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  maxAge: process.env.ACCESS_TOKEN_EXPIRY,
};

// @desc    Register user
// @route   POST /api/v1/users/auth/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, isGoogleSignIn } = req.body;
  if (!name || !email || !password || !phone) {
    throw new ApiError("Please provide all values", 400);
  }

  const createdUserWithPassword = await userService.registerUserService({
    name,
    email,
    password,
    phone,
    address,
    isGoogleSignIn,
  });

  const createdUser = await User.findById(createdUserWithPassword._id)
    .select("-password")
    .lean();

  if (createdUser) {
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  }
});

/**
 * desc    Login user
 * route   POST /api/v1/users/auth/login
 * access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    req.body.password = (function generatePassword(length = 8) {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
      return password;
    })()
  }

  const { user, accessToken, refreshToken } =
    await userService.loginUserService(req.body);

  // Update last login
  // await user.updateLastLogin();
  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            phone: user.phone,
            profileImage: user.profileImage,
          },
          accessToken,
          refreshToken,
        },
        "Login successful"
      )
    );
});

/**
 * desc    Update user
 * route   PUT /api/v1/users/profile/updateUser
 * access  Private
 */
const updateUser = asyncHandler(async (req, res) => {
  // const userId = req.user._id;
  const { name, email, password, userId } = req.body;

  // Only allow certain fields to be updated
  const allowedUpdates = {
    ...(name && { name }),
    ...(email && { email }),
    ...(password && { password }),
    ...(address && { address }),
    ...(phone && { phone }),
    ...(role && { role }),
    ...(isActive && { isActive }),
  };

  // Model validation will handle:
  // - Phone number format
  const updatedUser = await userService.updateUserService(
    userId,
    allowedUpdates
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// @desc    Logout user
// @route   POST /api/v1/users/auth/logout
// @access  Private

const logoutUser = asyncHandler(async (req, res) => {
  const isLoggedOut = await userService.logoutUserService(req.user._id);

  if (isLoggedOut) {
    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json(new ApiResponse(200, null, "Logged out successfully"));
  }
});

// @desc    Get all users
// @route   GET /api/v1/users/getAllUsers
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    returnres.status(200).json(users);
  } else {
    throw new ApiError("Users not found", 400);
  }
});

// @desc    Get user by id
// @route   GET /api/v1/users/getUserById/:id
// @access  Private

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
        "User found successfully"
      )
    );
  } else {
    throw new ApiError("User not found", 400);
  }
});



/*
 * desc    Get user by email
 * route   GET /api/v1/users/getUserByEmail/:email
 * access  Private
 */

const getUserByEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (user) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
        "User found successfully"
      )
    );
  } else {
    throw new ApiError("User not found", 400);
  }
});


const getFavouriteFoods = asyncHandler(async (req, res) => {
  const favouriteFoods = await userService.getFavouriteFoodsService(req.params.id);
  console.log(req.params.id)

  return res
    .status(200)
    .json(new ApiResponse(200, favouriteFoods, "Favourite Foods retrieved successfully"));
});

const updateFavouriteFoods = asyncHandler(async (req, res) => {
  const { foodId, action } = req.body;
  const userId = req.params.id;

  if (!foodId || !['add', 'remove'].includes(action)) {
    return res.status(400).json({ error: 'Invalid request' });
  }


  const updatedFavouriteFoods = await userService.updateFavouriteFoodsService(
    foodId,
    action,
    userId
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFavouriteFoods, "Favourite Foods List got updated successfully"));
});

export {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getFavouriteFoods,
  updateFavouriteFoods
};
