import { useEffect } from "react";

export function useTracking(pageUrl) {
  useEffect(() => {
    fetch("https://my-fastapi-backend-f4e2.onrender.com/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_url: pageUrl }),
    }).catch((err) => console.error("Tracking error:", err));
  }, [pageUrl]);
}