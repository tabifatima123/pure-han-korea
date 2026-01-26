import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderroutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// __dirname support (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CORS =================
   Allow Live Server + optional production domain
*/
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "http://localhost:5000",
  "https://peaceful-shortbread-aae4ee.netlify.app/"
];

app.use(
  cors({
    origin: function (origin, cb) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked for origin: " + origin), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================= STATIC UPLOADS =================
   IMPORTANT: __dirname is backend/src
   So uploads folder should be resolved correctly.
   This assumes your files are saved at: backend/storage/uploads
*/
app.use("/uploads", express.static(path.join(__dirname, "../storage/uploads")));

// Health check
app.get("/api/health", (req, res) => res.status(200).json({ ok: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Your frontend calls POST /api/upload, so router should be router.post("/")
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => res.send("🚀 Pure Han Korea API is running"));

async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // I recommend stopping server if DB is required:
    // process.exit(1);
  }

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

startServer();
