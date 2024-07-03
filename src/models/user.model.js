import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: { type: String },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "restaurantOwner", "admin"],
      default: "customer",
    },
    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    restaurants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],
    firstOrderDiscountUsed: {
      type: Boolean,
      default: false,
    },
    personalRecommendations: [
      {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
