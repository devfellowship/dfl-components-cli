import { test as base, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
const fixture = (name: string) => JSON.parse(readFileSync(new URL(`../src/components/organisms/roadmap/__fixtures__/${name}.json`, import.meta.url), 'utf8'));
const vocabulary = fixture('vocabulary');
const frontend = fixture('roadmapsh-frontend');
const longMap = fixture('long-5000');

const prefix = 'components-organisms-roadmap--';
const test = base.extend<{ pageErrors: string[] }>({
  // Auto fixture arms before navigation in every test, including the index sweep.
  pageErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await use(errors);
    expect(errors, 'Uncaught browser errors').toEqual([]);
  }, { auto: true }],
});

async function openStory(page: Page, story: string) {
  await page.goto(`/iframe.html?id=${prefix}${story}&viewMode=story`);
  await expect(page.locator('[data-roadmap-node-box]').first()).toBeVisible();
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
  await page.evaluate(() => document.fonts.ready);
}

// Measure distance to the BORDER, not distance to the filled rectangle. An
// endpoint in the middle of a node must fail as surely as one outside the node.
async function edgeGeometry(page: Page) {
  return page.evaluate(() => {
    const paths = [...document.querySelectorAll<SVGPathElement>('path[data-edge-id]')];
    const failures: string[] = [];
    let maxError = 0;
    for (const path of paths) {
      const grid = path.closest('[data-roadmap-grid]')!;
      const transform = path.getScreenCTM();
      if (!transform) throw new Error('Edge has no screen transform');
      for (const [id, position] of [[path.dataset.source, 0], [path.dataset.target, path.getTotalLength()]] as const) {
        const box = [...grid.querySelectorAll<HTMLElement>('[data-roadmap-node-box]')].find(node => node.dataset.roadmapNodeBox === id);
        if (!box) throw new Error(`Missing endpoint node ${id}`);
        const p = path.getPointAtLength(position).matrixTransform(transform);
        const r = box.getBoundingClientRect();
        const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));
        const distance = Math.min(
          Math.hypot(p.x - r.left, p.y - clamp(p.y, r.top, r.bottom)),
          Math.hypot(p.x - r.right, p.y - clamp(p.y, r.top, r.bottom)),
          Math.hypot(p.x - clamp(p.x, r.left, r.right), p.y - r.top),
          Math.hypot(p.x - clamp(p.x, r.left, r.right), p.y - r.bottom),
        );
        maxError = Math.max(maxError, distance);
        if (distance > 1) failures.push(`${path.dataset.edgeId} -> ${id}: ${distance.toFixed(3)}px`);
      }
    }
    return { count: paths.length, maxError, failures };
  });
}

async function expectEdges(page: Page, count: number) {
  await expect(page.locator('path[data-edge-id]')).toHaveCount(count);
  await expect.poll(async () => (await edgeGeometry(page)).failures).toEqual([]);
  return edgeGeometry(page);
}

for (const width of [360, 390]) {
  test(`${width}px uses three tracks with readable labels and no overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openStory(page, `viewport-${width}`);
    const metrics = await page.evaluate(() => {
      const grid = document.querySelector('[data-roadmap-grid]')!;
      const labels = [...document.querySelectorAll<HTMLElement>('[data-testid="roadmap-node-label"]')];
      const js = document.querySelector('[data-roadmap-node="js"] [data-testid="roadmap-node-label"]')!;
      const range = document.createRange(); range.selectNodeContents(js);
      return {
        tracks: getComputedStyle(grid).gridTemplateColumns.split(' ').map(Number.parseFloat),
        fonts: labels.map(label => Number.parseFloat(getComputedStyle(label).fontSize)),
        width: document.documentElement.scrollWidth,
        js: js.textContent, jsLines: range.getClientRects().length,
      };
    });
    expect(metrics.tracks).toHaveLength(3);
    expect(metrics.tracks.every(track => track > 0)).toBe(true);
    expect(metrics.fonts.length).toBe(vocabulary.nodes.length);
    expect(Math.min(...metrics.fonts)).toBeGreaterThanOrEqual(12);
    expect(metrics.width).toBeLessThanOrEqual(width);
    expect(metrics.js).toBe('JavaScript');
    expect(metrics.jsLines).toBe(1);
  });
}

test('a narrow container keeps its mobile layout inside a wide viewport', async ({ page }) => {
  await openStory(page, 'viewport-360');
  const metrics = await page.locator('[data-testid="roadmap"]').evaluate(root => ({
    width: root.getBoundingClientRect().width,
    titleFont: getComputedStyle(root.querySelector('[data-testid="roadmap-node-label"]')!).fontSize,
    overflow: root.scrollWidth > root.clientWidth,
  }));
  expect(metrics).toEqual({ width: 360, titleFont: '18px', overflow: false });
});

test('empty side tracks collapse while the title spans the usable width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await openStory(page, 'center-column-only');
  const read = () => page.evaluate(() => {
    const grid = document.querySelector('[data-roadmap-grid]')!;
    const title = document.querySelector('[data-roadmap-node="Start"]')!;
    const topic = document.querySelector('[data-roadmap-node="Internet"]')!;
    return {
      tracks: getComputedStyle(grid).gridTemplateColumns.split(' ').map(Number.parseFloat),
      title: title.getBoundingClientRect().width, topic: topic.getBoundingClientRect().width,
      grid: grid.getBoundingClientRect().width,
    };
  });
  const collapsed = await read();
  expect(collapsed.tracks[0]).toBe(0);
  expect(collapsed.tracks[2]).toBe(0);
  expect(collapsed.tracks[1]).toBeGreaterThan(350);
  expect(collapsed.title).toBeCloseTo(collapsed.grid, 1);
  expect(collapsed.topic).toBeCloseTo(collapsed.grid, 1);
  await openStory(page, 'reserved-empty-columns');
  const reserved = await read();
  expect(reserved.tracks.every(track => track > 0)).toBe(true);
  expect(reserved.title).toBeCloseTo(reserved.grid, 1);
  expect(reserved.topic).toBeLessThan(reserved.grid / 2);
});

test('long map scrolls normally and every edge follows node borders after resize', async ({ page }, info) => {
  await openStory(page, 'fixture-long-5000');
  await expect(page.locator('[data-roadmap-node-box]')).toHaveCount(longMap.nodes.length);
  expect(longMap.nodes.length).toBeGreaterThanOrEqual(200);
  const height = await page.locator('[data-testid="roadmap"]').evaluate(el => el.getBoundingClientRect().height);
  expect(height).toBeGreaterThanOrEqual(5000);
  const measurements = [];
  for (const width of [1280, 390, 360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    measurements.push({ width, ...await expectEdges(page, longMap.edges.length) });
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(4000);
  await expect(page.locator('[data-roadmap-node-box]').last()).toBeInViewport();
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByTestId('roadmap-edges')).toBeHidden();
  await info.attach('long-map-geometry', { body: JSON.stringify({ height, nodes: longMap.nodes.length, measurements }), contentType: 'application/json' });
});

for (const [story, count] of [['edge-with-label', 1], ['edge-without-label', 1], ['edge-dashed', 1], ['edge-dotted-elbow-arrow', 1], ['fan-out', 6]] as const) {
  test(`${story}: paths and label chips follow their nodes`, async ({ page }) => {
    await openStory(page, story);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await expectEdges(page, count);
      await expect.poll(() => page.evaluate(() => {
        return [...document.querySelectorAll<SVGForeignObjectElement>('foreignObject[data-edge-id]')].map(label => {
          const path = [...label.parentElement!.querySelectorAll<SVGPathElement>('path[data-edge-id]')].find(path => path.dataset.edgeId === label.dataset.edgeId)!;
          const middle = path.getPointAtLength(path.getTotalLength() / 2).matrixTransform(path.getScreenCTM()!);
          const chip = label.firstElementChild!.getBoundingClientRect();
          return Math.hypot(middle.x - (chip.left + chip.width / 2), middle.y - (chip.top + chip.height / 2)) <= 1;
        });
      })).toEqual(story === 'edge-with-label' || story === 'edge-dotted-elbow-arrow' ? [true] : []);
    }
  });
}

type GroupDocument = {
  nodes: { id: string; order: number; column: string; span?: number }[];
  groups: { id: string; from: number; to: number; columns?: string[] }[];
};
const basics = { nodes: ['Internet', 'HTML', 'CSS', 'JavaScript'].map((id, i) => ({ id, order: i + 1, column: 'center' })), groups: [{ id: 'basics', from: 1, to: 4 }] };
const groupedDocuments: Record<string, GroupDocument> = {
  'group-titled': basics,
  'group-dark-background': { ...basics, groups: [{ ...basics.groups[0], columns: ['center'] }] },
  'group-three-columns': {
    nodes: ['html', 'css', 'js', 'accessibility', 'practice', 'review'].map((id, i) => ({ id, order: Math.floor(i / 3), column: ['left', 'center', 'right'][i % 3] })),
    groups: [{ id: 'vocabulary', from: 0, to: 1 }],
  },
  'group-column-subsets': {
    nodes: ['Left', 'Center', 'Right'].map((id, i) => ({ id, order: 0, column: ['left', 'center', 'right'][i] })),
    groups: [{ id: 'sides', from: 0, to: 0, columns: ['left', 'right'] }, { id: 'middle', from: 0, to: 0, columns: ['center'] }],
  },
  'viewport-1280': vocabulary,
  'fixture-roadmapsh-frontend': frontend,
  'fixture-long-5000': longMap,
};

for (const width of [360, 390, 1280]) {
  test(`${width}px groups contain every declared member with clear titles`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    let checked = 0;
    for (const [story, model] of Object.entries(groupedDocuments)) {
      await openStory(page, story);
      const result = await page.evaluate(model => {
        const problems: string[] = [];
        let members = 0;
        for (const group of model.groups) {
          const boxes = [...document.querySelectorAll<HTMLElement>('[data-group-id]')].filter(el => el.dataset.groupId === group.id);
          if (!boxes.length) throw new Error(`Missing group ${group.id}`);
          const columns = group.columns ?? ['left', 'center', 'right'];
          for (const node of model.nodes.filter(node => node.order >= group.from && node.order <= group.to && columns.includes(node.column))) {
            const element = [...document.querySelectorAll<HTMLElement>('[data-roadmap-node-box]')].find(el => el.dataset.roadmapNodeBox === node.id);
            if (!element) throw new Error(`Missing group member ${node.id}`);
            const n = element.getBoundingClientRect();
            if (!boxes.some(box => { const g = box.getBoundingClientRect(); return n.left >= g.left - 1 && n.right <= g.right + 1 && n.top >= g.top - 1 && n.bottom <= g.bottom + 1; })) problems.push(`${group.id}/${node.id} outside painted group`);
            for (const title of boxes.flatMap(box => [...box.querySelectorAll<HTMLElement>('[title]')])) {
              const t = title.firstElementChild!.getBoundingClientRect();
              const label = element.querySelector('[data-testid="roadmap-node-label"]');
              if (!label) throw new Error(`Missing node label ${node.id}`);
              const text = label.getBoundingClientRect();
              if (Math.min(t.right, text.right) > Math.max(t.left, text.left) && Math.min(t.bottom, text.bottom) > Math.max(t.top, text.top)) problems.push(`${group.id} title overlaps ${node.id}`);
            }
            members++;
          }
        }
        return { members, problems };
      }, model);
      expect(result.problems, story).toEqual([]);
      expect(result.members, story).toBeGreaterThan(0);
      if (story === 'group-titled' || story === 'group-dark-background') expect(result.members).toBe(4);
      checked += result.members;
    }
    await info.attach('group-members', { body: JSON.stringify({ width, checked }), contentType: 'application/json' });
  });
}

for (const width of [360, 390]) {
  test(`${width}px simple mobile sequence keeps border gaps at most 24px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const story of ['sequence', 'group-titled', 'group-dark-background']) {
      await openStory(page, story);
      const gaps = await page.evaluate(() => {
        const boxes = ['Internet', 'HTML', 'CSS', 'JavaScript'].map(id => document.querySelector(`[data-roadmap-node-box="${id}"]`)!.getBoundingClientRect());
        return boxes.slice(1).map((box, i) => box.top - boxes[i].bottom);
      });
      expect(gaps).toHaveLength(3);
      expect(Math.min(...gaps)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...gaps), story).toBeLessThanOrEqual(24);
    }
  });
}

test('137-node fixture recomputes edges in at most 16ms median over 20 actual resizes', async ({ page }, info) => {
  await openStory(page, 'perf-recompute-137');
  await expect(page.locator('[data-roadmap-node]')).toHaveCount(137);
  await expect(page.locator('[data-roadmap-node-box]')).toHaveCount(136);
  await expect(page.getByRole('complementary', { name: 'Legend' })).toBeVisible();
  await expectEdges(page, frontend.edges.length);
  await page.getByRole('button', { name: 'Measure 20 resizes' }).click();
  const output = page.getByTestId('roadmap-perf-ms');
  await expect(output).toHaveAttribute('data-samples', '20', { timeout: 30_000 });
  const median = Number.parseFloat(await output.innerText());
  expect(median).toBeGreaterThanOrEqual(0);
  expect(median).toBeLessThanOrEqual(16);
  const samples = await page.evaluate(() => performance.getEntriesByName('roadmap:edges').map(entry => entry.duration));
  expect(samples.length).toBeGreaterThanOrEqual(20);
  await expectEdges(page, frontend.edges.length);
  await info.attach('edge-performance', { body: JSON.stringify({ nodes: 137, resizes: 20, median, samples }), contentType: 'application/json' });
});

test('every current Roadmap story renders positive content without browser errors', async ({ page, request, pageErrors }) => {
  test.setTimeout(180_000);
  const response = await request.get('/index.json');
  expect(response.ok()).toBe(true);
  const index = await response.json();
  const stories = Object.values(index.entries).filter((entry: any) => entry.type === 'story' && entry.id.startsWith(prefix)) as { id: string }[];
  expect(stories.length).toBeGreaterThanOrEqual(27);
  for (const story of stories) {
    await test.step(story.id, async () => {
      await openStory(page, story.id.slice(prefix.length));
      expect(await page.locator('[data-roadmap-node-box]').count()).toBeGreaterThan(0);
      await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
      expect(pageErrors, story.id).toEqual([]);
    });
  }
});
