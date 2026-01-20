import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderroutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Health first (Railway healthcheck)
app.get("/api/health", (req, res) => res.status(200).json({ ok: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "storage/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => res.send("🚀 Pure Han Korea API is running"));

// ✅ Start server even if DB fails (so healthcheck can pass + logs show DB error)
async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("⚠ Starting server without DB (check MONGO_URI)");
  }

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer();
