const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "src/storage/uploads",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.json({ image: `/uploads/${req.file.filename}` });
});

module.exports = router;

