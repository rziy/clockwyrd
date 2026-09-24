import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("discord_token");

  // BELUM LOGIN
  if (!token) {
    return <Navigate to="/" />;
  }

  // SUDAH LOGIN
  return children;
}
