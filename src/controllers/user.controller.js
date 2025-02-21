import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
// import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";




const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


// @desc    Register user
// @route   POST /api/v1/users/auth/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password || !phone || !address) {
        throw new ApiError("Please provide all values", 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError("User already exists", 400);
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        address
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (createdUser) {
        return res.status(201).json(
            new ApiResponse(201, "User created successfully", createdUser)
        )
    } else {
        throw new ApiError("User not found", 400);
    }
});


// @desc    Login user
// @route   POST /api/v1/users/auth/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError("Please provide all values", 400);
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError("User not found", 400);
    }

    if (!(await user.isPasswordCorrect(password))) {
        throw new ApiError("Incorrect password", 400);
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    const loggedInUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
});



// @desc    Update user
// @route   PUT /api/v1/users/updateUser
// @access  Private

const updateUser = asyncHandler(async (req, res) => {
    const { name, email, phone, address } = req.body;
    if (!name && !email && !phone && !address) {
        throw new ApiError("Please provide at least one value", 400);
    }
    const user = await User.findById(req.user._id);
    if (user) {

        // update user
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        const updatedUser = await user.save();


        // send response
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                },
                "User updated successfully"
            )
        )
    } else {
        throw new ApiError("User not found", 400);
    }
});



// @desc    Logout user 
// @route   POST /api/v1/users/auth/logout
// @access  Private

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.refreshToken = "";
        const updatedUser = await user.save();
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                },
                "User logged out successfully"
            )
        );
    } else {
        throw new ApiError("User not found", 400);
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
})


// @desc    Get user by id
// @route   GET /api/v1/getUserById/:id
// @access  Private

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        return res
        .status(200)
        .json(
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
})



export {    
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    getAllUsers,
    getUserById
}
