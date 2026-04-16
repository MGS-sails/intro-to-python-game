const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const challenges = require('./challenges');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'game.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    UNIQUE NOT NULL,
    avatar   TEXT    DEFAULT 'dna',
    total_xp INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id    INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    xp_earned    INTEGER NOT NULL,
    hints_used   INTEGER DEFAULT 0,
    time_seconds REAL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id),
    UNIQUE(player_id, challenge_id)
  );
`);

const LEVELS = [
  { name: 'Nucleotide', minXP: 0 },
  { name: 'Amino Acid', minXP: 300 },
  { name: 'Organelle',  minXP: 900 },
  { name: 'Cell',       minXP: 2000 },
  { name: 'Organism',   minXP: 3500 },
  { name: 'Ecosystem',  minXP: 5500 },
];

function levelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
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

module.exports = {
  upsertPlayer(name, avatar) {
    const row = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
    if (row) return { ...row, levelInfo: levelInfo(row.total_xp) };
    const info = db.prepare('INSERT INTO players (name, avatar) VALUES (?, ?)').run(name, avatar || 'dna');
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(info.lastInsertRowid);
    return { ...player, levelInfo: levelInfo(0) };
  },

  getPlayer(id) {
    const row = db.prepare('SELECT * FROM players WHERE id = ?').get(id);
    if (!row) return null;
    const completed = db.prepare('SELECT challenge_id FROM submissions WHERE player_id = ?').all(id).map(r => r.challenge_id);
    return { ...row, levelInfo: levelInfo(row.total_xp), completedChallenges: completed };
  },

  recordSubmission(playerId, challengeId, xpEarned, hintsUsed, timeSeconds) {
    const existing = db.prepare('SELECT id FROM submissions WHERE player_id = ? AND challenge_id = ?').get(playerId, challengeId);
    const challenge = challenges.find(c => c.id === challengeId);
    if (existing) return { newSubmission: false, challengeTitle: challenge?.title };

    db.prepare('INSERT INTO submissions (player_id, challenge_id, xp_earned, hints_used, time_seconds) VALUES (?,?,?,?,?)').run(playerId, challengeId, xpEarned, hintsUsed, timeSeconds);
    db.prepare('UPDATE players SET total_xp = total_xp + ? WHERE id = ?').run(xpEarned, playerId);

    const player = db.prepare('SELECT total_xp FROM players WHERE id = ?').get(playerId);
    return {
      newSubmission: true,
      challengeTitle: challenge?.title,
      newXP: player.total_xp,
      levelInfo: levelInfo(player.total_xp),
    };
  },

  getLeaderboard() {
    const rows = db.prepare(`
      SELECT p.id, p.name, p.avatar, p.total_xp,
             COUNT(s.id) AS challenges_completed
      FROM players p
      LEFT JOIN submissions s ON p.id = s.player_id
      GROUP BY p.id
      ORDER BY p.total_xp DESC
      LIMIT 30
    `).all();
    return rows.map((row, i) => ({ ...row, rank: i + 1, levelInfo: levelInfo(row.total_xp) }));
  },

  getPlayerProgress(playerId) {
    return db.prepare('SELECT * FROM submissions WHERE player_id = ? ORDER BY submitted_at').all(playerId);
  },
};
