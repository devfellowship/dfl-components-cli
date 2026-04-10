/**
 * @dfl/components
 *
 * Main entry point — exports UI components, utilities, and hooks.
 *
 * Sub-path exports:
 *   import { useIsMobile }     from '@dfl/components/hooks'
 *   import { AuthProvider }    from '@dfl/components/providers' (Phase 4)
 *   import { cn }              from '@dfl/components/utils'
 *   import '@dfl/components/styles'                             (CSS tokens)
 *   import '@dfl/components/tailwind'                           (Tailwind v4 preset)
 */

// Re-export everything from components
export * from "./components";

// Re-export cn utility
export { cn } from "./lib/utils";
