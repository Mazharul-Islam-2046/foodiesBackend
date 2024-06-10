import mongoose, { Schema } from "mongoose";

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    cuisineType: { type: String, required: true },
    menu: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
