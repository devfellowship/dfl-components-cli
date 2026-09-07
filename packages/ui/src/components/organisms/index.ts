export { LoginPage } from "./LoginPage";
export type { LoginPageProps } from "./LoginPage";

export { LoginScreen } from "./LoginScreen";
export type { LoginScreenProps } from "./LoginScreen";

export {
  UserAvatar,
  getInitials,
  memberHueIndex,
  memberHueVar,
  MEMBER_PALETTE_SIZE,
} from "./UserAvatar";
export type { UserAvatarProps } from "./UserAvatar";

export { UserMenu } from "./UserMenu";
export type { UserMenuProps, UserMenuItem } from "./UserMenu";

export { ConfirmDialog } from "./ConfirmDialog";
export type { ConfirmDialogProps } from "./ConfirmDialog";

export { AppSidebar } from "./AppSidebar";
export type { AppSidebarProps, NavItem, NavGroup, UserInfo } from "./AppSidebar";

export { AppNavbar } from "./AppNavbar";
export type { AppNavbarProps, BreadcrumbEntry, NavbarUserInfo } from "./AppNavbar";

export {
  Gantt,
  clampPct,
  stageProgress,
  resolveWeekCount,
  resolveWeekLabels,
  barGridColumn,
  resolveNameColWidth,
  DEFAULT_NAME_COL_WIDTH,
} from "./Gantt";
export type {
  GanttProps,
  GanttStage,
  GanttMilestone,
  GanttDependency,
} from "./Gantt";

export {
  PublishDrawer,
  parseTags,
  filterPublishableAccounts,
  validatePublishForm,
} from "./PublishDrawer";
export type {
  PublishDrawerProps,
  PublishDrawerSupabase,
  PublisherAccount,
  PublishResult,
  PublishStatus,
} from "./PublishDrawer";

// ─── Roadmap ──────────────────────────────────────────────────────────────────
// Round R1 ships the CONTRACT and the pure layout helpers. The React component
// lands in R2/R3 and re-exports from the same `./roadmap` barrel.
//
// The exports are listed one by one on purpose: the package root is a public
// API, and `export *` would let a later file widen it by accident. The
// roadmap.sh converter is deliberately NOT here — it is a dev tool (plan ADR-9).
export {
  // vocabularies
  ROADMAP_COLUMNS,
  ROADMAP_TONES,
  ROADMAP_NODE_KINDS,
  ROADMAP_NODE_STATES,
  ROADMAP_EDGE_STYLES,
  ROADMAP_EDGE_ROUTES,
  ROADMAP_ARROWS,
  ROADMAP_LEGEND_PLACEMENTS,
  ROADMAP_NODE_ID_PATTERN,
  ROADMAP_EDGE_LABEL_MAX,
  ROADMAP_LABEL_MAX,
  // defaults and resolvers
  DEFAULT_NODE_SPAN,
  DEFAULT_EDGE_STYLE,
  DEFAULT_EDGE_ROUTE,
  DEFAULT_EDGE_ARROW,
  DEFAULT_GROUP_TONE,
  DEFAULT_LEGEND_PLACEMENT,
  DEFAULT_NODE_STATE,
  NODE_KIND_DEFAULT_TONE,
  resolveNodeSpan,
  resolveNodeTone,
  resolveNodeState,
  resolveEdgeStyle,
  resolveEdgeRoute,
  resolveEdgeArrow,
  resolveGroupTone,
  resolveGroupColumns,
  resolveLegendPlacement,
  // schema and parsers
  roadmapDocumentSchema,
  roadmapStateOverlaySchema,
  roadmapStateSchema,
  roadmapNodeSchema,
  roadmapEdgeSchema,
  roadmapGroupSchema,
  roadmapLegendSchema,
  roadmapLegendEntrySchema,
  roadmapIconSchema,
  roadmapActionSchema,
  roadmapLinkSchema,
  roadmapNodeStateSchema,
  parseRoadmapDocument,
  safeParseRoadmapDocument,
  parseRoadmapStateOverlay,
  safeParseRoadmapStateOverlay,
  // pure layout helpers
  columnsCovered,
  columnIndex,
  gridColumnFor,
  rowsOf,
  maxRowOf,
  nodesByRow,
  columnsUsed,
  groupRanges,
  groupColumnRuns,
  validateNoOverlap,
  placeNodes,
  firstFreeRow,
} from "./roadmap";
export type {
  RoadmapColumn,
  RoadmapTone,
  RoadmapNodeKind,
  RoadmapNodeState,
  RoadmapEdgeStyle,
  RoadmapEdgeRoute,
  RoadmapArrow,
  RoadmapLegendPlacement,
  RoadmapIcon,
  RoadmapAction,
  RoadmapLink,
  RoadmapNode,
  RoadmapEdge,
  RoadmapGroup,
  RoadmapLegend,
  RoadmapLegendEntry,
  RoadmapDocument,
  RoadmapStateOverlay,
  RoadmapGroupRange,
  RoadmapOverlap,
  RoadmapPlacement,
} from "./roadmap";

export { Roadmap } from "./roadmap";
export type { RoadmapProps } from "./roadmap";
