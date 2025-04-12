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
    dietryPreference: {
      type: String,
      enum: ["vegetarian", "nonveg", "vegan", "glutenfree", "dairyfree"],
      required: true,
      default: "veg",
    },
    spiceLevel: {
      type: String,
      enum: ["low", "mild", "medium", "spicy", "hot"],
      required: true,
      default: "low",
    },
    prepearationTime: {
      type: string,
      required: true,
      enum: ["quick", "medium", "long"],
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
