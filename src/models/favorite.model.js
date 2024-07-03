import mongoose, { Schema } from "mongoose";

const FavoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model("Favorite", FavoriteSchema);
