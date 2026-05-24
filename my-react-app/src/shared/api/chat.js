import { apiRequest } from "./client";

export function sendChatMessage(message) {
  return apiRequest("/api/chat", {
    method: "POST",
    body: { message },
  });
}
