/* ============================================================
   calculus.js — limite, derivada, integral, série de Taylor
   ============================================================ */

/* ── Helpers ── */
function evalF(exprStr, x) {
  try {
    return math.evaluate(exprStr.replace(/\^/g, '**'), { x, pi: Math.PI, e: Math.E });
  } catch {
    return NaN;
  }
}

function fmtResult(n) {
  if (isNaN(n)) return 'indefinido / erro na expressão';
  if (!isFinite(n)) return n > 0 ? '+∞' : '-∞';
  return parseFloat(n.toPrecision(12)).toString();
}

function numDeriv(f, x, order, h = 1e-5) {
  if (order === 0) return evalF(f, x);
  if (order === 1) return (evalF(f, x + h) - evalF(f, x - h)) / (2 * h);
  return (numDeriv(f, x + h, order - 1, h) - numDeriv(f, x - h, order - 1, h)) / (2 * h);
}

function simpson(f, a, b, n = 2000) {
  if (n % 2 !== 0) n++;
  const h = (b - a) / n;
  let s = evalF(f, a) + evalF(f, b);
  for (let i = 1; i < n; i++) s += (i % 2 === 0 ? 2 : 4) * evalF(f, a + i * h);
  return s * h / 3;
}

function factInt(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/* ── Tab switching ── */
document.querySelectorAll('.calc-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

/* ── Limite ── */
document.getElementById('btnLim').addEventListener('click', () => {
  const f = document.getElementById('lf').value.trim();
  const a = parseFloat(document.getElementById('la').value);
  const h = 1e-7;
  const L = evalF(f, a + h);
  const R = evalF(f, a - h);
  const el = document.getElementById('lr');
  if (!isFinite(L) && !isFinite(R)) {
    el.textContent = 'limite = ' + fmtResult(L);
  } else if (Math.abs(L - R) < 1e-5) {
    el.textContent = 'lim = ' + fmtResult((L + R) / 2);
  } else {
    el.textContent = 'não existe  (lim⁺ = ' + fmtResult(L) + ',  lim⁻ = ' + fmtResult(R) + ')';
  }
});

/* ── Derivada ── */
document.getElementById('btnDeriv').addEventListener('click', () => {
  const f = document.getElementById('df').value.trim();
  const x = parseFloat(document.getElementById('dx').value);
  const n = Math.max(1, Math.min(4, parseInt(document.getElementById('dn').value) || 1));
  const val = numDeriv(f, x, n);
  const suf = ['', "'", "''", "'''", "⁽⁴⁾"][n] || '';
  document.getElementById('dr').textContent = 'f' + suf + '(' + x + ') = ' + fmtResult(val);
});

/* ── Integral ── */
document.getElementById('btnInteg').addEventListener('click', () => {
  const f = document.getElementById('if').value.trim();
  const a = parseFloat(document.getElementById('ia').value);
  const b = parseFloat(document.getElementById('ib').value);
  if (isNaN(a) || isNaN(b)) {
    document.getElementById('ir').textContent = 'erro: verifique os limites';
    return;
  }
  const val = simpson(f, a, b);
  document.getElementById('ir').textContent = '∫[' + a + ', ' + b + '] = ' + fmtResult(val);
});

/* ── Taylor ── */
document.getElementById('btnTaylor').addEventListener('click', () => {
  const f = document.getElementById('tf').value.trim();
  const x0 = parseFloat(document.getElementById('tx0').value);
  const n = Math.max(1, Math.min(10, parseInt(document.getElementById('tn').value) || 4));
  const terms = [];

  for (let k = 0; k <= n; k++) {
    const coef = numDeriv(f, x0, k) / factInt(k);
    if (Math.abs(coef) < 1e-9) continue;
    const c = parseFloat(coef.toPrecision(5));
    const abs = Math.abs(c);
    const sign = c >= 0 ? (terms.length ? '+ ' : '') : '- ';
    if (k === 0) {
      terms.push(c.toString());
    } else if (k === 1) {
      terms.push(sign + abs + '·(x − ' + x0 + ')');
    } else {
      terms.push(sign + abs + '·(x − ' + x0 + ')^' + k);
    }
  }

  document.getElementById('tr').textContent = terms.length
    ? 'f(x) ≈\n' + terms.join('\n')
    : '0';
});
