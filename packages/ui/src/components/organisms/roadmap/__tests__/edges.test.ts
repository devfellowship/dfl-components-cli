// Origin: agent
import { describe, expect, it } from 'vitest';
import { routeEdge, type EdgeRect } from '../layout';
const source: EdgeRect = { left: 100, right: 200, top: 0, bottom: 40 };
const edge = { id: 'e', source: 'a', target: 'b' };
describe('edge geometry', () => {
  it('anchors same-column auto edges on the facing borders', () => {
    expect(routeEdge(source, { ...source, top: 100, bottom: 140 }, edge).d).toBe('M 150 40 L 150 100');
  });
  it('anchors reverse edges and cross-column curves on facing borders', () => {
    const target = { left: 250, right: 350, top: 100, bottom: 140 };
    expect(routeEdge(source, target, edge)).toMatchObject({ start: { x: 200, y: 20 }, end: { x: 250, y: 120 } });
    expect(routeEdge(source, target, edge).d).toContain(' C ');
    expect(routeEdge({ ...source, top: 100, bottom: 140 }, source, edge).d).toBe('M 150 100 L 150 40');
  });
  it('takes a gutter detour around intervening nodes', () => {
    const target = { left: 400, right: 500, top: 0, bottom: 40 };
    const obstacle = { left: 250, right: 350, top: -10, bottom: 70 };
    const result = routeEdge(source, target, { ...edge, route: 'elbow' }, [source, target, obstacle]);
    expect(result.points!.some(p => p.y < -10 || p.y > 70)).toBe(true);
    for (let i = 1; i < result.points!.length; i++) {
      const a = result.points![i - 1], b = result.points![i];
      const crosses = a.x === b.x
        ? a.x > obstacle.left && a.x < obstacle.right && Math.max(a.y,b.y) > obstacle.top && Math.min(a.y,b.y) < obstacle.bottom
        : a.y > obstacle.top && a.y < obstacle.bottom && Math.max(a.x,b.x) > obstacle.left && Math.min(a.x,b.x) < obstacle.right;
      expect(crosses).toBe(false);
    }
  });
});
