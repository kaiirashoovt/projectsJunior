import { useEffect } from "react";
import { trackVisit } from "../shared/api/tracking";

export function useTracking(pageUrl) {
  useEffect(() => {
    trackVisit(pageUrl).catch(() => {});
  }, [pageUrl]);
}
