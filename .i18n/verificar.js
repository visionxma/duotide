// Confere as traduções de um idioma contra a fonte em português.
//   node .i18n/verificar.js <pasta>        ex.: node .i18n/verificar.js en
// ERRO = precisa corrigir. AVISO = conferir; pode estar certo (nome próprio, por ex.).
const fs = require('fs');
const path = require('path');
const FONTE = path.join(__dirname, 'fonte');
const pasta = process.argv[2];
if (!pasta) { console.log('uso: node .i18n/verificar.js <pasta>'); process.exit(2); }
const DEST = path.join(__dirname, pasta);
const erros = [], avisos = [];
const erro = (arq, msg) => erros.push(`${arq}: ${msg}`);
const aviso = (arq, msg) => avisos.push(`${arq}: ${msg}`);

// Atributos cujo valor é texto para o leitor e, portanto, deve ser traduzido.
const TRADUZIVEIS = ['alt', 'aria-label', 'title', 'placeholder'];
function tags(html) {
  return (html.match(/<\/?[a-zA-Z][^>]*>/g) || []).map(t =>
    t.replace(new RegExp(`\\s(${TRADUZIVEIS.join('|')})="[^"]*"`, 'g'), ` $1=""`).replace(/\s+/g, ' '));
}
function textos(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, '').split(/<[^>]+>/).map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
}
function partes(html) {
  const p = {};
  for (const k of ['slug', 'title', 'description', 'corpo']) {
    const m = html.match(new RegExp(`<!--${k}-->([\\s\\S]*?)<!--/${k}-->`));
    p[k] = m ? m[1] : null;
  }
  return p;
}
// Palavras que só aparecem em português (checadas como palavra inteira, sem diferenciar caixa).
const PT = ['você', 'vocês', 'não', 'corretora', 'corretoras', 'saque', 'saques', 'também', 'então', 'são', 'até', 'depósito', 'conta', 'também', 'informação', 'operação', 'antes de', 'para quem', 'pelo', 'pela', 'nunca'];
const NAO_CHECAR_PT = new Set(['pt-BR']);
const ASCII_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const rotas = JSON.parse(fs.readFileSync(path.join(FONTE, '_rotas.json'), 'utf8'));
const slugs = new Map();
for (const chave of Object.keys(rotas)) {
  const arq = `${chave}.html`;
  const pf = path.join(DEST, arq);
  if (!fs.existsSync(pf)) { erro(arq, 'arquivo não existe'); continue; }
  const orig = partes(fs.readFileSync(path.join(FONTE, arq), 'utf8'));
  const trad = partes(fs.readFileSync(pf, 'utf8'));
  for (const k of Object.keys(orig)) if (trad[k] === null) erro(arq, `marcador <!--${k}--> ausente`);
  if (Object.values(trad).includes(null)) continue;

  // slug
  const s = trad.slug.trim();
  if (chave === 'inicio' && s !== '') erro(arq, 'slug da home deve ficar vazio');
  else if (chave === 'blog' && s !== 'blog') erro(arq, 'slug do blog deve ser "blog"');
  else if (chave !== 'inicio' && !ASCII_SLUG.test(s)) erro(arq, `slug "${s}" inválido: só a-z, 0-9 e hífen`);
  else if (chave !== 'inicio') {
    const grupo = chave.startsWith('blog__') ? 'blog/' : '';
    if (slugs.has(grupo + s)) erro(arq, `slug "${s}" repetido (também em ${slugs.get(grupo + s)})`);
    slugs.set(grupo + s, arq);
  }
  // título e descrição
  const t = trad.title.trim(), d = trad.description.trim();
  if (!t) erro(arq, 'title vazio');
  if (!d) erro(arq, 'description vazia');
  if (!/duotide/i.test(t) && chave !== 'privacidade' && chave !== 'termos' && chave !== 'contato') aviso(arq, 'title sem "Duotide"');
  if ([...t].length > 70) aviso(arq, `title com ${[...t].length} caracteres (ideal ≤ 65)`);
  if ([...d].length > 170) aviso(arq, `description com ${[...d].length} caracteres (ideal ≤ 160)`);
  if (/["<>]/.test(d) || /[<>]/.test(t)) erro(arq, 'title/description não podem ter aspas duplas nem < >');
  if (t === orig.title.trim() && pasta !== 'pt-BR') erro(arq, 'title igual ao português (não traduzido)');

  // estrutura do corpo: mesmas tags, mesmos atributos, na mesma ordem
  const a = tags(orig.corpo), b = tags(trad.corpo);
  if (a.length !== b.length) erro(arq, `corpo com ${b.length} tags; a fonte tem ${a.length}`);
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) { erro(arq, `tag #${i + 1} diferente:\n      fonte: ${a[i]}\n      aqui : ${b[i]}`); break; }
  }
  // atributos traduzíveis não podem ficar vazios se na fonte não eram
  const attrs = h => (h.match(new RegExp(`\\s(?:${TRADUZIVEIS.join('|')})="([^"]*)"`, 'g')) || []);
  const ao = attrs(orig.corpo), at = attrs(trad.corpo);
  ao.forEach((x, i) => { if (!/=""$/.test(x) && at[i] && /=""$/.test(at[i])) erro(arq, `atributo traduzível ficou vazio: ${at[i]}`); });

  // texto não traduzido
  const to = new Set(textos(orig.corpo).filter(x => x.length > 30));
  for (const x of textos(trad.corpo)) if (to.has(x)) erro(arq, `trecho ainda em português: "${x.slice(0, 80)}"`);
  if (!NAO_CHECAR_PT.has(pasta)) {
    const corpoTxt = ' ' + textos(trad.corpo).join(' ').toLowerCase() + ' ' + t.toLowerCase() + ' ' + d.toLowerCase() + ' ';
    const achadas = [...new Set(PT.filter(w => new RegExp(`(^|[\\s.,;:!?()«»"'—–-])${w}([\\s.,;:!?()«»"'—–-]|$)`, 'i').test(corpoTxt)))];
    if (achadas.length) aviso(arq, `palavras que parecem português: ${achadas.join(', ')}`);
  }
  // links de afiliado intocados
  const aff = h => (h.match(/https:\/\/trade\.safirion\.com\/[^"]*/g) || []).join('|');
  if (aff(orig.corpo) !== aff(trad.corpo)) erro(arq, 'links de cadastro alterados');
}

// textos fixos
const pc = path.join(DEST, '_chrome.json');
if (!fs.existsSync(pc)) erro('_chrome.json', 'arquivo não existe');
else {
  let c;
  try { c = JSON.parse(fs.readFileSync(pc, 'utf8')); } catch (e) { erro('_chrome.json', 'JSON inválido: ' + e.message); }
  if (c) {
    const o = JSON.parse(fs.readFileSync(path.join(FONTE, '_chrome.json'), 'utf8'));
    (function comparar(x, y, p) {
      for (const k of Object.keys(x)) {
        if (k === '_nota') continue;
        if (!(k in y)) { erro('_chrome.json', `chave ausente: ${p}${k}`); continue; }
        if (typeof x[k] === 'object') { comparar(x[k], y[k], `${p}${k}.`); continue; }
        if (typeof y[k] !== 'string' || !y[k].trim()) { erro('_chrome.json', `valor vazio: ${p}${k}`); continue; }
        for (const ph of ['{ano}', '{n}']) if (x[k].includes(ph) && !y[k].includes(ph)) erro('_chrome.json', `${p}${k} perdeu ${ph}`);
        if (pasta !== 'pt-BR' && y[k] === x[k] && x[k].length > 12 && !/Duotide/.test(x[k])) erro('_chrome.json', `${p}${k} não traduzido`);
      }
    })(o, c, '');
  }
}

for (const a of avisos) console.log('AVISO ' + a);
for (const e of erros) console.log('ERRO  ' + e);
console.log(`\n${pasta}: ${erros.length} erro(s), ${avisos.length} aviso(s)`);
process.exit(erros.length ? 1 : 0);
