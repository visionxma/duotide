// Artigos do blog: um JSON por artigo em .blog/artigos/<slug>.json (formato em INSTRUCOES.md).
// O .i18n/montar.js usa lista() para o índice /blog/ e chama gerar() para escrever
// /blog/<slug>/index.html, usando a página /blog/ em português como casca (cabeçalho, rodapé, pop-up).
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const SITE = 'https://duotide.com.br';
const PASTA = path.join(__dirname, 'artigos');
const AFF_BASE = 'https://trade.safirion.com/register?aff=836698&aff_model=revenue&afftrack=';
const affDe = pasta => AFF_BASE + (pasta ? 'duotide-' + pasta : 'duotide');
const IDIOMAS = JSON.parse(fs.readFileSync(path.join(RAIZ, '.i18n/idiomas.json'), 'utf8'));
const TRAD = path.join(__dirname, 'traducoes');
const chromeDe = pasta => JSON.parse(fs.readFileSync(path.join(RAIZ, '.i18n', pasta || 'fonte', '_chrome.json'), 'utf8'));
const base = pasta => pasta ? `/${pasta}/blog/` : '/blog/';
const fmtData = (d, codigo) => { try { return new Intl.DateTimeFormat(codigo, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d + 'T12:00:00Z')); } catch (e) { return d; } };
// Capas provisórias (até chegarem as imagens próprias de cada artigo).
const IMGS = ['duotide-o-que-e', 'duotide-seguranca', 'duotide-abrir-conta', 'duotide-vale-a-pena', 'duotide-e-confiavel-01',
  'duotide-e-confiavel-02', 'duotide-e-confiavel-03', 'duotide-corretora-01', 'duotide-corretora-02', 'duotide-corretora-03',
  'duotide-corretora-04', 'duotide-app-01', 'duotide-app-02', 'duotide-app-03', 'duotide-app-04', 'duotide-seguro-01',
  'duotide-seguro-02', 'duotide-login-01', 'duotide-login-02'];
// Capas por categoria (imagens próprias em /assets/img/capas e fotos do site); notícias têm capa própria.
const C = n => `/assets/img/capas/${n}.webp`, F = n => `/assets/img/duotide-${n}.webp`;
const CAPAS = {
  'Análise técnica': [C('blog-analise-tecnica-e-fundamentalista'), F('corretora-02'), F('vale-a-pena'), F('corretora-04')],
  'Indicadores': [F('corretora-02'), C('blog-analise-tecnica-e-fundamentalista'), F('corretora-04'), F('app-03'), F('vale-a-pena')],
  'Estratégias': [C('blog-day-trade-ou-swing-trade'), F('corretora-01'), F('app-01'), C('blog-slippage-e-execucao-de-ordem')],
  'Gestão de risco': [C('blog-gestao-de-risco-stop-e-posicao'), F('seguro-02'), F('e-confiavel-02'), F('seguranca')],
  'Psicologia': [C('blog-por-que-iniciante-perde-dinheiro'), F('vale-a-pena'), F('o-que-e'), F('e-confiavel-03')],
  'Forex': [C('blog-corretora-offshore-o-que-e'), F('corretora-03'), '/assets/img/terra.webp', F('corretora-01')],
  'Criptomoedas': [C('blog-cripto-corretora-ou-exchange'), C('noticia-mercado-cripto-sem-indice-de-referencia'), C('noticia-near-dispara-parceria-ondo-acoes-tokenizadas')],
  'Ações': [C('noticia-futuros-nasdaq-caem-juros-treasuries'), C('noticia-alphabet-recua-na-bolsa-gastos-com-ia'), F('corretora-03'), F('corretora-04')],
  'ETFs e índices': [C('noticia-divida-global-passa-365-trilhoes'), F('corretora-04'), C('noticia-titulos-globais-caem-apostas-fed')],
  'Commodities': [C('noticia-petroleo-sobe-impasse-eua-ira'), C('noticia-divida-global-passa-365-trilhoes')],
  'Opções': [C('blog-slippage-e-execucao-de-ordem'), F('corretora-02'), C('blog-day-trade-ou-swing-trade')],
  'Mercado': [C('noticia-titulos-globais-caem-apostas-fed'), C('noticia-futuros-nasdaq-caem-juros-treasuries'), F('corretora-01')],
  'Iniciantes': [C('blog-como-escolher-uma-corretora'), F('abrir-conta'), F('app-01'), F('app-04'), C('blog-kyc-por-que-pedem-documento'), C('blog-saque-nao-caiu-o-que-fazer'), F('login-01')]
};
const contagem = {};
function capa(a, i) {
  const propria = C('noticia-' + a.slug);
  if (a.tipo === 'noticia' && fs.existsSync(path.join(RAIZ, propria))) return propria;
  const lista = CAPAS[a.categoria];
  if (!lista) return `/assets/img/${IMGS[i % IMGS.length]}.webp`;
  const k = contagem[a.categoria] = (contagem[a.categoria] || 0) + 1;
  return lista[(k - 1) % lista.length];
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dataBR = d => d.split('-').reverse().join('/');

// Ordem: a da lista de pautas (.blog/pautas.txt); artigos sem pauta listada vão para o fim.
function listaPt() {
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
  for (const k in contagem) delete contagem[k];
  const pos = a => { const i = pautas.indexOf(a.pauta); return i < 0 ? 1e6 : i; };
  // notícias primeiro (dentro da mesma data), depois a ordem das pautas
  const noticia = a => a.tipo === 'noticia' ? 0 : 1;
  arts.sort((a, b) => b.data.localeCompare(a.data) || noticia(a) - noticia(b) || pos(a) - pos(b) || a.slug.localeCompare(b.slug));
  arts.forEach((a, i) => {
    a.href = `/blog/${a.slug}/`;
    a.img = a.capa || capa(a, i);
    a.leitura = a.leitura || Math.max(3, Math.round(a.corpo.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));
  });
  return arts;
}

// Artigos de um idioma. pt: todos. Outros: só os que têm tradução em .blog/traducoes/<pasta>/,
// com a mesma ordem, data e capa do original. Cada item traz .alts (href em cada idioma).
function lista(pasta = '') {
  const pt = listaPt();
  const traducoes = {};
  for (const i of IDIOMAS.filter(i => i.pasta)) {
    const d = path.join(TRAD, i.pasta);
    traducoes[i.pasta] = {};
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter(f => f.endsWith('.json'))) {
      try { const t = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); if (t.slug && t.titulo && t.corpo) traducoes[i.pasta][f.slice(0, -5)] = t; } catch (e) {}
    }
  }
  const out = [];
  for (const a of pt) {
    const alts = { '': `/blog/${a.slug}/` };
    for (const i of IDIOMAS.filter(i => i.pasta)) { const t = traducoes[i.pasta][a.slug]; if (t) alts[i.pasta] = `/${i.pasta}/blog/${t.slug}/`; }
    if (!pasta) { out.push({ ...a, slugPt: a.slug, alts }); continue; }
    const t = traducoes[pasta][a.slug];
    if (!t) continue;
    const cats = (chromeDe(pasta).blog || {}).cats || {};
    out.push({ ...a, slugPt: a.slug, slug: t.slug, titulo: t.titulo, descricao: t.descricao, corpo: t.corpo,
      categoriaPt: a.categoria, categoria: cats[a.categoria] || a.categoria, href: alts[pasta], alts });
  }
  return out;
}

function gerar(pasta = '') {
  const idioma = IDIOMAS.find(i => i.pasta === pasta);
  const C = chromeDe(pasta), B = C.blog || {};
  const arts = lista(pasta);
  const dirBlog = path.join(RAIZ, pasta, 'blog');
  const casca = fs.readFileSync(path.join(dirBlog, 'index.html'), 'utf8');
  const aria = (casca.match(/<nav class="breadcrumb" aria-label="([^"]*)"/) || [, 'Breadcrumb'])[1];
  const AFF = affDe(pasta);
  const leitura = n => (B.leitura || '{n} min').replace('{n}', n);
  // apaga páginas de artigos que não existem mais (só pastas de artigo: blog/<slug>/index.html)
  const vivos = new Set(arts.map(a => a.slug));
  for (const d of fs.readdirSync(dirBlog)) {
    const f = path.join(dirBlog, d, 'index.html');
    if (!vivos.has(d) && fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('<!--artigo-blog-->')) fs.rmSync(path.join(dirBlog, d), { recursive: true });
  }
  for (const a of arts) {
    const url = `${SITE}${a.href}`;
    const iso = a.data + 'T09:00:00-03:00';
    const home = pasta ? `/${pasta}/` : '/';
    const ld = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'BlogPosting', '@id': url + '#artigo', headline: a.titulo, description: a.descricao, url, inLanguage: idioma.codigo,
        datePublished: iso, dateModified: iso, image: SITE + a.img, articleSection: a.categoria,
        author: { '@type': 'Organization', name: B.equipe || 'Duotide', url: SITE + home }, publisher: { '@id': SITE + '/#organization' },
        mainEntityOfPage: url, isPartOf: { '@id': SITE + base(pasta) + '#blog' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: C.nav.home, item: SITE + home },
        { '@type': 'ListItem', position: 2, name: C.nav.blog, item: SITE + base(pasta) },
        { '@type': 'ListItem', position: 3, name: a.titulo, item: url }] }] };
    const mesma = arts.filter(o => o.slug !== a.slug && o.categoria === a.categoria);
    const outros = [...mesma, ...arts.filter(o => o.slug !== a.slug && o.categoria !== a.categoria)].slice(0, 3);
    const main = `<nav class="breadcrumb" aria-label="${esc(aria)}">
    <div class="container">
      <ol>
        <li><a href="${home}">${esc(C.nav.home)}</a></li>
        <li><a href="${base(pasta)}">${esc(C.nav.blog)}</a></li>
        <li><span aria-current="page">${esc(a.titulo)}</span></li>
      </ol>
    </div>
  </nav>
  <main id="conteudo"><!--artigo-blog-->
    <section class="section">
      <div class="container article bq-post">
        <span class="bq__tag">${esc(a.categoria || 'Blog')}</span>
        <h1>${esc(a.titulo)}</h1>
        <p class="bq-post__meta">${esc(B.equipe || 'Duotide')} · <time datetime="${a.data}">${fmtData(a.data, idioma.codigo)}</time> · ${leitura(a.leitura)}</p>
        <figure class="foto"><img src="${a.img}" alt="" width="1024" height="512" decoding="async" fetchpriority="high"></figure>
        ${a.corpo}
${a.fonte ? `        <p class="artigo__fonte">${esc(B.fonte || '')} <a href="${esc(a.fonte)}" target="_blank" rel="noopener nofollow">Traders Union</a>.</p>
` : ''}        <div class="bq-post__cta">
          <p><strong>${esc(B.cta_titulo)}</strong> ${esc(B.cta_texto)}</p>
          <a class="btn btn--primary" href="${AFF}" target="_blank" rel="noopener sponsored nofollow">${esc(B.cta_botao)}</a>
        </div>
        <aside class="bq-post__mais">
          <h2>${esc(B.leia)}</h2>
          <div class="bq__grade bq__grade--3">
${outros.map(o => `            <a class="bq__card" href="${o.href}"><img src="${o.img}" alt="" width="1024" height="512" loading="lazy" decoding="async"><span class="bq__titulo">${esc(o.titulo)}</span><span class="bq__meta">${fmtData(o.data, idioma.codigo)} · ${leitura(o.leitura)}</span></a>`).join('\n')}
          </div>
        </aside>
      </div>
    </section>
  </main>`;
    let h = casca;
    h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(a.titulo)} | Blog Duotide</title>`);
    h = h.replace(/(<meta name="description" content=")[^"]*"/, (m, x) => x + esc(a.descricao) + '"');
    h = h.replace(/(<link rel="canonical" href=")[^"]*"/, (m, x) => x + url + '"');
    // hreflang: versões deste artigo que existem
    const alts = IDIOMAS.filter(i => a.alts[i.pasta]).map(i => `  <link rel="alternate" hreflang="${i.codigo}" href="${SITE}${a.alts[i.pasta]}">`);
    const xd = a.alts.en || a.alts[''];
    alts.push(`  <link rel="alternate" hreflang="x-default" href="${SITE}${xd}">`);
    h = h.replace(/<!--hreflang-->[\s\S]*?<!--\/hreflang-->/, () => `<!--hreflang-->\n${alts.join('\n')}\n  <!--/hreflang-->`);
    // seletor de idioma: leva a este mesmo artigo no outro idioma (ou ao blog daquele idioma, se ainda não traduzido)
    h = h.replace(/<details class="idioma">[\s\S]*?<\/details>/, sel => sel.replace(/<a href="[^"]*" hreflang="([^"]+)"/g, (m, cod) => {
      const i = IDIOMAS.find(x => x.codigo === cod);
      return i ? `<a href="${a.alts[i.pasta] || base(i.pasta)}" hreflang="${cod}"` : m;
    }));
    h = h.replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*"/g, (m, x) => x + esc(a.titulo) + '"');
    h = h.replace(/(<meta (?:property="og:description"|name="twitter:description") content=")[^"]*"/g, (m, x) => x + esc(a.descricao) + '"');
    h = h.replace(/(<meta property="og:url" content=")[^"]*"/, (m, x) => x + url + '"');
    h = h.replace(/(<meta property="og:type" content=")[^"]*"/, (m, x) => x + 'article"');
    h = h.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*"/g, (m, x) => x + SITE + a.img + '"');
    h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
    h = h.replace(/(?:<nav class="breadcrumb"[\s\S]*?<\/nav>\s*)?<main[\s\S]*?<\/main>/, () => main);
    const f = path.join(dirBlog, a.slug, 'index.html');
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, h);
  }
  return arts;
}

module.exports = { lista, gerar, IDIOMAS };
if (require.main === module) console.log(gerar(process.argv[2] || '').length, 'artigos gerados');
