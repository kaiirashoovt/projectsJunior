import { apiRequest } from "./client";

export function trackVisit(pageUrl) {
  return apiRequest("/api/track", {
    method: "POST",
    body: { page_url: pageUrl },
  });
}
