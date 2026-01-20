import express from "express";
import Product from "../../models/products.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET ALL PRODUCTS (PUBLIC) ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* ================= ADD PRODUCT (ADMIN) ================= */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = await Product.create({
      name: String(name).trim(),
      price: Number(price),
      category: (category && String(category).trim()) || "General",
      image: image || "",
      description: description || "",
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Product creation failed" });
  }
});

/* ================= DELETE PRODUCT (ADMIN) ================= */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
