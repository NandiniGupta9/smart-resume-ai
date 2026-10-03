const mongoose = require("mongoose");
const Analysis = require("../models/Analysis");

// List: only the fields needed for the history table
exports.getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .select("resumeName atsScore createdAt")
      .sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load history." });
  }
};

// Single analysis: full result (only if it belongs to the logged-in user)
exports.getAnalysisById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Analysis not found." });
    }
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId });
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found." });
    }
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load analysis." });
  }
};
