import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Service class for handling user-related business logic
 */
class UserService {
  /**
   * Register a new user
   * param {Object} userData - User registration data
   */
  async registerUserService(userData) {
    const { email, phone } = userData;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(409, "Email already registered");
      } else {
        throw new ApiError(409, "Phone number already registered");
      }
    }

    // Create new user
    const user = await User.create(userData);

    // Return user without sensitive fields
    return await User.findById(user._id);
  }

  /**
   * Login user and generate tokens
   * param {Object} credentials - Login credentials
   */
  async loginUserService(userData) {
    const { name, email, password, phone, address, isGoogleSignIn } = userData;


    // Google sign-in
    if (isGoogleSignIn === true) {
      let user = await User.findOne({ email })
      if (!user) {
        user = await this.registerUserService({
          name,
          email,
          phone,
          address,
          password,
          isGoogleSignIn
        });
      }
      // Generate tokens
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });


    //   User Object
      const userWithoutPassword = await User.findById(user._id).select("-password").lean();

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    }


    // Password sign-in
    // Find user and explicitly include password field
    const user = await User.findOne({ email }).select("+password");
    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    if (!user || user.status === "inactive") {
      throw new ApiError(400, "Invalid credentials or account inactive");
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Get user without sensitive data
    const userWithoutPassword = await User.findById(user._id)
      .select("-password")
      .lean();

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Update user profile
   * param {string} userId - User ID
   * param {Object} updateData - Data to update
   */
  async updateUserService(userId, updateData) {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if phone is being updated and verify it's not taken
    if (updateData.phone && updateData.phone !== user.phone) {
      const phoneExists = await User.findOne({
        phone: updateData.phone,
        _id: { $ne: userId },
      });
      if (phoneExists) {
        throw new ApiError(400, "Phone number already in use");
      }
    }

    // Update user
    const updatedUser = Object.assign(user, updateData); // Merge updateData into user overwriting existing values of the same key
    
    await user.save();

    return await User.findById(userId).select("-password").lean();
  }

  /**
   * Logout user by clearing refresh token
   * param {string} userId - User ID
   */
  async logoutUserService(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    return true;
  }

  /**
   * Get all users with filters and pagination
   * param {number} page - Page number
   * param {number} limit - Items per page
   * param {Object} filters - Filter criteria
   */
  async getAllUsersService(page, limit, filters = {}) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filters)
        .select("-password -refreshToken")
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      totalPages,
    };
  }

  /**
   * Get user by ID with optional population
   * param {string} userId - User ID
   * param {Array} populateOptions - Fields to populate
   */
  async getUserByIdService(userId, populateOptions = []) {
    let query = User.findById(userId).select("-password -refreshToken");

    // Populate specified fields
    populateOptions.forEach((option) => {
      query = query.populate(option);
    });

    const user = await query.lean();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  async getUserByEmailService(email) {
    const user = await User.findOne({ email })
      .select("-password -refreshToken")
      .lean();
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  async getFavouriteFoodsService(userId) {
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user.favoriteFoods;
  }


  async updateFavouriteFoodsService(foodId, action, userId) {
    try {
    const update =
      action === 'add'
        ? { $addToSet: { favoriteFoods: foodId } }  // avoids duplicates
        : { $pull: { favoriteFoods: foodId } };     // removes if present

    const user = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true } // return updated document
    );

    if (!user) throw new ApiError(404, "User not found");

    return user.favoriteFoods;


  } catch (err) {
    throw new ApiError(500, err.message);
  }
  }
}




export const userService = new UserService();
