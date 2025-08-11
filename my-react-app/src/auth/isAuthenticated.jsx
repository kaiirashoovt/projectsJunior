export async function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const mod = await import("jwt-decode");
    console.log("jwt-decode module:", mod);
    // Используем именованный экспорт jwtDecode
    const decodeFunc = mod.jwtDecode;
    const { exp } = decodeFunc(token);
    if (!exp || Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return false;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    return false;
  }
  return true;
}
