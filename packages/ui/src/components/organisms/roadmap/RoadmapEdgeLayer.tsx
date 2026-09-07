// Origin: agent
import React, { useId, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { RoadmapDocument, RoadmapEdge } from './contract';
import { resolveEdgeArrow, resolveEdgeStyle } from './contract';
import { routeEdge, type EdgePoint, type EdgeRect, type PathSpec } from './layout';

interface MeasuredEdge { edge: RoadmapEdge; path: PathSpec }
interface Props { containerRef: RefObject<HTMLDivElement>; document: RoadmapDocument; testIdPrefix: string; debugPerf?: boolean }
function Edge({ edge, path, instance, prefix }: MeasuredEdge & { instance: string; prefix: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [midpoint, setMidpoint] = useState<EdgePoint>();
  useLayoutEffect(() => {
    const element = pathRef.current;
    if (edge.label && element?.getTotalLength && path.d) {
      const p = element.getPointAtLength(element.getTotalLength() / 2);
      setMidpoint({ x: p.x, y: p.y });
    } else setMidpoint(undefined);
  }, [path.d, edge.label]);
  const arrow = resolveEdgeArrow(edge), style = resolveEdgeStyle(edge);
  const marker = `${instance}-${edge.id}`;
  const color = edge.tone ? `var(--c-roadmap-${edge.tone}-edge)` : 'var(--c-roadmap-edge)';
  return <g style={{ color }} data-roadmap-edge={edge.id}>
    {arrow !== 'none' && <defs><marker id={marker} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M 0 0 L 8 4 L 0 8 Z" fill="currentColor" /></marker></defs>}
    <path ref={pathRef} data-testid={`${prefix}-edge`} data-edge-id={edge.id} data-source={edge.source} data-target={edge.target}
      d={path.d} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={style === 'solid' ? undefined : style === 'dotted' ? '0.8 4' : '0.8 8'}
      className="[stroke-width:2px] md:[stroke-width:3px]"
      markerStart={arrow === 'both' ? `url(#${marker})` : undefined} markerEnd={arrow !== 'none' ? `url(#${marker})` : undefined} />
    {edge.label && midpoint && <foreignObject data-testid={`${prefix}-edge-label`} data-edge-id={edge.id} x={midpoint.x} y={midpoint.y} width="1" height="1" overflow="visible">
      <div className="w-max max-w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--c-roadmap-edge-label-bg)] px-2 py-0.5 text-center text-xs leading-normal text-[var(--c-roadmap-edge-label-fg)] [overflow-wrap:anywhere]"
        style={{ boxShadow: '0 0 0 2px var(--c-roadmap-surface)' }}>{edge.label}</div>
    </foreignObject>}
  </g>;
}

/** One observer and one scheduled frame for the entire map. No scroll listener. */
export function RoadmapEdgeLayer({ containerRef, document: documentModel, testIdPrefix, debugPerf }: Props) {
  const instance = `roadmap-${useId().replace(/:/g, '')}`;
  const [measured, setMeasured] = useState<MeasuredEdge[]>([]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !documentModel.edges.length) { setMeasured([]); return; }
    let disposed = false, frame = 0;
    const observed = new Set<Element>();
    const measure = () => {
      frame = 0;
      if (disposed) return;
      const started = performance.now();
      const root = container.getBoundingClientRect();
      const boxes = new Map<string, EdgeRect>();
      // Read every border before React writes any new SVG paths.
      for (const wrapper of container.querySelectorAll<HTMLElement>('[data-roadmap-node]')) {
        if (wrapper.closest('[data-roadmap-grid]') !== container) continue;
        const id = wrapper.dataset.roadmapNode!;
        const border = Array.from(wrapper.querySelectorAll<HTMLElement>('[data-roadmap-node-box]')).find(el => el.dataset.roadmapNodeBox === id);
        // A custom renderer without a marker uses its first element's border.
        // Text-only custom content uses the padded wrapper as a final fallback.
        const element = border ?? wrapper.firstElementChild ?? wrapper;
        for (const target of [wrapper, element]) if (!observed.has(target)) { observer?.observe(target); observed.add(target); }
        const rect = element.getBoundingClientRect();
        boxes.set(id, { left: rect.left - root.left, right: rect.right - root.left, top: rect.top - root.top, bottom: rect.bottom - root.top });
      }
      for (const element of observed) if (!container.contains(element)) { observer?.unobserve(element); observed.delete(element); }
      const obstacles = [...boxes.values()];
      const next = documentModel.edges.flatMap(edge => {
        const source = boxes.get(edge.source), target = boxes.get(edge.target);
        return source && target ? [{ edge, path: routeEdge(source, target, edge, obstacles) }] : [];
      });
      setMeasured(next);
      if (debugPerf) performance.measure('roadmap:edges', { start: started, end: performance.now() });
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(measure); };
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    observer?.observe(container);
    // Child replacement can keep both the count and the container size equal.
    // Ignore our own SVG writes, or every label update would create a loop.
    const mutations = new MutationObserver(records => {
      if (records.some(record => (record.target instanceof Element ? record.target : record.target.parentElement)?.closest('[data-roadmap-node]'))) schedule();
    });
    mutations.observe(container, { childList: true, subtree: true, characterData: true, attributes: true });
    const fonts = container.ownerDocument.fonts;
    fonts?.ready.then(schedule);
    fonts?.addEventListener('loadingdone', schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect(); mutations.disconnect();
      fonts?.removeEventListener('loadingdone', schedule);
    };
  }, [containerRef, documentModel, debugPerf]);
  return <svg data-testid={`${testIdPrefix}-edges`} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible">
    {measured.map(item => <Edge key={item.edge.id} {...item} instance={instance} prefix={testIdPrefix} />)}
  </svg>;
}
