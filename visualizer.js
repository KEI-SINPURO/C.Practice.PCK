// ============================================================
//  PCK道場 — Algorithm Visualizer
// ============================================================

const Visualizer = (() => {
  let canvas, ctx, animTimer = null, playing = false;
  let currentViz = 'sort';
  let stepIndex = 0, steps = [], logLines = [];

  // ---- colour palette (matches CSS vars) ----
  const C = {
    bg:      '#0d0d0f',
    surface: '#1e1e28',
    border:  'rgba(255,255,255,0.07)',
    gold:    '#e8a020',
    teal:    '#20c8b0',
    red:     '#e84040',
    green:   '#30c870',
    purple:  '#8060e8',
    text:    '#e8e8f0',
    text2:   '#a0a0b8',
    text3:   '#606078',
  };

  // ============================================================
  //  SORT
  // ============================================================
  function buildSortSteps() {
    const arr = [64, 34, 25, 12, 22, 11, 90, 45, 78, 55];
    const a = [...arr];
    const s = [];
    const n = a.length;

    s.push({ arr: [...a], hi: -1, hj: -1, swapped: -1, msg: '初期配列。バブルソートを開始します。' });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        s.push({ arr: [...a], hi: j, hj: j + 1, swapped: -1, msg: `a[${j}]=${a[j]} と a[${j+1}]=${a[j+1]} を比較` });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          s.push({ arr: [...a], hi: j, hj: j + 1, swapped: j, msg: `a[${j}] > a[${j+1}] → 交換！` });
        }
      }
      s.push({ arr: [...a], hi: -1, hj: -1, sorted: n - 1 - i, msg: `パス ${i+1} 完了。最大値が末尾に移動。` });
    }
    s.push({ arr: [...a], hi: -1, hj: -1, done: true, msg: 'ソート完了！🎉' });
    return s;
  }

  function drawSort(step) {
    const s = steps[step];
    if (!s) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const n = s.arr.length;
    const maxVal = Math.max(...s.arr);
    const barW = Math.floor((W - 60) / n);
    const maxH = H - 80;

    s.arr.forEach((v, i) => {
      const bh = Math.floor((v / maxVal) * maxH);
      const x = 30 + i * barW;
      const y = H - 40 - bh;

      let color = C.teal;
      if (s.done) color = C.green;
      else if (i === s.hi || i === s.hj) color = C.gold;
      else if (i === s.swapped || i === s.swapped + 1) color = C.red;
      else if (s.sorted !== undefined && i >= n - 1 - s.sorted) color = C.green;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + 2, y, barW - 4, bh, 4);
      ctx.fill();

      ctx.fillStyle = C.text2;
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(v, x + barW / 2, H - 22);
    });

    // log
    addLog(s.msg);
    document.getElementById('vizLog').textContent = logLines.slice(-5).join('\n');
  }

  // ============================================================
  //  BFS
  // ============================================================
  const BFS_GRAPH = {
    nodes: [
      { id: 0, x: 0.5, y: 0.15, label: '1' },
      { id: 1, x: 0.25, y: 0.4,  label: '2' },
      { id: 2, x: 0.75, y: 0.4,  label: '3' },
      { id: 3, x: 0.15, y: 0.7,  label: '4' },
      { id: 4, x: 0.4,  y: 0.7,  label: '5' },
      { id: 5, x: 0.6,  y: 0.7,  label: '6' },
      { id: 6, x: 0.85, y: 0.7,  label: '7' },
    ],
    edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]
  };

  function buildBFSSteps() {
    const g = BFS_GRAPH;
    const n = g.nodes.length;
    const adj = Array.from({length:n}, ()=>[]);
    g.edges.forEach(([a,b])=>{ adj[a].push(b); adj[b].push(a); });

    const s = [];
    const dist = new Array(n).fill(-1);
    const visited = new Array(n).fill(false);
    const queue = [];

    dist[0] = 0; visited[0] = true; queue.push(0);
    s.push({ visited: [...visited], dist: [...dist], queue: [...queue], cur: -1, msg: 'ノード1をキューに追加。dist[1]=0' });

    while (queue.length) {
      const v = queue.shift();
      s.push({ visited: [...visited], dist: [...dist], queue: [...queue], cur: v, msg: `ノード${v+1}をキューから取り出す (dist=${dist[v]})` });
      for (const u of adj[v]) {
        if (!visited[u]) {
          visited[u] = true;
          dist[u] = dist[v] + 1;
          queue.push(u);
          s.push({ visited: [...visited], dist: [...dist], queue: [...queue], cur: v, next: u, msg: `ノード${u+1}を発見！dist[${u+1}]=${dist[u]}` });
        }
      }
    }
    s.push({ visited: [...visited], dist: [...dist], queue: [], cur: -1, done: true, msg: 'BFS完了！全ノードの最短距離が確定しました。' });
    return s;
  }

  function drawBFS(stepIdx) {
    const s = steps[stepIdx];
    if (!s) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const g = BFS_GRAPH;

    // edges
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 2;
    g.edges.forEach(([a, b]) => {
      const na = g.nodes[a], nb = g.nodes[b];
      ctx.beginPath();
      ctx.moveTo(na.x * W, na.y * H);
      ctx.lineTo(nb.x * W, nb.y * H);
      ctx.stroke();
    });

    // highlight current edge
    if (s.next !== undefined) {
      const na = g.nodes[s.cur], nb = g.nodes[s.next];
      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(na.x * W, na.y * H);
      ctx.lineTo(nb.x * W, nb.y * H);
      ctx.stroke();
    }

    // nodes
    g.nodes.forEach((nd, i) => {
      const x = nd.x * W, y = nd.y * H;
      let fill = C.surface;
      if (s.done) fill = C.green;
      else if (i === s.cur) fill = C.gold;
      else if (i === s.next) fill = C.teal;
      else if (s.visited[i]) fill = C.purple;

      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = C.text;
      ctx.font = 'bold 14px Noto Sans JP, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nd.label, x, y);

      if (s.dist[i] >= 0) {
        ctx.fillStyle = C.text2;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText('d=' + s.dist[i], x, y + 32);
      }
    });

    addLog(s.msg);
    document.getElementById('vizLog').textContent = logLines.slice(-5).join('\n');
  }

  // ============================================================
  //  DFS
  // ============================================================
  function buildDFSSteps() {
    const g = BFS_GRAPH;
    const n = g.nodes.length;
    const adj = Array.from({length:n}, ()=>[]);
    g.edges.forEach(([a,b])=>{ adj[a].push(b); adj[b].push(a); });

    const s = [];
    const visited = new Array(n).fill(false);
    const stack_log = [];

    function dfs(v, parent) {
      visited[v] = true;
      stack_log.push(v);
      s.push({ visited: [...visited], stack: [...stack_log], cur: v, msg: `ノード${v+1}を訪問 (スタック深さ=${stack_log.length})` });
      for (const u of adj[v]) {
        if (!visited[u]) {
          s.push({ visited: [...visited], stack: [...stack_log], cur: v, next: u, msg: `ノード${v+1}からノード${u+1}へ移動` });
          dfs(u, v);
        }
      }
      stack_log.pop();
      s.push({ visited: [...visited], stack: [...stack_log], cur: v, backtrack: true, msg: `ノード${v+1}からバックトラック` });
    }

    dfs(0, -1);
    s.push({ visited: [...visited], stack: [], cur: -1, done: true, msg: 'DFS完了！' });
    return s;
  }

  function drawDFS(stepIdx) {
    const s = steps[stepIdx];
    if (!s) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const g = BFS_GRAPH;

    ctx.strokeStyle = C.border; ctx.lineWidth = 2;
    g.edges.forEach(([a,b]) => {
      const na = g.nodes[a], nb = g.nodes[b];
      ctx.beginPath();
      ctx.moveTo(na.x*W, na.y*H);
      ctx.lineTo(nb.x*W, nb.y*H);
      ctx.stroke();
    });

    if (s.next !== undefined) {
      const na = g.nodes[s.cur], nb = g.nodes[s.next];
      ctx.strokeStyle = C.red; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(na.x*W, na.y*H);
      ctx.lineTo(nb.x*W, nb.y*H);
      ctx.stroke();
    }

    g.nodes.forEach((nd, i) => {
      const x = nd.x*W, y = nd.y*H;
      let fill = C.surface;
      if (s.done) fill = C.green;
      else if (i === s.cur) fill = s.backtrack ? C.purple : C.red;
      else if (s.visited[i]) fill = C.teal;

      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke();

      ctx.fillStyle = C.text;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(nd.label, x, y);
    });

    // stack display
    ctx.fillStyle = C.text3;
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('スタック: [' + s.stack.map(v=>v+1).join(' → ') + ']', 10, 18);

    addLog(s.msg);
    document.getElementById('vizLog').textContent = logLines.slice(-5).join('\n');
  }

  // ============================================================
  //  DP (coin change)
  // ============================================================
  function buildDPSteps() {
    const coins = [1, 3, 5];
    const target = 11;
    const dp = new Array(target + 1).fill(Infinity);
    dp[0] = 0;

    const s = [];
    s.push({ dp: [...dp], cur: -1, coin: -1, msg: `dp[0]=0 初期化。コイン: [${coins.join(', ')}]、目標: ${target}` });

    for (let i = 1; i <= target; i++) {
      for (const c of coins) {
        if (i >= c && dp[i - c] + 1 < dp[i]) {
          dp[i] = dp[i - c] + 1;
          s.push({ dp: [...dp], cur: i, coin: c, msg: `dp[${i}] = dp[${i-c}]+1 = ${dp[i]} (コイン${c}を使用)` });
        }
      }
      if (dp[i] === Infinity)
        s.push({ dp: [...dp], cur: i, coin: -1, msg: `dp[${i}] = ∞ (到達不能)` });
    }
    s.push({ dp: [...dp], cur: -1, coin: -1, done: true, msg: `完了！${target}円の最少コイン枚数: ${dp[target]}枚` });
    return s;
  }

  function drawDP(stepIdx) {
    const s = steps[stepIdx];
    if (!s) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const n = s.dp.length;
    const cellW = Math.min(60, Math.floor((W - 40) / n));
    const startX = (W - cellW * n) / 2;
    const cellH = 60, cellY = H / 2 - cellH / 2;

    s.dp.forEach((v, i) => {
      const x = startX + i * cellW;
      let fill = C.surface;
      if (s.done) fill = v < Infinity ? C.green : C.surface;
      else if (i === s.cur) fill = C.gold;
      else if (v < Infinity) fill = C.teal;

      ctx.fillStyle = fill;
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x + 2, cellY, cellW - 4, cellH, 4);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = C.text;
      ctx.font = 'bold 15px JetBrains Mono, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(v === Infinity ? '∞' : v, x + cellW / 2, cellY + cellH / 2);

      ctx.fillStyle = C.text3;
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(i, x + cellW / 2, cellY + cellH + 16);
    });

    ctx.fillStyle = C.text2;
    ctx.font = '13px Noto Sans JP, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('dp[i] = i円を作る最少コイン枚数', W / 2, cellY - 20);

    addLog(s.msg);
    document.getElementById('vizLog').textContent = logLines.slice(-5).join('\n');
  }

  // ============================================================
  //  BINARY SEARCH
  // ============================================================
  function buildBinarySteps() {
    const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    const target = 23;
    const s = [];
    let lo = 0, hi = arr.length - 1;

    s.push({ arr: [...arr], lo, hi, mid: -1, target, msg: `目標値: ${target}。範囲 [0, ${hi}] から探索開始` });

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      s.push({ arr, lo, hi, mid, target, msg: `中央 mid=${mid} (値=${arr[mid]}) を確認` });
      if (arr[mid] === target) {
        s.push({ arr, lo, hi, mid, target, found: mid, msg: `発見！arr[${mid}]=${target} ✓` });
        break;
      } else if (arr[mid] < target) {
        lo = mid + 1;
        s.push({ arr, lo, hi, mid, target, msg: `arr[${mid}]=${arr[mid]} < ${target} → 右半分に絞る (lo=${lo})` });
      } else {
        hi = mid - 1;
        s.push({ arr, lo, hi, mid, target, msg: `arr[${mid}]=${arr[mid]} > ${target} → 左半分に絞る (hi=${hi})` });
      }
    }
    return s;
  }

  function drawBinary(stepIdx) {
    const s = steps[stepIdx];
    if (!s) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const n = s.arr.length;
    const cellW = Math.min(70, Math.floor((W - 40) / n));
    const startX = (W - cellW * n) / 2;
    const cellH = 60, cellY = H / 2 - cellH / 2;

    s.arr.forEach((v, i) => {
      const x = startX + i * cellW;
      let fill = C.surface;
      if (s.found === i) fill = C.green;
      else if (i === s.mid) fill = C.gold;
      else if (i >= s.lo && i <= s.hi) fill = '#1e2a3a';
      else fill = '#0d0d12';

      ctx.fillStyle = fill;
      ctx.strokeStyle = i >= s.lo && i <= s.hi ? C.teal : C.border;
      ctx.lineWidth = i >= s.lo && i <= s.hi ? 1.5 : 1;
      ctx.beginPath();
      ctx.roundRect(x + 2, cellY, cellW - 4, cellH, 4);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = i >= s.lo && i <= s.hi ? C.text : C.text3;
      ctx.font = 'bold 15px JetBrains Mono, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(v, x + cellW / 2, cellY + cellH / 2);

      ctx.fillStyle = C.text3;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(i, x + cellW / 2, cellY + cellH + 14);

      if (i === s.lo) { ctx.fillStyle = C.teal; ctx.fillText('lo', x + cellW/2, cellY - 14); }
      if (i === s.hi) { ctx.fillStyle = C.red;  ctx.fillText('hi', x + cellW/2, cellY - 14); }
      if (i === s.mid) { ctx.fillStyle = C.gold; ctx.font = 'bold 11px JetBrains Mono, monospace'; ctx.fillText('mid', x + cellW/2, cellY - 14); }
    });

    ctx.fillStyle = C.text2;
    ctx.font = '13px Noto Sans JP, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`目標値: ${s.target}`, W / 2, cellY - 35);

    addLog(s.msg);
    document.getElementById('vizLog').textContent = logLines.slice(-5).join('\n');
  }

  // ============================================================
  //  UTILS
  // ============================================================
  function addLog(msg) { logLines.push(msg); if (logLines.length > 30) logLines.shift(); }

  function getExplanation(type) {
    const exps = {
      sort: {
        title: 'バブルソート',
        text: '隣り合う要素を比較して、大きければ交換する操作を繰り返します。1回のパスで必ず最大値が末尾に移動します。計算量はO(N²)。実際の競技では qsort（O(N log N)）を使いましょう。',
        steps: [
          { n: 1, t: '隣り合う2要素を比較', c: 'if (a[j] > a[j+1])' },
          { n: 2, t: '大きければ交換', c: 'int tmp=a[j]; a[j]=a[j+1]; a[j+1]=tmp;' },
          { n: 3, t: 'N-1回パスを繰り返す', c: 'for(int i=0; i<n-1; i++)' },
        ]
      },
      bfs: {
        title: '幅優先探索 (BFS)',
        text: 'キューを使って近いノードから順に探索します。最短経路（辺の重みが全て1）を求めるのに有効。2024年「湖の調査」などのグリッド問題に応用できます。',
        steps: [
          { n: 1, t: '始点をキューに追加、dist[始点]=0', c: 'queue.push(start); dist[start]=0;' },
          { n: 2, t: 'キューから先頭を取り出す', c: 'int v = queue.front(); queue.pop();' },
          { n: 3, t: '未訪問の隣接ノードをキューに追加', c: 'if(!visited[u]) { dist[u]=dist[v]+1; queue.push(u); }' },
        ]
      },
      dfs: {
        title: '深さ優先探索 (DFS)',
        text: 'スタック（または再帰）を使って深い方向に進んでいく探索方法。連結成分の検出や全探索などに使います。バックトラック（戻る）が特徴的です。',
        steps: [
          { n: 1, t: '始点を訪問済みにする', c: 'visited[v] = true;' },
          { n: 2, t: '未訪問の隣接ノードを再帰的に探索', c: 'for(int u: adj[v]) if(!visited[u]) dfs(u);' },
          { n: 3, t: '全隣接ノードを探索したらバックトラック', c: '/* 再帰から戻る */' },
        ]
      },
      dp: {
        title: '動的計画法 (DP) — コイン問題',
        text: '「i円を作る最少コイン枚数」dp[i]を小さい値から順に計算します。dp[i] = min(dp[i-c]+1) for each coin c。記憶化で同じ計算を繰り返しません。',
        steps: [
          { n: 1, t: 'dp[0]=0で初期化（0円は0枚）', c: 'dp[0] = 0;' },
          { n: 2, t: '各コインでdp[i]を更新', c: 'if(dp[i-c]+1 < dp[i]) dp[i] = dp[i-c]+1;' },
          { n: 3, t: '1からtargetまで繰り返す', c: 'for(int i=1; i<=target; i++)' },
        ]
      },
      binary: {
        title: '二分探索',
        text: 'ソート済み配列で目標値を探す際、毎回範囲を半分に絞ります。O(log N)で非常に高速。N=10^9でも約30回の比較で終わります。',
        steps: [
          { n: 1, t: '中央値midを計算', c: 'int mid = (lo + hi) / 2;' },
          { n: 2, t: 'mid の値と目標を比較して範囲を絞る', c: 'if(arr[mid]<target) lo=mid+1; else hi=mid-1;' },
          { n: 3, t: 'lo > hi になるまで繰り返す', c: 'while(lo <= hi)' },
        ]
      }
    };
    return exps[type] || exps.sort;
  }

  function renderExplanation(type) {
    const e = getExplanation(type);
    const div = document.getElementById('vizExplanation');
    if (!div) return;
    div.innerHTML = `
      <div class="viz-exp-title">${e.title}</div>
      <div class="viz-exp-text">${e.text}</div>
      <div class="viz-steps">
        ${e.steps.map(st => `
          <div class="viz-step">
            <div class="viz-step-num">${st.n}</div>
            <div class="viz-step-text">${st.t}<br><code>${st.c}</code></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ============================================================
  //  PUBLIC API
  // ============================================================
  function init() {
    canvas = document.getElementById('vizCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    setViz('sort');
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width  - 40;
    canvas.height = 300;
    draw();
  }

  function setViz(type) {
    currentViz = type;
    stepIndex = 0;
    logLines = [];
    playing = false;
    clearInterval(animTimer);
    document.getElementById('vizPlay').textContent = '▶ 自動再生';

    switch (type) {
      case 'sort':   steps = buildSortSteps();   break;
      case 'bfs':    steps = buildBFSSteps();     break;
      case 'dfs':    steps = buildDFSSteps();     break;
      case 'dp':     steps = buildDPSteps();      break;
      case 'binary': steps = buildBinarySteps();  break;
      default:       steps = buildSortSteps();
    }
    renderExplanation(type);
    draw();
  }

  function draw() {
    if (!canvas || !ctx) return;
    switch (currentViz) {
      case 'sort':   drawSort(stepIndex);   break;
      case 'bfs':    drawBFS(stepIndex);    break;
      case 'dfs':    drawDFS(stepIndex);    break;
      case 'dp':     drawDP(stepIndex);     break;
      case 'binary': drawBinary(stepIndex); break;
    }
  }

  function step() {
    if (stepIndex < steps.length - 1) {
      stepIndex++;
      draw();
    } else {
      clearInterval(animTimer);
      playing = false;
      document.getElementById('vizPlay').textContent = '▶ 自動再生';
    }
  }

  function playPause() {
    if (playing) {
      clearInterval(animTimer);
      playing = false;
      document.getElementById('vizPlay').textContent = '▶ 自動再生';
    } else {
      if (stepIndex >= steps.length - 1) { stepIndex = 0; logLines = []; }
      playing = true;
      document.getElementById('vizPlay').textContent = '⏸ 一時停止';
      const spd = parseInt(document.getElementById('vizSpeed').value) || 5;
      const delay = Math.max(100, 1200 - spd * 100);
      animTimer = setInterval(() => {
        step();
        if (stepIndex >= steps.length - 1) {
          clearInterval(animTimer);
          playing = false;
          document.getElementById('vizPlay').textContent = '▶ 自動再生';
        }
      }, delay);
    }
  }

  function reset() {
    stepIndex = 0;
    logLines = [];
    clearInterval(animTimer);
    playing = false;
    document.getElementById('vizPlay').textContent = '▶ 自動再生';
    setViz(currentViz);
  }

  return { init, setViz, step, playPause, reset };
})();

// Global wrappers called from HTML
function vizStep()      { Visualizer.step(); }
function vizPlayPause() { Visualizer.playPause(); }
function vizReset()     { Visualizer.reset(); }
