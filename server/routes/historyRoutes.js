const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAnalyses, getAnalysisById } = require("../controllers/historyController");

const router = express.Router();

router.get("/", authMiddleware, getAnalyses);
router.get("/:id", authMiddleware, getAnalysisById);

module.exports = router;
