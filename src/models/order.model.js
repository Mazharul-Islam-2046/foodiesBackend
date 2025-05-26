import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurants: [
      {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    }
  ],
    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'delivered', 'cancelled'],
      default: "Pending",
    },
    discountApplied: { type: Boolean, default: false },
    deliveryAddress: { type: String, required: true },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
