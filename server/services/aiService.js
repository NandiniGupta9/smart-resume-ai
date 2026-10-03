// All AI logic lives in this one file.
// The API key is read from .env and never sent to the frontend.

const SYSTEM_PROMPT = `You are an ATS resume analyzer. Compare the candidate's resume with the provided job description and skills. Evaluate the relevance of the resume based only on the information provided. Do not invent skills, experience, education, or projects that are not present in the resume.

Score the resume in these 8 categories. Each score must be a whole number from 0 up to that category's maximum:
- skillsMatch (max 30): how many of the required skills/keywords appear in the resume
- keywordRelevance (max 15): how well the resume uses keywords from the job description
- technicalSkills (max 10): depth and relevance of technical skills
- projectsRelevance (max 15): how relevant the projects are to the job
- experienceRelevance (max 15): how relevant any work experience or internships are
- educationRelevance (max 5): how relevant the education is
- resumeClarity (max 5): how clear, concise and well organized the content is
- atsFormatting (max 5): how ATS-friendly the text structure looks (clear sections, no clutter)

Return ONLY valid JSON. No markdown, no code fences, no HTML, no extra text. Use exactly this format:
{
  "scoreBreakdown": {
    "skillsMatch": 0,
    "keywordRelevance": 0,
    "technicalSkills": 0,
    "projectsRelevance": 0,
    "experienceRelevance": 0,
    "educationRelevance": 0,
    "resumeClarity": 0,
    "atsFormatting": 0
  },
  "matchingSkills": ["skills found in the resume that the job needs"],
  "missingSkills": ["skills the job needs that are NOT in the resume"],
  "strengths": ["short strength statements"],
  "improvements": ["short, actionable suggestions"],
  "summary": "2-4 sentence explanation of how well the resume matches the job"
}`;

const MAX_POINTS = {
  skillsMatch: 30,
  keywordRelevance: 15,
  technicalSkills: 10,
  projectsRelevance: 15,
  experienceRelevance: 15,
  educationRelevance: 5,
  resumeClarity: 5,
  atsFormatting: 5,
};

function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

// Safely turn the AI text into a JS object
function parseAiJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("AI_BAD_FORMAT");
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function analyzeResumeWithAI(resumeText, jobDescription, skills) {
  const userMessage = `JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS / KEYWORDS:
${skills || "Not provided"}

RESUME TEXT:
${resumeText}`;

  // Models to try in order. AI_FALLBACK_MODEL is optional (a backup model name).
  const models = [process.env.AI_MODEL || "gemini-3.8-flash"];
  if (process.env.AI_FALLBACK_MODEL) models.push(process.env.AI_FALLBACK_MODEL);

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json", // asks Gemini to reply with JSON only
    },
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let response;

  // Free-tier models are sometimes busy (503). Retry a few times before giving up.
  outer: for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
          body,
        });
      } catch (err) {
        throw new Error("AI_UNREACHABLE");
      }

      if (response.ok) break outer;

      const busy = response.status === 503 || response.status === 500;
      console.error(`AI API error (${model}, attempt ${attempt}):`, response.status, await response.text());

      if (response.status === 429) throw new Error("AI_RATE_LIMIT");
      if (!busy) throw new Error("AI_API_ERROR");

      if (attempt < 3) await sleep(attempt * 2000); // wait 2s, then 4s
    }
  }

  if (!response || !response.ok) {
    throw new Error("AI_OVERLOADED");
  }

  const data = await response.json();
  const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  const text = parts && parts.map((p) => p.text || "").join("");
  if (!text || !text.trim()) {
    throw new Error("AI_EMPTY");
  }

  let parsed;
  try {
    parsed = parseAiJson(text);
  } catch (err) {
    throw new Error("AI_BAD_FORMAT");
  }

  // Clamp each category score to its max, then add them up for the final ATS score
  const breakdown = {};
  let atsScore = 0;
  for (const key of Object.keys(MAX_POINTS)) {
    const raw = Number(parsed.scoreBreakdown && parsed.scoreBreakdown[key]);
    const score = Number.isFinite(raw) ? Math.max(0, Math.min(MAX_POINTS[key], Math.round(raw))) : 0;
    breakdown[key] = score;
    atsScore += score;
  }

  return {
    atsScore,
    scoreBreakdown: breakdown,
    matchingSkills: toStringArray(parsed.matchingSkills),
    missingSkills: toStringArray(parsed.missingSkills),
    strengths: toStringArray(parsed.strengths),
    improvements: toStringArray(parsed.improvements),
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
  };
}

module.exports = { analyzeResumeWithAI, MAX_POINTS };