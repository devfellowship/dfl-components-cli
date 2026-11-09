---
"@devfellowship/components": minor
---

Redesign the "sent" state of `ImprovementsDialog` / `ImprovementsLauncher`: a green check icon (success token), the short title "Melhoria enviada" with one line, and an "Abrir thread" button that opens the thread in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) instead of the raw URL. A "Fechar" button closes the dialog. New optional labels: `sentTitle`, `sentHint`, `openThread`, `close`. The `sent` label is kept for compatibility but is no longer shown.
