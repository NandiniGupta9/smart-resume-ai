import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("All fields are required.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError("Please enter a valid email.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await signupUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        <label>Confirm Password</label>
        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
        <button className="btn full" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
