// import jwt_decode from "jwt-decode";

export default function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = jwt_decode(token);
    if (!exp || Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return false;
    }
  } catch {
    localStorage.removeItem("token");
    return false;
  }
  return true;
}
