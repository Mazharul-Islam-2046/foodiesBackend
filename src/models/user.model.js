import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    userType: { type: String, enum: ["Client", "Business"], required: true },
    orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    restaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
