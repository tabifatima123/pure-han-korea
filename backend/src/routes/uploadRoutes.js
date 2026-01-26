import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

/* ================= ESM __dirname ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= MULTER STORAGE =================
   Save uploads to: backend/storage/uploads
*/
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../storage/uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= ROUTE ================= */
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // ✅ Return RELATIVE path
  const filePath = `/uploads/${req.file.filename}`;

  res.json({
    url: filePath,
    image: filePath,
  });
});

export default router;
