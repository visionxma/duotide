// Gráficos próprios dos artigos, com cotações reais.
//   Dados: Binance (cripto, ex. BTCUSDT) e Yahoo Finance (ações, índices e câmbio, ex. ^GSPC, AAPL, EURUSD=X),
//   guardados em .blog/dados/<ativo>.json para a montagem não depender da internet.
//   node .blog/graficos.js baixar <ativo> [binance|yahoo]   atualiza o arquivo de dados
//   node .blog/graficos.js fatos <slug>                      números reais do gráfico do artigo (para escrever o texto)
// O artigo pede o gráfico no JSON: "grafico": {"ativo": "BTCUSDT", "fonte": "binance", "indicador": "rsi",
//   "inicio": "2026-01-01", "fim": "2026-06-30", "params": {"periodo": 14}}
// indicador: rsi | macd | bollinger | sma | ema | cruzamento | estocastico | atr | adx | cci | williams | obv | preco
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const RAIZ = path.join(__dirname, '..');
const DADOS = path.join(__dirname, 'dados');
const SAIDA = path.join(RAIZ, 'assets', 'graficos');

const NOMES = { BTCUSDT: 'BTC/USDT', ETHUSDT: 'ETH/USDT', SOLUSDT: 'SOL/USDT', XRPUSDT: 'XRP/USDT', '^GSPC': 'S&P 500', '^IXIC': 'Nasdaq',
  '^DJI': 'Dow Jones', '^BVSP': 'Ibovespa', 'EURUSD=X': 'EUR/USD', 'GBPUSD=X': 'GBP/USD', 'USDJPY=X': 'USD/JPY', 'USDBRL=X': 'USD/BRL',
  'GC=F': 'Ouro', 'CL=F': 'Petróleo WTI', AAPL: 'Apple', NVDA: 'Nvidia', TSLA: 'Tesla', MSFT: 'Microsoft', AMZN: 'Amazon' };
const FONTES = { binance: 'Binance', yahoo: 'Yahoo Finance' };
const nomeAtivo = a => NOMES[a] || a;
const arq = a => path.join(DADOS, a.replace(/[^A-Za-z0-9]/g, '_') + '.json');

// ---------------------------------------------------------------- dados
function baixar(ativo, fonte, forcar) {
  // os textos citam números destes arquivos: baixar de novo mudaria os números e as datas por baixo do texto
  if (fs.existsSync(arq(ativo)) && !forcar) throw new Error(`${ativo} já está em .blog/dados e não deve ser baixado de novo (os artigos citam esses números). Use o arquivo que existe.`);
  fonte = fonte || (/USDT$/.test(ativo) ? 'binance' : 'yahoo');
  let barras = [];
  if (fonte === 'binance') {
    let fim = Date.now();
    for (let i = 0; i < 3; i++) { // até ~3 anos de diários
      const url = `https://data-api.binance.vision/api/v3/klines?symbol=${ativo}&interval=1d&limit=1000&endTime=${fim}`;
      const k = JSON.parse(execFileSync('curl', ['-s', '-m', '30', url]).toString());
      if (!Array.isArray(k) || !k.length) break;
      barras = k.map(x => ({ t: new Date(x[0]).toISOString().slice(0, 10), o: +x[1], h: +x[2], l: +x[3], c: +x[4], v: +x[5] })).concat(barras);
      fim = k[0][0] - 1;
    }
  } else {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ativo)}?range=5y&interval=1d`;
    const j = JSON.parse(execFileSync('curl', ['-sL', '-m', '30', '-A', 'Mozilla/5.0', url]).toString());
    const r = j.chart.result[0], q = r.indicators.quote[0];
    // data no fuso do próprio mercado (câmbio vem à meia-noite de Londres; sem isso o pregão cai no dia anterior)
    const fuso = r.meta.gmtoffset || 0;
    barras = r.timestamp.map((t, i) => ({ t: new Date((t + fuso) * 1000).toISOString().slice(0, 10), o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i], v: q.volume[i] || 0 }))
      .filter(b => [b.o, b.h, b.l, b.c].every(x => typeof x === 'number'));
  }
  // o pregão de hoje ainda está aberto: fica de fora
  const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const vistos = new Set(); barras = barras.filter(b => b.t < hoje && !vistos.has(b.t) && vistos.add(b.t));
  if (!barras.length) throw new Error('sem dados para ' + ativo);
  fs.mkdirSync(DADOS, { recursive: true });
  fs.writeFileSync(arq(ativo), JSON.stringify({ ativo, fonte, baixado: new Date().toISOString().slice(0, 10), barras }));
  return barras.length;
}
function carregar(ativo, fonte) {
  if (!fs.existsSync(arq(ativo))) baixar(ativo, fonte);
  return JSON.parse(fs.readFileSync(arq(ativo), 'utf8'));
}

// ---------------------------------------------------------------- indicadores (todos devolvem arrays do tamanho da série, com null no aquecimento)
const sma = (x, n) => x.map((_, i) => i < n - 1 ? null : x.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n);
function ema(x, n) { const k = 2 / (n + 1); const o = []; let e = null; x.forEach((v, i) => { if (v == null) { o.push(null); return; } e = e == null ? v : v * k + e * (1 - k); o.push(i < n - 1 ? null : e); }); return o; }
function rsi(c, n = 14) { // médias de Wilder
  const o = Array(c.length).fill(null); let g = 0, p = 0;
  for (let i = 1; i < c.length; i++) {
    const d = c[i] - c[i - 1], up = Math.max(d, 0), dn = Math.max(-d, 0);
    if (i <= n) { g += up; p += dn; if (i === n) { g /= n; p /= n; o[i] = p === 0 ? 100 : 100 - 100 / (1 + g / p); } continue; }
    g = (g * (n - 1) + up) / n; p = (p * (n - 1) + dn) / n; o[i] = p === 0 ? 100 : 100 - 100 / (1 + g / p);
  }
  return o;
}
function macd(c, r = 12, l = 26, s = 9) { const a = ema(c, r), b = ema(c, l); const m = a.map((v, i) => v == null || b[i] == null ? null : v - b[i]);
  const first = m.findIndex(v => v != null); const sig = Array(c.length).fill(null); const se = ema(m.slice(first), s); se.forEach((v, i) => sig[first + i] = v);
  return { macd: m, sinal: sig, hist: m.map((v, i) => v == null || sig[i] == null ? null : v - sig[i]) }; }
function desvio(x, n) { const m = sma(x, n); return x.map((_, i) => m[i] == null ? null : Math.sqrt(x.slice(i - n + 1, i + 1).reduce((a, v) => a + (v - m[i]) ** 2, 0) / n)); }
function bollinger(c, n = 20, k = 2) { const m = sma(c, n), d = desvio(c, n); return { media: m, sup: m.map((v, i) => v == null ? null : v + k * d[i]), inf: m.map((v, i) => v == null ? null : v - k * d[i]) }; }
const tr = b => b.map((x, i) => i === 0 ? x.h - x.l : Math.max(x.h - x.l, Math.abs(x.h - b[i - 1].c), Math.abs(x.l - b[i - 1].c)));
function wilder(x, n) { const o = Array(x.length).fill(null); let s = null; x.forEach((v, i) => { if (i < n - 1) return; s = s == null ? x.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n : (s * (n - 1) + v) / n; o[i] = s; }); return o; }
const atr = (b, n = 14) => wilder(tr(b), n);
function estocastico(b, n = 14, d = 3) { const k = b.map((_, i) => { if (i < n - 1) return null; const j = b.slice(i - n + 1, i + 1); const hi = Math.max(...j.map(x => x.h)), lo = Math.min(...j.map(x => x.l)); return hi === lo ? 50 : 100 * (b[i].c - lo) / (hi - lo); });
  const kk = k.map(v => v); const dd = Array(b.length).fill(null); k.forEach((v, i) => { if (i >= n - 1 + d - 1) dd[i] = k.slice(i - d + 1, i + 1).reduce((a, x) => a + x, 0) / d; }); return { k: kk, d: dd }; }
function adx(b, n = 14) { const pdm = b.map((x, i) => i ? (x.h - b[i - 1].h > b[i - 1].l - x.l && x.h - b[i - 1].h > 0 ? x.h - b[i - 1].h : 0) : 0);
  const ndm = b.map((x, i) => i ? (b[i - 1].l - x.l > x.h - b[i - 1].h && b[i - 1].l - x.l > 0 ? b[i - 1].l - x.l : 0) : 0);
  const a = wilder(tr(b), n), p = wilder(pdm, n), m = wilder(ndm, n);
  const pdi = p.map((v, i) => v == null ? null : 100 * v / a[i]), mdi = m.map((v, i) => v == null ? null : 100 * v / a[i]);
  const dx = pdi.map((v, i) => v == null ? null : (v + mdi[i] === 0 ? 0 : 100 * Math.abs(v - mdi[i]) / (v + mdi[i])));
  const first = dx.findIndex(v => v != null); const ad = Array(b.length).fill(null); wilder(dx.slice(first), n).forEach((v, i) => ad[first + i] = v);
  return { adx: ad, pdi, mdi }; }
function cci(b, n = 20) { const tp = b.map(x => (x.h + x.l + x.c) / 3), m = sma(tp, n); return tp.map((v, i) => { if (m[i] == null) return null; const md = tp.slice(i - n + 1, i + 1).reduce((a, x) => a + Math.abs(x - m[i]), 0) / n; return md === 0 ? 0 : (v - m[i]) / (0.015 * md); }); }
function williams(b, n = 14) { return b.map((_, i) => { if (i < n - 1) return null; const j = b.slice(i - n + 1, i + 1); const hi = Math.max(...j.map(x => x.h)), lo = Math.min(...j.map(x => x.l)); return hi === lo ? -50 : -100 * (hi - b[i].c) / (hi - lo); }); }
function obv(b) { let s = 0; return b.map((x, i) => (s += i === 0 ? 0 : x.c > b[i - 1].c ? x.v : x.c < b[i - 1].c ? -x.v : 0)); }

// ---------------------------------------------------------------- cálculo do gráfico de um artigo
function calcular(g) {
  const d = carregar(g.ativo, g.fonte);
  const P = g.params || {};
  const todas = d.barras;
  // calcula na série inteira (aquecimento correto) e recorta a janela pedida
  const c = todas.map(b => b.c);
  const ser = {}; const linhas = []; let painel = null;
  const ind = g.indicador;
  if (ind === 'rsi') { ser.rsi = rsi(c, P.periodo || 14); painel = { nome: `RSI (${P.periodo || 14})`, linhas: [['rsi', '#7c3aed']], min: 0, max: 100, guias: [P.sup || 70, P.inf || 30] }; }
  if (ind === 'macd') { const m = macd(c, P.rapida || 12, P.lenta || 26, P.sinal || 9); Object.assign(ser, m); painel = { nome: `MACD (${P.rapida || 12}, ${P.lenta || 26}, ${P.sinal || 9})`, linhas: [['macd', '#2563eb'], ['sinal', '#ea580c']], hist: 'hist', guias: [0] }; }
  if (ind === 'bollinger') { const bb = bollinger(c, P.periodo || 20, P.desvios || 2); Object.assign(ser, bb); linhas.push(['sup', '#7c3aed', 1], ['media', '#64748b', 1], ['inf', '#7c3aed', 1]); }
  if (ind === 'sma' || ind === 'ema') { (P.periodos || [20]).forEach((n, i) => { ser['m' + n] = (ind === 'sma' ? sma : ema)(c, n); linhas.push(['m' + n, ['#2563eb', '#ea580c', '#7c3aed'][i % 3], 1.6]); }); }
  if (ind === 'cruzamento') { const [a, b2] = P.periodos || [50, 200]; ser['m' + a] = (P.tipo === 'ema' ? ema : sma)(c, a); ser['m' + b2] = (P.tipo === 'ema' ? ema : sma)(c, b2); linhas.push(['m' + a, '#2563eb', 1.6], ['m' + b2, '#ea580c', 1.6]); }
  if (ind === 'estocastico') { const s = estocastico(todas, P.periodo || 14, P.suave || 3); Object.assign(ser, s); painel = { nome: `Estocástico (${P.periodo || 14}, ${P.suave || 3})`, linhas: [['k', '#2563eb'], ['d', '#ea580c']], min: 0, max: 100, guias: [80, 20] }; }
  if (ind === 'atr') { ser.atr = atr(todas, P.periodo || 14); painel = { nome: `ATR (${P.periodo || 14})`, linhas: [['atr', '#0891b2']] }; }
  if (ind === 'adx') { Object.assign(ser, adx(todas, P.periodo || 14)); painel = { nome: `ADX (${P.periodo || 14})`, linhas: [['adx', '#0f172a'], ['pdi', '#16a34a'], ['mdi', '#dc2626']], guias: [25] }; }
  if (ind === 'cci') { ser.cci = cci(todas, P.periodo || 20); painel = { nome: `CCI (${P.periodo || 20})`, linhas: [['cci', '#7c3aed']], guias: [100, -100] }; }
  if (ind === 'williams') { ser.wr = williams(todas, P.periodo || 14); painel = { nome: `Williams %R (${P.periodo || 14})`, linhas: [['wr', '#7c3aed']], min: -100, max: 0, guias: [-20, -80] }; }
  if (ind === 'obv') { ser.obv = obv(todas); painel = { nome: 'OBV', linhas: [['obv', '#0891b2']] }; }
  const ini = g.inicio || todas[Math.max(0, todas.length - 180)].t, fim = g.fim || todas[todas.length - 1].t;
  const idx = todas.map((b, i) => i).filter(i => todas[i].t >= ini && todas[i].t <= fim);
  const corta = arr => idx.map(i => arr[i]);
  const s2 = {}; for (const k in ser) s2[k] = corta(ser[k]);
  return { d, barras: idx.map(i => todas[i]), ser: s2, linhas, painel, ini: todas[idx[0]].t, fim: todas[idx[idx.length - 1]].t };
}

// números reais que o texto do artigo pode citar
function fatos(g) {
  const x = calcular(g); const b = x.barras; const r = n => Math.round(n * 100) / 100;
  const f = { ativo: nomeAtivo(g.ativo), fonte: FONTES[x.d.fonte], periodo: `${x.ini} a ${x.fim}`, barras: b.length,
    preco_inicio: r(b[0].c), preco_fim: r(b[b.length - 1].c), variacao_pct: r(100 * (b[b.length - 1].c / b[0].c - 1)),
    maxima: { data: b.reduce((m, v) => v.h > m.h ? v : m).t, valor: r(Math.max(...b.map(v => v.h))) }, minima: { data: b.reduce((m, v) => v.l < m.l ? v : m).t, valor: r(Math.min(...b.map(v => v.l))) } };
  for (const k in x.ser) {
    const s = x.ser[k]; const ok = s.map((v, i) => [v, i]).filter(([v]) => v != null);
    if (!ok.length) continue;
    const mx = ok.reduce((m, v) => v[0] > m[0] ? v : m), mn = ok.reduce((m, v) => v[0] < m[0] ? v : m);
    f[k] = { ultimo: r(ok[ok.length - 1][0]), maior: { data: b[mx[1]].t, valor: r(mx[0]), preco: r(b[mx[1]].c) }, menor: { data: b[mn[1]].t, valor: r(mn[0]), preco: r(b[mn[1]].c) } };
  }
  if (x.painel && x.painel.guias && x.painel.guias.length === 2) { // entradas nas zonas extremas e o que o preço fez nos 10 pregões seguintes
    const k = x.painel.linhas[0][0], s = x.ser[k], [sup, inf] = x.painel.guias.slice().sort((a, b) => b - a);
    const ev = [];
    for (let i = 1; i < s.length; i++) {
      if (s[i] == null || s[i - 1] == null) continue;
      const tipo = s[i - 1] <= sup && s[i] > sup ? 'acima de ' + sup : s[i - 1] >= inf && s[i] < inf ? 'abaixo de ' + inf : null;
      if (tipo) { const j = Math.min(i + 10, b.length - 1); ev.push({ data: b[i].t, evento: `${k} cruzou ${tipo}`, valor: r(s[i]), preco: r(b[i].c), preco_10_pregoes_depois: r(b[j].c), variacao_10_pregoes_pct: r(100 * (b[j].c / b[i].c - 1)) }); }
    }
    f.eventos = ev;
  }
  if (g.indicador === 'cruzamento' || g.indicador === 'macd') {
    const [ka, kb] = g.indicador === 'macd' ? ['macd', 'sinal'] : Object.keys(x.ser); const a = x.ser[ka], c2 = x.ser[kb]; const ev = [];
    for (let i = 1; i < a.length; i++) { if ([a[i], a[i - 1], c2[i], c2[i - 1]].some(v => v == null)) continue;
      const t = a[i - 1] <= c2[i - 1] && a[i] > c2[i] ? 'cruzamento de alta' : a[i - 1] >= c2[i - 1] && a[i] < c2[i] ? 'cruzamento de baixa' : null;
      if (t) { const j = Math.min(i + 10, b.length - 1); ev.push({ data: b[i].t, evento: `${ka} x ${kb}: ${t}`, preco: r(b[i].c), preco_10_pregoes_depois: r(b[j].c), variacao_10_pregoes_pct: r(100 * (b[j].c / b[i].c - 1)) }); } }
    f.cruzamentos = ev;
  }
  return f;
}

// ---------------------------------------------------------------- desenho (SVG, tema claro do blog, textos neutros de idioma)
function svg(g, cor) {
  const x = calcular(g); const b = x.barras; const n = b.length;
  const W = 960, M = { l: 12, r: 70, t: 44 }, Hp = x.painel ? 300 : 400, Hi = x.painel ? 130 : 0, gap = x.painel ? 26 : 0, H = M.t + Hp + gap + Hi + 40;
  const cw = (W - M.l - M.r) / n, X = i => M.l + cw * (i + 0.5);
  const vals = b.flatMap(v => [v.h, v.l]).concat(...x.linhas.map(([k]) => x.ser[k].filter(v => v != null)));
  let lo = Math.min(...vals), hi = Math.max(...vals); const pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
  const Y = v => M.t + Hp - (v - lo) / (hi - lo) * Hp;
  const fmt = v => Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : Math.abs(v) >= 10 ? v.toFixed(2) : v.toFixed(4);
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Inter,system-ui,sans-serif" font-size="12" role="img">`);
  out.push(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);
  out.push(`<text x="${M.l}" y="22" font-size="15" font-weight="700" fill="#0f172a">${esc(nomeAtivo(g.ativo))} · 1D</text>`);
  out.push(`<text x="${W - M.r}" y="22" font-size="11" fill="#64748b" text-anchor="end">${FONTES[x.d.fonte]} · ${x.ini} → ${x.fim}</text>`);
  // grade e eixo do preço
  for (let k = 0; k <= 5; k++) { const v = lo + (hi - lo) * k / 5, y = Y(v); out.push(`<line x1="${M.l}" x2="${W - M.r}" y1="${y}" y2="${y}" stroke="#eef1f4"/><text x="${W - M.r + 8}" y="${y + 4}" fill="#64748b">${fmt(v)}</text>`); }
  // datas
  const passos = Math.max(1, Math.round(n / 6));
  for (let i = 0; i < n; i += passos) out.push(`<text x="${X(i)}" y="${H - 12}" fill="#64748b" text-anchor="${i === 0 ? 'start' : 'middle'}">${b[i].t.slice(5).split('-').reverse().join('/')}/${b[i].t.slice(2, 4)}</text>`);
  // velas (ou linha, se forem muitas)
  if (n <= 220) for (let i = 0; i < n; i++) { const v = b[i], up = v.c >= v.o, col = up ? '#16a34a' : '#dc2626';
    out.push(`<line x1="${X(i)}" x2="${X(i)}" y1="${Y(v.h)}" y2="${Y(v.l)}" stroke="${col}"/><rect x="${X(i) - Math.max(1, cw * 0.35)}" y="${Math.min(Y(v.o), Y(v.c))}" width="${Math.max(2, cw * 0.7)}" height="${Math.max(1, Math.abs(Y(v.o) - Y(v.c)))}" fill="${col}"/>`); }
  else out.push(`<polyline fill="none" stroke="#0f172a" stroke-width="1.4" points="${b.map((v, i) => X(i) + ',' + Y(v.c)).join(' ')}"/>`);
  for (const [k, col, w] of x.linhas) out.push(`<polyline fill="none" stroke="${col}" stroke-width="${w || 1.4}" points="${x.ser[k].map((v, i) => v == null ? null : X(i) + ',' + Y(v)).filter(Boolean).join(' ')}"/>`);
  // legenda das linhas sobre o preço
  let lx = M.l; x.linhas.forEach(([k, col]) => { const t = k.replace(/^m(\d+)/, (g.indicador === 'ema' || (g.params || {}).tipo === 'ema' ? 'MME ' : 'MMS ') + '$1').replace('sup', 'Banda sup.').replace('inf', 'Banda inf.').replace('media', 'Média'); out.push(`<rect x="${lx}" y="32" width="10" height="3" fill="${col}"/><text x="${lx + 14}" y="37" font-size="11" fill="#334155">${t}</text>`); lx += 26 + t.length * 6.5; });
  // painel do indicador
  if (x.painel) {
    const P = x.painel, y0 = M.t + Hp + gap;
    const vv = P.linhas.flatMap(([k]) => x.ser[k].filter(v => v != null)).concat(P.hist ? x.ser[P.hist].filter(v => v != null) : []);
    let a = P.min != null ? P.min : Math.min(...vv), z = P.max != null ? P.max : Math.max(...vv); if (P.min == null) { const p2 = (z - a) * 0.08; a -= p2; z += p2; }
    const YI = v => y0 + Hi - (v - a) / (z - a) * Hi;
    out.push(`<rect x="${M.l}" y="${y0}" width="${W - M.l - M.r}" height="${Hi}" fill="#fafbfc" stroke="#eef1f4"/>`);
    out.push(`<text x="${M.l + 6}" y="${y0 + 15}" font-size="11" font-weight="600" fill="#334155">${esc(P.nome)}</text>`);
    (P.guias || []).forEach(gv => { if (gv < a || gv > z) return; out.push(`<line x1="${M.l}" x2="${W - M.r}" y1="${YI(gv)}" y2="${YI(gv)}" stroke="#94a3b8" stroke-dasharray="4 4"/><text x="${W - M.r + 8}" y="${YI(gv) + 4}" fill="#64748b">${gv}</text>`); });
    if (P.min != null && P.guias && P.guias.length === 2) { const [s, i2] = P.guias.slice().sort((p, q) => q - p); out.push(`<rect x="${M.l}" y="${YI(P.max)}" width="${W - M.l - M.r}" height="${YI(s) - YI(P.max)}" fill="#dc2626" opacity=".05"/><rect x="${M.l}" y="${YI(i2)}" width="${W - M.l - M.r}" height="${YI(P.min) - YI(i2)}" fill="#16a34a" opacity=".05"/>`); }
    if (P.hist) x.ser[P.hist].forEach((v, i) => { if (v == null) return; out.push(`<rect x="${X(i) - Math.max(1, cw * 0.35)}" y="${Math.min(YI(v), YI(0))}" width="${Math.max(1.5, cw * 0.7)}" height="${Math.max(0.5, Math.abs(YI(v) - YI(0)))}" fill="${v >= 0 ? '#16a34a' : '#dc2626'}" opacity=".55"/>`); });
    for (const [k, col] of P.linhas) out.push(`<polyline fill="none" stroke="${col}" stroke-width="1.5" points="${x.ser[k].map((v, i) => v == null ? null : X(i) + ',' + YI(v)).filter(Boolean).join(' ')}"/>`);
    // marca as entradas nas zonas extremas
    if (P.min != null && P.guias && P.guias.length === 2) { const k = P.linhas[0][0], s = x.ser[k], [sup, inf] = P.guias.slice().sort((p, q) => q - p);
      for (let i = 1; i < s.length; i++) { if (s[i] == null || s[i - 1] == null) continue;
        if (s[i - 1] <= sup && s[i] > sup) out.push(`<circle cx="${X(i)}" cy="${YI(s[i])}" r="3.5" fill="#dc2626"/><line x1="${X(i)}" x2="${X(i)}" y1="${M.t}" y2="${M.t + Hp}" stroke="#dc2626" stroke-opacity=".18"/>`);
        if (s[i - 1] >= inf && s[i] < inf) out.push(`<circle cx="${X(i)}" cy="${YI(s[i])}" r="3.5" fill="#16a34a"/><line x1="${X(i)}" x2="${X(i)}" y1="${M.t}" y2="${M.t + Hp}" stroke="#16a34a" stroke-opacity=".18"/>`); } }
  }
  out.push(`<text x="${W - M.r}" y="${H - 12}" font-size="10" fill="#94a3b8" text-anchor="end">${esc(g.marca || '')}</text>`);
  out.push('</svg>');
  return out.join('\n');
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// desenha o gráfico do artigo e devolve o caminho público e a legenda
function desenhar(slug, g, marca) {
  fs.mkdirSync(SAIDA, { recursive: true });
  const f = path.join(SAIDA, slug + '.svg');
  fs.writeFileSync(f, svg({ ...g, marca }));
  const x = calcular(g);
  return { src: `/assets/graficos/${slug}.svg`, ativo: nomeAtivo(g.ativo), fonte: FONTES[x.d.fonte], ini: x.ini, fim: x.fim };
}

module.exports = { baixar, carregar, calcular, fatos, desenhar, nomeAtivo, rsi, sma, ema, macd };
if (require.main === module) {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'baixar') console.log(a, baixar(a, b, process.argv.includes('--forcar')), 'pregões');
  else if (cmd === 'fatos') { const art = JSON.parse(fs.readFileSync(path.join(__dirname, 'artigos', a + '.json'), 'utf8')); console.log(JSON.stringify(fatos(art.grafico), null, 1)); }
  else console.log('uso: node .blog/graficos.js baixar <ativo> [fonte] | fatos <slug>');
}
