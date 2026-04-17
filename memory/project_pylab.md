---
name: PyLab project overview
description: Full-stack Python learning game for life scientists (R users) — architecture, curriculum, and key decisions
type: project
---

PyLab is a gamified Python coding game at /Users/mahfouz/Code/sandbox/intro-to-python-game.

**Why:** Teaching an intro Python course to life scientists (postdocs, PhDs) who already know R. Uses comparative R→Python framing throughout.

**How to apply:** Every challenge should show the R equivalent first. Maintain the life-sciences theme. Keep the competitive/gamified feel (XP, leaderboard, tiers).

**Stack:**
- Backend: Express + Socket.io (real-time leaderboard) + better-sqlite3
- Frontend: Vanilla JS + Monaco editor (VS Code-like editor UX)
- Python runtime: Pyodide (WebAssembly Python in-browser Web Worker)
- CSS: custom design system, GitHub dark theme inspired

**Key files:**
- `src/challenges.js` — 30 R→Python challenges across 6 tiers
- `src/database.js` — SQLite via better-sqlite3, player/submission tracking
- `public/js/pyodide-worker.js` — Python execution Web Worker
- `public/js/app.js` — game controller
- `public/game.html` — main game page with Monaco editor
- `public/leaderboard.html` — full leaderboard page
- `python_for_life_scientists.md` — course curriculum reference

**Challenge tiers (XP):** Nucleotide (100–150) → Amino Acid (200–250) → Organelle (350–400) → Organism (500) → Ecosystem (750–1000) → Bug Hunt (300–500)
- 5 challenges per tier (Nucleotide, Amino Acid, Organelle), 4 Organism, 3 Ecosystem, 8 Bug Hunt = 30 total
- All challenges use life-sciences context (gene expression, sequences, DESeq2, FASTA, etc.)
- Bug Hunt (IDs 23-30): intentional R→Python migration bugs for students to debug

**Multi-player / concurrency:**
- Uses sessionStorage (NOT localStorage) for player identity — each browser tab gets its own identity, enabling multi-tab testing
- POST /api/players broadcasts leaderboard_update to all connected sockets when new student registers
- Socket.io presence: tracks who's online and which challenge they're on; presence:join/update events
- Leaderboard: LEFT JOIN includes all players (even 0 XP)

**Multi-player competitive features:**
- Sprint Race Mode: instructor launches timed race via `/instructor`, all clients auto-navigate and race; 1st/2nd/3rd place get +500/300/150 bonus XP
- Online Presence: Socket.io tracks connected players and current challenge
- Instructor panel at `/instructor` (key: INSTRUCTOR_KEY env var, default PYLAB2024)
- Deployment: `railway.toml` included; NOT compatible with Netlify (needs persistent WebSocket + server)

**Socket.io events:** `sprint:launch`, `sprint:started`, `sprint:state`, `sprint:submit`, `sprint:player_finished`, `sprint:ended`, `sprint:cancel`, `sprint:cancelled`, `presence:join`, `presence:challenge`, `presence:update`, `instructor:join`

**Start:** `npm start` → http://localhost:3000 · Instructor → http://localhost:3000/instructor
