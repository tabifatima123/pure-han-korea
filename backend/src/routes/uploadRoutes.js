import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directory: backend/src/storage/uploads
const uploadDir = path.join(__dirname, "../storage/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();

    const base = path
      .basename(file.originalname || "image", ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 60);

    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

// Only allow images
function fileFilter(req, file, cb) {
  if (file?.mimetype?.startsWith("image/")) return cb(null, true);
  return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Test route
router.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// Upload route (field name must be "image")
router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // Multer errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image too large (max 10MB)" });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "Only image files are allowed" });
      }
      return res.status(400).json({ message: err.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    return res.json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;

