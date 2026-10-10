// Confere um artigo reescrito no formato novo (resposta rápida, gráfico real, seções).
//   node .blog/verificar-artigo.js <slug> [<slug>...]
const fs = require('fs'), path = require('path');
const SEM_ACENTO = /(?<!\p{L})(nao|voce|tambem|entao|ate|grafico|analise|preco|operacao|media|indice|negociacao|sao|estrategia|tendencia|sera|ja|ha|alem|possivel|periodo|informacao|calculo)(?!\p{L})/iu;
let falhas = 0;
for (const slug of process.argv.slice(2)) {
  const f = path.join(__dirname, 'artigos', slug + '.json'); const e = [];
  let a; try { a = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (x) { console.log(`ERRO ${slug}: JSON inválido (${x.message})`); falhas++; continue; }
  for (const k of ['slug', 'titulo', 'descricao', 'categoria', 'corpo', 'data', 'resposta', 'revisado']) if (!a[k]) e.push(`falta "${k}"`);
  if (a.slug !== slug) e.push('slug mudou');
  const txt = (a.corpo || '').replace(/<[^>]+>/g, ' ');
  if (SEM_ACENTO.test(txt + ' ' + a.titulo + ' ' + a.resposta)) e.push('texto sem acentos: "' + (txt + ' ' + a.titulo + ' ' + a.resposta).match(SEM_ACENTO)[0] + '"');
  const h2 = (a.corpo.match(/<h2>/g) || []).length; if (a.tipo !== 'noticia' && h2 < 3) e.push(`só ${h2} <h2>`);
  if (a.tipo !== 'noticia' && !/<h2>Erros comuns/i.test(a.corpo)) e.push('falta a seção "Erros comuns"');
  if (a.grafico) {
    if (!a.corpo.includes('<!--grafico-->')) e.push('tem "grafico" mas o corpo não tem <!--grafico-->');
    try { require('./graficos.js').fatos(a.grafico); } catch (x) { e.push('gráfico não calcula: ' + x.message); }
  } else if (a.corpo.includes('<!--grafico-->')) e.push('<!--grafico--> sem "grafico" no JSON');
  if (/<a\s/i.test(a.corpo)) e.push('não use links no corpo');
  if (/<(script|style|img|iframe)/i.test(a.corpo)) e.push('tag proibida no corpo');
  if ((a.corpo.match(/<p>/g) || []).length !== (a.corpo.match(/<\/p>/g) || []).length) e.push('<p> sem fechar');
  if (/"/.test(a.descricao) || a.descricao.length > 170) e.push('descrição com aspas ou maior que 170');
  const pal = txt.split(/\s+/).filter(Boolean).length; if (pal < 500) e.push(`texto curto (${pal} palavras)`);
  if (e.length) { falhas++; console.log(`ERRO ${slug}: ${e.join('; ')}`); } else console.log(`ok   ${slug} (${pal} palavras${a.grafico ? ', gráfico ' + a.grafico.indicador + ' ' + a.grafico.ativo : ''})`);
}
process.exit(falhas ? 1 : 0);
