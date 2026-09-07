// Origin: agent
import React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Roadmap } from '../Roadmap';
import type { RoadmapDocument } from '../contract';
let callback: ResizeObserverCallback;
let frame: FrameRequestCallback | undefined;
const disconnect = vi.fn();
const observe = vi.fn();
const fonts = new EventTarget();
const model: RoadmapDocument = { version: 'roadmap/v1', direction: 'down', columns: 3, groups: [], nodes: [{ id: 'a', column: 'center', order: 0, kind: 'topic', label: 'A' }, { id: 'b', column: 'center', order: 1, kind: 'topic', label: 'B' }], edges: [{ id: 'e', source: 'a', target: 'b', arrow: 'both' }] };
let height = 40;
const flush = async () => { await act(async () => { const next = frame; frame = undefined; next?.(0); }); };
beforeEach(() => {
  height = 40; frame = undefined; observe.mockClear(); disconnect.mockClear();
  vi.stubGlobal('ResizeObserver', class { constructor(cb: ResizeObserverCallback) { callback = cb; } observe = observe; unobserve = vi.fn(); disconnect = disconnect; });
  vi.stubGlobal('requestAnimationFrame', vi.fn(cb => { frame = cb; return 1; }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn(() => { frame = undefined; }));
  Object.defineProperty(document, 'fonts', { configurable: true, value: Object.assign(fonts, { ready: new Promise(() => {}) }) });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function(this: HTMLElement) {
    const marked = this.dataset.roadmapNodeBox;
    const top = marked === 'b' ? 100 : 0;
    return { left: marked ? 100 : 0, right: marked ? 200 : 300, top, bottom: top + (marked ? height : 200), width: marked ? 100 : 300, height: marked ? height : 200 } as DOMRect;
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('edge layer lifecycle', () => {
  it('measures borders, batches resizes and refreshes child sizes without a container resize', async () => {
    const view = render(<Roadmap document={model} />); await flush();
    expect(view.getByTestId('roadmap-edge').getAttribute('d')).toBe('M 150 40 L 150 100');
    expect(observe).toHaveBeenCalledWith(view.container.querySelector('[data-roadmap-node-box="a"]'));
    height = 64;
    await act(async () => { callback([], {} as ResizeObserver); callback([], {} as ResizeObserver); });
    await flush();
    expect(view.getByTestId('roadmap-edge').getAttribute('d')).toBe('M 150 64 L 150 100');
    expect(frame).toBeUndefined();
  });
  it('refreshes same-count documents, custom border replacements and font completion', async () => {
    const view = render(<Roadmap document={model} />); await flush();
    view.rerender(<Roadmap document={{ ...model, edges: [{ ...model.edges[0], source: 'b', target: 'a' }] }} renderNode={node => <section><div data-roadmap-node-box={node.id}>{node.label}</div></section>} />);
    await flush();
    expect(view.getByTestId('roadmap-edge').getAttribute('d')).toBe('M 150 100 L 150 40');
    height = 55;
    await act(async () => fonts.dispatchEvent(new Event('loadingdone'))); await flush();
    expect(view.getByTestId('roadmap-edge').getAttribute('d')).toBe('M 150 100 L 150 55');
    height = 70;
    await act(async () => { view.container.querySelector('[data-roadmap-node-box="a"]')!.textContent = 'Longer content'; }); await flush();
    expect(view.getByTestId('roadmap-edge').getAttribute('d')).toBe('M 150 100 L 150 70');
  });
  it('scopes markers per instance, ignores scroll and cleans pending frames/listeners', async () => {
    const view = render(<><Roadmap document={model} /><Roadmap document={model} testIdPrefix="second" /></>); await flush();
    // Flush a separate mount so the simple rAF stub need not simulate a browser queue.
    view.unmount();
    const first = render(<Roadmap document={model} />); await flush();
    const firstMarker = first.getByTestId('roadmap-edge').getAttribute('marker-end');
    first.unmount();
    const second = render(<Roadmap document={model} />); await flush();
    expect(second.getByTestId('roadmap-edge').getAttribute('marker-end')).not.toBe(firstMarker);
    window.dispatchEvent(new Event('scroll')); expect(frame).toBeUndefined();
    callback([], {} as ResizeObserver); expect(frame).toBeDefined(); second.unmount();
    expect(frame).toBeUndefined(); expect(disconnect).toHaveBeenCalled();
    fonts.dispatchEvent(new Event('loadingdone')); expect(frame).toBeUndefined();
  });
});
