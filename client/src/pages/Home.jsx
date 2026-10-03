import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/api";

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(isLoggedIn() ? "/dashboard" : "/login");
  };

  return (
    <section className="hero">
      <h1>Analyze Your Resume with AI</h1>
      <p>
        SmartResume AI compares your resume with a job description and gives you an
        ATS score, matching and missing skills, and clear suggestions to improve it.
      </p>
      <button className="btn" onClick={handleStart}>Analyze Resume</button>
    </section>
  );
}
