// src/auth/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./isAuthenticated";

export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    alert("Сначала авторизуйтесь");
    return <Navigate to="/login" replace />;
  }
  return children;
}
