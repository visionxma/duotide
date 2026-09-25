// Artigos do blog: um JSON por artigo em .blog/artigos/<slug>.json (formato em INSTRUCOES.md).
// O .i18n/montar.js usa lista() para o índice /blog/ e chama gerar() para escrever
// /blog/<slug>/index.html, usando a página /blog/ em português como casca (cabeçalho, rodapé, pop-up).
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const SITE = 'https://duotide.com.br';
const PASTA = path.join(__dirname, 'artigos');
const AFF = 'https://trade.safirion.com/register?aff=836698&aff_model=revenue&afftrack=duotide';
// Capas provisórias (até chegarem as imagens próprias de cada artigo).
const IMGS = ['duotide-o-que-e', 'duotide-seguranca', 'duotide-abrir-conta', 'duotide-vale-a-pena', 'duotide-e-confiavel-01',
  'duotide-e-confiavel-02', 'duotide-e-confiavel-03', 'duotide-corretora-01', 'duotide-corretora-02', 'duotide-corretora-03',
  'duotide-corretora-04', 'duotide-app-01', 'duotide-app-02', 'duotide-app-03', 'duotide-app-04', 'duotide-seguro-01',
  'duotide-seguro-02', 'duotide-login-01', 'duotide-login-02'];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dataBR = d => d.split('-').reverse().join('/');

// Ordem: a da lista de pautas (.blog/pautas.txt); artigos sem pauta listada vão para o fim.
function lista() {
  if (!fs.existsSync(PASTA)) return [];
  const pautas = fs.existsSync(path.join(__dirname, 'pautas.txt'))
    ? fs.readFileSync(path.join(__dirname, 'pautas.txt'), 'utf8').split('\n').map(s => s.trim()).filter(Boolean) : [];
  const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const arts = [];
  for (const f of fs.readdirSync(PASTA).filter(f => f.endsWith('.json')).sort()) {
    const p = path.join(PASTA, f);
    let a;
    try { a = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { console.log(`blog: ${f} não é JSON válido, ignorado`); continue; }
    if (!a.slug || !a.titulo || !a.corpo) { console.log(`blog: ${f} incompleto, ignorado`); continue; }
    // a data de publicação é gravada uma vez, na primeira montagem, e não muda mais
    if (!a.data) { a.data = hoje; fs.writeFileSync(p, JSON.stringify(a, null, 2) + '\n'); }
    arts.push(a);
  }
  const pos = a => { const i = pautas.indexOf(a.pauta); return i < 0 ? 1e6 : i; };
  // notícias primeiro (dentro da mesma data), depois a ordem das pautas
  const noticia = a => a.tipo === 'noticia' ? 0 : 1;
  arts.sort((a, b) => b.data.localeCompare(a.data) || noticia(a) - noticia(b) || pos(a) - pos(b) || a.slug.localeCompare(b.slug));
  arts.forEach((a, i) => {
    a.href = `/blog/${a.slug}/`;
    a.img = a.capa || `/assets/img/${IMGS[i % IMGS.length]}.webp`;
    a.leitura = a.leitura || Math.max(3, Math.round(a.corpo.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));
  });
  return arts;
}

function gerar() {
  const arts = lista();
  const casca = fs.readFileSync(path.join(RAIZ, 'blog/index.html'), 'utf8');
  // apaga páginas de artigos que não existem mais (só pastas de artigo: blog/<slug>/index.html)
  const vivos = new Set(arts.map(a => a.slug));
  for (const d of fs.readdirSync(path.join(RAIZ, 'blog'))) {
    const f = path.join(RAIZ, 'blog', d, 'index.html');
    if (!vivos.has(d) && fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('<!--artigo-blog-->')) fs.rmSync(path.join(RAIZ, 'blog', d), { recursive: true });
  }
  for (const a of arts) {
    const url = `${SITE}/blog/${a.slug}/`;
    const iso = a.data + 'T09:00:00-03:00';
    const ld = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'BlogPosting', '@id': url + '#artigo', headline: a.titulo, description: a.descricao, url, inLanguage: 'pt-BR',
        datePublished: iso, dateModified: iso, image: SITE + a.img, articleSection: a.categoria,
        author: { '@type': 'Organization', name: 'Equipe Duotide', url: SITE + '/' }, publisher: { '@id': SITE + '/#organization' },
        mainEntityOfPage: url, isPartOf: { '@id': SITE + '/blog/#blog' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
        { '@type': 'ListItem', position: 3, name: a.titulo, item: url }] }] };
    const mesma = arts.filter(o => o.slug !== a.slug && o.categoria === a.categoria);
    const outros = [...mesma, ...arts.filter(o => o.slug !== a.slug && o.categoria !== a.categoria)].slice(0, 3);
    const main = `<nav class="breadcrumb" aria-label="Trilha de navegação">
    <div class="container">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><span aria-current="page">${esc(a.titulo)}</span></li>
      </ol>
    </div>
  </nav>
  <main id="conteudo"><!--artigo-blog-->
    <section class="section">
      <div class="container article bq-post">
        <span class="bq__tag">${esc(a.categoria || 'Blog')}</span>
        <h1>${esc(a.titulo)}</h1>
        <p class="bq-post__meta">Equipe Duotide · <time datetime="${a.data}">${dataBR(a.data)}</time> · ${a.leitura} min de leitura</p>
        <figure class="foto"><img src="${a.img}" alt="" width="1024" height="512" decoding="async" fetchpriority="high"></figure>
        ${a.corpo}
${a.fonte ? `        <p class="artigo__fonte">Com informações de <a href="${esc(a.fonte)}" target="_blank" rel="noopener nofollow">Traders Union</a>.</p>
` : ''}        <div class="bq-post__cta">
          <p><strong>Pratique antes de arriscar.</strong> Crie sua conta na Duotide e teste suas ideias na conta demo com R$ 10.000 virtuais.</p>
          <a class="btn btn--primary" href="${AFF}" target="_blank" rel="noopener sponsored nofollow">Criar conta grátis</a>
        </div>
        <aside class="bq-post__mais">
          <h2>Leia também</h2>
          <div class="bq__grade bq__grade--3">
${outros.map(o => `            <a class="bq__card" href="${o.href}"><img src="${o.img}" alt="" width="1024" height="512" loading="lazy" decoding="async"><span class="bq__titulo">${esc(o.titulo)}</span><span class="bq__meta">${dataBR(o.data)} · ${o.leitura} min de leitura</span></a>`).join('\n')}
          </div>
        </aside>
      </div>
    </section>
  </main>`;
    let h = casca;
    h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(a.titulo)} | Blog Duotide</title>`);
    h = h.replace(/(<meta name="description" content=")[^"]*"/, (m, x) => x + esc(a.descricao) + '"');
    h = h.replace(/(<link rel="canonical" href=")[^"]*"/, (m, x) => x + url + '"');
    h = h.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '');
    h = h.replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*"/g, (m, x) => x + esc(a.titulo) + '"');
    h = h.replace(/(<meta (?:property="og:description"|name="twitter:description") content=")[^"]*"/g, (m, x) => x + esc(a.descricao) + '"');
    h = h.replace(/(<meta property="og:url" content=")[^"]*"/, (m, x) => x + url + '"');
    h = h.replace(/(<meta property="og:type" content=")[^"]*"/, (m, x) => x + 'article"');
    h = h.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*"/g, (m, x) => x + SITE + a.img + '"');
    h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
    h = h.replace(/(?:<nav class="breadcrumb"[\s\S]*?<\/nav>\s*)?<main[\s\S]*?<\/main>/, () => main);
    const f = path.join(RAIZ, 'blog', a.slug, 'index.html');
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, h);
  }
  return arts;
}

module.exports = { lista, gerar };
if (require.main === module) console.log(gerar().length, 'artigos gerados');
