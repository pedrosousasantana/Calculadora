/* ============================================================
   calc.js — lógica da calculadora científica
   ============================================================ */

const ROWS = [
  [{ l: '(', t: 'p' }, { l: ')', t: 'p' }, { l: 'x²', t: 'fn', f: 'sq' }, { l: 'xʸ', t: 'o', v: '^' }, { l: '√', t: 'fn', f: 'sqrt' }],
  [{ l: 'sin', t: 'fn', f: 'sin' }, { l: 'cos', t: 'fn', f: 'cos' }, { l: 'tan', t: 'fn', f: 'tan' }, { l: 'log', t: 'fn', f: 'log' }, { l: 'ln', t: 'fn', f: 'ln' }],
  [{ l: 'π', t: 'c', v: '3.14159265358979' }, { l: 'e', t: 'c', v: '2.71828182845904' }, { l: 'n!', t: 'fn', f: 'fact' }, { l: '%', t: 'o', v: '%' }, { l: 'AC', t: 'clr' }],
  [{ l: '7', t: 'n' }, { l: '8', t: 'n' }, { l: '9', t: 'n' }, { l: '÷', t: 'o', v: '/' }, { l: 'DEL', t: 'del' }],
  [{ l: '4', t: 'n' }, { l: '5', t: 'n' }, { l: '6', t: 'n' }, { l: '×', t: 'o', v: '*' }, { l: '(', t: 'p' }],
  [{ l: '1', t: 'n' }, { l: '2', t: 'n' }, { l: '3', t: 'n' }, { l: '−', t: 'o', v: '-' }, { l: ')', t: 'p' }],
  [{ l: '±', t: 'neg' }, { l: '0', t: 'n' }, { l: '.', t: 'dot' }, { l: '+', t: 'o', v: '+' }, { l: '=', t: 'eq' }],
];

const INV_MAP = { sin: 'asin', cos: 'acos', tan: 'atan', log: 'pow10', ln: 'expn' };
const INV_LBL = { sin: 'sin⁻¹', cos: 'cos⁻¹', tan: 'tan⁻¹', log: '10ˣ', ln: 'eˣ' };

let expr = '', result = '0', mode = 'deg', inv = false, newNum = true, history = [];

/* ── DOM refs ── */
const elExpr = document.getElementById('expr');
const elMain = document.getElementById('mainVal');
const elHistLast = document.getElementById('histLast');
const elHistList = document.getElementById('histList');
const elHistPanel = document.getElementById('histPanel');

/* ── Build keypad ── */
function renderKeys() {
  const grid = document.getElementById('keypad');
  grid.innerHTML = '';
  ROWS.forEach(row => {
    row.forEach(b => {
      const btn = document.createElement('button');
      let lbl = b.l;
      if (inv && b.t === 'fn' && INV_MAP[b.f]) lbl = INV_LBL[b.f] || lbl;
      btn.textContent = lbl;
      btn.className = 'key ' + keyClass(b);
      btn.addEventListener('click', () => handleKey(b));
      grid.appendChild(btn);
    });
  });
}

function keyClass(b) {
  if (b.t === 'n' || b.t === 'dot') return 'key-num';
  if (b.t === 'eq') return 'key-eq';
  if (b.t === 'clr') return 'key-clr';
  if (b.t === 'o') return 'key-op';
  return 'key-fn';
}

/* ── Mode / Inv / Hist ── */
document.getElementById('bDeg').addEventListener('click', () => setMode('deg'));
document.getElementById('bRad').addEventListener('click', () => setMode('rad'));
document.getElementById('bInv').addEventListener('click', toggleInv);
document.getElementById('bHist').addEventListener('click', toggleHist);

function setMode(m) {
  mode = m;
  ['bDeg', 'bRad'].forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById(m === 'deg' ? 'bDeg' : 'bRad').classList.add('active');
}

function toggleInv() {
  inv = !inv;
  document.getElementById('bInv').classList.toggle('active', inv);
  renderKeys();
}

function toggleHist() {
  const open = !elHistPanel.classList.contains('open');
  elHistPanel.classList.toggle('open', open);
  document.getElementById('bHist').classList.toggle('active', open);
}

/* ── Math helpers ── */
function toRad(x) { return mode === 'deg' ? x * Math.PI / 180 : x; }
function fromRad(x) { return mode === 'deg' ? x * 180 / Math.PI : x; }
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function fmtN(n) {
  if (isNaN(n)) return 'Erro';
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
  return parseFloat(n.toPrecision(12)).toString();
}

function applyFn(f, x) {
  const ef = inv && INV_MAP[f] ? INV_MAP[f] : f;
  switch (ef) {
    case 'sin': return Math.sin(toRad(x));
    case 'cos': return Math.cos(toRad(x));
    case 'tan': return Math.tan(toRad(x));
    case 'asin': return fromRad(Math.asin(x));
    case 'acos': return fromRad(Math.acos(x));
    case 'atan': return fromRad(Math.atan(x));
    case 'log': return Math.log10(x);
    case 'ln': return Math.log(x);
    case 'pow10': return Math.pow(10, x);
    case 'expn': return Math.E ** x;
    case 'sqrt': return Math.sqrt(x);
    case 'sq': return x * x;
    case 'fact': return factorial(x);
    default: return x;
  }
}

/* ── Key handler ── */
function handleKey(b) {
  switch (b.t) {
    case 'clr':
      expr = ''; result = '0'; newNum = true;
      break;
    case 'del':
      if (expr.length > 0) expr = expr.slice(0, -1);
      if (!expr) result = '0';
      newNum = false;
      break;
    case 'n':
      if (newNum) { expr = ''; newNum = false; }
      expr += b.l;
      result = fmtN(parseFloat(expr)) || result;
      break;
    case 'dot':
      if (newNum) { expr = '0.'; newNum = false; }
      else if (!expr.split(/[+\-*/^]/).pop().includes('.')) expr += '.';
      break;
    case 'c':
      if (newNum) { expr = b.v; newNum = false; }
      else expr += b.v;
      result = fmtN(parseFloat(b.v));
      break;
    case 'p':
      expr += b.l; newNum = false;
      break;
    case 'neg':
      expr = expr.startsWith('-') ? expr.slice(1) : '-' + expr;
      break;
    case 'fn': {
      const cur = parseFloat(result) || 0;
      const val = applyFn(b.f, cur);
      const nm = inv && INV_MAP[b.f] ? (INV_LBL[b.f] || b.l) : b.l;
      expr = nm + '(' + fmtN(cur) + ')';
      result = fmtN(val);
      newNum = true;
      break;
    }
    case 'o':
      newNum = false;
      expr += b.v === '/' ? '÷' : b.v === '*' ? '×' : b.v;
      break;
    case 'eq': {
      try {
        const safe = expr
          .replace(/÷/g, '/')
          .replace(/×/g, '*')
          .replace(/\^/g, '**')
          .replace(/%/g, '/100');
        // eslint-disable-next-line no-new-func
        const val = Function('"use strict"; return (' + safe + ')')();
        const r = fmtN(val);
        const entry = expr + ' = ' + r;
        history.unshift(entry);
        if (history.length > 30) history.pop();
        updateHistory();
        expr = '';
        result = r;
        newNum = true;
      } catch {
        result = 'Erro';
        newNum = true;
      }
      break;
    }
  }
  elExpr.textContent = expr;
  elMain.textContent = result;
}

function updateHistory() {
  elHistLast.textContent = history[0] || '';
  elHistList.innerHTML = history
    .slice(0, 20)
    .map(s => `<div class="hist-item">${s}</div>`)
    .join('');
  elHistList.querySelectorAll('.hist-item').forEach((el, i) => {
    el.addEventListener('click', () => {
      const val = history[i].split(' = ').pop();
      result = val;
      expr = val;
      newNum = true;
      elExpr.textContent = expr;
      elMain.textContent = result;
    });
  });
}

/* ── Keyboard support ── */
document.addEventListener('keydown', e => {
  const map = {
    '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    '.':'.','+':`+`,'-':'−','*':'×','/':'÷','(':' (',')':`)`,'Enter':'=','Backspace':'DEL','Escape':'AC'
  };
  const lbl = map[e.key];
  if (!lbl) return;
  const flat = ROWS.flat();
  const found = flat.find(b => b.l === lbl || (b.v && (b.v === e.key || b.l === lbl)));
  if (found) handleKey(found);
});

/* ── Init ── */
renderKeys();
