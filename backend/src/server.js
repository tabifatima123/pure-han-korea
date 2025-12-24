const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "storage/uploads"))
);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/uploads", require("./routes/uploads"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Pure Han Korea API running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
