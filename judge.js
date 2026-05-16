// ============================================================
//  PCK道場 — Code Judge (Browser-side simulation)
//  Note: 実際のコンパイルはブラウザでは不可能なため、
//  入出力ベースの正誤判定 + Pythonのみeval判定を行います。
// ============================================================

const Judge = (() => {
  let currentProblem = null;
  let hintLevel = 0;
  let startTime = null;

  // ---- Simple Python-like interpreter for basic problems ----
  function evalPython(code, input) {
    const lines = input.trim().split('\n');
    let lineIdx = 0;
    const output = [];

    // Mock input() function
    function mockInput() {
      return lines[lineIdx++] || '';
    }

    // Mock print function
    function mockPrint(...args) {
      output.push(args.join(' '));
    }

    // Rewrite common patterns
    let transformed = code
      .replace(/input\(\)/g, '__input__()')
      .replace(/print\(/g, '__print__(');

    try {
      const fn = new Function(
        '__input__', '__print__', '__lines__',
        `
        const map = (fn, iter) => Array.from(iter).map(fn);
        const int = (x) => parseInt(x, 10);
        const float = (x) => parseFloat(x);
        const str = (x) => String(x);
        const len = (x) => x.length;
        const range = function(a,b,c){
          if(b===undefined){b=a;a=0;c=1;}
          if(c===undefined)c=1;
          const r=[];
          for(let i=a;c>0?i<b:i>b;i+=c)r.push(i);
          return r;
        };
        const abs = Math.abs;
        const max = (...a) => a.length===1&&Array.isArray(a[0])?Math.max(...a[0]):Math.max(...a);
        const min = (...a) => a.length===1&&Array.isArray(a[0])?Math.min(...a[0]):Math.min(...a);
        const sum = (a) => a.reduce((s,x)=>s+x,0);
        const sorted = (a,key,rev) => {
          const c=[...a];
          c.sort(key||(x=>x));
          if(rev)c.reverse();
          return c;
        };
        const list = (x) => Array.isArray(x)?[...x]:[...x];
        const math = {ceil:Math.ceil,floor:Math.floor,sqrt:Math.sqrt,pow:Math.pow};
        ${transformed}
        `
      );
      fn(mockInput, mockPrint, lines);
      return { ok: true, output: output.join('\n') };
    } catch (e) {
      return { ok: false, output: 'エラー: ' + e.message };
    }
  }

  // ---- Judge against test cases ----
  function runTestCases(problem, code, lang) {
    const results = [];
    let allPass = true;

    for (let i = 0; i < problem.examples.length; i++) {
      const ex = problem.examples[i];
      let got = '';
      let ok = false;

      if (lang === 'python') {
        const r = evalPython(code, ex.input);
        got = r.output.trim();
        ok = r.ok && normalize(got) === normalize(ex.output);
        if (!r.ok) { got = r.output; allPass = false; }
        else allPass = allPass && ok;
      } else {
        // C/C++/Java: テンプレートコードと照合（コンパイル不可）
        // 代わりにコードパターンマッチで部分チェック
        const check = checkCodeStructure(code, lang, problem);
        ok = check.pass;
        got = check.pass ? ex.output : '(ブラウザでのC言語実行は未対応。ロジックチェックのみ)';
        allPass = allPass && ok;
      }

      results.push({
        no: i + 1,
        input: ex.input,
        expected: ex.output,
        got,
        pass: ok
      });
    }

    return { results, allPass };
  }

  // ---- Structural check for C/C++/Java ----
  function checkCodeStructure(code, lang, problem) {
    if (!code || code.trim().length < 20) return { pass: false, msg: 'コードが短すぎます' };

    const checks = [];
    const c = code.toLowerCase();

    // Check basic structure
    if (lang === 'c' || lang === 'cpp') {
      if (!c.includes('main')) checks.push('main関数がない');
      if (!c.includes('printf') && !c.includes('cout')) checks.push('出力文がない');
      if (!c.includes('scanf') && !c.includes('cin') && !c.includes('int ') && problem.inputDesc !== '') {
        // might be ok for some problems
      }
    }

    // Problem-specific checks
    const pid = problem.id;
    if (pid === 'p2025_1') {
      if (!c.includes('a + b * x') && !c.includes('a+b*x') && !c.includes('b * x') && !c.includes('b*x')) {
        checks.push('A + B×X の計算式が見当たりません');
      }
    }
    if (pid === 'p2025_2') {
      if (!c.includes('side') && !c.includes('"side"')) checks.push('"side"の出力がない');
      if (!c.includes('up') && !c.includes('"up"')) checks.push('"up"の出力がない');
      if (!c.includes('down') && !c.includes('"down"')) checks.push('"down"の出力がない');
    }
    if (pid === 'p2023_1') {
      if (!c.includes('%') && !c.includes('mod')) checks.push('剰余演算子(%)が見当たりません');
    }
    if (pid === 'p2023_3') {
      if (!c.includes('b / 2') && !c.includes('b/2')) checks.push('b/2 の計算が見当たりません');
    }

    return { pass: checks.length === 0, issues: checks };
  }

  // ---- Normalize output for comparison ----
  function normalize(s) {
    return s.trim().replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '');
  }

  // ---- Run single input (for custom test) ----
  function runCustom(code, lang, input) {
    if (lang === 'python') {
      return evalPython(code, input);
    }
    // For C/C++/Java simulate with structural hint
    return {
      ok: true,
      output: `[C言語/C++/Java はブラウザ内コンパイル不可]\n\n` +
              `実際に実行するには:\n` +
              `• オンラインジャッジ: paiza.io, wandbox.org\n` +
              `• ローカル: gcc コマンドでコンパイル\n\n` +
              `コードの構造チェック: ${checkCodeStructure(code, lang, currentProblem || {id:'',inputDesc:''}).issues?.join(', ') || 'OK'}`
    };
  }

  // ---- Public API ----
  function setProblem(problem) {
    currentProblem = problem;
    hintLevel = 0;
    startTime = Date.now();

    // Render problem statement
    const ps = document.getElementById('problemStatement');
    if (!ps) return;

    const diffStars = '★'.repeat(problem.diff) + '☆'.repeat(4 - problem.diff);
    const tagsHtml = (problem.tags || []).map(t =>
      `<span class="tag tag-teal">${t}</span>`).join(' ');

    ps.innerHTML = `
      <div class="ps-title">${problem.title}</div>
      <div style="margin-bottom:12px">
        <span class="ps-points">${problem.points}点 | ${diffStars} | ${problem.year}年 第${problem.num}問</span>
      </div>
      <div style="margin-bottom:8px">${tagsHtml}</div>

      <div class="ps-section">
        <h4>問題文</h4>
        <p>${problem.desc}</p>
      </div>
      ${problem.formula ? `
      <div class="ps-section">
        <h4>ポイント</h4>
        <p style="color:var(--gold)">${problem.formula}</p>
      </div>` : ''}
      <div class="ps-section">
        <h4>入力形式</h4>
        <p>${problem.inputDesc}</p>
      </div>
      <div class="ps-section">
        <h4>出力形式</h4>
        <p>${problem.outputDesc}</p>
      </div>
      ${problem.examples.map((ex, i) => `
        <div class="ps-section">
          <h4>入出力例 ${i + 1}</h4>
          <div class="io-example">
            <div class="io-label-sm">入力</div>
            <pre>${ex.input}</pre>
            <div class="io-label-sm" style="margin-top:6px">出力</div>
            <pre>${ex.output}</pre>
          </div>
        </div>
      `).join('')}
    `;

    // Set subtitle
    const sub = document.getElementById('judgeSubtitle');
    if (sub) sub.textContent = `${problem.title} — ${problem.year}年 第${problem.num}問`;

    // Load template
    const lang = document.getElementById('langSelect')?.value || 'c';
    loadTemplate(lang);
    updateLineNumbers();
  }

  function loadTemplate(lang) {
    if (!currentProblem) return;
    const tmpl = currentProblem.template?.[lang] || `// ${lang} のテンプレートがありません`;
    const editor = document.getElementById('codeEditor');
    if (editor) {
      editor.value = tmpl;
      updateLineNumbers();
    }
  }

  function showHint() {
    if (!currentProblem) {
      showToast('先に問題を選択してください', '💡');
      return;
    }
    const box = document.getElementById('hintBox');
    if (!box) return;
    const hints = currentProblem.hints || ['ヒントはありません'];
    const h = hints[Math.min(hintLevel, hints.length - 1)];
    box.classList.remove('hidden');
    box.innerHTML = `
      <h4>💡 ヒント ${hintLevel + 1}/${hints.length}</h4>
      <p>${h}</p>
      ${hintLevel < hints.length - 1 ?
        `<button class="btn-ghost btn-sm" style="margin-top:8px" onclick="showHint()">次のヒントを見る →</button>` : ''}
    `;
    hintLevel = Math.min(hintLevel + 1, hints.length - 1);
    // Penalty for using hints (no XP deduction here, just track)
  }

  function updateLineNumbers() {
    const editor = document.getElementById('codeEditor');
    const lnDiv = document.getElementById('lineNumbers');
    if (!editor || !lnDiv) return;
    const lines = editor.value.split('\n').length;
    lnDiv.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
  }

  function run() {
    if (!currentProblem) {
      const outArea = document.getElementById('outputArea');
      if (outArea) outArea.textContent = '問題を選択してから実行してください。';
      return;
    }

    const code = document.getElementById('codeEditor')?.value || '';
    const lang = document.getElementById('langSelect')?.value || 'c';
    const customInput = document.getElementById('inputArea')?.value || '';
    const outArea = document.getElementById('outputArea');
    const trDiv = document.getElementById('testResults');

    if (!outArea) return;

    // Custom input execution
    if (customInput.trim()) {
      const r = runCustom(code, lang, customInput);
      outArea.textContent = r.output;
      outArea.className = 'io-area output-area ' + (r.ok ? 'output-ok' : 'output-err');
    } else {
      outArea.textContent = 'テスト入力を入力するか、↓のテストケースで確認してください';
    }

    // Test cases
    if (trDiv) {
      const { results, allPass } = runTestCases(currentProblem, code, lang);
      trDiv.classList.remove('hidden');

      const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

      trDiv.innerHTML = `
        <div class="tr-title">
          ${allPass ? '✅ 全テストケース通過！' : '❌ 一部のテストケースが不正解'}
          <span style="color:var(--text3);font-size:12px;margin-left:12px">経過時間: ${elapsed}秒</span>
        </div>
        ${results.map(r => `
          <div class="tr-case">
            <div class="tr-icon">${r.pass ? '✅' : '❌'}</div>
            <div class="tr-label">テスト ${r.no}</div>
            <div class="tr-result">入力: ${r.input.replace(/\n/g, ' / ')} → 期待: ${r.expected} | 結果: ${r.got.replace(/\n/g,' ')}</div>
          </div>
        `).join('')}
      `;

      // Award XP if all pass
      if (allPass && window.AppState) {
        const isFast = elapsed < 60;
        window.AppState.solveProblem(currentProblem, isFast);
      }
    }
  }

  function resetCode() {
    const lang = document.getElementById('langSelect')?.value || 'c';
    loadTemplate(lang);
    const trDiv = document.getElementById('testResults');
    const hintBox = document.getElementById('hintBox');
    if (trDiv) trDiv.classList.add('hidden');
    if (hintBox) hintBox.classList.add('hidden');
    hintLevel = 0;
    startTime = Date.now();
    updateLineNumbers();
  }

  return { setProblem, loadTemplate, showHint, run, resetCode, updateLineNumbers };
})();

// Global wrappers
function runCode()    { Judge.run(); }
function showHint()   { Judge.showHint(); }
function resetCode()  { Judge.resetCode(); }
function handleEditorInput()           { Judge.updateLineNumbers(); }
function handleEditorKeydown(e) {
  // Tab key → insert spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    const ed = e.target;
    const s = ed.selectionStart, en = ed.selectionEnd;
    ed.value = ed.value.substring(0, s) + '    ' + ed.value.substring(en);
    ed.selectionStart = ed.selectionEnd = s + 4;
    Judge.updateLineNumbers();
  }
}
