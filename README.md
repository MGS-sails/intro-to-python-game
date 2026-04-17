# 🧬 PyLab — Python for Life Scientists

A gamified, multiplayer Python coding game for life sciences courses. Students solve bioinformatics-themed challenges in a browser-based VS Code-style editor, earn XP, level up, and compete on a live leaderboard. Instructors can launch timed Sprint races that push a challenge to every student simultaneously.

---

## Table of Contents

1. [What students see](#what-students-see)
2. [Quick start — running locally](#quick-start--running-locally)
3. [How students join](#how-students-join)
   - [Option A — same machine (demo / self-practice)](#option-a--same-machine)
   - [Option B — same Wi-Fi network (classroom)](#option-b--same-wi-fi-network-classroom)
   - [Option C — internet (Railway deployment)](#option-c--internet-railway-deployment)
4. [Testing concurrent sessions locally](#testing-concurrent-sessions-locally)
5. [The instructor panel](#the-instructor-panel)
6. [Challenge curriculum](#challenge-curriculum)
7. [Deploying to Railway](#deploying-to-railway)
8. [Environment variables](#environment-variables)
9. [Tech stack](#tech-stack)

---

## What students see

| Screen | Description |
|--------|-------------|
| **Landing page** `/` | Enter name, pick an avatar, click Start |
| **Game** `/game` | Monaco editor (VS Code-style), challenge description, test results, live leaderboard |
| **Leaderboard** `/leaderboard` | Full rankings with XP, level, and challenge completion |
| **Instructor panel** `/instructor` | Launch Sprint races, see who's online (password-protected) |

Python code runs **entirely in the browser** via [Pyodide](https://pyodide.org) (WebAssembly) — no accounts, no installs, nothing for students to configure. They just open a URL.

---

## Quick start — running locally

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- A terminal

### Steps

```bash
# 1. Clone / download the repo
git clone <your-repo-url>
cd intro-to-python-game

# 2. Install dependencies (takes ~10 seconds)
npm install

# 3. Start the server
npm start
```

You should see:

```
🧬  PyLab running → http://localhost:3000
    Instructor panel → http://localhost:3000/instructor
```

Open `http://localhost:3000` in your browser. That's it.

> **First load note:** The game downloads the Pyodide Python runtime (~10 MB) from a CDN on the first visit. This takes 5–15 seconds depending on internet speed. Subsequent visits are faster because the browser caches it.

---

## How students join

### Option A — same machine

Open multiple browser tabs at `http://localhost:3000`. Each tab can register as a different student. This is the fastest way to test the full experience yourself.

### Option B — same Wi-Fi network (classroom)

This is the **recommended setup for in-person teaching.** You run the server on your laptop; students connect from their own laptops or phones over the room's Wi-Fi.

**Step 1 — find your laptop's local IP address**

| OS | Command |
|----|---------|
| macOS | `ipconfig getifaddr en0` |
| Linux | `hostname -I` |
| Windows | `ipconfig` (look for IPv4 Address under Wi-Fi) |

You'll get something like `192.168.1.42`.

**Step 2 — start the server**

```bash
npm start
```

**Step 3 — tell students the URL**

Write this on the board or share it in the chat:

```
http://192.168.1.42:3000
```

Students open that URL in any modern browser (Chrome / Firefox / Safari) on their laptop. No install needed. They enter their name, pick an avatar, and start coding immediately.

> **Tip:** If students can't connect, check that your laptop's firewall isn't blocking port 3000. On macOS you'll get a popup asking to allow incoming connections — click Allow.

### Option C — internet (Railway deployment)

See the [Deploying to Railway](#deploying-to-railway) section below. Once deployed, you share the Railway URL (e.g. `https://pylab-production.up.railway.app`) and students connect from anywhere.

---

## Testing concurrent sessions locally

Yes — you can fully simulate a classroom of competing students on one machine. Here are three approaches, from quickest to most realistic:

### Method 1: Multiple browser tabs (quickest)

Open 4 tabs, all pointing to `http://localhost:3000`. Register each with a different name (Alice, Bob, Carol, Dave). They all share the same leaderboard and respond to Sprint events simultaneously.

```
Tab 1 → http://localhost:3000  → register as "Alice"
Tab 2 → http://localhost:3000  → register as "Bob"
Tab 3 → http://localhost:3000  → register as "Carol"
Tab 4 → http://localhost:3000/instructor  → instructor panel
```

### Method 2: Multiple browsers (most realistic)

Different browsers maintain completely separate sessions, so you get independent cookies and localStorage.

```
Chrome  → http://localhost:3000  → register as "Alice"
Firefox → http://localhost:3000  → register as "Bob"
Safari  → http://localhost:3000  → register as "Carol"
```

### Method 3: Incognito / private windows

Within the same browser, each incognito window is an independent session.

```
Normal window     → http://localhost:3000  → "Alice"
Incognito window  → http://localhost:3000  → "Bob"
```

### Testing a Sprint race end-to-end

1. Open 3 tabs as three different students (all on `/game`)
2. Open a 4th tab at `http://localhost:3000/instructor`
3. Enter the instructor key (`PYLAB2024` by default)
4. Select a challenge (e.g. "Hello, Lab!") and set 2 minutes
5. Click **Launch Sprint for All Students**
6. Watch all three student tabs react simultaneously:
   - Sprint banner slides in with the challenge name and countdown
   - Each tab navigates to the challenge automatically
7. Solve the challenge in one tab → a medal chip appears on every screen
8. Solve it in another tab → 2nd place awarded
9. When the timer ends → results modal pops on every tab at the same time

---

## The instructor panel

Navigate to `/instructor` (e.g. `http://localhost:3000/instructor`).

**Default key:** `PYLAB2024`

Change it by setting the `INSTRUCTOR_KEY` environment variable before starting the server:

```bash
INSTRUCTOR_KEY=mySecretKey npm start
```

### What the instructor panel does

| Feature | Description |
|---------|-------------|
| **Launch Sprint** | Pushes a timed challenge to all connected students at once |
| **Live finishers** | See who solves the sprint challenge and in what time, in real time |
| **Cancel Sprint** | End the sprint early |
| **Who's online** | See every connected student and which challenge they're working on |

### Sprint bonus XP

| Place | Bonus XP |
|-------|----------|
| 🥇 1st | +500 XP |
| 🥈 2nd | +300 XP |
| 🥉 3rd | +150 XP |
| Others who finish | +50 XP |

Bonus XP stacks on top of the normal challenge XP.

---

## Challenge curriculum

25 challenges across 6 tiers, all using life-sciences context (DNA, proteins, gene expression, spectrophotometry, etc.).

### 🟢 Nucleotide — 100–150 XP (beginner)
| # | Challenge | Concept |
|---|-----------|---------|
| 1 | Hello, Lab! | `print()` |
| 2 | DNA Storage | Variables |
| 3 | Sequence Length | `len()` |
| 4 | GC Content | `.count()` |
| 5 | RNA Transcription | `.replace()` |

### 🔵 Amino Acid — 200–250 XP (easy)
| # | Challenge | Concept |
|---|-----------|---------|
| 6 | Slicing the Genome | String slicing |
| 7 | Protein Inventory | Lists |
| 8 | Temperature Converter | Arithmetic |
| 9 | Cell Counter | `for` loops |
| 10 | Mutation Alert | `if/else`, `in` |

### 🟣 Organelle — 350–400 XP (medium)
| # | Challenge | Concept |
|---|-----------|---------|
| 11 | Codon Dictionary | Dictionaries |
| 12 | Expression Filter | Loops + conditions |
| 13 | Reverse Complement | String methods chained |
| 14 | Lab Statistics | `sum()`, `min()`, `max()` |
| 15 | Reusable Assay | Functions, `def`, `return` |

### 🟡 Organism — 500 XP (hard)
| # | Challenge | Concept |
|---|-----------|---------|
| 16 | Unique Gene Finder | Sets, `^` operator |
| 17 | Translate Codons | Range with step, `break` |
| 18 | K-mer Counter | Sliding window, `dict.get()` |

### 🔴 Ecosystem — 750–1000 XP (expert)
| # | Challenge | Concept |
|---|-----------|---------|
| 19 | FASTA Parser | Multi-line string parsing |
| 20 | The Grand Pipeline | Everything combined |

### 🐛 Bug Hunt — 300–500 XP (find and fix!)
Pre-written buggy code. Students run it, see the wrong output, debug the bug, and fix it.

| # | Challenge | Bug |
|---|-----------|-----|
| 21 | Debug: Case Blindness | `.count("g")` on uppercase string |
| 22 | Debug: Missing Factor | GC% missing `× 100` |
| 23 | Debug: Off-By-One Codon | `range(..., 4)` should be step 3 |
| 24 | Debug: Wrong Value Appended | Appending weight instead of name |
| 25 | Debug: Frozen Counter | `+ 0` instead of `+ 1` |

---

## Deploying to Railway

Railway is a hosting platform that supports persistent Node.js servers with WebSocket — exactly what PyLab needs. It has a free tier.

> **Why not Netlify?** Netlify only hosts static files. PyLab needs a persistent server for Socket.io (real-time leaderboard + sprint events) and SQLite. Railway is the right tool.

### Steps

**1. Push your code to GitHub**

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/your-username/pylab.git
git push -u origin main
```

**2. Create a Railway project**

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your repository
4. Railway auto-detects Node.js and reads `railway.toml` — no extra config needed

**3. Set environment variables**

In the Railway dashboard, go to your service → **Variables** tab, and add:

| Variable | Value |
|----------|-------|
| `INSTRUCTOR_KEY` | Choose a secret key, e.g. `Lab2024!` |

Railway sets `PORT` automatically — you don't need to add it.

**4. Deploy**

Railway deploys automatically on every `git push`. The first deploy takes ~2 minutes.

**5. Share the URL**

Railway gives you a URL like `https://pylab-production.up.railway.app`. Share that with your students.

### Persistent storage note

The SQLite database (`data/game.db`) lives on the server's filesystem. On Railway's free tier, the filesystem is **ephemeral** — it resets on redeploy. This means student scores persist during a session but are wiped when you redeploy.

For a permanent leaderboard that survives redeployments:
- Add a [Railway Volume](https://docs.railway.app/reference/volumes) and mount it at `/app/data`
- Or migrate from SQLite to [Railway's managed PostgreSQL](https://docs.railway.app/databases/postgresql) (requires updating `src/database.js` to use `pg`)

For a single course workshop, ephemeral storage is fine.

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (set automatically by Railway) |
| `INSTRUCTOR_KEY` | `PYLAB2024` | Password for the instructor panel |

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
# then edit .env with your values
```

> **Note:** `dotenv` is not included. To load `.env` locally, either install it (`npm install dotenv` and add `require('dotenv').config()` at the top of `index.js`) or export variables manually: `export INSTRUCTOR_KEY=mykey && npm start`.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Server | [Express](https://expressjs.com) + [Socket.io](https://socket.io) |
| Database | [SQLite](https://www.sqlite.org) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Python runtime | [Pyodide](https://pyodide.org) (WebAssembly, runs in browser) |
| Code editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (same engine as VS Code) |
| Real-time | Socket.io WebSockets |
| Hosting | [Railway](https://railway.app) |
| Frontend | Vanilla JS + CSS (no framework) |

---

## Project structure

```
intro-to-python-game/
├── index.js                  ← Express server + Socket.io events
├── package.json
├── railway.toml              ← Railway deployment config
├── .env.example              ← Environment variable template
├── src/
│   ├── challenges.js         ← All 25 challenge definitions
│   └── database.js           ← SQLite helpers (players, XP, leaderboard)
├── public/
│   ├── index.html            ← Landing / login page
│   ├── game.html             ← Main game page
│   ├── leaderboard.html      ← Full leaderboard
│   ├── instructor.html       ← Instructor sprint panel
│   ├── css/style.css         ← Design system
│   └── js/
│       ├── app.js            ← Game controller (sprint, presence, editor)
│       └── pyodide-worker.js ← Web Worker that runs Python
└── data/
    └── game.db               ← SQLite database (auto-created on first run)
```
