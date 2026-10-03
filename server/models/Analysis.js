const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeName: { type: String, required: true },
  jobDescription: { type: String, required: true },
  skills: { type: String, default: "" },
  atsScore: { type: Number, required: true },
  scoreBreakdown: { type: Object, default: {} },
  matchingSkills: { type: [String], default: [] },
  missingSkills: { type: [String], default: [] },
  strengths: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
  summary: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analysis", analysisSchema);
