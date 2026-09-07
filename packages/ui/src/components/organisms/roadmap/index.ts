/**
 * The `Roadmap` organism — public surface.
 *
 * Round R1 ships the CONTRACT and the pure layout helpers only. The React
 * component (`Roadmap.tsx`, `RoadmapNode.tsx`, `RoadmapGroup.tsx`,
 * `RoadmapEdgeLayer.tsx`, `RoadmapLegend.tsx`) lands in rounds R2 and R3 and
 * re-exports from here.
 *
 * `convert/fromRoadmapSh` is deliberately ABSENT from this file. It is a dev
 * tool for building fidelity fixtures (plan ADR-9); exporting it would put a
 * closed third-party format in the published bundle.
 */
export * from "./contract";
export * from "./layout";
