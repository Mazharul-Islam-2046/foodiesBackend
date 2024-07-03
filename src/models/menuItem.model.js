import mongoose, { Schema } from "mongoose";

const menuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String },
    imageUrl: { type: String },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    healthy: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
