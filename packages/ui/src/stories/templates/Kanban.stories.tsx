import type { Meta, StoryObj } from "@storybook/react";
import { GripVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";

/**
 * Templates/Kanban — page-level composition, NOT a new component.
 *
 * The kanban archetype (learn DraggableKanbanBoard, payments
 * InvoiceKanbanBoard): a KanbanBoard of KanbanColumns, each with a header
 * carrying a count Badge, holding draggable Cards. There is no drag-and-drop
 * lib in `@devfellowship/components`, so this is a STATIC visual
 * representation (a drag affordance icon per card) — no heavy dnd dep added.
 * COMPOSES existing primitives only.
 */
const meta: Meta = {
  title: "Templates/Kanban",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

type KItem = { id: string; title: string; assignee: string; avatar?: string; tag: string };

const columns: { key: string; label: string; items: KItem[] }[] = [
  {
    key: "todo",
    label: "A Fazer",
    items: [
      { id: "T-101", title: "Revisar roteiro da aula 12", assignee: "Ana Costa", avatar: "https://github.com/shadcn.png", tag: "Conteúdo" },
      { id: "T-102", title: "Corrigir bug no player", assignee: "Bruno Lima", tag: "Bug" },
      { id: "T-103", title: "Atualizar landing page", assignee: "Carla Dias", tag: "Marketing" },
    ],
  },
  {
    key: "doing",
    label: "Em Progresso",
    items: [
      { id: "T-104", title: "Gravar aula de Server Components", assignee: "Diego Reis", tag: "Conteúdo" },
      { id: "T-105", title: "Integração Woovi PIX", assignee: "Elena Moura", avatar: "https://github.com/shadcn.png", tag: "Backend" },
    ],
  },
  {
    key: "review",
    label: "Revisão",
    items: [
      { id: "T-106", title: "QA do fluxo de matrícula", assignee: "Fábio Nunes", tag: "QA" },
    ],
  },
  {
    key: "done",
    label: "Concluído",
    items: [
      { id: "T-107", title: "Deploy da v2 do dashboard", assignee: "Ana Costa", avatar: "https://github.com/shadcn.png", tag: "Infra" },
      { id: "T-108", title: "Enviar newsletter de junho", assignee: "Bruno Lima", tag: "Marketing" },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function tagVariant(tag: string) {
  if (tag === "Bug") return "destructive" as const;
  if (tag === "Conteúdo" || tag === "Backend" || tag === "Infra") return "default" as const;
  return "secondary" as const;
}

function KanbanCard({ item }: { item: KItem }) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-roledescription="Cartão arrastável"
      style={{ cursor: "grab" }}
    >
      <CardContent style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <GripVertical
            style={{ width: 14, height: 14, color: "var(--muted-foreground)", marginTop: 2, flexShrink: 0 }}
            aria-hidden
          />
          <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{item.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Badge variant={tagVariant(item.tag)}>{item.tag}</Badge>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.id}</span>
            <Avatar className="h-6 w-6 shrink-0">
              {item.avatar && <AvatarImage src={item.avatar} alt={item.assignee} />}
              <AvatarFallback className="text-[10px]">{getInitials(item.assignee)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Default Kanban — 4 columns, each header shows a count Badge, holding static
 * "draggable" cards (grip affordance; no dnd lib).
 */
export const Default: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns.length}, minmax(220px, 1fr))`,
        gap: 12,
        overflowX: "auto",
        paddingBottom: 8,
      }}
    >
      {columns.map((col) => (
        <div
          key={col.key}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "var(--muted)",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Card style={{ boxShadow: "none", border: "none", background: "transparent" }}>
            <CardHeader style={{ padding: "2px 4px" }}>
              <CardTitle
                style={{ fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                {col.label}
                <Badge variant="secondary">{col.items.length}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          {col.items.map((item) => (
            <KanbanCard key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  ),
};
