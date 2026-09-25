// Separa de cada página em português o que precisa ser traduzido e grava em
// .i18n/fonte/<chave>.html. Rode de novo sempre que uma página em pt mudar.
//   node .i18n/extrair.js
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
// Páginas que ficam só em português: notícias (robô diário, fontes brasileiras) e 404.
const FORA = new Set(['noticias', '404.html',
  // pastas geradas pelo montar.js (uma por idioma)
  ...JSON.parse(fs.readFileSync(path.join(__dirname, 'idiomas.json'), 'utf8')).map(i => i.pasta).filter(Boolean)]);

// Endereços removidos que viraram redirecionamento (gerados pelo montar.js) não são páginas.
const REDIR = new Set(fs.existsSync(path.join(__dirname, 'redirecionados.json'))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'redirecionados.json'), 'utf8')) : []);
function paginas() {
  const out = [];
  (function andar(dir) {
    for (const nome of fs.readdirSync(dir)) {
      if (nome.startsWith('.') || nome === 'assets' || nome === 'node_modules') continue;
      const p = path.join(dir, nome);
      const rel = path.relative(RAIZ, p);
      if (FORA.has(rel)) continue;
      if (fs.statSync(p).isDirectory()) { andar(p); continue; }
      // artigos do blog (.blog/artigos.js) ficam só em português e não passam pela tradução
      if (nome === 'index.html' && !REDIR.has('/' + path.relative(RAIZ, dir) + '/') && !fs.readFileSync(p, 'utf8').includes('<!--artigo-blog-->')) out.push(path.relative(RAIZ, dir));
    }
  })(RAIZ);
  return out.sort();
}
const chave = rota => rota === '' ? 'inicio' : rota.replace(/\//g, '__');

function extrair(rota) {
  const html = fs.readFileSync(path.join(RAIZ, rota, 'index.html'), 'utf8');
  const titulo = html.match(/<title>([\s\S]*?)<\/title>/)[1].trim();
  const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
  const trilha = (html.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/) || [''])[0];
  // o que o montar.js gera (botões das lojas, topo do app) não é texto para traduzir
  const main = html.match(/<main[\s\S]*?<\/main>/)[0].replace(/\s*<!--gerado-->[\s\S]*?<!--\/gerado-->/g, '')
    .replace(/<div[^>]*\sdata-g(?:\s[^>]*)?>\s*/g, '').replace(/\s*<\/div><!--\/g-->/g, ''); // invólucros de layout da home
  const slug = rota.split('/').pop();
  return `<!--slug-->${slug}<!--/slug-->
<!--title-->${titulo}<!--/title-->
<!--description-->${desc}<!--/description-->
<!--corpo-->
${trilha ? '  ' + trilha + '\n  ' : '  '}${main}
<!--/corpo-->
`;
}

if (require.main === module) {
  const rotas = paginas();
  fs.mkdirSync(path.join(__dirname, 'fonte'), { recursive: true });
  for (const r of rotas) fs.writeFileSync(path.join(__dirname, 'fonte', chave(r) + '.html'), extrair(r));
  fs.writeFileSync(path.join(__dirname, 'fonte', '_rotas.json'), JSON.stringify(Object.fromEntries(rotas.map(r => [chave(r), r])), null, 2) + '\n');
  console.log(rotas.length, 'páginas extraídas');
}
module.exports = { paginas, chave };
