import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/api";

export default function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}
