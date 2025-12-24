const express = require("express");
const router = express.Router();

let orders = [];

// PLACE ORDER
router.post("/", (req, res) => {
  const { items, total, paymentMethod } = req.body;

  const order = {
    id: Date.now(),
    items,
    total,
    paymentMethod,
    status: paymentMethod === "cod" ? "Pending COD" : "Payment Verification",
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  res.json({ message: "Order placed", order });
});

// GET ALL ORDERS (ADMIN)
router.get("/", (req, res) => {
  res.json(orders);
});

// UPDATE ORDER STATUS (ADMIN)
router.put("/:id", (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id == req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  res.json({ message: "Status updated", order });
});

module.exports = router;

