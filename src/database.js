const fs = require('fs');
const path = require('path');
const challenges = require('./challenges');

const DATA_FILE = path.join(__dirname, '../data/game.json');

const LEVELS = [
  { name: 'Nucleotide', minXP: 0 },
  { name: 'Amino Acid', minXP: 300 },
  { name: 'Organelle',  minXP: 900 },
  { name: 'Cell',       minXP: 2000 },
  { name: 'Organism',   minXP: 3500 },
  { name: 'Ecosystem',  minXP: 5500 },
];

function levelInfo(xp) {
  let current = LEVELS[0], next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const progress = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100;
  return { level: LEVELS.indexOf(current) + 1, name: current.name, next: next?.name, progress };
}

// ── In-memory store ───────────────────────────────────
const store = {
  players: [],
  submissions: [],
  nextPlayerId: 1,
  nextSubmissionId: 1,
};

function load() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(DATA_FILE)) {
      Object.assign(store, JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
    }
  } catch (e) {
    console.warn('Could not load game data, starting fresh:', e.message);
  }
}

function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    // Railway free tier has ephemeral filesystem — in-memory state still works
    console.warn('Could not persist game data:', e.message);
  }
}

load();

// ── Public API (same interface as before) ────────────
module.exports = {
  upsertPlayer(name, avatar) {
    let player = store.players.find(p => p.name === name);
    if (player) return { ...player, levelInfo: levelInfo(player.total_xp) };
    player = {
      id: store.nextPlayerId++,
      name,
      avatar: avatar || '🧬',
      total_xp: 0,
      created_at: new Date().toISOString(),
    };
    store.players.push(player);
    save();
    return { ...player, levelInfo: levelInfo(0) };
  },

  getPlayer(id) {
    const player = store.players.find(p => p.id === id);
    if (!player) return null;
    const completed = store.submissions
      .filter(s => s.player_id === id)
      .map(s => s.challenge_id);
    return { ...player, levelInfo: levelInfo(player.total_xp), completedChallenges: completed };
  },

  recordSubmission(playerId, challengeId, xpEarned, hintsUsed, timeSeconds) {
    const challenge = challenges.find(c => c.id === challengeId);
    const existing = store.submissions.find(
      s => s.player_id === playerId && s.challenge_id === challengeId,
    );
    if (existing) return { newSubmission: false, challengeTitle: challenge?.title };

    store.submissions.push({
      id: store.nextSubmissionId++,
      player_id: playerId,
      challenge_id: challengeId,
      xp_earned: xpEarned,
      hints_used: hintsUsed,
      time_seconds: timeSeconds,
      submitted_at: new Date().toISOString(),
    });
    const player = store.players.find(p => p.id === playerId);
    if (player) player.total_xp += xpEarned;
    save();
    return {
      newSubmission: true,
      challengeTitle: challenge?.title,
      newXP: player?.total_xp ?? xpEarned,
      levelInfo: levelInfo(player?.total_xp ?? xpEarned),
    };
  },

  getLeaderboard() {
    return store.players
      .map(p => ({
        ...p,
        challenges_completed: store.submissions.filter(s => s.player_id === p.id).length,
        levelInfo: levelInfo(p.total_xp),
      }))
      .sort((a, b) => b.total_xp - a.total_xp)
      .slice(0, 30)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  },

  getPlayerProgress(playerId) {
    return store.submissions
      .filter(s => s.player_id === playerId)
      .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
  },

  awardBonusXP(playerId, amount) {
    const player = store.players.find(p => p.id === playerId);
    if (!player) return { newXP: 0, levelInfo: levelInfo(0) };
    player.total_xp += amount;
    save();
    return { newXP: player.total_xp, levelInfo: levelInfo(player.total_xp) };
  },
};
