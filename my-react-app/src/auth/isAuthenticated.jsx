// src/auth/isAuthenticated.jsx
export async function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const jwt_decode = (await import('jwt-decode')).default; // динамический импорт, если надо
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
