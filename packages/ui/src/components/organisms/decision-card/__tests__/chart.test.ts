// Origin: agent
// Unit tests of the Decision Card micro-chart: the contract check at read time,
// the value axis, and the pixel layout. Ported from dfl-os
// lib/question-chart.test.js (DC P4 T5, dfl-os PR #478) when the card moved here.
import { it } from "vitest";
import { strict as assert } from "node:assert";
import {
  QUESTION_CHART_LIMITS, MIN_CHART_WIDTH, readChart, niceCeil, chartDomain, formatTick, fitLabel, chartLayout, seriesTone,
} from "../chart";

const test = (name: string, fn: () => void) => it(name, fn);
// The contract example of the plan (PR granularity, red / green by size band).
const EXAMPLE = () => ({
  kind: 'stacked_bar',
  title: 'Agent PRs red, by size',
  unit: '% of PRs',
  categories: ['<=50', '51-200', '201-500', '501-1500', '>1500'],
  series: [
    { name: 'red', status: 'red', values: [8.6, 13.3, 19.6, 20.8, 22.9] },
    { name: 'green', status: 'green', values: [91.4, 86.7, 80.4, 79.2, 77.1] },
  ],
  marks: [{ option: 'A', category: '201-500' }, { option: 'B', category: '51-200' }],
  source: 'plan 20261116-pr-granularity-fleet-data v3, 3,700 PRs, 30 days',
})
const with_ = (over: Record<string, unknown>) => ({ ...EXAMPLE(), ...over })

test('the limits are the plan limits (keep equal to T4 in dfl-os-commands)', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(QUESTION_CHART_LIMITS)), {
    kinds: ['bar', 'stacked_bar', 'line'], statuses: ['green', 'red', 'amber', 'neutral'],
    seriesMin: 1, seriesMax: 3, categoriesMin: 1, lineCategoriesMin: 2, categoriesMax: 8,
    labelMax: 30, titleMax: 30, sourceMax: 120,
  })
  assert.ok(Object.isFrozen(QUESTION_CHART_LIMITS))
  assert.equal(MIN_CHART_WIDTH, 320)
})

test('readChart: the plan example is valid and comes back clean', () => {
  const c: any = readChart(EXAMPLE(), ['A', 'B'])
  assert.equal(c.kind, 'stacked_bar')
  assert.equal(c.series.length, 2)
  assert.deepEqual(c.marks, [{ option: 'A', category: '201-500' }, { option: 'B', category: '51-200' }])
  assert.equal(c.source, EXAMPLE().source)
  // No status → a neutral series; no marks → [].
  const plain: any = readChart(with_({ kind: 'bar', series: [{ name: 'runs', values: [1, 2, 3, 4, 5] }], marks: undefined }))
  assert.deepEqual(plain.series[0], { name: 'runs', status: null, values: [1, 2, 3, 4, 5] })
  assert.deepEqual(plain.marks, [])
})

test('readChart: over a limit or not valid → null (the slot renders nothing)', () => {
  const cats9 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
  const s = (name: string, n: number, extra: Record<string, unknown> = {}) => ({ name, values: Array(n).fill(1), ...extra })
  const bad: Record<string, unknown> = {
    'not an object': 'chart',
    'an array': [],
    'unknown kind': with_({ kind: 'pie' }),
    '4 series': with_({ series: [s('a', 5), s('b', 5), s('c', 5), s('d', 5)] }),
    '0 series': with_({ series: [] }),
    '9 categories': with_({ categories: cats9, series: [s('a', 9)], marks: [] }),
    'a label over 30 characters': with_({ categories: ['x'.repeat(31), 'b', 'c', 'd', 'e'], marks: [] }),
    'a series name over 30': with_({ series: [s('n'.repeat(31), 5)], marks: [] }),
    'a unit over 30': with_({ unit: 'u'.repeat(31) }),
    'no source': with_({ source: undefined }),
    'a blank source': with_({ source: '   ' }),
    'a source over 120': with_({ source: 's'.repeat(121) }),
    'no unit': with_({ unit: undefined }),
    'a title over 30': with_({ title: 't'.repeat(31) }),
    'values shorter than categories': with_({ series: [s('a', 4)], marks: [] }),
    'a value that is not a number': with_({ series: [{ name: 'a', values: [1, 2, '3', 4, 5] }], marks: [] }),
    'NaN': with_({ series: [{ name: 'a', values: [1, 2, NaN, 4, 5] }], marks: [] }),
    'a negative bar': with_({ kind: 'bar', series: [{ name: 'a', values: [1, -2, 3, 4, 5] }], marks: [] }),
    'an unknown status': with_({ series: [s('a', 5, { status: 'blue' })], marks: [] }),
    'two series with one name': with_({ series: [s('a', 5), s('a', 5)], marks: [] }),
    'two categories with one name': with_({ categories: ['a', 'a', 'c', 'd', 'e'], marks: [] }),
    'a mark on an unknown category': with_({ marks: [{ option: 'A', category: 'nope' }] }),
    'a mark with both category and value': with_({ marks: [{ option: 'A', category: '<=50', value: 3 }] }),
    'a mark with neither': with_({ marks: [{ option: 'A' }] }),
    'two marks for one option': with_({ marks: [{ option: 'A', category: '<=50' }, { option: 'A', category: '>1500' }] }),
    'a mark that is not a letter': with_({ marks: [{ option: '1', category: '<=50' }] }),
    'a line with one category': with_({ kind: 'line', categories: ['a'], series: [s('a', 1)], marks: [] }),
  }
  for (const [why, raw] of Object.entries(bad)) assert.equal(readChart(raw, ['A', 'B']), null, why)
  // A mark for an option the question does not have.
  assert.equal(readChart(with_({ marks: [{ option: 'C', category: '<=50' }] }), ['A', 'B']), null, 'option C is not on the question')
  // Without option letters (no options known) the letter is only checked for shape.
  assert.ok(readChart(with_({ marks: [{ option: 'C', category: '<=50' }] })))
})

test('readChart: a line may go below 0 and may mark a value', () => {
  const c: any = readChart({ kind: 'line', unit: 'min', categories: ['w1', 'w2', 'w3'], series: [{ name: 'delta', values: [-4, 2, 6] }], marks: [{ option: 'A', value: 5 }], source: 'ci logs' }, ['A'])
  assert.deepEqual(c.marks, [{ option: 'A', value: 5 }])
  assert.deepEqual(chartDomain(c), { min: -5, max: 10, ticks: [-5, 0, 10] })
})

test('the value axis starts at 0; a stacked bar sums its series; nice ticks', () => {
  assert.deepEqual(chartDomain(readChart(EXAMPLE())!), { min: 0, max: 100, ticks: [0, 50, 100] })
  assert.deepEqual(chartDomain(readChart(with_({ kind: 'bar', marks: [] }))!), { min: 0, max: 100, ticks: [0, 50, 100] })
  assert.equal(chartDomain(readChart(with_({ kind: 'bar', series: [{ name: 'a', values: [3, 7, 12, 0, 1] }], marks: [] }))!).max, 20)
  assert.equal(chartDomain(readChart(with_({ kind: 'bar', series: [{ name: 'a', values: [0, 0, 0, 0, 0] }], marks: [] }))!).max, 1)
  assert.deepEqual([0.3, 1, 1.2, 2.2, 4, 7, 23].map(niceCeil), [0.5, 1, 2, 2.5, 5, 10, 25])
  assert.deepEqual([0, 12.5, 1500, 25000, 2500000].map(formatTick), ['0', '12.5', '1500', '25k', '2.5M'])
  assert.equal(fitLabel('201-500', 60), '201-500')
  assert.equal(fitLabel('a very long category label', 30), 'a ve…')
})

test('chartLayout: one group per category, stacked segments fill to the sum, marks above the marked group', () => {
  const c: any = readChart(EXAMPLE(), ['A', 'B'])
  const L = chartLayout(c, 600, 150)
  assert.equal(L.groups.length, 5)
  for (const g of L.groups) {
    assert.equal(g.bars.length, 2)
    // The segments touch: red on the bottom, green on top of it.
    assert.ok(Math.abs(g.bars[0].y - (g.bars[1].y + g.bars[1].h)) < 1e-6)
    // Every bar ends on the 0 line.
    assert.ok(Math.abs(g.bars[0].y + g.bars[0].h - L.y0) < 1e-6)
    assert.ok(g.bars.every(b => b.x >= L.padL && b.x + b.w <= L.padL + L.plotW + 1e-6))
  }
  assert.deepEqual(L.groups[0].bars.map(b => b.tone), ['red', 'green'])
  assert.equal(L.marks.length, 2)
  const a = L.marks.find(m => m.option === "A")!
  const g = L.groups[2]
  assert.ok(a.x > g.x && a.x < g.x + g.w, 'A sits on 201-500')
  assert.ok(a.y <= g.top, 'A sits above the bar')
  assert.ok(L.ticks.some(t => t.value === 0 && Math.abs(t.y - L.y0) < 1e-6))
})

test('chartLayout: grouped bars and lines; neutral palette by position', () => {
  const bar = readChart({ kind: 'bar', unit: 'runs', categories: ['a', 'b', 'c'], series: [{ name: 'x', values: [1, 2, 3] }, { name: 'y', values: [3, 2, 1] }], marks: [{ option: 'A', category: 'b' }, { option: 'B', category: 'b' }], source: 's' })!
  const Lb = chartLayout(bar, 400, 150)
  assert.deepEqual(Lb.groups.map(g => g.bars.length), [2, 2, 2])
  assert.deepEqual(Lb.groups[0].bars.map(b => b.tone), ['n0', 'n1'])
  const [m1, m2] = Lb.marks
  assert.ok(Math.abs((m1.x + m2.x) / 2 - Lb.groups[1].cx) < 1e-6, 'two letters on one category are centred on it')
  assert.ok(m2.x - m1.x >= 14, 'the two letters do not overlap')
  const line = readChart({ kind: 'line', unit: 'min', categories: ['w1', 'w2', 'w3'], series: [{ name: 'p50', status: 'amber', values: [4, 5, 6] }], marks: [{ option: 'A', category: 'w3' }], source: 's' })!
  const Ll = chartLayout(line, 400, 150)
  assert.equal(Ll.lines.length, 1)
  assert.equal(Ll.lines[0].points.length, 3)
  assert.equal(Ll.lines[0].tone, 'amber')
  assert.ok(Ll.groups.every(g => g.bars.length === 0))
  assert.equal(seriesTone({ status: null }, 4), 'n1')
})


test('the limits are one source: readChart and the package entry use the same object', async () => {
  const entry = await import('../chart-limits')
  assert.equal(entry.QUESTION_CHART_LIMITS, QUESTION_CHART_LIMITS)
  // The title is a label: no looser than the other labels, so the post path (labels of 30) and the card agree.
  assert.equal(QUESTION_CHART_LIMITS.titleMax, QUESTION_CHART_LIMITS.labelMax)
  // A title the post path refuses (31 characters) is never drawn; one it accepts (30) is.
  assert.equal(readChart(with_({ title: 't'.repeat(30) }), ['A', 'B'])?.title, 't'.repeat(30))
  assert.equal(readChart(with_({ title: 't'.repeat(31) }), ['A', 'B']), null)
})
