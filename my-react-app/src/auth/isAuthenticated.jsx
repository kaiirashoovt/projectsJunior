import { isTokenValid } from "../shared/api/auth";

export async function isAuthenticated() {
  return isTokenValid();
}
