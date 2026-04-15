/* ============================================================
   graph.js — renderização do gráfico f(x) e f'(x)
   ============================================================ */

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

function evalF(exprStr, x) {
  try {
    return math.evaluate(exprStr.replace(/\^/g, '**'), { x, pi: Math.PI, e: Math.E });
  } catch {
    return NaN;
  }
}

function numDeriv(f, x, h = 1e-5) {
  return (evalF(f, x + h) - evalF(f, x - h)) / (2 * h);
}

function drawGraph() {
  const fExpr = document.getElementById('gf').value.trim();
  const xMin = parseFloat(document.getElementById('gxmin').value) || -2 * Math.PI;
  const xMax = parseFloat(document.getElementById('gxmax').value) || 2 * Math.PI;
  const show = document.getElementById('gshow').value;

  const W = canvas.offsetWidth || 600;
  const H = 200;
  canvas.width = W;
  canvas.height = H;

  ctx.clearRect(0, 0, W, H);

  const steps = W * 2;
  const yVals = [], dyVals = [];

  for (let i = 0; i <= steps; i++) {
    const x = xMin + (xMax - xMin) * (i / steps);
    yVals.push(evalF(fExpr, x));
    if (show === 'df' || show === 'both') dyVals.push(numDeriv(fExpr, x));
  }

  const isFiniteV = v => isFinite(v) && !isNaN(v);
  const allY = [
    ...(show !== 'df' ? yVals : []),
    ...(show !== 'f' ? dyVals : []),
  ].filter(isFiniteV);

  if (!allY.length) return;

  let yMin = Math.min(...allY);
  let yMax = Math.max(...allY);
  if (yMin === yMax) { yMin -= 1; yMax += 1; }
  const pad = (yMax - yMin) * 0.1;
  yMin -= pad; yMax += pad;

  const cx = x => (x - xMin) / (xMax - xMin) * W;
  const cy = y => H - (y - yMin) / (yMax - yMin) * H;

  /* grid lines */
  ctx.strokeStyle = 'rgba(46,49,56,0.9)';
  ctx.lineWidth = 0.5;
  const gridX = niceStep(xMax - xMin, 6);
  const gridY = niceStep(yMax - yMin, 5);

  for (let gx = Math.ceil(xMin / gridX) * gridX; gx <= xMax; gx += gridX) {
    ctx.beginPath(); ctx.moveTo(cx(gx), 0); ctx.lineTo(cx(gx), H); ctx.stroke();
  }
  for (let gy = Math.ceil(yMin / gridY) * gridY; gy <= yMax; gy += gridY) {
    ctx.beginPath(); ctx.moveTo(0, cy(gy)); ctx.lineTo(W, cy(gy)); ctx.stroke();
  }

  /* axes */
  ctx.strokeStyle = 'rgba(90,96,112,0.8)';
  ctx.lineWidth = 1;
  if (xMin < 0 && xMax > 0) {
    ctx.beginPath(); ctx.moveTo(cx(0), 0); ctx.lineTo(cx(0), H); ctx.stroke();
  }
  if (yMin < 0 && yMax > 0) {
    ctx.beginPath(); ctx.moveTo(0, cy(0)); ctx.lineTo(W, cy(0)); ctx.stroke();
  }

  /* axis labels */
  ctx.font = '9px "IBM Plex Mono", monospace';
  ctx.fillStyle = 'rgba(90,96,112,0.9)';
  for (let gx = Math.ceil(xMin / gridX) * gridX; gx <= xMax; gx += gridX) {
    if (Math.abs(gx) < gridX * 0.01) continue;
    ctx.fillText(fmtAxis(gx), cx(gx) + 3, H - 4);
  }
  for (let gy = Math.ceil(yMin / gridY) * gridY; gy <= yMax; gy += gridY) {
    if (Math.abs(gy) < gridY * 0.01) continue;
    ctx.fillText(fmtAxis(gy), 4, cy(gy) - 3);
  }

  /* curves */
  function drawCurve(vals, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = vals[i];
      if (!isFiniteV(y)) { started = false; continue; }
      const canY = cy(y);
      if (!started) { ctx.moveTo(cx(x), canY); started = true; }
      else ctx.lineTo(cx(x), canY);
    }
    ctx.stroke();
  }

  if (show === 'f' || show === 'both') drawCurve(yVals, '#5b8cff');
  if (show === 'df' || show === 'both') drawCurve(dyVals, '#ff7b3a');

  /* legend */
  const legend = document.getElementById('graphLegend');
  if (show === 'both') {
    legend.innerHTML = `
      <span class="legend-item"><span class="legend-dot" style="background:#5b8cff"></span>f(x)</span>
      <span class="legend-item"><span class="legend-dot" style="background:#ff7b3a"></span>f'(x)</span>
    `;
  } else if (show === 'df') {
    legend.innerHTML = `<span class="legend-item"><span class="legend-dot" style="background:#ff7b3a"></span>f'(x)</span>`;
  } else {
    legend.innerHTML = `<span class="legend-item"><span class="legend-dot" style="background:#5b8cff"></span>f(x)</span>`;
  }
}

function niceStep(range, targetCount) {
  const raw = range / targetCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const residual = raw / magnitude;
  if (residual <= 1) return magnitude;
  if (residual <= 2) return 2 * magnitude;
  if (residual <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function fmtAxis(n) {
  if (Math.abs(n) >= 1000 || (Math.abs(n) < 0.01 && n !== 0)) return n.toExponential(1);
  return parseFloat(n.toPrecision(3)).toString();
}

/* listeners */
['gf', 'gxmin', 'gxmax', 'gshow'].forEach(id => {
  document.getElementById(id).addEventListener('input', drawGraph);
});

window.addEventListener('resize', drawGraph);
setTimeout(drawGraph, 120);
