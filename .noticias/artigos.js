// Gera /noticias/<slug>/ para cada artigo de .noticias/artigos.json e a lista
// "Análises e notícias" no molde da página /noticias/ (.noticias/modelo.html).
//   node .noticias/artigos.js
// A casca (cabeçalho, rodapé, pop-up) vem de noticias/index.html, então rode o
// .i18n/montar.js antes, se tiver mudado cabeçalho ou rodapé.
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const SITE = 'https://duotide.com.br';
const artigos = JSON.parse(fs.readFileSync(path.join(__dirname, 'artigos.json'), 'utf8'))
  .sort((a, b) => b.data.localeCompare(a.data));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dataBR = d => d.split('-').reverse().join('/');
const casca = fs.readFileSync(path.join(RAIZ, 'noticias/index.html'), 'utf8');

for (const a of artigos) {
  const url = `${SITE}/noticias/${a.slug}/`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'NewsArticle', '@id': url + '#artigo', headline: a.titulo, description: a.descricao, url,
        datePublished: a.data + 'T09:00:00-03:00', dateModified: a.data + 'T09:00:00-03:00', inLanguage: 'pt-BR',
        image: SITE + '/assets/img/og.png', author: { '@id': SITE + '/#organization' }, publisher: { '@id': SITE + '/#organization' },
        mainEntityOfPage: url },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Mercado hoje', item: SITE + '/noticias/' },
        { '@type': 'ListItem', position: 3, name: a.titulo, item: url }] }
    ]
  };
  const outros = artigos.filter(o => o.slug !== a.slug).slice(0, 4);
  const main = `<nav class="breadcrumb" aria-label="Trilha de navegação">
    <div class="container">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/noticias/">Mercado hoje</a></li>
        <li><span aria-current="page">${esc(a.titulo)}</span></li>
      </ol>
    </div>
  </nav>
  <main id="conteudo">
    <section class="section">
      <div class="container article">
        <p class="artigo__data"><time datetime="${a.data}">${dataBR(a.data)}</time></p>
        <h1>${esc(a.titulo)}</h1>
        <p class="artigo__linha-fina">${esc(a.descricao)}</p>
${a.corpo.map(p => `        <p>${esc(p)}</p>`).join('\n')}
        <p class="artigo__fonte">Com informações de <a href="${a.fonte}" target="_blank" rel="noopener nofollow">Traders Union</a>.</p>
        <aside class="related">
          <h2>Mais notícias</h2>
          <ul>
${outros.map(o => `            <li><a href="/noticias/${o.slug}/">${esc(o.titulo)}</a></li>`).join('\n')}
          </ul>
        </aside>
      </div>
    </section>
  </main>`;
  let h = casca;
  h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(a.titulo)} | Duotide</title>`);
  h = h.replace(/(<meta name="description" content=")[^"]*"/, (m, x) => x + esc(a.descricao) + '"');
  h = h.replace(/(<link rel="canonical" href=")[^"]*"/, (m, x) => x + url + '"');
  h = h.replace(/(<meta property="og:(?:title)" content=")[^"]*"/, (m, x) => x + esc(a.titulo) + '"');
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*"/, (m, x) => x + esc(a.titulo) + '"');
  h = h.replace(/(<meta property="og:description" content=")[^"]*"/, (m, x) => x + esc(a.descricao) + '"');
  h = h.replace(/(<meta name="twitter:description" content=")[^"]*"/, (m, x) => x + esc(a.descricao) + '"');
  h = h.replace(/(<meta property="og:url" content=")[^"]*"/, (m, x) => x + url + '"');
  h = h.replace(/(<meta property="og:type" content=")[^"]*"/, (m, x) => x + 'article"');
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
  h = h.replace(/(?:<nav class="breadcrumb"[\s\S]*?<\/nav>\s*)?<main[\s\S]*?<\/main>/, () => main);
  h = h.replace(/(<nav class="site-nav"[\s\S]*?<a href="\/noticias\/")(>)/, '$1 aria-current="page"$2');
  const f = path.join(RAIZ, 'noticias', a.slug, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, h);
}

// Lista no molde (e na página atual, para não esperar o robô diário)
const lista = `<!--artigos-->
    <section class="section section--lilac">
      <div class="container">
        <div class="section__head"><h2>Análises e notícias</h2></div>
        <div class="cards cards--noticias">
${artigos.map(a => `          <a class="card card--noticia" href="/noticias/${a.slug}/"><time datetime="${a.data}">${dataBR(a.data)}</time><h3>${esc(a.titulo)}</h3><p>${esc(a.descricao)}</p></a>`).join('\n')}
        </div>
      </div>
    </section>
    <!--/artigos-->`;
for (const f of [path.join(__dirname, 'modelo.html'), path.join(RAIZ, 'noticias/index.html')]) {
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(/\s*<!--artigos-->[\s\S]*?<!--\/artigos-->/, '');
  h = h.replace(/(\s*<\/main>)/, '\n    ' + lista + '$1');
  fs.writeFileSync(f, h);
}
console.log(artigos.length, 'artigos gerados');
