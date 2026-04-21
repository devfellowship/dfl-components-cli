import { useContext } from "react";
import { IframeContext } from "../components/iframe/iframe-context";

export function useIframeAuth() {
  const ctx = useContext(IframeContext);
  return { token: ctx.token, userId: ctx.userId, ready: ctx.ready };
}
