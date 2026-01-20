import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },

    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      city: String,
      postalCode: String,
      country: String,
    },

    paymentMethod: { type: String, default: "cod" }, // "cod", "bank", etc.
    paymentStatus: { type: String, default: "Pending" }, // Pending/Verified/Failed
    orderStatus: { type: String, default: "Pending" }, // Pending/Processing/Shipped/Delivered/Cancelled
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

