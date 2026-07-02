import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../components/badge";
import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanDropZone,
  type KanbanColumnDef,
  type KanbanItem,
} from "../../components/organisms/KanbanBoard";

/**
 * Templates/Kanban — page-level composition.
 *
 * Kanban archetype (learn DraggableKanbanBoard, payments InvoiceKanbanBoard):
 * board of columns, each carrying draggable cards. No dnd library — static
 * visual representation with grip affordance.
 *
 * DS fixes applied vs previous implementation:
 *   - Elevation stack: page (#0a0908) → column panel (#141210) →
 *     card raised (#1a1714) → card hover elevated (#1f1c18). Was inverted.
 *   - Focus ring: uniform DS amber box-shadow (2px gap + 1px ring); transition: none.
 *   - Ticket IDs in JetBrains Mono via --c-kanban-id-font.
 *   - Badge semantic mapping: Bug→danger, Conteúdo→default, Backend/Infra→info,
 *     QA→warning, Marketing→secondary; shape="square" (4px radius per --c-badge-radius).
 *   - Done-column cards attenuated to opacity 0.6.
 *   - Empty column shows dashed drop-zone (1.5px dashed --s-border-strong).
 *
 * Stories — ONE story = ONE state:
 *   Default       full 4-column board
 *   CardFocused   single card in keyboard-focus state
 *   CardDragging  single card in drag-in-progress state
 *   EmptyColumn   column with zero cards → dashed drop zone
 *   DoneColumn    'Concluído' column with attenuated cards (opacity 0.6)
 *   BadgeVariants canonical tag → badge variant semantic map
 */
const meta: Meta = {
  title: "Templates/Kanban",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

// ── Fixture data ──────────────────────────────────────────────────────────────

const COLUMNS: KanbanColumnDef[] = [
  {
    key: "todo",
    label: "A Fazer",
    items: [
      {
        id: "T-101",
        title: "Revisar roteiro da aula 12",
        assignee: "Ana Costa",
        avatar: "https://github.com/shadcn.png",
        tag: "Conteúdo",
      },
      {
        id: "T-102",
        title: "Corrigir bug no player",
        assignee: "Bruno Lima",
        tag: "Bug",
      },
      {
        id: "T-103",
        title: "Atualizar landing page",
        assignee: "Carla Dias",
        tag: "Marketing",
      },
    ],
  },
  {
    key: "doing",
    label: "Em Progresso",
    items: [
      {
        id: "T-104",
        title: "Gravar aula de Server Components",
        assignee: "Diego Reis",
        tag: "Conteúdo",
      },
      {
        id: "T-105",
        title: "Integração Woovi PIX",
        assignee: "Elena Moura",
        avatar: "https://github.com/shadcn.png",
        tag: "Backend",
      },
    ],
  },
  {
    key: "review",
    label: "Revisão",
    items: [
      {
        id: "T-106",
        title: "QA do fluxo de matrícula",
        assignee: "Fábio Nunes",
        tag: "QA",
      },
    ],
  },
  {
    key: "done",
    label: "Concluído",
    items: [
      {
        id: "T-107",
        title: "Deploy da v2 do dashboard",
        assignee: "Ana Costa",
        avatar: "https://github.com/shadcn.png",
        tag: "Infra",
      },
      {
        id: "T-108",
        title: "Enviar newsletter de junho",
        assignee: "Bruno Lima",
        tag: "Marketing",
      },
    ],
  },
];

const FOCUSED_ITEM: KanbanItem = {
  id: "T-203",
  title: "Nome da tarefa aqui",
  assignee: "Elena Faria",
  tag: "Bug",
};

const DRAGGING_ITEM: KanbanItem = {
  id: "T-204",
  title: "Nome da tarefa aqui",
  assignee: "Gabriel Henrique",
  tag: "QA",
};

const DONE_COLUMN: KanbanColumnDef = {
  key: "done",
  label: "Concluído",
  items: [
    {
      id: "T-107",
      title: "Deploy da v2 do dashboard",
      assignee: "Ana Costa",
      avatar: "https://github.com/shadcn.png",
      tag: "Infra",
    },
    {
      id: "T-108",
      title: "Enviar newsletter de junho",
      assignee: "Bruno Lima",
      tag: "Marketing",
    },
  ],
};

const EMPTY_COLUMN: KanbanColumnDef = {
  key: "review",
  label: "Revisão",
  items: [],
};

// ── Stories ───────────────────────────────────────────────────────────────────

/**
 * Default — 4 populated columns using the correct 4-level DS elevation stack:
 *   --s-surface-panel for columns, --s-surface-raised for cards,
 *   --s-surface-elevated for card hover. Semantic top-border accent per column status.
 */
export const Default: Story = {
  render: () => <KanbanBoard columns={COLUMNS} />,
};

/**
 * CardFocused — single draggable card in keyboard-focused state, showing the
 * uniform amber focus ring (box-shadow: 0 0 0 2px #0a0908, 0 0 0 3px #E07A4A,
 * transition: none). Ticket ID in JetBrains Mono.
 */
export const CardFocused: Story = {
  render: () => (
    <div
      style={{
        background: "var(--s-surface-panel)",
        borderRadius: "var(--p-radius-lg)",
        padding: 16,
        maxWidth: 260,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: "var(--s-font-mono)",
          fontSize: 10,
          color: "var(--s-ink-muted)",
          letterSpacing: "0.5px",
        }}
      >
        focus (kbd)
      </span>
      <KanbanCard item={FOCUSED_ITEM} forceState="focused" />
      <p
        style={{
          fontSize: 11,
          color: "var(--s-ink-muted)",
          lineHeight: 1.6,
          marginTop: 4,
        }}
      >
        Focus ring: <code
          style={{
            fontFamily: "var(--s-font-mono)",
            fontSize: 10,
            background: "var(--s-surface-elevated)",
            padding: "1px 5px",
            borderRadius: 3,
            border: "1px solid var(--s-border-subtle)",
          }}
        >
          box-shadow: 0 0 0 2px #0a0908, 0 0 0 3px #E07A4A
        </code>{" "}
        — <code
          style={{
            fontFamily: "var(--s-font-mono)",
            fontSize: 10,
            background: "var(--s-surface-elevated)",
            padding: "1px 5px",
            borderRadius: 3,
            border: "1px solid var(--s-border-subtle)",
          }}
        >
          transition: none
        </code>
      </p>
    </div>
  ),
};

/**
 * CardDragging — card in drag-in-progress visual state:
 * border-color: --s-brand-border (amber 22%), background: --s-surface-elevated,
 * elevated box-shadow, transform: rotate(1.5deg), cursor: grabbing.
 */
export const CardDragging: Story = {
  render: () => (
    <div
      style={{
        background: "var(--s-surface-panel)",
        borderRadius: "var(--p-radius-lg)",
        padding: 24,
        maxWidth: 300,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: "var(--s-font-mono)",
          fontSize: 10,
          color: "var(--s-ink-muted)",
          letterSpacing: "0.5px",
        }}
      >
        dragging
      </span>
      <KanbanCard item={DRAGGING_ITEM} forceState="dragging" />
    </div>
  ),
};

/**
 * EmptyColumn — column containing zero cards renders a dashed drop-zone
 * placeholder (border: 1.5px dashed --s-border-strong) with a Plus icon
 * and 'Arraste cartões aqui' label, occupying the full remaining column height.
 */
export const EmptyColumn: Story = {
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <KanbanColumn column={EMPTY_COLUMN} forceEmpty />
    </div>
  ),
};

/**
 * DoneColumn — 'Concluído' column where each card carries opacity: 0.6
 * to visually attenuate completed items while preserving layout and structure.
 */
export const DoneColumn: Story = {
  render: () => (
    <div style={{ maxWidth: 260 }}>
      <KanbanColumn column={DONE_COLUMN} doneAttenuation />
    </div>
  ),
};

/**
 * BadgeVariants — canonical tag-to-badge semantic mapping.
 *
 *   Bug       → danger  (outline-on-subtle red)
 *   Conteúdo  → default (brand amber outline-on-subtle)
 *   Backend   → info    (blue — technical category, NOT brand CTA)
 *   Infra     → info    (blue — same as Backend)
 *   QA        → warning (yellow)
 *   Marketing → secondary (muted surface)
 *
 * Shape: square (border-radius: var(--c-badge-radius) = 4px), NOT pill.
 * Previous mapping used `default` (solid amber) for Backend/Infra, conflicting
 * with the brand CTA colour; this story documents the corrected mapping.
 */
export const BadgeVariants: Story = {
  render: () => (
    <div
      style={{
        background: "var(--s-surface-panel)",
        borderRadius: "var(--p-radius-lg)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 480,
      }}
    >
      <span
        style={{
          fontFamily: "var(--s-font-mono)",
          fontSize: 10,
          color: "var(--s-ink-muted)",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        Tag → Badge semantic map
      </span>

      {/* Badge grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Badge variant="danger" shape="square">Bug</Badge>
        <Badge variant="default" shape="square">Conteúdo</Badge>
        <Badge variant="info" shape="square">Backend</Badge>
        <Badge variant="info" shape="square">Infra</Badge>
        <Badge variant="warning" shape="square">QA</Badge>
        <Badge variant="secondary" shape="square">Marketing</Badge>
      </div>

      {/* Annotation */}
      <div
        style={{
          fontSize: 11,
          color: "var(--s-ink-muted)",
          lineHeight: 1.7,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {(
          [
            ["Bug", "danger", "outline-on-subtle red — semantic intent"],
            ["Conteúdo", "default", "brand amber — editorial/content category"],
            ["Backend / Infra", "info", "blue — technical, NOT brand CTA"],
            ["QA", "warning", "yellow — caution / review signal"],
            ["Marketing", "secondary", "muted — ancillary categories"],
          ] as [string, string, string][]
        ).map(([tag, variant, note]) => (
          <div
            key={tag}
            style={{ display: "flex", alignItems: "baseline", gap: 8 }}
          >
            <code
              style={{
                fontFamily: "var(--s-font-mono)",
                fontSize: 10,
                color: "var(--s-ink-secondary)",
                background: "var(--s-surface-elevated)",
                padding: "1px 5px",
                borderRadius: 3,
                border: "1px solid var(--s-border-subtle)",
                minWidth: 120,
                display: "inline-block",
              }}
            >
              {tag}
            </code>
            <span>
              <code
                style={{
                  fontFamily: "var(--s-font-mono)",
                  fontSize: 10,
                  color: "var(--s-brand-fg)",
                }}
              >
                {variant}
              </code>{" "}
              — {note}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
