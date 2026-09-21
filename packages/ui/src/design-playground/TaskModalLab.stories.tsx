import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Bot,
  Check,
  Component,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Figma,
  GitPullRequest,
  History,
  Info,
  Link2,
  Minus,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  Sparkles,
  SquareKanban,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../components/dialog";
import { IconButton } from "../components/icon-button";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Textarea } from "../components/textarea";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/tooltip";
import { cn } from "../lib/utils";

/**
 * DesignPlayground / TaskModalLab — EXPERIMENTATION SANDBOX. NOT exported.
 *
 * Experimento: rebalancear o "Update Task" do dashboard para Design Ops ↔ Dev Ops.
 * A task nasce da automação (PR que toca o design playground) em Ideation ou
 * Design Review, e depois desce para Dev (To Do → Doing → Done).
 *
 *   01 · ATTACHMENTS COMPACTO — dropzone de 1 linha (ícone + microcopy)
 *   02 · ORIGIN EM DESTAQUE   — PR + Storybook story da automação num bloco âmbar
 *   03 · LINKED RESOURCES     — designer anexa novas stories, Figma, PRs e vincula tasks
 *   04 · DESCRIPTION BALANCEADA — preview estruturado (label → valor), sem vazio
 *
 * One story per state — DesignReview, IdeationEmpty, AddingLink, LinkingTask,
 * WithAttachments.
 */
const meta: Meta = {
  title: "DesignPlayground/TaskModalLab",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

type Stage = "ideation" | "design-review" | "approved";
type LinkKind = "story" | "figma" | "task" | "pr" | "link";
type UrlLinkKind = Exclude<LinkKind, "task">;
type ComposerMode = "closed" | "url" | "task";
type DescriptionMode = "preview" | "edit";

interface LinkedResource {
  id: string;
  kind: LinkKind;
  title: string;
  href: string;
  meta: string;
  addedBy: string;
  addedAt: string;
  stage?: Stage;
}

interface OriginLink {
  kind: "pr" | "story";
  title: string;
  subtitle: string;
  href: string;
  status: { label: string; variant: "success" | "warning" | "info" };
}

interface DashboardTask {
  id: string;
  title: string;
  stage: Stage;
  owner: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
}

interface TaskFixture {
  id: string;
  name: string;
  points: number;
  priority: number;
  status: string;
  owner: string;
  stage: Stage;
  epic: string;
  delivery: string;
  createdAt: string;
  updatedLabel: string;
  origin: OriginLink[];
  description: string;
}

interface DescriptionSection {
  label: string;
  lines: string[];
}

interface ComposerPreset {
  mode: ComposerMode;
  kind?: UrlLinkKind;
  url?: string;
}

const MAX_FILE_BYTES = 500 * 1024;
const CURRENT_USER = "João Pedro";

const STAGE_CONFIG: Record<Stage, { label: string; className: string }> = {
  ideation: {
    label: "Ideation",
    className:
      "text-[var(--p-lilac)] bg-[color-mix(in_srgb,var(--p-lilac)_12%,transparent)] border-[color-mix(in_srgb,var(--p-lilac)_40%,transparent)]!",
  },
  "design-review": {
    label: "Design Review",
    className:
      "text-[var(--s-warning-fg)] bg-[var(--s-warning-subtle)] border-[var(--s-warning-border)]!",
  },
  approved: {
    label: "Approved",
    className:
      "text-[var(--s-success-fg)] bg-[var(--s-success-subtle)] border-[var(--s-success-border)]!",
  },
};

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", dot: "bg-[var(--s-danger-solid)]" },
  { value: "doing", label: "Doing", dot: "bg-[var(--s-warning-solid)]" },
  { value: "done", label: "Done", dot: "bg-[var(--s-success-solid)]" },
];

const OWNER_OPTIONS = ["João Pedro Danhoni", "Tainan", "Samuel"];
const EPIC_OPTIONS = ["Design ↔ implementation flow — canonical", "No epic"];
const DELIVERY_OPTIONS = ["No delivery", "Sprint 38 · Oct/26"];

const LINK_KIND_CONFIG: Record<LinkKind, { label: string; icon: LucideIcon; tone: string }> = {
  story: {
    label: "Story",
    icon: Component,
    tone: "text-[var(--s-brand-fg)] bg-[var(--s-brand-subtle)] border-[var(--s-brand-border)]!",
  },
  figma: {
    label: "Figma",
    icon: Figma,
    tone: "text-[var(--s-info-fg)] bg-[var(--s-info-subtle)] border-[var(--s-info-border)]!",
  },
  task: {
    label: "Task",
    icon: SquareKanban,
    tone: "text-[var(--s-ink-secondary)] bg-[var(--s-surface-elevated)] border-[var(--s-border-strong)]!",
  },
  pr: {
    label: "Pull request",
    icon: GitPullRequest,
    tone: "text-[var(--s-success-fg)] bg-[var(--s-success-subtle)] border-[var(--s-success-border)]!",
  },
  link: {
    label: "Link",
    icon: Link2,
    tone: "text-[var(--s-ink-secondary)] bg-[var(--s-surface-elevated)] border-[var(--s-border-strong)]!",
  },
};

const URL_LINK_KINDS: UrlLinkKind[] = ["story", "figma", "pr", "link"];

const URL_PLACEHOLDER: Record<UrlLinkKind, string> = {
  story: "https://pr-501.itera-storybook.pages.dev/?path=/story/…",
  figma: "https://www.figma.com/design/…",
  pr: "https://github.com/org/repo/pull/…",
  link: "https://…",
};

const DASHBOARD_TASKS: DashboardTask[] = [
  {
    id: "e91dc114-418d-4401-82e3-cd1ef5d2a7b0",
    title: "Trilha do Curso · Cores — Course-Path-With-Colors (itera-player#493)",
    stage: "design-review",
    owner: "João Pedro Danhoni",
  },
  {
    id: "b7a0f2c9-5d1e-4c3a-9f60-2e8b41d7c915",
    title: "T16 — Decide verify-on-stop: rebind to the DFL task id or archive",
    stage: "design-review",
    owner: "Tainan",
  },
  {
    id: "4c19ad07-7e2b-4f18-a3d4-0b9e6c52f1aa",
    title: "João · open a PR for every design delivery",
    stage: "ideation",
    owner: "João Pedro Danhoni",
  },
  {
    id: "d20e6b51-3a8f-4b27-8c1d-5f4e9a0b7c63",
    title: "João · put the coming deliveries into Storybook, components and organisms",
    stage: "ideation",
    owner: "João Pedro Danhoni",
  },
  {
    id: "91f3c8ee-2b6d-4e0a-b5c7-8d1f3a4e6b20",
    title: "Apply the visual treatment to P1 with short, variable scenes",
    stage: "ideation",
    owner: "Tainan",
  },
];

const DESIGN_REVIEW_TASK: TaskFixture = {
  id: "3e72d41b-292c-456a-8790-82d815819c04",
  name: "Catalog Page Lab — Create CatalogPageLab.stories.tsx (itera-player#495)",
  points: 0,
  priority: 11,
  status: "todo",
  owner: "João Pedro Danhoni",
  stage: "design-review",
  epic: EPIC_OPTIONS[0],
  delivery: DELIVERY_OPTIONS[0],
  createdAt: "21 Sep · 14:32",
  updatedLabel: "Updated 2h ago · João Pedro Danhoni",
  origin: [
    {
      kind: "pr",
      title: "iterahq/itera-player #495",
      subtitle: "github.com · 1 file changed",
      href: "https://github.com/iterahq/itera-player/pull/495",
      status: { label: "Open", variant: "success" },
    },
    {
      kind: "story",
      title: "DesignPlayground / CatalogPageLab",
      subtitle: "pr-495.itera-storybook.pages.dev",
      href: "https://pr-495.itera-storybook.pages.dev",
      status: { label: "Live", variant: "info" },
    },
  ],
  description: [
    "**Por quê**: New courses catalog proposal-ui-3vs",
    "**O quê**: 1 arquivo(s) no design playground",
    "**Antes — Design Playground na main**:",
    "- `design-playground/CatalogPageLab.stories.tsx` — story ainda não publicada (o índice do Storybook é buildado da main)",
    "**Arquivos tocados**:",
    "- `design-playground/CatalogPageLab.stories.tsx`",
  ].join("\n"),
};

const IDEATION_TASK: TaskFixture = {
  id: "91f3c8ee-2b6d-4e0a-b5c7-8d1f3a4e6b20",
  name: "Apply the visual treatment to P1 with short, variable scenes",
  points: 0,
  priority: 8,
  status: "todo",
  owner: "Tainan",
  stage: "ideation",
  epic: EPIC_OPTIONS[1],
  delivery: DELIVERY_OPTIONS[0],
  createdAt: "21 Sep · 09:10",
  updatedLabel: "Created by automation · 5h ago",
  origin: [
    {
      kind: "pr",
      title: "iterahq/itera-player #498",
      subtitle: "github.com · 1 file changed",
      href: "https://github.com/iterahq/itera-player/pull/498",
      status: { label: "Open", variant: "success" },
    },
    {
      kind: "story",
      title: "DesignPlayground / P1SceneLab",
      subtitle: "pr-498.itera-storybook.pages.dev",
      href: "https://pr-498.itera-storybook.pages.dev",
      status: { label: "Building", variant: "warning" },
    },
  ],
  description: [
    "**Por quê**: Protótipo de engenharia — tratamento visual do P1 com cenas curtas e variáveis",
    "**O quê**: 1 arquivo(s) no design playground",
    "**Arquivos tocados**:",
    "- `design-playground/P1SceneLab.stories.tsx`",
  ].join("\n"),
};

const DESIGN_REVIEW_LINKS: LinkedResource[] = [
  {
    id: "link-story-grid",
    kind: "story",
    title: "CatalogPageLab · Grid v2 (3 columns)",
    href: "https://pr-501.itera-storybook.pages.dev/?path=/story/designplayground-catalogpagelab--grid-v-2",
    meta: "pr-501.itera-storybook.pages.dev",
    addedBy: CURRENT_USER,
    addedAt: "2h ago",
  },
  {
    id: "link-figma-explorations",
    kind: "figma",
    title: "Catalog — explorations · Page 2",
    href: "https://www.figma.com/design/k3Yp9Q/Catalog-Explorations?node-id=2-14",
    meta: "figma.com · design file",
    addedBy: CURRENT_USER,
    addedAt: "yesterday",
  },
  {
    id: "link-task-course-path",
    kind: "task",
    title: DASHBOARD_TASKS[0].title,
    href: `#task/${DASHBOARD_TASKS[0].id}`,
    meta: DASHBOARD_TASKS[0].owner,
    addedBy: CURRENT_USER,
    addedAt: "yesterday",
    stage: DASHBOARD_TASKS[0].stage,
  },
];

const ATTACHED_FILES: AttachedFile[] = [
  { id: "file-catalog-grid", name: "catalog-grid-v2.png", size: 312 * 1024 },
  { id: "file-feedback", name: "review-notes.pdf", size: 88 * 1024 },
  { id: "file-recording", name: "catalog-walkthrough.mov", size: 4.2 * 1024 * 1024 },
];

function detectLinkKind(url: string): UrlLinkKind {
  const value = url.trim().toLowerCase();
  if (value.includes("figma.com")) return "figma";
  if (value.includes("storybook") || value.includes("path=/story")) return "story";
  if (/github\.com\/[^/]+\/[^/]+\/pull\/\d+/.test(value)) return "pr";
  return "link";
}

function describeUrl(url: string, kind: UrlLinkKind): { title: string; meta: string } {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (kind === "pr" && segments.length >= 4) {
      return { title: `${segments[0]}/${segments[1]} #${segments[3]}`, meta: host };
    }
    if (kind === "figma" && segments[2]) {
      return { title: decodeURIComponent(segments[2]).replace(/-/g, " "), meta: `${host} · ${segments[0]} file` };
    }
    if (kind === "story") {
      const storyId = parsed.searchParams.get("path")?.replace("/story/", "") ?? "";
      const [group = "", variant = ""] = storyId.split("--");
      const component = group.split("-").pop() ?? "";
      return { title: storyId ? `${component} · ${variant.replace(/-/g, " ")}` : "Storybook story", meta: host };
    }
    return { title: `${host}${parsed.pathname.replace(/\/$/, "")}`, meta: host };
  } catch {
    return { title: url.trim(), meta: "link" };
  }
}

function isValidUrl(url: string): boolean {
  try {
    return Boolean(new URL(url.trim()));
  } catch {
    return false;
  }
}

function parseDescription(markdown: string): DescriptionSection[] {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<DescriptionSection[]>((sections, line) => {
      const heading = line.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
      if (heading) return [...sections, { label: heading[1], lines: heading[2] ? [heading[2]] : [] }];
      if (sections.length === 0) return [{ label: "", lines: [line] }];
      const last = sections[sections.length - 1];
      return [...sections.slice(0, -1), { ...last, lines: [...last.lines, line] }];
    }, []);
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

const monoLabel =
  "font-mono text-[10.5px] font-medium uppercase leading-[15px] tracking-[0.6px] text-[var(--s-ink-muted)]";

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn(monoLabel, "mb-1.5 block")}>
      {children}
    </label>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-[var(--s-ink-primary)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`")) {
          return (
            <code
              key={index}
              className="rounded-[var(--p-radius-sm)] bg-[var(--s-surface-elevated)] px-1 py-px font-mono text-[11.5px] text-[var(--s-brand-fg)]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

function IconAction({
  label,
  children,
  ...props
}: Omit<React.ComponentProps<typeof IconButton>, "aria-label"> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton size="sm" aria-label={label} {...props}>
          {children}
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function CopyAction({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <IconAction label={copied ? "Copied" : label} onClick={handleCopy}>
      {copied ? <Check className="text-[var(--s-success-fg)]" /> : <Copy />}
    </IconAction>
  );
}

function StageBadge({ stage }: { stage: Stage }) {
  const { label, className } = STAGE_CONFIG[stage];
  return (
    <Badge dot variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

function KindTile({ kind, size = "md" }: { kind: LinkKind; size?: "md" | "lg" }) {
  const { icon: KindIcon, tone } = LINK_KIND_CONFIG[kind];
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[var(--p-radius-md)] border",
        size === "lg" ? "size-9 [&_svg]:size-4" : "size-7 [&_svg]:size-3.5",
        tone,
      )}
    >
      <KindIcon strokeWidth={1.75} />
    </span>
  );
}

function TaskModalHeader({ task }: { task: TaskFixture }) {
  return (
    <header className="flex items-start gap-3 px-6 pb-3 pr-14 pt-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <DialogTitle className="font-condensed text-[22px] font-semibold leading-none tracking-[0.2px]">
            Update Task
          </DialogTitle>
          <StageBadge stage={task.stage} />
          <Badge variant="secondary" shape="square">
            <Bot className="size-3" strokeWidth={1.75} aria-hidden />
            Auto-created
          </Badge>
        </div>
        <div className="mt-1.5 flex min-w-0 items-center gap-1">
          <span className="truncate font-mono text-[11px] text-[var(--s-ink-secondary)]">{task.id}</span>
          <CopyAction value={task.id} label="Copy task id" />
        </div>
        <DialogDescription className="sr-only">
          Edit the task fields, review the origin pull request and Storybook story, and link
          design resources for development.
        </DialogDescription>
      </div>
      <div className="flex items-center gap-1.5">
        <IconAction label="Minimize" variant="outline">
          <Minus />
        </IconAction>
        <IconAction label="More actions" variant="outline">
          <MoreHorizontal />
        </IconAction>
      </div>
    </header>
  );
}

function OriginLinkCard({ link }: { link: OriginLink }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[var(--p-radius-md)] border border-[var(--s-border-subtle)] bg-[var(--s-surface-panel)] py-2.5 pl-2.5 pr-1.5 transition-colors duration-150 hover:border-[var(--s-border-strong)]!">
      <KindTile kind={link.kind} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={monoLabel}>{LINK_KIND_CONFIG[link.kind].label}</span>
          <Badge variant={link.status.variant} dot className="px-1.5 py-0 text-[10px]">
            {link.status.label}
          </Badge>
        </div>
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-0.5 block truncate text-[13px] font-medium text-[var(--s-ink-primary)] underline-offset-2 hover:text-[var(--s-brand-fg)] hover:underline"
        >
          {link.title}
        </a>
        <span className="block truncate font-mono text-[11px] text-[var(--s-ink-secondary)]">
          {link.subtitle}
        </span>
      </div>
      <CopyAction value={link.href} label={`Copy ${LINK_KIND_CONFIG[link.kind].label} link`} />
      <IconAction label={`Open ${LINK_KIND_CONFIG[link.kind].label}`} asChild>
        <a href={link.href} target="_blank" rel="noreferrer">
          <ExternalLink />
        </a>
      </IconAction>
    </div>
  );
}

function OriginLinks({ task }: { task: TaskFixture }) {
  return (
    <section
      aria-labelledby="task-origin-heading"
      className="mx-6 rounded-[var(--p-radius-lg)] border border-[var(--s-brand-border)]! bg-[var(--s-brand-subtle)] p-3"
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 pl-0.5">
        <Zap className="size-3.5 text-[var(--s-brand-fg)]" strokeWidth={1.75} aria-hidden />
        <h3
          id="task-origin-heading"
          className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.6px] text-[var(--s-brand-fg)]"
        >
          Origin
        </h3>
        <span className="text-[12px] text-[var(--s-ink-secondary)]">
          Created by automation from the PR · {task.createdAt}
        </span>
        <Button variant="ghost" size="sm" className="ml-auto h-6 px-2 text-[11.5px]">
          <Pencil aria-hidden />
          Edit
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {task.origin.map((link) => (
          <OriginLinkCard key={link.kind} link={link} />
        ))}
      </div>
    </section>
  );
}

function SelectField({
  id,
  label,
  defaultValue,
  options,
}: {
  id: string;
  label: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select defaultValue={defaultValue}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CompactAttachments({
  files,
  onAddFiles,
  onRemoveFile,
}: {
  files: AttachedFile[];
  onAddFiles: (files: FileList) => void;
  onRemoveFile: (id: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onAddFiles(event.dataTransfer.files);
  };

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className={monoLabel}>Attachments</span>
        {files.length > 0 && (
          <span className="font-mono text-[10.5px] text-[var(--s-ink-muted)]">{files.length} files</span>
        )}
      </div>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex h-10 cursor-pointer items-center gap-2.5 rounded-[var(--p-radius-md)] border border-dashed px-3",
          "transition-colors duration-150 focus-within:border-[var(--s-border-focus)]!",
          isDragging
            ? "border-[var(--s-brand-solid)]! bg-[var(--s-brand-subtle)]"
            : "border-[var(--s-border-strong)]! bg-[var(--s-surface-panel)] hover:border-[var(--s-ink-muted)]!",
        )}
      >
        <Paperclip className="size-3.5 text-[var(--s-ink-muted)]" strokeWidth={1.75} aria-hidden />
        <span className="truncate text-[12.5px] text-[var(--s-ink-secondary)]">
          <span className="font-medium text-[var(--s-brand-fg)]">Browse</span> or drop files
        </span>
        <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.6px] text-[var(--s-ink-muted)]">
          Max 500KB
        </span>
        <input
          type="file"
          multiple
          className="sr-only"
          aria-label="Attach files, maximum 500KB each"
          onChange={(event) => event.target.files && onAddFiles(event.target.files)}
        />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {files.map((file) => {
            const isTooLarge = file.size > MAX_FILE_BYTES;
            return (
              <li
                key={file.id}
                className={cn(
                  "flex h-7 max-w-full items-center gap-1.5 rounded-[var(--p-radius-md)] border pl-2 pr-0.5 text-[12px]",
                  isTooLarge
                    ? "border-[var(--s-danger-border)]! bg-[var(--s-danger-subtle)] text-[var(--s-danger-fg)]"
                    : "border-[var(--s-border-subtle)] bg-[var(--s-surface-panel)] text-[var(--s-ink-secondary)]",
                )}
              >
                <FileText className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                <span className="max-w-[140px] truncate">{file.name}</span>
                <span className="font-mono text-[10.5px] opacity-80">
                  {isTooLarge ? "too large" : formatFileSize(file.size)}
                </span>
                <IconButton size="xs" aria-label={`Remove ${file.name}`} onClick={() => onRemoveFile(file.id)}>
                  <X />
                </IconButton>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function TaskFields({
  task,
  files,
  onAddFiles,
  onRemoveFile,
}: {
  task: TaskFixture;
  files: AttachedFile[];
  onAddFiles: (files: FileList) => void;
  onRemoveFile: (id: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <FieldLabel htmlFor="tm-name">Task name *</FieldLabel>
        <Input id="tm-name" defaultValue={task.name} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div>
          <FieldLabel htmlFor="tm-points">Points</FieldLabel>
          <Input id="tm-points" type="number" min={0} defaultValue={task.points} />
        </div>
        <div>
          <FieldLabel htmlFor="tm-priority">Priority</FieldLabel>
          <Input id="tm-priority" type="number" min={0} defaultValue={task.priority} />
        </div>
        <p className="col-span-2 flex items-start gap-1.5 text-[11.5px] leading-[1.45] text-[var(--s-ink-muted)]">
          <Info className="mt-px size-3 shrink-0" strokeWidth={1.75} aria-hidden />
          Design phases don't score — points count once the work reaches execution.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <FieldLabel htmlFor="tm-status">Status</FieldLabel>
          <Select defaultValue={task.status}>
            <SelectTrigger id="tm-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <span className="flex items-center gap-2">
                    <span aria-hidden className={cn("size-2 rounded-full", status.dot)} />
                    {status.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <SelectField id="tm-owner" label="Owner" defaultValue={task.owner} options={OWNER_OPTIONS} />
      </div>

      <div className="min-w-0">
        <FieldLabel htmlFor="tm-stage">Stage</FieldLabel>
        <Select defaultValue={task.stage}>
          <SelectTrigger id="tm-stage">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STAGE_CONFIG) as Stage[]).map((stage) => (
              <SelectItem key={stage} value={stage}>
                {STAGE_CONFIG[stage].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField id="tm-epic" label="Epic" defaultValue={task.epic} options={EPIC_OPTIONS} />
        <SelectField id="tm-delivery" label="Delivery" defaultValue={task.delivery} options={DELIVERY_OPTIONS} />
      </div>

      <CompactAttachments files={files} onAddFiles={onAddFiles} onRemoveFile={onRemoveFile} />
    </div>
  );
}

function DescriptionPreview({ markdown }: { markdown: string }) {
  const sections = parseDescription(markdown);
  return (
    <dl className="grid grid-cols-[112px_minmax(0,1fr)] gap-x-4 gap-y-3">
      {sections.map((section, index) => (
        <React.Fragment key={`${section.label}-${index}`}>
          <dt className={cn(monoLabel, "pt-[3px] text-[10px]")}>{section.label}</dt>
          <dd className="m-0 space-y-1 text-[13px] leading-[1.5] text-[var(--s-ink-secondary)] [overflow-wrap:anywhere]">
            {section.lines.map((line, lineIndex) =>
              line.startsWith("- ") ? (
                <p key={lineIndex} className="m-0 flex gap-2">
                  <span aria-hidden className="text-[var(--s-ink-muted)]">•</span>
                  <span>
                    <InlineMarkdown text={line.slice(2)} />
                  </span>
                </p>
              ) : (
                <p key={lineIndex} className="m-0">
                  <InlineMarkdown text={line} />
                </p>
              ),
            )}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

function DescriptionPanel({
  value,
  mode,
  onChange,
  onModeChange,
}: {
  value: string;
  mode: DescriptionMode;
  onChange: (value: string) => void;
  onModeChange: (mode: DescriptionMode) => void;
}) {
  return (
    <section aria-labelledby="tm-description-label" className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between">
        <label id="tm-description-label" htmlFor="tm-description" className={monoLabel}>
          Description
        </label>
        <div className="flex items-center gap-0.5">
          <IconAction label="Improve with AI">
            <Sparkles />
          </IconAction>
          <IconAction label="Edit markdown" aria-pressed={mode === "edit"} onClick={() => onModeChange("edit")}>
            <Pencil />
          </IconAction>
          <IconAction label="Preview" aria-pressed={mode === "preview"} onClick={() => onModeChange("preview")}>
            <Eye />
          </IconAction>
        </div>
      </div>
      {mode === "edit" ? (
        <Textarea
          id="tm-description"
          value={value}
          rows={8}
          onChange={(event) => onChange(event.target.value)}
          className="resize-y font-mono text-[12px]"
        />
      ) : (
        <div className="max-h-[208px] overflow-y-auto [scrollbar-color:var(--s-border-strong)_transparent] [scrollbar-width:thin] rounded-[var(--p-radius-md)] border border-[var(--s-border-subtle)] bg-[var(--s-surface-panel)] px-4 py-3.5">
          <DescriptionPreview markdown={value} />
        </div>
      )}
    </section>
  );
}

function LinkedResourceRow({ link, onRemove }: { link: LinkedResource; onRemove: (id: string) => void }) {
  const isTask = link.kind === "task";
  return (
    <li className="group flex min-w-0 items-center gap-3 py-2 pl-2.5 pr-1.5 transition-colors duration-150 hover:bg-[var(--s-surface-panel)]">
      <KindTile kind={link.kind} />
      <div className="min-w-0 flex-1">
        <a
          href={link.href}
          target={isTask ? undefined : "_blank"}
          rel={isTask ? undefined : "noreferrer"}
          className="block truncate text-[13px] font-medium text-[var(--s-ink-primary)] underline-offset-2 hover:text-[var(--s-brand-fg)] hover:underline"
        >
          {link.title}
        </a>
        <span className="block truncate text-[11.5px] text-[var(--s-ink-muted)]">
          <span className="font-mono">{LINK_KIND_CONFIG[link.kind].label}</span> · {link.meta} · {link.addedBy},{" "}
          {link.addedAt}
        </span>
      </div>
      {link.stage && <StageBadge stage={link.stage} />}
      <div className="flex items-center opacity-60 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
        {!isTask && <CopyAction value={link.href} label="Copy link" />}
        <IconAction label={isTask ? "Open task" : "Open link"} asChild>
          <a href={link.href} target={isTask ? undefined : "_blank"} rel={isTask ? undefined : "noreferrer"}>
            <ExternalLink />
          </a>
        </IconAction>
        <IconAction label="Remove link" variant="destructive" onClick={() => onRemove(link.id)}>
          <X />
        </IconAction>
      </div>
    </li>
  );
}

function useLinkComposer(preset: ComposerPreset, onSubmit: (url: string, label: string, kind: UrlLinkKind) => void) {
  const [url, setUrl] = useState(preset.url ?? "");
  const [label, setLabel] = useState(preset.url ? describeUrl(preset.url, detectLinkKind(preset.url)).title : "");
  const [kind, setKind] = useState<UrlLinkKind>(preset.url ? detectLinkKind(preset.url) : preset.kind ?? "story");
  const [isKindLocked, setIsKindLocked] = useState(Boolean(preset.kind && !preset.url));

  const isDetected = url.trim().length > 0 && !isKindLocked;
  const canSubmit = isValidUrl(url);

  const handleUrlChange = (nextUrl: string) => {
    const nextKind = isKindLocked ? kind : detectLinkKind(nextUrl);
    setUrl(nextUrl);
    setKind(nextKind);
    if (isValidUrl(nextUrl)) setLabel(describeUrl(nextUrl, nextKind).title);
  };

  const handleKindChange = (nextKind: string) => {
    if (!nextKind) return;
    setKind(nextKind as UrlLinkKind);
    setIsKindLocked(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (canSubmit) onSubmit(url, label, kind);
  };

  return { url, label, kind, isDetected, canSubmit, setLabel, handleUrlChange, handleKindChange, handleSubmit };
}

function LinkComposer({
  preset,
  onSubmit,
  onCancel,
}: {
  preset: ComposerPreset;
  onSubmit: (url: string, label: string, kind: UrlLinkKind) => void;
  onCancel: () => void;
}) {
  const composer = useLinkComposer(preset, onSubmit);
  return (
    <form
      onSubmit={composer.handleSubmit}
      className="space-y-2.5 rounded-[var(--p-radius-md)] border border-[var(--s-brand-border)]! bg-[var(--s-surface-panel)] p-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={composer.kind}
          onValueChange={composer.handleKindChange}
          aria-label="Link type"
        >
          {URL_LINK_KINDS.map((kind) => {
            const { icon: KindIcon, label } = LINK_KIND_CONFIG[kind];
            return (
              <ToggleGroupItem key={kind} value={kind} className="gap-1.5 px-2 text-[12px]">
                <KindIcon className="size-3.5" strokeWidth={1.75} aria-hidden />
                {kind === "pr" ? "PR" : label}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
        {composer.isDetected && (
          <span className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.6px] text-[var(--s-success-fg)]">
            <Check className="size-3" aria-hidden />
            Auto-detected
          </span>
        )}
      </div>
      <Input
        autoFocus
        aria-label="Link URL"
        placeholder={URL_PLACEHOLDER[composer.kind]}
        value={composer.url}
        onChange={(event) => composer.handleUrlChange(event.target.value)}
        className="font-mono text-[12px]"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label="Link label (optional)"
          placeholder="Label (optional) — e.g. Grid v2, Page 2"
          value={composer.label}
          onChange={(event) => composer.setLabel(event.target.value)}
          className="min-w-[180px] flex-1"
        />
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={!composer.canSubmit}>
          Add link
        </Button>
      </div>
    </form>
  );
}

function TaskPicker({
  tasks,
  onSelect,
  onCancel,
}: {
  tasks: DashboardTask[];
  onSelect: (task: DashboardTask) => void;
  onCancel: () => void;
}) {
  const stages = (Object.keys(STAGE_CONFIG) as Stage[]).filter((stage) =>
    tasks.some((task) => task.stage === stage),
  );
  return (
    <div className="relative">
      <Command className="border-[var(--s-brand-border)]! bg-[var(--s-surface-panel)] shadow-none">
        <CommandInput autoFocus placeholder="Search dashboard tasks by name or id…" className="pr-8" />
        <CommandList className="max-h-[196px]">
          <CommandEmpty>No task found.</CommandEmpty>
          {stages.map((stage) => (
            <CommandGroup key={stage} heading={STAGE_CONFIG[stage].label}>
              {tasks
                .filter((task) => task.stage === stage)
                .map((task) => (
                  <CommandItem
                    key={task.id}
                    value={`${task.title} ${task.id}`}
                    onSelect={() => onSelect(task)}
                    className="gap-2.5"
                  >
                    <SquareKanban className="size-3.5 shrink-0 text-[var(--s-ink-muted)]" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1 truncate text-[12.5px]">{task.title}</span>
                    <span className="shrink-0 font-mono text-[10.5px] text-[var(--s-ink-muted)]">
                      {task.id.slice(0, 8)}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
      <IconButton size="xs" aria-label="Close task search" className="absolute right-3 top-3.5" onClick={onCancel}>
        <X />
      </IconButton>
    </div>
  );
}

function LinksEmptyState({ onOpen }: { onOpen: (preset: ComposerPreset) => void }) {
  return (
    <div className="rounded-[var(--p-radius-md)] border border-dashed border-[var(--s-border-strong)]! px-4 py-4">
      <p className="m-0 text-[13px] font-medium text-[var(--s-ink-primary)]">No design additions yet</p>
      <p className="m-0 mt-0.5 text-[12px] leading-[1.5] text-[var(--s-ink-muted)]">
        Attach a new story, a Figma file or link a related task — Dev picks up the latest proposal from here.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Button variant="outline" size="sm" onClick={() => onOpen({ mode: "url", kind: "story" })}>
          <Component aria-hidden />
          Story
        </Button>
        <Button variant="outline" size="sm" onClick={() => onOpen({ mode: "url", kind: "figma" })}>
          <Figma aria-hidden />
          Figma
        </Button>
        <Button variant="outline" size="sm" onClick={() => onOpen({ mode: "task" })}>
          <SquareKanban aria-hidden />
          Task
        </Button>
        <Button variant="outline" size="sm" onClick={() => onOpen({ mode: "url", kind: "link" })}>
          <Link2 aria-hidden />
          Other link
        </Button>
      </div>
    </div>
  );
}

function LinkedResources({
  links,
  composer,
  linkableTasks,
  onOpenComposer,
  onCloseComposer,
  onAddUrl,
  onAddTask,
  onRemove,
}: {
  links: LinkedResource[];
  composer: ComposerPreset;
  linkableTasks: DashboardTask[];
  onOpenComposer: (preset: ComposerPreset) => void;
  onCloseComposer: () => void;
  onAddUrl: (url: string, label: string, kind: UrlLinkKind) => void;
  onAddTask: (task: DashboardTask) => void;
  onRemove: (id: string) => void;
}) {
  const hasLinks = links.length > 0;
  return (
    <section aria-labelledby="tm-links-heading" className="min-w-0">
      <div className="mb-1.5 flex items-center gap-2">
        <h3 id="tm-links-heading" className={cn(monoLabel, "m-0")}>
          Linked resources
        </h3>
        {hasLinks && <span className="font-mono text-[10.5px] text-[var(--s-ink-muted)]">{links.length}</span>}
        {hasLinks && composer.mode === "closed" && (
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onOpenComposer({ mode: "task" })}>
              <SquareKanban aria-hidden />
              Link task
            </Button>
            <Button variant="outline" size="sm" onClick={() => onOpenComposer({ mode: "url" })}>
              <Plus aria-hidden />
              Add link
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {hasLinks && (
          <ul className="divide-y divide-[var(--s-border-subtle)] overflow-hidden rounded-[var(--p-radius-md)] border border-[var(--s-border-subtle)]">
            {links.map((link) => (
              <LinkedResourceRow key={link.id} link={link} onRemove={onRemove} />
            ))}
          </ul>
        )}
        {composer.mode === "url" && (
          <LinkComposer preset={composer} onSubmit={onAddUrl} onCancel={onCloseComposer} />
        )}
        {composer.mode === "task" && (
          <TaskPicker tasks={linkableTasks} onSelect={onAddTask} onCancel={onCloseComposer} />
        )}
        {!hasLinks && composer.mode === "closed" && <LinksEmptyState onOpen={onOpenComposer} />}
      </div>
    </section>
  );
}

function useTaskModalLab({
  task,
  initialLinks,
  initialComposer,
  initialFiles,
}: {
  task: TaskFixture;
  initialLinks: LinkedResource[];
  initialComposer: ComposerPreset;
  initialFiles: AttachedFile[];
}) {
  const [open, setOpen] = useState(true);
  const [links, setLinks] = useState(initialLinks);
  const [composer, setComposer] = useState(initialComposer);
  const [files, setFiles] = useState(initialFiles);
  const [description, setDescription] = useState(task.description);
  const [descriptionMode, setDescriptionMode] = useState<DescriptionMode>("preview");

  const linkableTasks = DASHBOARD_TASKS.filter(
    (candidate) => candidate.id !== task.id && !links.some((link) => link.href.endsWith(candidate.id)),
  );

  const closeComposer = () => setComposer({ mode: "closed" });

  const addUrlLink = (url: string, label: string, kind: UrlLinkKind) => {
    const described = describeUrl(url, kind);
    const link: LinkedResource = {
      id: `link-${Date.now()}`,
      kind,
      title: label.trim() || described.title,
      href: url.trim(),
      meta: described.meta,
      addedBy: CURRENT_USER,
      addedAt: "just now",
    };
    setLinks((current) => [...current, link]);
    closeComposer();
  };

  const addTaskLink = (linkedTask: DashboardTask) => {
    const link: LinkedResource = {
      id: `link-${linkedTask.id}`,
      kind: "task",
      title: linkedTask.title,
      href: `#task/${linkedTask.id}`,
      meta: linkedTask.owner,
      addedBy: CURRENT_USER,
      addedAt: "just now",
      stage: linkedTask.stage,
    };
    setLinks((current) => [...current, link]);
    closeComposer();
  };

  const removeLink = (id: string) => setLinks((current) => current.filter((link) => link.id !== id));

  const addFiles = (fileList: FileList) => {
    const added = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: file.size,
    }));
    setFiles((current) => [...current, ...added]);
  };

  const removeFile = (id: string) => setFiles((current) => current.filter((file) => file.id !== id));

  return {
    open,
    setOpen,
    links,
    composer,
    setComposer,
    closeComposer,
    linkableTasks,
    addUrlLink,
    addTaskLink,
    removeLink,
    files,
    addFiles,
    removeFile,
    description,
    setDescription,
    descriptionMode,
    setDescriptionMode,
  };
}

function keepComposerFocus(event: Event) {
  event.preventDefault();
  const content = event.currentTarget;
  if (content instanceof HTMLElement && !content.contains(document.activeElement)) content.focus();
}

function TaskModalLab({
  task,
  initialLinks = [],
  initialComposer = { mode: "closed" },
  initialFiles = [],
}: {
  task: TaskFixture;
  initialLinks?: LinkedResource[];
  initialComposer?: ComposerPreset;
  initialFiles?: AttachedFile[];
}) {
  const lab = useTaskModalLab({ task, initialLinks, initialComposer, initialFiles });

  return (
    <TooltipProvider delayDuration={300}>
      <div className="grid min-h-screen place-items-center bg-[var(--s-surface-page)]">
        {!lab.open && (
          <Button variant="primary" onClick={() => lab.setOpen(true)}>
            Reopen task
          </Button>
        )}
        <Dialog open={lab.open} onOpenChange={lab.setOpen}>
          <DialogContent
            onOpenAutoFocus={keepComposerFocus}
            className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 outline-none sm:max-w-[1040px]"
          >
            <TaskModalHeader task={task} />
            <OriginLinks task={task} />
            <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto px-6 py-5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] [scrollbar-color:var(--s-border-strong)_transparent] [scrollbar-width:thin]">
              <TaskFields task={task} files={lab.files} onAddFiles={lab.addFiles} onRemoveFile={lab.removeFile} />
              <div className="flex min-w-0 flex-col gap-5">
                <DescriptionPanel
                  value={lab.description}
                  mode={lab.descriptionMode}
                  onChange={lab.setDescription}
                  onModeChange={lab.setDescriptionMode}
                />
                <LinkedResources
                  links={lab.links}
                  composer={lab.composer}
                  linkableTasks={lab.linkableTasks}
                  onOpenComposer={lab.setComposer}
                  onCloseComposer={lab.closeComposer}
                  onAddUrl={lab.addUrlLink}
                  onAddTask={lab.addTaskLink}
                  onRemove={lab.removeLink}
                />
              </div>
            </div>
            <footer className="flex flex-wrap items-center gap-3 border-t border-[var(--s-border-subtle)] px-6 py-3.5">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--s-ink-muted)]">
                <History className="size-3.5" strokeWidth={1.75} aria-hidden />
                {task.updatedLabel}
              </span>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => lab.setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary">Update Task</Button>
              </div>
            </footer>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

/** DesignReview — task da automação já revisada: origem em destaque + 3 links do designer. */
export const DesignReview: Story = {
  render: () => <TaskModalLab task={DESIGN_REVIEW_TASK} initialLinks={DESIGN_REVIEW_LINKS} />,
};

/** IdeationEmpty — protótipo de engenharia recém-chegado; nenhum link do designer ainda. */
export const IdeationEmpty: Story = {
  render: () => <TaskModalLab task={IDEATION_TASK} />,
};

/** AddingLink — designer cola uma URL do Figma; o tipo é detectado e o label sugerido. */
export const AddingLink: Story = {
  render: () => (
    <TaskModalLab
      task={DESIGN_REVIEW_TASK}
      initialLinks={DESIGN_REVIEW_LINKS.slice(0, 1)}
      initialComposer={{
        mode: "url",
        url: "https://www.figma.com/design/k3Yp9Q/Catalog-Explorations?node-id=2-14",
      }}
    />
  ),
};

/** LinkingTask — busca de tasks do dashboard para vincular um card ao outro. */
export const LinkingTask: Story = {
  render: () => (
    <TaskModalLab task={IDEATION_TASK} initialComposer={{ mode: "task" }} />
  ),
};

/** WithAttachments — attachments compacto com arquivos (um acima de 500KB). */
export const WithAttachments: Story = {
  render: () => (
    <TaskModalLab task={DESIGN_REVIEW_TASK} initialLinks={DESIGN_REVIEW_LINKS} initialFiles={ATTACHED_FILES} />
  ),
};
