---
name: PyLab project overview
description: Full-stack Python learning game for life sciences — architecture and key decisions
type: project
---

PyLab is a gamified Python coding game at /Users/mahfouz/Code/sandbox/intro-to-python-game.

**Why:** Teaching an intro Python course to life sciences professionals (postdocs, PhDs). Needs to be educative, fun, and competitive.

**How to apply:** When adding features, maintain the life-sciences theme for challenge content. Keep the competitive/gamified feel (XP, leaderboard, tiers).

**Stack:**
- Backend: Express + Socket.io (real-time leaderboard) + better-sqlite3
- Frontend: Vanilla JS + Monaco editor (VS Code-like editor UX)
- Python runtime: Pyodide (WebAssembly Python in-browser Web Worker)
- CSS: custom design system, GitHub dark theme inspired

**Key files:**
- `src/challenges.js` — 20 life-science themed challenges (Tier 1–5)
- `src/database.js` — SQLite via better-sqlite3, player/submission tracking
- `public/js/pyodide-worker.js` — Python execution Web Worker
- `public/js/app.js` — game controller
- `public/game.html` — main game page with Monaco editor
- `public/leaderboard.html` — full leaderboard page

**Challenge tiers (XP):** Nucleotide (100–150) → Amino Acid (200–250) → Organelle (350–400) → Organism (500) → Ecosystem (750–1000)

**Test system:** Each challenge has `testCode` (Python strings), executed via `exec()` in Pyodide with `_ns` (student namespace dict) and `_stdout` available. AssertionError messages surface directly to students.

**Start:** `npm start` → http://localhost:3000
