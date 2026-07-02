import type { Meta, StoryObj } from "@storybook/react";

/**
 * DesignPlayground / ThemeTokens — EXPERIMENTATION SANDBOX. NOT exported.
 *
 * A scratch surface to eyeball the shared design tokens (the SAME CSS custom
 * properties the real components consume) under the 3 themes. Useful when
 * proposing new tokens before they land in `src/styles/*`.
 *
 * NOT distributed via the registry / npm package.
 *
 * One story per token group — conforms to the one-state-per-story rule.
 * All token references use var(--s-*) or var(--p-*) — no raw hex in JSX
 * except where the token IS a hex literal (ramp stops, focus ring color).
 */
const meta: Meta = {
  title: "DesignPlayground/ThemeTokens",
};

export default meta;
type Story = StoryObj;

// ── Shared layout primitives ─────────────────────────────────────────────────

function PlaygroundWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily:
          "var(--s-font-body, 'Inter', system-ui, sans-serif)",
        background: "var(--s-surface-page)",
        padding: "24px",
        maxWidth: 760,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ title, layer }: { title: string; layer: string }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}
    >
      <span
        style={{
          fontFamily:
            "var(--s-font-display, 'Barlow Condensed', sans-serif)",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "var(--s-brand-fg)",
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontFamily:
            "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
          fontSize: 10,
          color: "var(--s-ink-muted)",
          background: "var(--s-surface-raised)",
          border: "1px solid var(--s-border-subtle)",
          borderRadius: 4,
          padding: "1px 6px",
        }}
      >
        {layer}
      </span>
    </div>
  );
}

function SwatchGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 8,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A single swatch card — token name in JetBrains Mono, resolved hex/alias,
 * semantic role description. Ring and inset variants handle near-bg colors.
 */
function SwatchCard({
  token,
  hex,
  desc,
  hasRing = false,
  inset = false,
  bgOverride,
  borderOverride,
}: {
  token: string;
  hex: string;
  desc: string;
  hasRing?: boolean;
  inset?: boolean;
  /** Pass a literal bg when the var resolves to transparent/rgba */
  bgOverride?: string;
  borderOverride?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--s-surface-panel)",
        border: "1px solid var(--s-border-subtle)",
        borderRadius: 6,
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: 6,
          background: bgOverride ?? `var(${token})`,
          border: borderOverride ?? "1px solid rgba(255,255,255,0.06)",
          boxShadow: inset
            ? "inset 0 0 0 1px var(--s-border-strong)"
            : hasRing
            ? "inset 0 0 0 2px var(--s-border-strong)"
            : undefined,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <code
          style={{
            fontFamily:
              "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
            fontSize: 11,
            color: "var(--s-ink-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {token}
        </code>
        <span
          style={{
            fontFamily:
              "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
            fontSize: 10,
            color: "var(--s-ink-muted)",
          }}
        >
          {hex}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--s-ink-disabled)",
          }}
        >
          {desc}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Story 1 — SurfaceTokens
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Surface hierarchy — page → panel → raised → elevated.
 * Each swatch shows token name (JetBrains Mono), resolved hex + sand alias,
 * and semantic role label.
 */
export const SurfaceTokens: Story = {
  render: () => (
    <PlaygroundWrap>
      <SectionLabel title="Surface Tokens" layer="--s-surface-*" />
      <SwatchGrid>
        <SwatchCard
          token="--s-surface-page"
          hex="#0a0908 · sand-950"
          desc="Page / canvas bg"
          hasRing
        />
        <SwatchCard
          token="--s-surface-panel"
          hex="#141210 · sand-900"
          desc="Card / sidebar bg"
          hasRing
        />
        <SwatchCard
          token="--s-surface-raised"
          hex="#1a1714 · sand-850"
          desc="Input / elevated bg"
        />
        <SwatchCard
          token="--s-surface-elevated"
          hex="#1f1c18 · sand-800"
          desc="Hover / overlay bg"
        />
      </SwatchGrid>
    </PlaygroundWrap>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 2 — InkTokens
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ink (text) hierarchy — primary → secondary → muted → disabled.
 * Swatches show the resolved hex; a live text preview block shows each level
 * rendering actual visible text at that ink value.
 */
export const InkTokens: Story = {
  render: () => (
    <PlaygroundWrap>
      <SectionLabel title="Ink Tokens" layer="--s-ink-*" />
      <SwatchGrid>
        <SwatchCard
          token="--s-ink-primary"
          hex="#f6f1e7 · sand-50"
          desc="Body / heading text"
        />
        <SwatchCard
          token="--s-ink-secondary"
          hex="#c9c0b4 · sand-200"
          desc="Secondary labels"
        />
        <SwatchCard
          token="--s-ink-muted"
          hex="#7d7568 · sand-400"
          desc="Placeholders / hints"
        />
        <SwatchCard
          token="--s-ink-disabled"
          hex="#5a5249 · sand-500"
          desc="Disabled text"
        />
      </SwatchGrid>

      {/* Live text preview at each ink level */}
      <div
        style={{
          background: "var(--s-surface-panel)",
          border: "1px solid var(--s-border-subtle)",
          borderRadius: 6,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontFamily:
              "var(--s-font-mono, 'JetBrains Mono', monospace)",
            fontSize: 10,
            color: "var(--s-ink-muted)",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          live text preview
        </div>
        <span style={{ color: "var(--s-ink-primary)", fontSize: 14 }}>
          --s-ink-primary · Body &amp; heading text
        </span>
        <span style={{ color: "var(--s-ink-secondary)", fontSize: 14 }}>
          --s-ink-secondary · Labels &amp; captions
        </span>
        <span style={{ color: "var(--s-ink-muted)", fontSize: 14 }}>
          --s-ink-muted · Placeholders &amp; hints
        </span>
        <span style={{ color: "var(--s-ink-disabled)", fontSize: 14 }}>
          --s-ink-disabled · Disabled states
        </span>
      </div>
    </PlaygroundWrap>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 3 — BrandTokens
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full brand palette — solid / hover / pressed / fg / subtle / border / ring.
 * Each swatch shows resolved hex and usage annotation. Subtle/border/ring
 * swatches use an inset ring so they're visible against the dark panel bg.
 */
export const BrandTokens: Story = {
  render: () => (
    <PlaygroundWrap>
      <SectionLabel title="Brand Tokens" layer="--s-brand-*" />
      <SwatchGrid>
        <SwatchCard
          token="--s-brand-solid"
          hex="#E07A4A · amber-500"
          desc="Primary CTA bg"
        />
        <SwatchCard
          token="--s-brand-hover"
          hex="#ea915a · amber-400"
          desc="CTA hover state"
        />
        <SwatchCard
          token="--s-brand-pressed"
          hex="#c2663b · amber-600"
          desc="CTA pressed state"
        />
        <SwatchCard
          token="--s-brand-fg"
          hex="#f0a872 · amber-300"
          desc="On-dark accent text"
        />
        <SwatchCard
          token="--s-brand-subtle"
          hex="rgba(224,122,74,0.10)"
          desc="Tinted bg"
          inset
        />
        <SwatchCard
          token="--s-brand-border"
          hex="rgba(224,122,74,0.22)"
          desc="Brand border"
          bgOverride="transparent"
          borderOverride="1px solid var(--s-brand-border)"
        />
        <SwatchCard
          token="--s-brand-ring"
          hex="rgba(224,122,74,0.45)"
          desc="Input focus ring"
        />
      </SwatchGrid>
    </PlaygroundWrap>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 4 — SemanticStatusTokens
// ─────────────────────────────────────────────────────────────────────────────

type StatusGroup = {
  name: string;
  solid: string;
  fg: string;
  subtle: string;
  border: string;
};

const STATUS_GROUPS: StatusGroup[] = [
  {
    name: "Success",
    solid: "--s-success-solid",
    fg: "--s-success-fg",
    subtle: "--s-success-subtle",
    border: "--s-success-border",
  },
  {
    name: "Warning",
    solid: "--s-warning-solid",
    fg: "--s-warning-fg",
    subtle: "--s-warning-subtle",
    border: "--s-warning-border",
  },
  {
    name: "Danger",
    solid: "--s-danger-solid",
    fg: "--s-danger-fg",
    subtle: "--s-danger-subtle",
    border: "--s-danger-border",
  },
  {
    name: "Info",
    solid: "--s-info-solid",
    fg: "--s-info-fg",
    subtle: "--s-info-subtle",
    border: "--s-info-border",
  },
];

function StatusCard({ group }: { group: StatusGroup }) {
  return (
    <div
      style={{
        background: "var(--s-surface-panel)",
        border: "1px solid var(--s-border-subtle)",
        borderRadius: 6,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: `var(${group.solid})`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontWeight: 600,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            color: `var(${group.fg})`,
          }}
        >
          {group.name}
        </span>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
      >
        {(
          [
            { token: group.solid, label: "solid" },
            { token: group.fg, label: "fg" },
            { token: group.subtle, label: "subtle" },
            { token: group.border, label: "border" },
          ] as const
        ).map(({ token, label }) => (
          <div
            key={token}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                flexShrink: 0,
                background:
                  label === "border" ? "transparent" : `var(${token})`,
                border:
                  label === "border"
                    ? `1px solid var(${token})`
                    : label === "subtle"
                    ? `1px solid var(${group.border})`
                    : "none",
              }}
            />
            <div
              style={{
                fontFamily:
                  "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
                fontSize: 10,
                color: "var(--s-ink-muted)",
                lineHeight: 1.3,
              }}
            >
              {token}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Semantic status tokens — success / warning / danger / info.
 * Each group shows solid, fg, subtle, border in a 2×4 grid layout.
 * No raw hex in component code — semantic CSS vars only.
 */
export const SemanticStatusTokens: Story = {
  render: () => (
    <PlaygroundWrap>
      <SectionLabel
        title="Semantic Status"
        layer="--s-success/warning/danger/info-*"
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
      >
        {STATUS_GROUPS.map((group) => (
          <StatusCard key={group.name} group={group} />
        ))}
      </div>
    </PlaygroundWrap>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 5 — PrimitiveColorRamps
// ─────────────────────────────────────────────────────────────────────────────

// Ramp stops are raw hex because they ARE the primitive definition —
// they cannot reference themselves via CSS var.

const SAND_RAMP = [
  { stop: "50", hex: "#f6f1e7" },
  { stop: "100", hex: "#e8e0d0" },
  { stop: "200", hex: "#c9c0b4" },
  { stop: "300", hex: "#a89e8f" },
  { stop: "400", hex: "#7d7568" },
  { stop: "500", hex: "#5a5249" },
  { stop: "600", hex: "#3a3530" },
  { stop: "700", hex: "#2a2622" },
  { stop: "800", hex: "#1f1c18" },
  { stop: "850", hex: "#1a1714" },
  { stop: "900", hex: "#141210", nearBg: true },
  { stop: "950", hex: "#0a0908", nearBg: true },
] as const;

const AMBER_RAMP = [
  { stop: "50", hex: "#fff1e6" },
  { stop: "100", hex: "#fadcc0" },
  { stop: "200", hex: "#f5c298" },
  { stop: "300", hex: "#f0a872" },
  { stop: "400", hex: "#ea915a" },
  { stop: "500", hex: "#E07A4A", brand: true },
  { stop: "600", hex: "#c2663b" },
  { stop: "700", hex: "#9e5230" },
  { stop: "800", hex: "#783e25" },
  { stop: "900", hex: "#4d2818" },
] as const;

function ColorRamp({
  label,
  stops,
}: {
  label: string;
  stops: ReadonlyArray<{
    stop: string;
    hex: string;
    brand?: boolean;
    nearBg?: boolean;
  }>;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          fontFamily:
            "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
          fontSize: 10,
          color: "var(--s-ink-muted)",
          width: 50,
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {stops.map(({ stop, hex, brand, nearBg }) => (
          <div key={stop} style={{ position: "relative" }}>
            <div
              title={`--p-${label}-${stop}: ${hex}`}
              style={{
                width: 36,
                height: 28,
                borderRadius: 4,
                background: hex,
                // amber-500 gets the DS focus ring to mark it as brand
                boxShadow: brand
                  ? "0 0 0 2px #0a0908, 0 0 0 3px #E07A4A"
                  : nearBg
                  ? "inset 0 0 0 1px #2a2622"
                  : undefined,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -18,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily:
                  "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
                fontSize: 9,
                color: brand ? "#E07A4A" : "var(--s-ink-disabled)",
                fontWeight: brand ? 600 : undefined,
                whiteSpace: "nowrap",
              }}
            >
              {brand ? `${stop}★` : stop}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Primitive color ramps — --p-sand-* (50→950) and --p-amber-* (50→900).
 * Horizontal ramp strip with stop labels; amber-500 marked as DS v0 brand (★).
 */
export const PrimitiveColorRamps: Story = {
  render: () => (
    <PlaygroundWrap>
      <SectionLabel
        title="Primitive Color Ramps"
        layer="--p-sand-* / --p-amber-*"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 36,
          paddingBottom: 28,
        }}
      >
        <ColorRamp label="sand" stops={SAND_RAMP} />
        <ColorRamp label="amber" stops={AMBER_RAMP} />
      </div>
    </PlaygroundWrap>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 6 — FocusRingSpec
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 2px bg-colored gap · 1px amber ring.
 * Hard-coded because this IS the spec constant — not a runtime var.
 */
const FOCUS_RING_VALUE =
  "0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A";

const monoLabel: React.CSSProperties = {
  fontFamily:
    "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
  fontSize: 10,
  color: "var(--s-ink-muted)",
};

/**
 * Focus ring spec — interactive demo.
 * Uniform `box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A`
 * applied to a Button, Input, and a swatch div in focused vs default state.
 */
export const FocusRingSpec: Story = {
  render: () => (
    <PlaygroundWrap>
      <SectionLabel title="Focus Ring" layer="--ds-focus-ring" />

      {/* Spec callout */}
      <div
        style={{
          background: "rgba(224,122,74,0.05)",
          border: "1px solid var(--s-brand-border)",
          borderRadius: 4,
          padding: "10px 14px",
          fontFamily:
            "var(--s-font-mono, 'JetBrains Mono', ui-monospace, monospace)",
          fontSize: 11,
          color: "var(--s-brand-fg)",
          lineHeight: 1.7,
        }}
      >
        box-shadow: 0 0 0 2px var(--s-surface-page), 0 0 0 3px #E07A4A;
        <br />
        {"/* 2px bg-colored gap · 1px amber ring · no animation (instant) */"}
      </div>

      {/* Demo row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 24,
          flexWrap: "wrap",
          marginTop: 8,
        }}
      >
        {/* Button focused */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={monoLabel}>button:focus-visible</span>
          <button
            tabIndex={-1}
            style={{
              background: "var(--s-brand-solid)",
              color: "var(--s-ink-inverse)",
              border: "none",
              borderRadius: 6,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "var(--s-font-body)",
              cursor: "pointer",
              boxShadow: FOCUS_RING_VALUE,
              outline: "none",
            }}
          >
            Save Changes
          </button>
        </div>

        {/* Input focused */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={monoLabel}>input:focus-visible</span>
          <input
            tabIndex={-1}
            readOnly
            defaultValue="Token name…"
            style={{
              background: "var(--s-surface-raised)",
              border: "1px solid var(--s-brand-solid)",
              borderRadius: 6,
              padding: "7px 12px",
              color: "var(--s-ink-primary)",
              fontSize: 13,
              fontFamily: "var(--s-font-body)",
              width: 180,
              boxShadow: FOCUS_RING_VALUE,
              outline: "none",
            }}
          />
        </div>

        {/* Swatch focused */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={monoLabel}>swatch:focus-visible</span>
          <div
            tabIndex={-1}
            style={{
              width: 48,
              height: 32,
              background: "var(--s-brand-solid)",
              border: "1px solid var(--s-border-strong)",
              borderRadius: 6,
              boxShadow: FOCUS_RING_VALUE,
              outline: "none",
            }}
          />
        </div>

        {/* Default — no focus */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={monoLabel}>default (no focus)</span>
          <button
            tabIndex={-1}
            style={{
              background: "var(--s-brand-solid)",
              color: "var(--s-ink-inverse)",
              border: "none",
              borderRadius: 6,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "var(--s-font-body)",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </PlaygroundWrap>
  ),
};
