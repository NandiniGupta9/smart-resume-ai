const pdfParse = require("pdf-parse");

// Takes a PDF Buffer and returns clean plain text
async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  const text = (data.text || "").replace(/\s+/g, " ").trim();
  return text;
}

module.exports = { extractTextFromPdf };
