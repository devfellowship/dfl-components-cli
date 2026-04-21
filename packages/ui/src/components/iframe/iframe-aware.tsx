import { useCallback, useEffect, useRef, useState } from "react";
import { IframeContext } from "./iframe-context";
import type { DflIframeMessage, DflSetTokenMessage } from "./types";
import { isAllowedOrigin } from "./types";

export interface IframeAwareProps {
  children: React.ReactNode;
  allowedOrigins?: RegExp[];
}

export function IframeAware({ children, allowedOrigins }: IframeAwareProps) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkOrigin = useCallback(
    (origin: string) => {
      if (allowedOrigins) {
        return allowedOrigins.some((p) => p.test(origin));
      }
      return isAllowedOrigin(origin);
    },
    [allowedOrigins],
  );

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!checkOrigin(event.origin)) return;

      const data = event.data as DflSetTokenMessage;
      if (data?.type === "DFL_SET_TOKEN") {
        setToken(data.token);
        setUserId(data.userId ?? null);
        setReady(true);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [checkOrigin]);

  useEffect(() => {
    if (!window.parent || window.parent === window) return;

    window.parent.postMessage(
      { type: "DFL_READY" } satisfies DflIframeMessage,
      "*",
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !window.parent || window.parent === window) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const height = Math.ceil(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
      window.parent.postMessage(
        { type: "DFL_RESIZE", height } satisfies DflIframeMessage,
        "*",
      );
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <IframeContext.Provider value={{ token, userId, ready }}>
      <div ref={containerRef}>{children}</div>
    </IframeContext.Provider>
  );
}
