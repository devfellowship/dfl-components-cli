import { useCallback } from "react";
import type { DflIframeMessage } from "../components/iframe/types";

export function useIframeNavigate() {
  return useCallback((path: string) => {
    if (!window.parent || window.parent === window) return;

    window.parent.postMessage(
      { type: "DFL_NAVIGATE", path } satisfies DflIframeMessage,
      "*",
    );
  }, []);
}
