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

**Multi-player competitive features:**
- Sprint Race Mode: instructor launches timed race via `/instructor`, all clients auto-navigate and race; 1st/2nd/3rd place get +500/300/150 bonus XP; results modal shown to all on end
- Online Presence: Socket.io tracks connected players and current challenge; shown in lb-sidebar and topbar pill
- Bug Hunt challenges (ids 21-25): intentionally buggy life-sciences code for students to debug and fix
- Instructor panel at `/instructor` (key: INSTRUCTOR_KEY env var, default PYLAB2024)
- Deployment: `railway.toml` included; NOT compatible with Netlify (needs persistent WebSocket + server)

**Socket.io events:** `sprint:launch`, `sprint:started`, `sprint:state`, `sprint:submit`, `sprint:player_finished`, `sprint:ended`, `sprint:cancel`, `sprint:cancelled`, `presence:join`, `presence:challenge`, `presence:update`, `instructor:join`

**Start:** `npm start` → http://localhost:3000 · Instructor → http://localhost:3000/instructor
