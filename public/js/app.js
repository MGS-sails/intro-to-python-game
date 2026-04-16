/* ═══════════════════════════════════════════════════
   PyLab — Game Controller
   ═══════════════════════════════════════════════════ */

// ─── State ───────────────────────────────────────────
const state = {
  player: null,
  challenges: [],
  currentId: null,
  worker: null,
  workerReady: false,
  isRunning: false,
  runTimer: null,
  startTime: null,
  hintsRevealed: 0,
  completed: new Set(),
  editor: null,
  socket: null,

  // Sprint
  sprint: {
    active: false,
    challengeId: null,
    challengeTitle: null,
    endTime: null,
    timerInterval: null,
    myFinished: false,
    startedAt: null,
    durationSecs: null,
  },

  // Presence
  onlinePlayers: [],
};

const MEDALS = ['🥇', '🥈', '🥉'];

// ─── Bootstrap ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const stored = JSON.parse(localStorage.getItem('pylab_player') || 'null');
  if (!stored?.id) { window.location.href = '/'; return; }

  try {
    const player = await api('/api/players/' + stored.id);
    state.player = player;
    state.completed = new Set(player.completedChallenges || []);
    renderPlayerInfo();
  } catch {
    localStorage.removeItem('pylab_player');
    window.location.href = '/';
    return;
  }

  const challenges = await api('/api/challenges');
  state.challenges = challenges;
  renderChallengeList();

  initWorker();
  initSocket();

  const first = challenges.find(c => !state.completed.has(c.id)) || challenges[0];
  if (first) selectChallenge(first.id);
});

// ─── API helper ──────────────────────────────────────
async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Worker ──────────────────────────────────────────
function initWorker() {
  state.workerReady = false;
  document.getElementById('py-loading').classList.remove('hidden');

  if (state.worker) state.worker.terminate();
  state.worker = new Worker('/js/pyodide-worker.js');

  state.worker.onmessage = (e) => {
    const { type } = e.data;
    if (type === 'ready') {
      state.workerReady = true;
      document.getElementById('py-loading').classList.add('hidden');
    } else if (type === 'init_error') {
      document.getElementById('py-loading').classList.add('hidden');
      showToast('Failed to load Python runtime: ' + e.data.message, 'error');
    } else if (type === 'result') {
      clearTimeout(state.runTimer);
      state.isRunning = false;
      handleResult(e.data);
      setRunButtonState(false);
    }
  };
}

// ─── Socket.io ───────────────────────────────────────
function initSocket() {
  state.socket = io();

  // Announce presence once connected
  state.socket.on('connect', () => {
    if (state.player) {
      state.socket.emit('presence:join', {
        playerId: state.player.id,
        playerName: state.player.name,
        avatar: state.player.avatar,
      });
    }
  });

  state.socket.on('leaderboard_update', renderLeaderboard);

  state.socket.on('presence:update', (players) => {
    state.onlinePlayers = players;
    renderPresence(players);
    renderOnlinePill(players.length);
  });

  state.socket.on('player_completed', ({ playerName, challengeTitle, xpEarned }) => {
    if (playerName !== state.player.name) {
      showToast(`🧬 ${playerName} completed "${challengeTitle}" (+${xpEarned} XP)`, 'info');
    }
  });

  // ── Sprint events ──────────────────────────────
  state.socket.on('sprint:started', (data) => {
    startSprint(data);
    showToast(`🏃 SPRINT LAUNCHED — "${data.challengeTitle}"! Race to solve it!`, 'gold');
  });

  // Catch up if joining mid-sprint
  state.socket.on('sprint:state', (data) => {
    startSprint(data);
    // Replay already-finished players
    (data.submissions || []).forEach(s => addSprintFinisherChip(s));
  });

  state.socket.on('sprint:player_finished', (data) => {
    addSprintFinisherChip(data);
    if (data.playerName !== state.player.name) {
      const medal = MEDALS[data.rank - 1] || '✅';
      showToast(`${medal} ${data.playerName} solved it! (${data.timeSeconds.toFixed(1)}s · +${data.bonusXP} XP)`, data.rank <= 3 ? 'gold' : 'info');
    }
  });

  state.socket.on('sprint:ended', ({ submissions }) => {
    stopSprintTimer();
    state.sprint.active = false;
    document.getElementById('sprint-banner').classList.add('hidden');
    showSprintResults(submissions);
  });

  state.socket.on('sprint:cancelled', () => {
    stopSprintTimer();
    state.sprint.active = false;
    document.getElementById('sprint-banner').classList.add('hidden');
    showToast('Sprint was cancelled by the instructor', 'info');
  });
}

// ─── Challenge list ──────────────────────────────────
function renderChallengeList() {
  const container = document.getElementById('challenge-list');
  container.innerHTML = '';

  const tiers = [...new Set(state.challenges.map(c => c.tier))];
  tiers.forEach(tier => {
    const group = document.createElement('div');
    group.className = 'tier-group';

    const tierLevel = state.challenges.find(c => c.tier === tier)?.tierLevel;
    const isBugHunt = tier === 'Bug Hunt';

    const label = document.createElement('div');
    label.className = 'tier-label';
    label.style.color = isBugHunt ? 'var(--red)' : `var(--t${tierLevel})`;
    label.innerHTML = `${isBugHunt ? '🐛 ' : ''}${tier}`;
    group.appendChild(label);

    state.challenges.filter(c => c.tier === tier).forEach(c => {
      const item = document.createElement('div');
      const isSprint = state.sprint.active && state.sprint.challengeId === c.id;
      item.className = 'challenge-item' +
        (state.completed.has(c.id) ? ' completed' : '') +
        (state.currentId === c.id ? ' active' : '') +
        (isSprint ? ' sprint-active-item' : '');
      item.dataset.id = c.id;
      item.innerHTML = `
        <span class="ci-icon">${c.icon}</span>
        <div class="ci-info">
          <div class="ci-title">${c.title}</div>
          <div class="ci-xp">${isSprint ? '🏃 ' : ''}⚡ ${c.xp} XP</div>
        </div>
        ${state.completed.has(c.id) ? '<span style="color:var(--green);font-size:0.8rem">✓</span>' : ''}
      `;
      item.addEventListener('click', () => selectChallenge(c.id));
      group.appendChild(item);
    });

    container.appendChild(group);
  });
}

// ─── Select challenge ─────────────────────────────────
function selectChallenge(id) {
  state.currentId = id;
  state.hintsRevealed = 0;
  const challenge = state.challenges.find(c => c.id === id);
  if (!challenge) return;

  // Emit presence update
  if (state.socket) {
    state.socket.emit('presence:challenge', { challengeId: id });
  }

  document.querySelectorAll('.challenge-item').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.id) === id);
  });

  const isCompleted = state.completed.has(id);
  const isBugHunt = challenge.type === 'bugHunt';

  const tierTagClass = isBugHunt ? 'tag-bughunt' : `tag-t${challenge.tierLevel}`;
  const tierLabel = isBugHunt ? '🐛 Bug Hunt' : challenge.tier;

  document.getElementById('description-pane').innerHTML = `
    ${isCompleted ? '<div class="challenge-complete-banner">✅ Already solved — practice again any time!</div>' : ''}
    <div class="challenge-header">
      <span class="challenge-icon-big">${challenge.icon}</span>
      <div>
        <h1>${challenge.title}</h1>
        <div class="challenge-meta">
          <span class="tag ${tierTagClass}">${tierLabel}</span>
          <span class="xp-badge">⚡ ${challenge.xp} XP</span>
        </div>
      </div>
    </div>
    <div class="challenge-desc" id="challenge-md"></div>
    <div class="concepts-row">
      ${challenge.concepts.map(c => `<span class="concept-chip">${c}</span>`).join('')}
    </div>
    <div class="hints-section">
      <button class="hints-toggle" onclick="toggleHints()">💡 Hints (${challenge.hints.length})</button>
      <div class="hints-list" id="hints-list">
        ${challenge.hints.map((h, i) => `
          <div class="hint-item" id="hint-${i}" onclick="revealHint(${i})">
            ${i === 0 ? h : `Hint ${i + 1} — click to reveal`}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  renderMarkdown(challenge.description, document.getElementById('challenge-md'));

  if (state.editor) {
    state.editor.setValue(challenge.starterCode);
    state.editor.setScrollPosition({ scrollTop: 0 });
  }

  clearOutput();
  state.startTime = Date.now();
}

// ─── Minimal markdown renderer ────────────────────────
function renderMarkdown(text, el) {
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/(\|.+\|\n)((?:\|[-:]+)+\|\n)((?:\|.+\|\n?)*)/g, (m, header, sep, rows) => {
      const ths = header.split('|').filter(Boolean).map(h => `<th>${h.trim()}</th>`).join('');
      const trs = rows.split('\n').filter(Boolean).map(row =>
        '<tr>' + row.split('|').filter(Boolean).map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
      ).join('');
      return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    })
    .replace(/\n/g, '<br>');
  el.innerHTML = html;
}

function toggleHints() {
  document.getElementById('hints-list')?.classList.toggle('open');
}

function revealHint(i) {
  const challenge = state.challenges.find(c => c.id === state.currentId);
  if (!challenge) return;
  const el = document.getElementById('hint-' + i);
  if (!el || el.classList.contains('revealed')) return;
  el.textContent = challenge.hints[i];
  el.classList.add('revealed');
  state.hintsRevealed = Math.max(state.hintsRevealed, i + 1);
}

// ─── Monaco editor ────────────────────────────────────
function initEditor() {
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } });
  require(['vs/editor/editor.main'], () => {
    monaco.editor.defineTheme('pylab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment',    foreground: '6e7681', fontStyle: 'italic' },
        { token: 'keyword',    foreground: 'ff7b72' },
        { token: 'string',     foreground: 'a5d6ff' },
        { token: 'number',     foreground: '79c0ff' },
        { token: 'identifier', foreground: 'e6edf3' },
      ],
      colors: {
        'editor.background':              '#0d1117',
        'editor.foreground':              '#e6edf3',
        'editor.lineHighlightBackground': '#161b2240',
        'editorLineNumber.foreground':    '#6e7681',
        'editorCursor.foreground':        '#3fb950',
        'editor.selectionBackground':     '#3fb95030',
        'editorIndentGuide.background':   '#21262d',
      },
    });

    state.editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: '',
      language: 'python',
      theme: 'pylab-dark',
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      lineNumbers: 'on',
      renderLineHighlight: 'line',
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      padding: { top: 12, bottom: 12 },
    });

    state.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      runCode
    );

    const first = state.challenges.find(c => !state.completed.has(c.id)) || state.challenges[0];
    if (first && state.currentId === first.id) {
      state.editor.setValue(first.starterCode);
    }
  });
}

// ─── Run code ─────────────────────────────────────────
function runCode() {
  if (state.isRunning || !state.workerReady || !state.editor) return;
  const challenge = state.challenges.find(c => c.id === state.currentId);
  if (!challenge) return;

  const code = state.editor.getValue();
  state.isRunning = true;
  setRunButtonState(true);
  clearOutput();
  showRunningState();

  state.runTimer = setTimeout(() => {
    showToast('⏱ Execution timed out — possible infinite loop. Worker restarting…', 'error');
    setRunButtonState(false);
    state.isRunning = false;
    initWorker();
    showOutput('⏱ Execution timed out (8 s).\nCheck for infinite loops in your code!', true);
  }, 8000);

  state.worker.postMessage({
    type: 'run',
    id: String(challenge.id),
    code,
    testsJson: JSON.stringify(challenge.tests),
  });
}

function setRunButtonState(running) {
  const btn = document.getElementById('run-btn');
  if (!btn) return;
  btn.disabled = running;
  btn.innerHTML = running
    ? '<span class="spinner" style="width:14px;height:14px;border-width:2px"></span> Running…'
    : '▶ Run Code';
}

function showRunningState() {
  document.getElementById('stdout-content').innerHTML = '<span class="stdout-placeholder">⏳ Running…</span>';
  const s = document.getElementById('result-summary');
  s.className = 'result-summary idle';
  s.textContent = 'Running your code…';
}

function clearOutput() {
  const s = document.getElementById('result-summary');
  s.className = 'result-summary idle';
  s.textContent = 'Run your code to see results';
  document.getElementById('test-results-list').innerHTML = '';
  document.getElementById('stdout-content').innerHTML = '<span class="stdout-placeholder">Output will appear here…</span>';
}

function showOutput(text, isError = false) {
  const el = document.getElementById('stdout-content');
  el.textContent = text;
  el.className = 'stdout-content' + (isError ? ' error' : '');
}

// ─── Handle results ───────────────────────────────────
function handleResult(data) {
  const { stdout, error, testResults, allPassed } = data;
  const challenge = state.challenges.find(c => c.id === state.currentId);

  showOutput(error ? cleanTraceback(error) : (stdout || '(no output)'), !!error);

  const summary = document.getElementById('result-summary');
  const list = document.getElementById('test-results-list');
  list.innerHTML = '';

  if (error) {
    summary.className = 'result-summary has-fail';
    summary.innerHTML = '❌ Code error — check the output panel';
    return;
  }

  const passed = testResults.filter(t => t.passed).length;
  const total = testResults.length;

  summary.className = allPassed ? 'result-summary all-pass' : 'result-summary has-fail';
  summary.innerHTML = allPassed
    ? `✅ All ${total} test${total !== 1 ? 's' : ''} passed! &nbsp;<span style="color:var(--gold)">+${challenge?.xp} XP</span>`
    : `❌ ${passed} / ${total} tests passed`;

  testResults.forEach(t => {
    const div = document.createElement('div');
    div.className = 'test-item ' + (t.passed ? 'pass' : 'fail');
    div.innerHTML = `
      <span class="test-icon">${t.passed ? '✅' : '❌'}</span>
      <div>
        <div class="test-desc">${t.description}</div>
        ${!t.passed && t.message ? `<div class="test-msg">${escapeHtml(t.message)}</div>` : ''}
      </div>
    `;
    list.appendChild(div);
  });

  if (allPassed && challenge && !state.completed.has(challenge.id)) {
    onChallengeComplete(challenge);
  }
}

function cleanTraceback(tb) {
  const lines = tb.split('\n');
  const start = lines.findIndex(l => l.includes('<string>'));
  return (start >= 0 ? lines.slice(start).join('\n') : tb).trim();
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Challenge complete ───────────────────────────────
async function onChallengeComplete(challenge) {
  const elapsed = (Date.now() - (state.startTime || Date.now())) / 1000;

  // Fire sprint submission if there's an active sprint for this challenge
  if (state.sprint.active &&
      state.sprint.challengeId === challenge.id &&
      !state.sprint.myFinished) {
    state.sprint.myFinished = true;
    const sprintElapsed = (Date.now() - state.sprint.startedAt) / 1000;
    state.socket.emit('sprint:submit', {
      playerId: state.player.id,
      playerName: state.player.name,
      avatar: state.player.avatar,
      timeSeconds: sprintElapsed,
    });
  }

  animateXP(challenge.xp);
  state.completed.add(challenge.id);
  renderChallengeList();

  try {
    const result = await api('/api/submissions', {
      method: 'POST',
      body: JSON.stringify({
        playerId: state.player.id,
        challengeId: challenge.id,
        xpEarned: challenge.xp,
        hintsUsed: state.hintsRevealed,
        timeSeconds: elapsed,
      }),
    });

    if (result.newSubmission) {
      state.player.total_xp = result.newXP;
      state.player.levelInfo = result.levelInfo;
      updateXPBar(result.newXP, result.levelInfo);
      showToast(`🎉 Solved! +${challenge.xp} XP`, 'success');

      const remaining = state.challenges.filter(c => !state.completed.has(c.id));
      if (remaining.length === 0) {
        setTimeout(() => showToast('🏆 You\'ve completed every challenge! Incredible!', 'gold'), 1000);
      } else if (!state.sprint.active) {
        setTimeout(() => selectChallenge(remaining[0].id), 2000);
      }
    }
  } catch (err) {
    console.error('Submission error:', err);
  }
}

// ─── Player info bar ─────────────────────────────────
function renderPlayerInfo() {
  const { name, avatar, total_xp = 0, levelInfo = {} } = state.player;
  document.getElementById('topbar-name').textContent = name;
  document.getElementById('topbar-avatar').textContent = avatar;
  document.getElementById('topbar-level').textContent = levelInfo.name || 'Nucleotide';
  document.getElementById('xp-label').textContent = `${total_xp} XP`;
  const fill = document.getElementById('xp-bar-fill');
  if (fill) fill.style.width = (levelInfo.progress || 0) + '%';
}

function updateXPBar(newXP, levelInfo) {
  document.getElementById('xp-label').textContent = `${newXP} XP`;
  document.getElementById('topbar-level').textContent = levelInfo.name;
  const fill = document.getElementById('xp-bar-fill');
  if (fill) fill.style.width = levelInfo.progress + '%';
}

// ─── Leaderboard ──────────────────────────────────────
function renderLeaderboard(data) {
  const list = document.getElementById('lb-list');
  if (!list) return;
  const onlineIds = new Set(state.onlinePlayers.map(p => p.playerId));

  list.innerHTML = data.map(p => {
    const rankClass = p.rank === 1 ? 'lb-rank-1' : p.rank === 2 ? 'lb-rank-2' : p.rank === 3 ? 'lb-rank-3' : '';
    const isMe = state.player && p.id === state.player.id;
    const isOnline = onlineIds.has(p.id);
    return `
      <div class="lb-item ${isMe ? 'me' : ''}">
        <div class="lb-rank ${rankClass}">${p.rank <= 3 ? MEDALS[p.rank-1] : p.rank}</div>
        <div class="lb-avatar" style="position:relative">
          ${p.avatar}
          ${isOnline ? '<span style="position:absolute;bottom:-1px;right:-1px;width:7px;height:7px;background:var(--green);border-radius:50%;border:1px solid var(--bg2)"></span>' : ''}
        </div>
        <div class="lb-info">
          <div class="lb-name">${escapeHtml(p.name)}${isMe ? ' <span style="color:var(--green);font-size:0.68rem">(you)</span>' : ''}</div>
          <div class="lb-stats">
            <span>${p.levelInfo.name}</span>
            <span>·</span>
            <span>${p.challenges_completed} ✓</span>
          </div>
        </div>
        <div class="lb-xp">${p.total_xp}</div>
      </div>
    `;
  }).join('');
}

// ─── Online presence ──────────────────────────────────
function renderPresence(players) {
  const container = document.getElementById('lb-presence-list');
  if (!container) return;

  if (players.length === 0) {
    container.innerHTML = '<div style="padding:8px 10px;color:var(--dim);font-size:0.78rem">No one else is here yet</div>';
    return;
  }

  const challengeTitle = (id) => state.challenges.find(c => c.id === id)?.title || '';

  container.innerHTML = players
    .filter(p => p.playerId !== state.player?.id)
    .map(p => `
      <div class="presence-chip">
        <div class="presence-dot"></div>
        <span>${p.avatar}</span>
        <span class="presence-name">${escapeHtml(p.playerName)}</span>
        ${p.challengeId ? `<span class="presence-challenge">${escapeHtml(challengeTitle(p.challengeId))}</span>` : ''}
      </div>
    `).join('') ||
    '<div style="padding:8px 10px;color:var(--dim);font-size:0.78rem">Just you here!</div>';
}

function renderOnlinePill(count) {
  const el = document.getElementById('online-count');
  if (el) el.textContent = count;
}

// ═══════════════════════════════════════════════════
//  SPRINT MODE
// ═══════════════════════════════════════════════════

function startSprint({ challengeId, challengeTitle, durationSecs, startedAt }) {
  state.sprint.active = true;
  state.sprint.challengeId = challengeId;
  state.sprint.challengeTitle = challengeTitle;
  state.sprint.durationSecs = durationSecs;
  state.sprint.startedAt = startedAt;
  state.sprint.endTime = startedAt + durationSecs * 1000;
  state.sprint.myFinished = false;

  // Show banner
  const banner = document.getElementById('sprint-banner');
  banner.classList.remove('hidden');
  document.getElementById('sprint-challenge-name').textContent = challengeTitle;
  document.getElementById('sprint-finishers-row').innerHTML = '';

  // Navigate to the sprint challenge
  selectChallenge(challengeId);
  renderChallengeList(); // highlight sprint item

  // Start timer
  if (state.sprint.timerInterval) clearInterval(state.sprint.timerInterval);
  updateSprintCountdown();
  state.sprint.timerInterval = setInterval(updateSprintCountdown, 500);
}

function updateSprintCountdown() {
  const rem = Math.max(0, state.sprint.endTime - Date.now());
  const m = Math.floor(rem / 60000);
  const s = Math.floor((rem % 60000) / 1000);
  const el = document.getElementById('sprint-countdown');
  if (el) {
    el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    el.style.color = rem < 30000 ? 'var(--red)' : rem < 60000 ? 'var(--gold)' : 'var(--text)';
  }
  if (rem === 0) stopSprintTimer();
}

function stopSprintTimer() {
  if (state.sprint.timerInterval) {
    clearInterval(state.sprint.timerInterval);
    state.sprint.timerInterval = null;
  }
}

function addSprintFinisherChip({ playerName, avatar, rank }) {
  const row = document.getElementById('sprint-finishers-row');
  if (!row) return;
  const chip = document.createElement('div');
  const rankClass = rank <= 3 ? `rank-${rank}` : '';
  chip.className = `sprint-finisher-chip ${rankClass}`;
  chip.innerHTML = `${MEDALS[rank - 1] || '✅'} ${avatar} <strong>${escapeHtml(playerName)}</strong>`;
  row.appendChild(chip);
}

function showSprintResults(submissions) {
  const body = document.getElementById('sprint-results-body');
  const modal = document.getElementById('sprint-results-modal');

  if (!submissions || submissions.length === 0) {
    body.innerHTML = '<p style="color:var(--muted);padding:20px 0">Nobody finished in time — the challenge is still open!</p>';
  } else {
    body.innerHTML = submissions.map(s => `
      <div class="sprint-result-row rank-${s.rank <= 3 ? s.rank : ''}">
        <span class="sprint-result-medal">${MEDALS[s.rank - 1] || s.rank}</span>
        <span class="sprint-result-avatar">${s.avatar}</span>
        <span class="sprint-result-name">${escapeHtml(s.playerName)}${s.playerName === state.player.name ? ' <span style="color:var(--green);font-size:0.7rem">(you)</span>' : ''}</span>
        <span class="sprint-result-time">${s.timeSeconds.toFixed(1)}s</span>
        <span class="sprint-result-bonus">+${s.bonusXP} XP</span>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
}

// ─── Animations ───────────────────────────────────────
function animateXP(amount) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = `+${amount} XP ⚡`;
  const btn = document.getElementById('run-btn');
  const rect = btn?.getBoundingClientRect() || { left: window.innerWidth / 2, top: window.innerHeight / 2 };
  el.style.left = rect.left + 'px';
  el.style.top = rect.top + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ─── Toast ───────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.25s ease forwards';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// ─── Expose globals ───────────────────────────────────
window.runCode = runCode;
window.toggleHints = toggleHints;
window.revealHint = revealHint;
window.initEditor = initEditor;
