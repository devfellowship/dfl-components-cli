import { useCallback, useEffect, useRef, useState } from "react";
import type { DflIframeMessage } from "./types";
import { isAllowedOrigin } from "./types";

export interface DflRemoteProps {
  src: string;
  title: string;
  authToken?: string | null;
  supabaseSession?: { access_token: string; user?: { id: string } } | null;
  onNavigate?: (path: string) => void;
  onReady?: () => void;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  allow?: string;
}

export function DflRemote({
  src,
  title,
  authToken,
  supabaseSession,
  onNavigate,
  onReady,
  fallback,
  className = "w-full border-0",
  style,
  allow = "clipboard-read; clipboard-write; fullscreen",
}: DflRemoteProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const token = authToken ?? supabaseSession?.access_token ?? null;
  const userId = supabaseSession?.user?.id;

  const sendToken = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow || !token) return;

    const targetOrigin = new URL(src).origin;
    iframe.contentWindow.postMessage(
      { type: "DFL_SET_TOKEN", token, userId } satisfies DflIframeMessage,
      targetOrigin,
    );
  }, [src, token, userId]);

  useEffect(() => {
    if (ready) sendToken();
  }, [ready, sendToken]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!isAllowedOrigin(event.origin)) return;

      const data = event.data as DflIframeMessage;
      if (!data?.type) return;

      switch (data.type) {
        case "DFL_READY":
          setReady(true);
          sendToken();
          onReady?.();
          break;
        case "DFL_NAVIGATE":
          onNavigate?.(data.path);
          break;
        case "DFL_RESIZE":
          setHeight(data.height);
          break;
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onNavigate, onReady, sendToken]);

  const mergedStyle: React.CSSProperties = {
    minHeight: height ? `${height}px` : "calc(100vh - 64px)",
    ...style,
  };

  return (
    <>
      {!ready && fallback}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className={className}
        style={mergedStyle}
        allow={allow}
      />
    </>
  );
}
