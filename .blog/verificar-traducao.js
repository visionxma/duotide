// Confere .blog/traducoes/<pasta>/*.json contra .blog/artigos/*.json
//   node .blog/verificar-traducao.js <pasta> [lista.txt]
const fs = require('fs'), path = require('path');
const pasta = process.argv[2], lista = process.argv[3];
const FON = path.join(__dirname, 'artigos'), DST = path.join(__dirname, 'traducoes', pasta);
const tags = h => (h.match(/<\/?[a-z0-9]+(?:\s[^>]*)?>|<!--grafico-->/g) || []).join('');
// palavras que só existem em português: se aparecem na tradução, um trecho ficou sem traduzir
const PT = /(?<!\p{L})(não|você|então|operação|operações|limitações|também|isso|exemplo prático|erros comuns|ações)(?!\p{L})/iu;
let slugs = new Map(), erros = 0, ok = 0, falta = 0, velhas = 0;
const alvo = lista ? fs.readFileSync(lista, 'utf8').split('\n').filter(Boolean) : fs.readdirSync(FON).map(f => f.replace(/\.json$/, ''));
for (const s of alvo) {
  const f = path.join(DST, s + '.json');
  if (!fs.existsSync(f)) { falta++; continue; }
  const e = m => { console.log(`ERRO ${s}: ${m}`); erros++; };
  let t; try { t = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (x) { e('JSON inválido'); continue; }
  const o = JSON.parse(fs.readFileSync(path.join(FON, s + '.json'), 'utf8'));
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug || '') || t.slug.length > 60) e(`slug inválido "${t.slug}"`);
  else if (slugs.has(t.slug)) e(`slug repetido (também em ${slugs.get(t.slug)})`); else slugs.set(t.slug, s);
  if (!t.titulo || !t.descricao || !t.corpo) e('campo vazio');
  else {
    if ([...t.titulo].length > 80) e('titulo longo');
    if (/"/.test(t.descricao)) e('descricao com aspas duplas');
    if (tags(t.corpo) !== tags(o.corpo)) e('tags do corpo diferentes da fonte');
    if (t.titulo === o.titulo) e('titulo não traduzido');
    if (o.resposta && !t.resposta) e('falta resposta');
    if (o.resposta && t.resposta === o.resposta) e('resposta não traduzida');
    const resto = (t.titulo + ' ' + (t.resposta || '') + ' ' + t.corpo).replace(/<[^>]+>/g, ' ').match(PT);
    if (resto) e(`trecho em português esquecido: "${resto[0]}"`);
    if (o.revisado && t.revisado !== o.revisado) { console.log(`DESATUALIZADA ${s}: a fonte foi revisada em ${o.revisado}; traduza de novo (mantenha o slug "${t.slug}")`); velhas++; }
  }
  ok++;
}
console.log(`${pasta}: ${ok} feitos, ${falta} faltando, ${velhas} desatualizada(s), ${erros} erro(s)`);
process.exit(erros || velhas ? 1 : 0);
