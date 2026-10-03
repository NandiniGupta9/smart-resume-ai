import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAnalysis } from "../services/api";

const LABELS = {
  skillsMatch: ["Skills Match", 30],
  keywordRelevance: ["Keyword Relevance", 15],
  technicalSkills: ["Technical Skills", 10],
  projectsRelevance: ["Projects Relevance", 15],
  experienceRelevance: ["Experience Relevance", 15],
  educationRelevance: ["Education Relevance", 5],
  resumeClarity: ["Resume Clarity", 5],
  atsFormatting: ["ATS Formatting", 5],
};

export default function Result() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis(id).then(setData).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const scoreClass = data.atsScore >= 75 ? "good" : data.atsScore >= 50 ? "medium" : "low";

  return (
    <div>
      <h1>Resume Analysis Result</h1>
      <p className="muted">{data.resumeName}</p>

      <div className="score-wrap">
        <div className={`score-circle ${scoreClass}`}>
          <span className="score-number">{data.atsScore}/100</span>
          <span>ATS SCORE</span>
        </div>
      </div>

      {data.scoreBreakdown && Object.keys(data.scoreBreakdown).length > 0 && (
        <div className="card">
          <h3>Score Breakdown</h3>
          {Object.entries(LABELS).map(([key, [label, max]]) => (
            <div className="breakdown-row" key={key}>
              <span>{label}</span>
              <span>{data.scoreBreakdown[key] ?? 0} / {max}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <h3>Matching Skills</h3>
          <div className="tags">
            {data.matchingSkills.length === 0 && <p className="muted">None found.</p>}
            {data.matchingSkills.map((s, i) => <span key={i} className="tag green">{s}</span>)}
          </div>
        </div>
        <div className="card">
          <h3>Missing Skills</h3>
          <div className="tags">
            {data.missingSkills.length === 0 && <p className="muted">No missing skills.</p>}
            {data.missingSkills.map((s, i) => <span key={i} className="tag red">{s}</span>)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Resume Strengths</h3>
        <ul>{data.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>

      <div className="card">
        <h3>Improvements</h3>
        <ul>{data.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>

      <div className="card">
        <h3>AI Summary</h3>
        <p>{data.summary}</p>
      </div>

      <Link to="/dashboard" className="btn">Analyze Another Resume</Link>
    </div>
  );
}
