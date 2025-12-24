const express = require("express");
const router = express.Router();

/**
 * TEMP IN-MEMORY PRODUCTS
 * (Later we will move to database)
 */
let products = [
  {
    id: 1,
    name: "Pure Han Rice Brightening Cream",
    price: 3200,
    image: "https://via.placeholder.com/300"
  },
  {
    id: 2,
    name: "Korean Ginseng Hair Serum",
    price: 2800,
    image: "https://via.placeholder.com/300"
  }
];

/**
 * GET all products
 */
router.get("/", (req, res) => {
  res.json(products);
});

/**
 * ADD a new product (ADMIN)
 */
router.post("/", (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price required" });
  }

  const newProduct = {
    id: Date.now(),
    name,
    price,
    image: image || "https://via.placeholder.com/300"
  };

  products.push(newProduct);
  res.json(newProduct);
});

/**
 * DELETE a product (ADMIN)
 */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

module.exports = router;

