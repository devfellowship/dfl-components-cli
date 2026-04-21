import { createContext } from "react";

export interface IframeContextValue {
  token: string | null;
  userId: string | null;
  ready: boolean;
}

export const IframeContext = createContext<IframeContextValue>({
  token: null,
  userId: null,
  ready: false,
});
