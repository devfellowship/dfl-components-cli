---
"@devfellowship/components": minor
---

Add the "Minhas melhorias" tab to `ImprovementsDialog` / `ImprovementsLauncher`: pass `listMine` (new `createImprovementsClient().listMine`, `GET /v1/requests?mine=1`) to list the caller's requests with thread status, task status and the result URL. The list refreshes when the tab opens and right after a submit. Without `listMine` the tab stays hidden. New exports: `ImprovementRequestSummary`, `ImprovementsView`, `improvementStatusLabel`.
