/**
 * @dfl/components
 *
 * Main entry point — exports UI components, utilities, and hooks.
 *
 * Sub-path exports:
 *   import { useIsMobile, useToast, useAuth, useSession } from '@dfl/components/hooks'
 *   import { AuthProvider, FeatureFlagProvider }          from '@dfl/components/providers'
 *   import { cn, formatCurrency, formatDate }             from '@dfl/components/utils'
 *   import '@dfl/components/styles'                       (CSS tokens)
 *   import '@dfl/components/tailwind'                     (Tailwind v4 preset)
 */

// UI components
export * from "./components";

// cn utility (also available from @dfl/components/utils)
export { cn } from "./lib/utils";

// Hooks re-export for convenience (full set at @dfl/components/hooks)
export { useIsMobile, useToast, toast, useAuth, useSession } from "./hooks";
export type { ToastProps, ToastVariant, AuthContextType, UserProfile } from "./hooks";

// Providers re-export for convenience
export { AuthProvider, FeatureFlagProvider, useFeatureFlag, useFeatureFlags } from "./providers";
export type { AuthProviderProps, FeatureFlagProviderProps, FeatureFlags } from "./providers";
