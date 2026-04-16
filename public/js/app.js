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
};

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

  // auto-select first incomplete challenge
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
  state.socket.on('leaderboard_update', renderLeaderboard);
  state.socket.on('player_completed', ({ playerName, challengeTitle, xpEarned }) => {
    if (playerName !== state.player.name) {
      showToast(`🧬 ${playerName} completed "${challengeTitle}" (+${xpEarned} XP)`, 'info');
    }
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
    const label = document.createElement('div');
    label.className = 'tier-label';
    label.style.color = `var(--t${tierLevel})`;
    label.textContent = tier;
    group.appendChild(label);

    state.challenges.filter(c => c.tier === tier).forEach(c => {
      const item = document.createElement('div');
      item.className = 'challenge-item' +
        (state.completed.has(c.id) ? ' completed' : '') +
        (state.currentId === c.id ? ' active' : '');
      item.dataset.id = c.id;
      item.innerHTML = `
        <span class="ci-icon">${c.icon}</span>
        <div class="ci-info">
          <div class="ci-title">${c.title}</div>
          <div class="ci-xp">⚡ ${c.xp} XP</div>
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

  // Highlight active in sidebar
  document.querySelectorAll('.challenge-item').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.id) === id);
  });

  // Description pane
  const descPane = document.getElementById('description-pane');
  const isCompleted = state.completed.has(id);

  descPane.innerHTML = `
    ${isCompleted ? '<div class="challenge-complete-banner">✅ Already completed — try again to practice!</div>' : ''}
    <div class="challenge-header">
      <span class="challenge-icon-big">${challenge.icon}</span>
      <div>
        <h1>${challenge.title}</h1>
        <div class="challenge-meta">
          <span class="tag tag-t${challenge.tierLevel}">${challenge.tier}</span>
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

  // Auto-reveal first hint as teaser (blurred)
  const firstHint = document.getElementById('hint-0');
  if (firstHint) firstHint.classList.remove('revealed'); // keep blurred until clicked

  // Render markdown-ish description
  renderMarkdown(challenge.description, document.getElementById('challenge-md'));

  // Editor — reset to starter code
  if (state.editor) {
    state.editor.setValue(challenge.starterCode);
    state.editor.setScrollPosition({ scrollTop: 0 });
  }

  // Clear output
  clearOutput();
  state.startTime = Date.now();
}

// ─── Minimal markdown renderer ────────────────────────
function renderMarkdown(text, el) {
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // fenced code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // tables
    .replace(/(\|.+\|\n)((?:\|[-:]+)+\|\n)((?:\|.+\|\n)*)/g, (m, header, sep, rows) => {
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
  const list = document.getElementById('hints-list');
  if (list) list.classList.toggle('open');
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
    // Custom theme
    monaco.editor.defineTheme('pylab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6e7681', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'identifier', foreground: 'e6edf3' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#161b2240',
        'editorLineNumber.foreground': '#6e7681',
        'editorCursor.foreground': '#3fb950',
        'editor.selectionBackground': '#3fb95030',
        'editorIndentGuide.background': '#21262d',
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

    // Ctrl+Enter / Cmd+Enter to run
    state.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      runCode
    );

    // Load the first challenge
    const first = state.challenges.find(c => !state.completed.has(c.id)) || state.challenges[0];
    if (first && state.currentId === first.id) {
      state.editor.setValue(first.starterCode);
    }
  });
}

// ─── Run code ─────────────────────────────────────────
function runCode() {
  if (state.isRunning || !state.workerReady) return;
  if (!state.editor) return;

  const challenge = state.challenges.find(c => c.id === state.currentId);
  if (!challenge) return;

  const code = state.editor.getValue();
  state.isRunning = true;
  setRunButtonState(true);
  clearOutput();
  showRunningState();

  // Timeout guard — terminate + restart worker if code hangs
  state.runTimer = setTimeout(() => {
    showToast('⏱ Execution timed out — possible infinite loop? Worker restarting…', 'error');
    setRunButtonState(false);
    state.isRunning = false;
    initWorker();
    showOutput('⏱ Execution timed out (8 s limit).\nThis usually means an infinite loop — check your loop conditions!', true);
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
  const summary = document.getElementById('result-summary');
  summary.className = 'result-summary idle';
  summary.textContent = 'Running your code…';
}

function clearOutput() {
  const summary = document.getElementById('result-summary');
  summary.className = 'result-summary idle';
  summary.textContent = 'Run your code to see results';
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

  // stdout
  if (error) {
    showOutput(cleanTraceback(error), true);
  } else {
    showOutput(stdout || '(no output)');
  }

  // test results
  const summary = document.getElementById('result-summary');
  const list = document.getElementById('test-results-list');
  list.innerHTML = '';

  if (error) {
    summary.className = 'result-summary has-fail';
    summary.innerHTML = `❌ Code error — check the output panel`;
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
  // Remove Pyodide internal frames for readability
  const lines = tb.split('\n');
  const userStart = lines.findIndex(l => l.includes('<string>'));
  return userStart >= 0
    ? lines.slice(userStart).join('\n').trim()
    : tb.trim();
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Challenge complete ───────────────────────────────
async function onChallengeComplete(challenge) {
  const elapsed = (Date.now() - (state.startTime || Date.now())) / 1000;
  const xpEarned = challenge.xp; // could deduct for hints

  // XP float animation
  animateXP(xpEarned);

  // Mark completed
  state.completed.add(challenge.id);
  renderChallengeList();

  // Submit to server
  try {
    const result = await api('/api/submissions', {
      method: 'POST',
      body: JSON.stringify({
        playerId: state.player.id,
        challengeId: challenge.id,
        xpEarned,
        hintsUsed: state.hintsRevealed,
        timeSeconds: elapsed,
      }),
    });

    if (result.newSubmission) {
      const prevXP = state.player.total_xp || 0;
      state.player.total_xp = result.newXP;
      state.player.levelInfo = result.levelInfo;
      updateXPBar(prevXP, result.newXP, result.levelInfo);

      showToast(`🎉 Challenge complete! +${xpEarned} XP`, 'success');

      if (result.levelInfo.name !== state.player.levelInfo?.name) {
        setTimeout(() => showToast(`🚀 Level up! You are now a ${result.levelInfo.name}!`, 'gold'), 800);
      }

      // Auto-advance to next challenge after a short delay
      const remaining = state.challenges.filter(c => !state.completed.has(c.id));
      if (remaining.length > 0) {
        setTimeout(() => selectChallenge(remaining[0].id), 2000);
      } else {
        setTimeout(() => showToast('🏆 You\'ve completed all challenges! Incredible!', 'gold'), 1200);
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

function updateXPBar(prevXP, newXP, levelInfo) {
  state.player.total_xp = newXP;
  state.player.levelInfo = levelInfo;
  document.getElementById('xp-label').textContent = `${newXP} XP`;
  document.getElementById('topbar-level').textContent = levelInfo.name;
  const fill = document.getElementById('xp-bar-fill');
  if (fill) fill.style.width = levelInfo.progress + '%';
}

// ─── Leaderboard ──────────────────────────────────────
function renderLeaderboard(data) {
  const list = document.getElementById('lb-list');
  if (!list) return;

  list.innerHTML = data.map(p => {
    const rankClass = p.rank === 1 ? 'lb-rank-1' : p.rank === 2 ? 'lb-rank-2' : p.rank === 3 ? 'lb-rank-3' : '';
    const isMe = state.player && p.id === state.player.id;
    return `
      <div class="lb-item ${isMe ? 'me' : ''}">
        <div class="lb-rank ${rankClass}">${p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank-1] : p.rank}</div>
        <div class="lb-avatar">${p.avatar}</div>
        <div class="lb-info">
          <div class="lb-name">${escapeHtml(p.name)}${isMe ? ' <span style="color:var(--green);font-size:0.7rem">(you)</span>' : ''}</div>
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

// ─── Expose globals for HTML event handlers ───────────
window.runCode = runCode;
window.toggleHints = toggleHints;
window.revealHint = revealHint;
window.initEditor = initEditor;
