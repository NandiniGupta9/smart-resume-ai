const Analysis = require("../models/Analysis");
const { extractTextFromPdf } = require("../utils/pdfParser");
const { analyzeResumeWithAI } = require("../services/aiService");

exports.analyzeResume = async (req, res) => {
  try {
    const { jobDescription, skills } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF resume." });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: "Please paste the job description." });
    }

    // 1. Extract text from PDF
    let resumeText;
    try {
      resumeText = await extractTextFromPdf(req.file.buffer);
    } catch (err) {
      return res.status(400).json({ message: "Could not read this PDF. It may be corrupted." });
    }

    if (resumeText.length < 50) {
      return res.status(400).json({
        message: "No readable text found. The PDF may be a scanned image. Please upload a text-based PDF.",
      });
    }

    // 2. Send to AI (limit text length to keep requests small)
    const result = await analyzeResumeWithAI(
      resumeText.slice(0, 12000),
      jobDescription.trim().slice(0, 6000),
      (skills || "").trim()
    );

    // 3. Save to MongoDB
    const saved = await Analysis.create({
      userId: req.userId,
      resumeName: req.file.originalname,
      jobDescription: jobDescription.trim(),
      skills: (skills || "").trim(),
      ...result,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    const messages = {
      AI_UNREACHABLE: "Could not reach the AI service. Check your internet connection.",
      AI_API_ERROR: "The AI service returned an error. Check your API key and model name in server/.env.",
      AI_OVERLOADED: "The free AI is very busy right now. Please wait a minute and try again.",
      AI_RATE_LIMIT: "Free AI limit reached. Wait a minute and try again.",
      AI_EMPTY: "The AI returned an empty response. Please try again.",
      AI_BAD_FORMAT: "The AI response was not in the expected format. Please try again.",
    };
    res.status(500).json({ message: messages[err.message] || "Analysis failed. Please try again." });
  }
};