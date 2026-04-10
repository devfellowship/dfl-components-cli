/**
 * FeatureFlagProvider — simple static feature flag system.
 * Apps pass a flags map; consumers read flags via useFeatureFlag().
 */
import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";

export type FeatureFlags = Record<string, boolean>;

interface FeatureFlagContextType {
  flags: FeatureFlags;
  isEnabled: (flag: string) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  flags: {},
  isEnabled: () => false,
});

export interface FeatureFlagProviderProps {
  children: ReactNode;
  flags: FeatureFlags;
}

export const FeatureFlagProvider = ({
  children,
  flags,
}: FeatureFlagProviderProps) => {
  const value = useMemo(
    () => ({
      flags,
      isEnabled: (flag: string) => Boolean(flags[flag]),
    }),
    [flags]
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlag = (flag: string): boolean => {
  const { isEnabled } = useContext(FeatureFlagContext);
  return isEnabled(flag);
};

export const useFeatureFlags = (): FeatureFlags => {
  const { flags } = useContext(FeatureFlagContext);
  return flags;
};
