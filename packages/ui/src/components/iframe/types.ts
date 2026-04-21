export const ALLOWED_ORIGINS = [
  /^https?:\/\/.*\.devfellowship\.com$/,
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
];

export type IframeMessageType =
  | "DFL_SET_TOKEN"
  | "DFL_NAVIGATE"
  | "DFL_READY"
  | "DFL_RESIZE";

export interface DflSetTokenMessage {
  type: "DFL_SET_TOKEN";
  token: string;
  userId?: string;
}

export interface DflNavigateMessage {
  type: "DFL_NAVIGATE";
  path: string;
}

export interface DflReadyMessage {
  type: "DFL_READY";
}

export interface DflResizeMessage {
  type: "DFL_RESIZE";
  height: number;
}

export type DflIframeMessage =
  | DflSetTokenMessage
  | DflNavigateMessage
  | DflReadyMessage
  | DflResizeMessage;

export function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.some((pattern) => pattern.test(origin));
}
