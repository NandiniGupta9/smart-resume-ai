import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, saveSession } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Email and password are required.");
    }

    setLoading(true);
    try {
      const data = await loginUser(form);
      saveSession(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        <button className="btn full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p className="muted">New here? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}
