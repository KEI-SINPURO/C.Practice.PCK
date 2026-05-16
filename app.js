// ============================================================
//  PCK道場 — Main App Controller
// ============================================================

// ---- State ----
const AppState = window.AppState = (() => {
  const KEY = 'pckDojo_v2';

  const defaults = {
    xp: 0,
    streak: 0,
    lastDate: '',
    solved: [],          // problem ids
    solvedCats: [],      // categories solved
    completedLessons: [],
    achievements: [],
    fastSolves: false,
    usedLangs: [],
    name: 'はじめて'
  };

  let state = { ...defaults };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = { ...defaults, ...JSON.parse(raw) };
    } catch (_) {}
    // Update streak
    const today = new Date().toDateString();
    if (state.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (state.lastDate === yesterday) state.streak++;
      else if (state.lastDate !== today) state.streak = 1;
      state.lastDate = today;
      save();
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  function addXP(amount) {
    state.xp += amount;
    save();
  }

  function solveProblem(problem, isFast) {
    if (state.solved.includes(problem.id)) {
      showToast('この問題は既に解いています！', '✅');
      return;
    }
    state.solved.push(problem.id);
    if (problem.cat && !state.solvedCats.includes(problem.cat)) {
      state.solvedCats.push(problem.cat);
    }
    if (isFast) state.fastSolves = true;

    const earned = problem.points * 20;
    addXP(earned);
    checkAchievements();
    renderAll();
    launchConfetti();
    showToast(`+${earned} XP 獲得！「${problem.title}」クリア！`, '🎉');
  }

  function completeLesson(lessonId, xpAmount) {
    if (state.completedLessons.includes(lessonId)) return false;
    state.completedLessons.push(lessonId);
    addXP(xpAmount);
    checkAchievements();
    renderAll();
    showToast(`+${xpAmount} XP！レッスン完了！`, '📚');
    return true;
  }

  function checkAchievements() {
    let newUnlock = false;
    ACHIEVEMENTS.forEach(ach => {
      if (state.achievements.includes(ach.id)) return;
      const cats = state.solvedCats;
      const langs = state.usedLangs.length;
      const lessons = state.completedLessons.length;
      if (ach.cond(state.xp, state.solved.length, state.streak, state.fastSolves, cats, lessons, langs)) {
        state.achievements.push(ach.id);
        showToast(`実績解除: 「${ach.name}」${ach.icon}`, '🏆');
        newUnlock = true;
      }
    });
    if (newUnlock) save();
  }

  function getRank() {
    let rank = RANKS[0];
    for (const r of RANKS) {
      if (state.xp >= r.minXP) rank = r;
    }
    return rank;
  }

  function getNextRank() {
    for (const r of RANKS) {
      if (r.minXP > state.xp) return r;
    }
    return null;
  }

  load();
  return { state, addXP, solveProblem, completeLesson, getRank, getNextRank, checkAchievements, save };
})();

// ============================================================
//  TOAST
// ============================================================
let toastTimer;
function showToast(msg, icon = '✨') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = `<span style="font-size:20px">${icon}</span> ${msg}`;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 3500);
}

// ============================================================
//  CONFETTI
// ============================================================
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({length: 80}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 8 + 4,
    c: ['#e8a020','#f0c060','#30c870','#20c8b0','#8060e8','#e84040'][Math.floor(Math.random()*6)],
    vx: (Math.random()-0.5)*4,
    vy: Math.random()*4+2,
    angle: Math.random()*360,
    spin: (Math.random()-0.5)*10
  }));

  let frames = 0;
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI/180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
      ctx.restore();
    });
    frames++;
    if (frames < 80) requestAnimationFrame(animate);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  animate();
}

// ============================================================
//  NAVIGATION
// ============================================================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');

  const ni = document.querySelector(`[data-page="${page}"]`);
  if (ni) ni.classList.add('active');

  if (page === 'visualizer') Visualizer.init();
}

// ============================================================
//  PROGRESS RING
// ============================================================
function drawProgressRing(pct) {
  const canvas = document.getElementById('progressRing');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2, r = 68;

  ctx.clearRect(0,0,W,H);

  // BG ring
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.stroke();

  // Progress arc
  const angle = (pct/100) * Math.PI * 2 - Math.PI/2;
  const grad = ctx.createLinearGradient(cx-r, cy, cx+r, cy);
  grad.addColorStop(0, '#e8a020');
  grad.addColorStop(1, '#f0c060');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI/2, angle);
  ctx.stroke();
}

// ============================================================
//  DASHBOARD RENDER
// ============================================================
function renderDashboard() {
  const s = AppState.state;
  const totalProblems = PROBLEMS.length;
  const solvedCount = s.solved.length;
  const pct = Math.round((solvedCount / Math.max(totalProblems, 1)) * 100);

  drawProgressRing(pct);
  const rp = document.getElementById('ringPct');
  if (rp) rp.textContent = pct + '%';

  const rank = AppState.getRank();
  const greet = document.getElementById('heroGreeting');
  if (greet) greet.textContent = `${s.name}さん、修行を続けよう！`;

  const bio = document.getElementById('heroBio');
  if (bio) bio.textContent = rank.desc + '。今日も一問解いて実力を磨こう！';

  const ss = document.getElementById('statSolved');
  const sx = document.getElementById('statXP');
  const st = document.getElementById('statStreak');
  if (ss) ss.textContent = solvedCount;
  if (sx) sx.textContent = s.xp;
  if (st) st.textContent = s.streak;

  // Topic grid
  const tg = document.getElementById('topicGrid');
  if (tg) {
    tg.innerHTML = TOPICS.map(topic => {
      const done = s.solved.filter(id => {
        const p = PROBLEMS.find(pp => pp.id === id);
        return p && p.cat === topic.id;
      }).length;
      const total = topic.problems;
      const pctT = total > 0 ? Math.round(done/total*100) : 0;
      return `
        <div class="topic-card${done===total&&total>0?' completed':''}" onclick="filterAndGoProblems('${topic.id}')">
          <div class="topic-icon">${topic.icon}</div>
          <div class="topic-name">${topic.name}</div>
          <div class="topic-count">${done}/${total} 問</div>
          <div class="topic-progress">
            <div class="topic-progress-fill" style="width:${pctT}%;background:${topic.color}"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function filterAndGoProblems(cat) {
  navigate('problems');
  const sel = document.getElementById('catFilter');
  if (sel) { sel.value = cat; renderProblemList(); }
}

// ============================================================
//  SIDEBAR USER
// ============================================================
function renderSidebar() {
  const s = AppState.state;
  const rank = AppState.getRank();
  const next = AppState.getNextRank();

  const av = document.getElementById('userAvatar');
  if (av) av.textContent = s.name.charAt(0);

  const un = document.getElementById('userName');
  if (un) un.textContent = s.name;

  const ur = document.getElementById('userRank');
  if (ur) { ur.textContent = rank.name; ur.style.color = rank.color; }

  const rankIdx = RANKS.indexOf(rank);
  const prevXP = rankIdx > 0 ? RANKS[rankIdx - 1].minXP : 0;
  const nextXP = next ? next.minXP : rank.minXP + 1000;
  const pct = nextXP > prevXP ? Math.round(((s.xp - prevXP) / (nextXP - prevXP)) * 100) : 100;

  const xpFill = document.getElementById('xpFill');
  if (xpFill) xpFill.style.width = Math.min(100, Math.max(0, pct)) + '%';

  const xpText = document.getElementById('xpText');
  if (xpText) xpText.textContent = s.xp + ' XP';

  const sc = document.getElementById('streakCount');
  if (sc) sc.textContent = s.streak;
}

// ============================================================
//  CURRICULUM RENDER
// ============================================================
function renderCurriculum() {
  const s = AppState.state;
  const cp = document.getElementById('curriculumPath');
  if (!cp) return;

  cp.innerHTML = CURRICULUM.map(level => {
    const totalLessons = level.lessons.length;
    const doneLessons = level.lessons.filter(l => s.completedLessons.includes(l.id)).length;
    const locked = level.level > 1 && CURRICULUM[level.level-2].lessons.filter(l=>s.completedLessons.includes(l.id)).length < Math.ceil(CURRICULUM[level.level-2].lessons.length*0.5);

    return `
      <div class="level-section">
        <div class="level-header">
          <div class="level-badge ${level.cls}">${level.icon}</div>
          <div>
            <div class="level-title">${level.title}</div>
            <div class="level-subtitle">${level.subtitle} — ${doneLessons}/${totalLessons} 完了</div>
          </div>
        </div>
        <div class="lessons-grid">
          ${level.lessons.map(lesson => {
            const done = s.completedLessons.includes(lesson.id);
            const lk = locked;
            return `
              <div class="lesson-card${done?' completed':''}${lk?' locked':''}"
                   onclick="${lk?'showToast(\'前のレベルを先にクリアしよう！\',\'🔒\')':('openLesson(\''+lesson.id+'\')')}">
                <div class="lesson-header">
                  <div class="lesson-icon">${lesson.icon}</div>
                  <div class="lesson-status">${done?'✅':lk?'🔒':'⭕'}</div>
                </div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-desc">${lesson.desc}</div>
                <div class="lesson-meta">
                  <span>⏱ ${lesson.time}</span>
                  <span class="lesson-xp">+${lesson.xp} XP</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================
//  LESSON MODAL
// ============================================================
function openLesson(lessonId) {
  const lesson = CURRICULUM.flatMap(l => l.lessons).find(l => l.id === lessonId);
  if (!lesson) return;

  const modal = document.getElementById('lessonModal');
  const body = document.getElementById('lessonBody');
  if (!modal || !body) return;

  const content = lesson.content;
  const quiz = content.quiz;

  body.innerHTML = `
    <div class="lesson-content">
      <span class="lc-tag">📚 レッスン</span>
      <h2>${lesson.icon} ${lesson.title}</h2>
      <div style="color:var(--text3);font-size:13px;margin-bottom:20px">⏱ ${lesson.time} | +${lesson.xp} XP</div>

      ${content.sections.map(sec => `
        <h3>${sec.title}</h3>
        ${sec.body ? `<p>${sec.body.replace(/\n/g,'<br>')}</p>` : ''}
        ${sec.code ? `
          <div class="code-block">
            <pre>${colorizeCode(sec.code, sec.lang||'c')}</pre>
          </div>
        ` : ''}
      `).join('')}

      ${quiz ? `
        <div class="quiz-section">
          <div class="quiz-q">❓ 理解チェック: ${quiz.q}</div>
          <div class="quiz-opts">
            ${quiz.opts.map((opt, i) => `
              <button class="quiz-opt" onclick="answerQuiz(this, ${i}, ${quiz.ans}, '${lessonId}', ${lesson.xp})">
                ${String.fromCharCode(65+i)}. ${opt}
              </button>
            `).join('')}
          </div>
          <div id="quizFeedback_${lessonId}" style="margin-top:12px;font-size:13px;display:none"></div>
        </div>
      ` : `
        <div class="lesson-nav">
          <div></div>
          <button class="btn-primary" onclick="finishLesson('${lessonId}', ${lesson.xp})">
            完了 ✓
          </button>
        </div>
      `}
    </div>
  `;

  modal.classList.remove('hidden');
}

function answerQuiz(btn, selected, correct, lessonId, xp) {
  const opts = btn.parentElement.querySelectorAll('.quiz-opt');
  opts.forEach((o, i) => {
    o.disabled = true;
    if (i === correct) o.classList.add('correct');
    else if (i === selected && selected !== correct) o.classList.add('wrong');
  });

  const fb = document.getElementById('quizFeedback_' + lessonId);
  if (fb) {
    fb.style.display = 'block';
    if (selected === correct) {
      fb.innerHTML = `<span style="color:var(--green)">✅ 正解！${CURRICULUM.flatMap(l=>l.lessons).find(l=>l.id===lessonId)?.content?.quiz?.exp||''}</span>`;
      setTimeout(() => finishLesson(lessonId, xp), 1200);
    } else {
      fb.innerHTML = `<span style="color:var(--red2)">❌ 不正解。正解は「${btn.parentElement.querySelectorAll('.quiz-opt')[correct].textContent.trim()}」です。<br>${CURRICULUM.flatMap(l=>l.lessons).find(l=>l.id===lessonId)?.content?.quiz?.exp||''}</span>`;
    }
  }
}

function finishLesson(lessonId, xp) {
  const completed = AppState.completeLesson(lessonId, xp);
  if (completed) launchConfetti();
  closeLessonModal();
  renderCurriculum();
}

function closeLessonModal() {
  const modal = document.getElementById('lessonModal');
  if (modal) modal.classList.add('hidden');
}

// ---- Simple syntax colorizer ----
function colorizeCode(code, lang) {
  let s = code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  if (lang === 'c' || lang === 'cpp') {
    s = s
      .replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>')
      .replace(/\b(int|long|char|double|float|void|return|if|else|while|for|do|break|continue|printf|scanf|include|define|struct|typedef|static|const|bool|true|false|NULL)\b/g, '<span class="kw">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="str">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
  } else if (lang === 'python') {
    s = s
      .replace(/(#[^\n]*)/g, '<span class="cm">$1</span>')
      .replace(/\b(def|class|if|elif|else|for|while|return|import|from|in|not|and|or|print|input|range|len|int|str|float|list|True|False|None|map|sorted|sum|max|min)\b/g, '<span class="kw">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="str">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
  }
  return s;
}

// ============================================================
//  PROBLEM LIST RENDER
// ============================================================
function renderProblemList() {
  const s = AppState.state;
  const diff = document.querySelector('.filter-btn.active')?.dataset?.diff || 'all';
  const cat = document.getElementById('catFilter')?.value || 'all';
  const search = document.getElementById('searchProblems')?.value?.toLowerCase() || '';

  let filtered = PROBLEMS.filter(p => {
    if (diff !== 'all' && p.diff !== parseInt(diff)) return false;
    if (cat !== 'all' && p.cat !== cat) return false;
    if (search && !p.title.toLowerCase().includes(search) &&
        !(p.tags||[]).some(t=>t.toLowerCase().includes(search))) return false;
    return true;
  });

  const list = document.getElementById('problemList');
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">条件に合う問題が見つかりません</div>';
    return;
  }

  list.innerHTML = filtered.map(p => {
    const solved = s.solved.includes(p.id);
    const stars = '★'.repeat(p.diff) + '☆'.repeat(4-p.diff);
    const tagHtml = (p.tags||[]).slice(0,2).map(t=>`<span class="tag tag-teal">${t}</span>`).join(' ');
    return `
      <div class="problem-item${solved?' solved':''}" onclick="openProblem('${p.id}')">
        <div class="pi-diff" title="難易度">
          ${Array.from({length:4},(_,i)=>`<span class="star ${i<p.diff?'filled':'empty'}">★</span>`).join('')}
        </div>
        <div class="pi-info">
          <div class="pi-name">${p.title}</div>
          <div class="pi-meta">
            <span class="pi-year">${p.year}年 第${p.num}問</span>
            <span class="pi-cat">${getCatName(p.cat)}</span>
            <span class="pi-pts">${p.points}点</span>
            ${tagHtml}
          </div>
        </div>
        <div class="pi-actions">
          ${solved ? '<span class="badge-solved">✅ 解済み</span>' : ''}
          <button class="btn-primary btn-sm" onclick="event.stopPropagation();startProblem('${p.id}')">
            挑戦 →
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function getCatName(cat) {
  const m = {math:'数学',geometry:'幾何',graph:'グラフ',dp:'DP',string:'文字列',greedy:'貪欲法'};
  return m[cat] || cat;
}

function openProblem(id) {
  const p = PROBLEMS.find(pp => pp.id === id);
  if (!p) return;

  const modal = document.getElementById('problemModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  const diffStars = Array.from({length:4},(_,i)=>`<span style="color:${i<p.diff?'var(--gold)':'var(--text3)'};font-size:16px">★</span>`).join('');
  body.innerHTML = `
    <div style="margin-bottom:20px">
      <div style="margin-bottom:8px">${diffStars}</div>
      <h2 style="font-family:var(--font-display);font-size:24px;margin-bottom:8px">${p.title}</h2>
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px">
        <span class="tag tag-gold">${p.points}点</span>
        <span class="tag tag-teal">${p.year}年 第${p.num}問</span>
        <span class="tag tag-purple">${getCatName(p.cat)}</span>
      </div>
    </div>
    <div class="ps-section"><h4>問題文</h4><p>${p.desc}</p></div>
    ${p.formula?`<div class="ps-section"><h4>数式のポイント</h4><p style="color:var(--gold)">${p.formula}</p></div>`:''}
    <div class="ps-section"><h4>入力</h4><p>${p.inputDesc}</p></div>
    <div class="ps-section"><h4>出力</h4><p>${p.outputDesc}</p></div>
    ${p.examples.map((ex,i)=>`
      <div class="ps-section"><h4>例 ${i+1}</h4>
        <div class="io-example">
          <div class="io-label-sm">入力</div><pre>${ex.input}</pre>
          <div class="io-label-sm" style="margin-top:6px">出力</div><pre>${ex.output}</pre>
        </div>
      </div>
    `).join('')}
    <div style="display:flex;gap:12px;margin-top:20px">
      <button class="btn-primary" onclick="closeModal();startProblem('${p.id}')">コードを書く →</button>
      <button class="btn-ghost" onclick="closeModal()">閉じる</button>
    </div>
  `;
  modal.classList.remove('hidden');
}

function startProblem(id) {
  const p = PROBLEMS.find(pp => pp.id === id);
  if (!p) return;
  navigate('judge');
  Judge.setProblem(p);
}

function closeModal() {
  const modal = document.getElementById('problemModal');
  if (modal) modal.classList.add('hidden');
}

// ============================================================
//  ACHIEVEMENTS RENDER
// ============================================================
function renderAchievements() {
  const s = AppState.state;
  const rank = AppState.getRank();
  const next = AppState.getNextRank();

  // Belt color
  const belt = document.getElementById('rankBelt');
  if (belt) belt.style.background = rank.color;
  const rn = document.getElementById('rankName');
  if (rn) { rn.textContent = rank.name; rn.style.color = rank.color; }
  const rd = document.getElementById('rankDesc');
  if (rd) rd.textContent = rank.desc;

  const nextXP = next ? next.minXP : s.xp + 1;
  const prevXP = rank.minXP;
  const progress = Math.min(100, Math.round(((s.xp - prevXP) / (nextXP - prevXP)) * 100));

  const rpf = document.getElementById('rpFill');
  if (rpf) rpf.style.width = progress + '%';
  const rpt = document.getElementById('rpText');
  if (rpt) rpt.textContent = next ? `次の段位まで: ${next.minXP - s.xp} XP` : '最高段位達成！';

  // Rank path
  const rp = document.getElementById('rankPath');
  if (rp) {
    rp.innerHTML = RANKS.map(r => {
      const achieved = s.xp >= r.minXP;
      const current = rank.name === r.name;
      return `
        <div class="rank-stage ${current?'current':''} ${achieved?'achieved':''}">
          <div class="rs-belt" style="background:${r.color}"></div>
          <div class="rs-info">
            <div class="rs-name">${r.name}</div>
            <div class="rs-req">${r.minXP} XP以上 — ${r.desc}</div>
          </div>
          <div class="rs-status">${achieved?'✅':current?'👊':'🔒'}</div>
        </div>
      `;
    }).join('');
  }

  // Achievements grid
  const ag = document.getElementById('achievementsGrid');
  if (ag) {
    const cats = s.solvedCats;
    const langs = s.usedLangs.length;
    const lessons = s.completedLessons.length;
    ag.innerHTML = ACHIEVEMENTS.map(ach => {
      const unlocked = s.achievements.includes(ach.id);
      return `
        <div class="achievement-item ${unlocked?'unlocked':'locked'}">
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-name">${ach.name}</div>
          <div class="ach-desc">${unlocked ? ach.desc : '???'}</div>
        </div>
      `;
    }).join('');
  }
}

// ============================================================
//  DAILY CHALLENGE
// ============================================================
function startDailyChallenge() {
  const unsolved = PROBLEMS.filter(p => !AppState.state.solved.includes(p.id));
  const target = unsolved.length > 0 ? unsolved[0] : PROBLEMS[0];
  startProblem(target.id);
}

// ============================================================
//  RENDER ALL
// ============================================================
function renderAll() {
  renderSidebar();
  renderDashboard();
  renderCurriculum();
  renderProblemList();
  renderAchievements();
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.page));
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProblemList();
    });
  });

  // Category filter & search
  const catF = document.getElementById('catFilter');
  if (catF) catF.addEventListener('change', renderProblemList);
  const srch = document.getElementById('searchProblems');
  if (srch) srch.addEventListener('input', renderProblemList);

  // Lang select
  const ls = document.getElementById('langSelect');
  if (ls) ls.addEventListener('change', () => Judge.loadTemplate(ls.value));

  // Viz selector
  document.querySelectorAll('.viz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.viz-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Visualizer.setViz(btn.dataset.viz);
    });
  });

  // Speed slider
  const spd = document.getElementById('vizSpeed');
  if (spd) spd.addEventListener('input', () => {
    // If playing, restart with new speed
    const playBtn = document.getElementById('vizPlay');
    if (playBtn && playBtn.textContent.includes('一時停止')) {
      Visualizer.playPause(); // pause
      Visualizer.playPause(); // play again with new speed
    }
  });

  // Splash → app transition
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    if (splash && app) {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
        app.classList.remove('hidden');
        renderAll();
        AppState.checkAchievements();
        // Check if first visit
        if (AppState.state.xp === 0) {
          showToast('道場へようこそ！まずはカリキュラムから始めよう！', '⛩️');
        }
      }, 600);
    }
  }, 2000);
});
