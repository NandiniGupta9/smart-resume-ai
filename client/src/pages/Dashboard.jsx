import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    setError("");
    if (selected && selected.type !== "application/pdf") {
      setFile(null);
      return setError("Only PDF files are allowed.");
    }
    if (selected && selected.size > 2 * 1024 * 1024) {
      setFile(null);
      return setError("PDF is too large. Maximum size is 2 MB.");
    }
    setFile(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) return setError("Please upload a PDF resume.");
    if (!jobDescription.trim()) return setError("Please paste the job description.");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    formData.append("skills", skills);

    setLoading(true);
    try {
      const result = await analyzeResume(formData);
      navigate(`/result/${result._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Analyze Your Resume</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Upload your Resume (PDF)</label>
        <input type="file" accept="application/pdf" onChange={handleFile} />
        {file && <p className="muted">Selected: {file.name}</p>}

        <label>Paste Job Description</label>
        <textarea
          rows="10"
          placeholder="Paste Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <label>Skills / Keywords</label>
        <input
          placeholder="Java, React, SQL, Spring Boot, Git, DSA"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button className="btn" disabled={loading}>
          {loading ? "Analyzing... please wait" : "Analyze Resume"}
        </button>
      </form>
    </div>
  );
}
