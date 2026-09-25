// Remove um elemento inteiro (<li>, <p>, <details>…) da página em português E da mesma
// posição em todas as traduções — sem retraduzir nada. Funciona porque o verificador
// garante que cada tradução tem exatamente a mesma sequência de tags da fonte.
//   node .i18n/cortar.js cortes.json
// cortes.json: [{"chave": "duotide-atendimento", "tag": "details", "contem": "O suporte pode pedir"}]
// Com "trocar": {"fonte": "<p>…</p>", "en": "<p>…</p>", …} o elemento fica e só o conteúdo
// dele é substituído, pelo texto de cada idioma ("fonte" vale para a fonte e a página em pt).
// Com "depois": "<div …></div>" o trecho é inserido logo após o elemento, igual em todos os idiomas.
// "contem" tem de achar exatamente UM elemento daquela tag na fonte, senão nada é alterado.
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const ROTAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'fonte/_rotas.json'), 'utf8'));
const PASTAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'idiomas.json'), 'utf8')).map(i => i.pasta).filter(Boolean);
const texto = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Lista as tags de um trecho com suas posições.
function tags(h) {
  const out = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let m;
  while ((m = re.exec(h))) out.push({ nome: m[1].toLowerCase(), fecha: m[0][1] === '/', ini: m.index, fim: re.lastIndex });
  return out;
}
// A partir da tag de abertura de índice i, acha a de fechamento correspondente.
function par(ts, i) {
  let prof = 0;
  for (let k = i; k < ts.length; k++) {
    if (ts[k].nome !== ts[i].nome) continue;
    prof += ts[k].fecha ? -1 : 1;
    if (prof === 0) return k;
  }
  throw new Error('tag sem fechamento');
}
// Remove o elemento que começa na tag i, junto com a quebra de linha e o recuo antes dele.
function remover(h, ts, i) {
  const j = par(ts, i);
  let ini = ts[i].ini;
  while (ini > 0 && /[ \t]/.test(h[ini - 1])) ini--;
  if (ini > 0 && h[ini - 1] === '\n') ini--;
  return h.slice(0, ini) + h.slice(ts[j].fim);
}
// Corpo da página (o trecho que o verificador compara): da trilha de navegação ao fim do <main>.
function corpoDe(h) {
  const a = h.search(/<nav class="breadcrumb"|<main/);
  const b = h.indexOf('</main>') + '</main>'.length;
  return [a, b];
}

const cortes = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
// 1) localiza tudo antes de mexer em qualquer arquivo
const plano = cortes.map(c => {
  const fonte = fs.readFileSync(path.join(__dirname, 'fonte', c.chave + '.html'), 'utf8');
  const corpo = fonte.match(/<!--corpo-->([\s\S]*?)<!--\/corpo-->/)[1];
  const ts = tags(corpo);
  const achados = ts.map((t, i) => [t, i]).filter(([t, i]) => !t.fecha && t.nome === c.tag &&
    (texto(corpo.slice(t.ini, ts[par(ts, i)].fim)).includes(c.contem) || corpo.slice(t.ini, ts[par(ts, i)].fim).includes(c.contem))).map(([, i]) => i);
  // fica só o mais interno (um <li> dentro de outro <li> casaria duas vezes)
  const internos = achados.filter(i => !achados.some(k => k > i && k < par(ts, i)));
  if (internos.length !== 1) throw new Error(`${c.chave}: "${c.contem}" achou ${internos.length} <${c.tag}>`);
  return { ...c, indice: internos[0] };
});
// 2) aplica, do maior índice para o menor em cada página, para os índices não se deslocarem
const porPagina = {};
for (const p of plano) (porPagina[p.chave] = porPagina[p.chave] || []).push(p);
let n = 0;
for (const [chave, lista] of Object.entries(porPagina)) {
  lista.sort((a, b) => b.indice - a.indice);
  const alvos = [path.join(__dirname, 'fonte', chave + '.html'),
    ...PASTAS.map(p => path.join(__dirname, p, chave + '.html')).filter(f => fs.existsSync(f)),
    path.join(RAIZ, ROTAS[chave], 'index.html')];
  for (const f of alvos) {
    let h = fs.readFileSync(f, 'utf8');
    const ehPagina = !f.includes('/.i18n/');
    let a, b;
    if (ehPagina) [a, b] = corpoDe(h);
    else { a = h.indexOf('<!--corpo-->') + '<!--corpo-->'.length; b = h.indexOf('<!--/corpo-->'); }
    let corpo = h.slice(a, b);
    const pasta = f.includes('/.i18n/') && !f.includes('/.i18n/fonte/') ? path.basename(path.dirname(f)) : 'fonte';
    for (const p of lista) {
      const ts = tags(corpo);
      const t = ts[p.indice];
      if (!t || t.nome !== p.tag || t.fecha) throw new Error(`${f}: posição ${p.indice} não é <${p.tag}>`);
      if (p.depois) {
        const j = par(ts, p.indice);
        const recuo = (corpo.slice(0, t.ini).match(/[ \t]*$/) || [''])[0];
        corpo = corpo.slice(0, ts[j].fim) + '\n' + recuo + p.depois + corpo.slice(ts[j].fim);
      } else if (p.trocar) {
        if (!p.trocar[pasta]) throw new Error(`${p.chave}: falta o texto em ${pasta}`);
        const j = par(ts, p.indice);
        corpo = corpo.slice(0, t.fim) + p.trocar[pasta] + corpo.slice(ts[j].ini);
      } else corpo = remover(corpo, ts, p.indice);
    }
    fs.writeFileSync(f, h.slice(0, a) + corpo + h.slice(b));
    n++;
  }
  console.log(`${chave}: ${lista.length} corte(s) em ${alvos.length} arquivos`);
}
console.log(`${n} arquivos alterados`);
