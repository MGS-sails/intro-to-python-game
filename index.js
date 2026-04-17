const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const db = require('./src/database');
const challenges = require('./src/challenges');
const examples = require('./src/examples');
const projectSteps = require('./src/project');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Players ───────────────────────────────────────────
app.post('/api/players', (req, res) => {
  const { name, avatar } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
  const player = db.upsertPlayer(name.trim(), avatar);
  io.emit('leaderboard_update', db.getLeaderboard());
  res.json(player);
});

app.get('/api/players/:id', (req, res) => {
  const player = db.getPlayer(Number(req.params.id));
  if (!player) return res.status(404).json({ error: 'Player not found' });
  res.json(player);
});

// ── Project steps ─────────────────────────────────────
app.get('/api/project', (_req, res) => {
  res.json(projectSteps.map(s => ({
    id: s.id, icon: s.icon, title: s.title,
    subtitle: s.subtitle, description: s.description, code: s.code,
    tests: s.tests.map(t => ({ description: t.description, testCode: t.testCode })),
  })));
});

// ── Examples ──────────────────────────────────────────
app.get('/api/examples', (_req, res) => {
  res.json(examples.map(e => ({
    id: e.id, icon: e.icon, title: e.title,
    subtitle: e.subtitle, description: e.description, code: e.code,
  })));
});

// ── Challenges ────────────────────────────────────────
app.get('/api/challenges', (_req, res) => {
  res.json(challenges.map(c => ({
    id: c.id, title: c.title, tier: c.tier, tierLevel: c.tierLevel,
    xp: c.xp, icon: c.icon, concepts: c.concepts, description: c.description,
    starterCode: c.starterCode, hints: c.hints, type: c.type || 'coding',
    tests: c.tests.map(t => ({ description: t.description, testCode: t.testCode })),
  })));
});

// ── Submissions ───────────────────────────────────────
app.post('/api/submissions', (req, res) => {
  const { playerId, challengeId, xpEarned, hintsUsed, timeSeconds } = req.body;
  if (!playerId || !challengeId) return res.status(400).json({ error: 'Missing fields' });

  const result = db.recordSubmission(playerId, challengeId, xpEarned, hintsUsed, timeSeconds);

  if (result.newSubmission) {
    io.emit('leaderboard_update', db.getLeaderboard());
    io.emit('player_completed', {
      playerName: db.getPlayer(playerId)?.name,
      challengeTitle: result.challengeTitle,
      xpEarned,
    });
  }

  res.json(result);
});

// ── Leaderboard & progress ────────────────────────────
app.get('/api/leaderboard', (_req, res) => res.json(db.getLeaderboard()));
app.get('/api/player-progress/:id', (req, res) =>
  res.json(db.getPlayerProgress(Number(req.params.id))));

// ── Sprint state (for polling fallback) ──────────────
app.get('/api/sprint', (_req, res) => {
  if (!sprint) return res.json({ active: false });
  const elapsed = (Date.now() - sprint.startedAt) / 1000;
  const remaining = Math.max(0, sprint.durationSecs - elapsed);
  res.json({
    active: remaining > 0,
    challengeId: sprint.challengeId,
    challengeTitle: sprint.challengeTitle,
    durationSecs: sprint.durationSecs,
    startedAt: sprint.startedAt,
    remainingSecs: remaining,
    submissions: sprint.submissions,
  });
});

// ── Pages ─────────────────────────────────────────────
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/game', (_req, res) => res.sendFile(path.join(__dirname, 'public/game.html')));
app.get('/leaderboard', (_req, res) => res.sendFile(path.join(__dirname, 'public/leaderboard.html')));
app.get('/instructor', (_req, res) => res.sendFile(path.join(__dirname, 'public/instructor.html')));

// ══════════════════════════════════════════════════════
//  Real-time state
// ══════════════════════════════════════════════════════

// Online presence: socketId → { playerId, playerName, avatar, challengeId }
const online = new Map();

// Sprint state
let sprint = null;
const SPRINT_BONUS = [500, 300, 150]; // 1st, 2nd, 3rd place bonus XP

// ── Socket.io ─────────────────────────────────────────
io.on('connection', socket => {
  // Hydrate the new client with current state
  socket.emit('leaderboard_update', db.getLeaderboard());
  socket.emit('presence:update', [...online.values()]);

  if (sprint) {
    const elapsed = (Date.now() - sprint.startedAt) / 1000;
    const remaining = sprint.durationSecs - elapsed;
    if (remaining > 0) {
      socket.emit('sprint:state', {
        challengeId: sprint.challengeId,
        challengeTitle: sprint.challengeTitle,
        durationSecs: sprint.durationSecs,
        startedAt: sprint.startedAt,
        submissions: sprint.submissions,
      });
    }
  }

  // ── Presence ──────────────────────────────────────
  socket.on('presence:join', ({ playerId, playerName, avatar }) => {
    online.set(socket.id, { playerId, playerName, avatar, challengeId: null });
    io.emit('presence:update', [...online.values()]);
  });

  socket.on('presence:challenge', ({ challengeId }) => {
    const p = online.get(socket.id);
    if (p) {
      p.challengeId = challengeId;
      io.emit('presence:update', [...online.values()]);
    }
  });

  // ── Sprint ────────────────────────────────────────
  socket.on('sprint:launch', ({ challengeId, durationSecs, key }) => {
    if (key !== (process.env.INSTRUCTOR_KEY || 'PYLAB2024')) {
      socket.emit('sprint:error', 'Invalid instructor key');
      return;
    }
    if (sprint?.endTimer) clearTimeout(sprint.endTimer);

    const challenge = challenges.find(c => c.id === Number(challengeId));
    sprint = {
      challengeId: Number(challengeId),
      challengeTitle: challenge?.title || 'Unknown',
      durationSecs: Number(durationSecs),
      startedAt: Date.now(),
      submissions: [],
    };

    io.emit('sprint:started', {
      challengeId: sprint.challengeId,
      challengeTitle: sprint.challengeTitle,
      durationSecs: sprint.durationSecs,
      startedAt: sprint.startedAt,
    });

    sprint.endTimer = setTimeout(() => {
      io.emit('sprint:ended', { submissions: sprint.submissions });
      sprint = null;
    }, sprint.durationSecs * 1000);
  });

  socket.on('sprint:submit', ({ playerId, playerName, avatar, timeSeconds }) => {
    if (!sprint) return;
    if (sprint.submissions.find(s => s.playerId === playerId)) return;

    const rank = sprint.submissions.length + 1;
    const bonusXP = SPRINT_BONUS[rank - 1] ?? 50;

    sprint.submissions.push({ playerId, playerName, avatar, rank, timeSeconds, bonusXP });

    try {
      db.awardBonusXP(playerId, bonusXP);
      io.emit('leaderboard_update', db.getLeaderboard());
    } catch (e) { console.error('awardBonusXP error:', e.message); }

    io.emit('sprint:player_finished', { playerName, avatar, rank, timeSeconds, bonusXP });

    // If instructor panel is watching
    socket.to('instructor').emit('sprint:player_finished', { playerName, avatar, rank, timeSeconds, bonusXP });
  });

  socket.on('sprint:cancel', ({ key }) => {
    if (key !== (process.env.INSTRUCTOR_KEY || 'PYLAB2024')) return;
    if (sprint?.endTimer) clearTimeout(sprint.endTimer);
    sprint = null;
    io.emit('sprint:cancelled');
  });

  // Instructor room for targeted updates
  socket.on('instructor:join', ({ key }) => {
    if (key === (process.env.INSTRUCTOR_KEY || 'PYLAB2024')) {
      socket.join('instructor');
    }
  });

  socket.on('disconnect', () => {
    online.delete(socket.id);
    io.emit('presence:update', [...online.values()]);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`\n🧬  PyLab running → http://localhost:${PORT}\n    Instructor panel → http://localhost:${PORT}/instructor\n`));
