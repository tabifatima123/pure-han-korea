router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "/api/upload" });
});
router.post("/", (req, res) => {
  console.log("UPLOAD HIT");
  console.log("Content-Type:", req.headers["content-type"]);

  upload.single("image")(req, res, (err) => {
    console.log("MULTER err:", err);
    console.log("MULTER file:", req.file);

    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "Image too large. Max 10MB." });
      }
      return res.status(400).json({ message: err.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    return res.json({ url: `/uploads/${req.file.filename}` });
  });
});

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload folder: backend/src/storage/uploads
const uploadDir = path.join(__dirname, "../storage/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path
      .basename(file.originalname || "image", ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 60);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (file?.mimetype?.startsWith("image/")) return cb(null, true);
  return cb(new Error("Only image files are allowed"), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/upload (FormData field name MUST be "image")
router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "Image too large. Max 10MB." });
      }
      return res.status(400).json({ message: err.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // frontend expects uploadData.url
    return res.json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;
