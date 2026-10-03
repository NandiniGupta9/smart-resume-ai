const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { analyzeResume } = require("../controllers/analysisController");

const router = express.Router();

// Memory storage: the PDF is kept in RAM only and never written to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("ONLY_PDF"));
    }
    cb(null, true);
  },
});

// Wrap multer so upload errors become friendly JSON messages
const handleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "PDF is too large. Maximum size is 2 MB." });
    }
    if (err.message === "ONLY_PDF") {
      return res.status(400).json({ message: "Only PDF files are allowed." });
    }
    return res.status(400).json({ message: "File upload failed." });
  });
};

router.post("/", authMiddleware, handleUpload, analyzeResume);

module.exports = router;
