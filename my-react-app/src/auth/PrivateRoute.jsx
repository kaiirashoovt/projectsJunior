import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = jwt_decode(token);
    if (Date.now() >= exp * 1000) {
      // Токен истёк
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Ошибка декодирования
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}
