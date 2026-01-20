// backend/src/routes/orderRoutes.js
import express from "express";
import Order from "../../models/order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";


const router = express.Router();

/** Create order (logged-in user) */
router.post("/", protect, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;

    if (!items?.length || !total) {
      return res.status(400).json({ message: "Order items and total are required" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
});

/** My orders (logged-in user) */
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

/** Admin: all orders */
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

/** Admin: update order status */
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const { orderStatus } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { orderStatus });
  res.json({ success: true });
});

/** Admin: update payment status */
router.put("/:id/payment", protect, adminOnly, async (req, res) => {
  const { paymentStatus } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { paymentStatus });
  res.json({ success: true });
});
// Download Invoice PDF (admin OR order owner)
router.get("/:id/invoice", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    generateInvoicePDF(order, res);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});


export default router;

