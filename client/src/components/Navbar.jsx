import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, clearSession } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">SmartResume AI</Link>
      <div className="nav-links">
        {loggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/history">Analysis History</Link>
            <button className="link-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
