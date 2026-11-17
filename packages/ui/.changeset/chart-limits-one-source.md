---
"@devfellowship/components": minor
---

Decision Card chart limits are one source. New entry `@devfellowship/components/chart-limits` (no React, no import) exports `QUESTION_CHART_LIMITS`; `readChart` uses it. The chart title limit is now 30 characters, the same as every other label (it was 120), so the card never draws a title that the post path (`dfl-os-commands`) refuses. New keys in the limits: `seriesMin`, `categoriesMin`, `lineCategoriesMin`. The post path tests its own limits against this entry.
