const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const db = require('./src/database');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Players ───────────────────────────────────────────
app.post('/api/players', (req, res) => {
  const { name, avatar } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
  res.json(db.upsertPlayer(name.trim(), avatar));
});

app.get('/api/players/:id', (req, res) => {
  const player = db.getPlayer(Number(req.params.id));
  if (!player) return res.status(404).json({ error: 'Player not found' });
  res.json(player);
});

// ── Challenges ────────────────────────────────────────
app.get('/api/challenges', (_req, res) => {
  const challenges = require('./src/challenges');
  // Strip solution hints beyond safe level before sending to client
  res.json(challenges.map(c => ({
    id: c.id,
    title: c.title,
    tier: c.tier,
    tierLevel: c.tierLevel,
    xp: c.xp,
    icon: c.icon,
    concepts: c.concepts,
    description: c.description,
    starterCode: c.starterCode,
    hints: c.hints,
    tests: c.tests.map(t => ({ description: t.description, testCode: t.testCode })),
  })));
});

// ── Submissions ───────────────────────────────────────
app.post('/api/submissions', (req, res) => {
  const { playerId, challengeId, xpEarned, hintsUsed, timeSeconds } = req.body;
  if (!playerId || !challengeId) return res.status(400).json({ error: 'Missing fields' });

  const result = db.recordSubmission(playerId, challengeId, xpEarned, hintsUsed, timeSeconds);

  if (result.newSubmission) {
    const leaderboard = db.getLeaderboard();
    io.emit('leaderboard_update', leaderboard);
    io.emit('player_completed', {
      playerName: db.getPlayer(playerId)?.name,
      challengeTitle: result.challengeTitle,
      xpEarned,
    });
  }

  res.json(result);
});

// ── Leaderboard ───────────────────────────────────────
app.get('/api/leaderboard', (_req, res) => res.json(db.getLeaderboard()));

app.get('/api/player-progress/:id', (req, res) =>
  res.json(db.getPlayerProgress(Number(req.params.id)))
);

// ── Socket.io ─────────────────────────────────────────
io.on('connection', socket => {
  socket.emit('leaderboard_update', db.getLeaderboard());
});

// ── Pages ─────────────────────────────────────────────
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/game', (_req, res) => res.sendFile(path.join(__dirname, 'public/game.html')));
app.get('/leaderboard', (_req, res) => res.sendFile(path.join(__dirname, 'public/leaderboard.html')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`\n🧬  PyLab running → http://localhost:${PORT}\n`));
