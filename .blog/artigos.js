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
// Textos da página de artigo (layout no molde do blog da IQ Option), por idioma.
const TXT = JSON.parse(fs.readFileSync(path.join(__dirname, 'textos-artigo.json'), 'utf8'));
const VISITAS = 'https://duotide-visitas.visionxma.workers.dev';
const fmtCurta = (d, codigo) => { try { return new Intl.DateTimeFormat(codigo, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d + 'T12:00:00Z')); } catch (e) { return d; } };
const fmtLonga = (d, codigo) => { try { return new Intl.DateTimeFormat(codigo, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d + 'T12:00:00Z')); } catch (e) { return d; } };
// "atualizado em": a data mais recente entre publicação, JSON em pt e tradução (dia no calendário de São Paulo)
const diaSP = ms => new Date(ms).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
function atualizado(a, pasta) {
  const datas = [a.data];
  if (a.atualizado) datas.push(a.atualizado);
  for (const p of [path.join(PASTA, a.slugPt + '.json'), pasta ? path.join(TRAD, pasta, a.slugPt + '.json') : null]) {
    if (p && fs.existsSync(p)) datas.push(diaSP(fs.statSync(p).mtimeMs));
  }
  return datas.sort().pop();
}
// dá id aos <h2> do corpo e devolve o sumário
const ancora = t => t.replace(/<[^>]+>/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 's';
function sumario(corpo) {
  const itens = [], usados = new Set();
  const html = corpo.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (m, at = '', t) => {
    let id = ancora(t), k = id, n = 2; while (usados.has(k)) k = id + '-' + n++; usados.add(k);
    itens.push({ id: k, t: t.replace(/<[^>]+>/g, '').trim() });
    return `<h2 id="${k}"${at.replace(/\sid="[^"]*"/, '')}>${t}</h2>`;
  });
  return { html, itens };
}
const slugSobre = pasta => { try { return (fs.readFileSync(path.join(RAIZ, '.i18n', pasta, 'sobre.html'), 'utf8').match(/<!--slug-->([^<]*)/) || [, 'sobre'])[1].trim(); } catch (e) { return 'sobre'; } };
const OLHO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
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
        datePublished: iso, dateModified: atualizado(a, pasta) + 'T09:00:00-03:00', image: SITE + a.img, articleSection: a.categoria,
        author: { '@type': 'Organization', name: B.equipe || 'Duotide', url: SITE + home }, publisher: { '@id': SITE + '/#organization' },
        mainEntityOfPage: url, isPartOf: { '@id': SITE + base(pasta) + '#blog' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: C.nav.home, item: SITE + home },
        { '@type': 'ListItem', position: 2, name: C.nav.blog, item: SITE + base(pasta) },
        { '@type': 'ListItem', position: 3, name: a.titulo, item: url }] }] };
    const mesma = arts.filter(o => o.slug !== a.slug && o.categoria === a.categoria);
    const outros = [...mesma, ...arts.filter(o => o.slug !== a.slug && o.categoria !== a.categoria)].slice(0, 3);
    const T = TXT[pasta] || TXT[''];
    const sm = sumario(a.corpo);
    const atual = atualizado(a, pasta);
    const autor = esc(B.equipe || 'Duotide');
    const avatar = '<img class="ap__avatar" src="/assets/img/marca-duotide.png" alt="" width="56" height="56" loading="lazy" decoding="async">';
    const vis = cls => `<span class="ap__vis${cls}" data-visitas hidden>${OLHO}<b></b><span class="sr-only"> ${esc(T.visitas)}</span></span>`;
    const main = `<nav class="breadcrumb" aria-label="${esc(aria)}">
    <div class="container ap__trilha">
      <ol>
        <li><a href="${home}">${esc(C.nav.home)}</a></li>
        <li><a href="${base(pasta)}">${esc(C.nav.blog)}</a></li>
        <li><span aria-current="page">${esc(a.titulo)}</span></li>
      </ol>
      <a class="ap__voltar" href="${base(pasta)}">${esc(T.voltar)}</a>
    </div>
  </nav>
  <main id="conteudo"><!--artigo-blog-->
    <div class="ap__progresso" aria-hidden="true"><span></span></div>
    <article class="ap" data-slug="${a.slugPt}" data-api="${VISITAS}" data-copiado="${esc(T.copiado)}">
      <div class="container">
        <header class="ap__cab" id="topo">
          <div class="ap__info">
            <div class="ap__linha">
              <span><time datetime="${a.data}">${fmtCurta(a.data, idioma.codigo)}</time><span class="ap__sep">${leitura(a.leitura)}</span></span>
              ${vis('')}
            </div>
            <p class="ap__atual">${esc(T.atualizado)}: <time datetime="${atual}">${fmtLonga(atual, idioma.codigo)}</time></p>
            <span class="bq__tag">${esc(a.categoria || 'Blog')}</span>
            <h1>${esc(a.titulo)}</h1>
            <div class="ap__autor">${avatar}<span><strong>${autor}</strong><small>${esc(T.funcao)}</small></span></div>
          </div>
          <figure class="ap__capa"><img src="${a.img}" alt="" width="1024" height="512" decoding="async" fetchpriority="high"></figure>
        </header>
        <div class="ap__grade">
          <aside class="ap__lado">
            <nav class="ap__indice" aria-label="${esc(T.conteudo)}">
${sm.itens.length ? `              <p class="ap__indice-tit">${esc(T.conteudo)}</p>
              <div class="ap__trilho"><span class="ap__barra"></span><ol>
${sm.itens.map(i => `                <li><a href="#${i.id}">${esc(i.t)}</a></li>`).join('\n')}
              </ol></div>
` : '              <div class="ap__trilho ap__trilho--so"><span class="ap__barra"></span></div>\n'}              <a class="ap__topo" href="#topo"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 17V7m-4.5 4.5L12 7l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>${esc(T.topo)}</a>
            </nav>
          </aside>
          <div class="ap__texto article">
            ${sm.html}
${a.fonte ? `            <p class="artigo__fonte">${esc(B.fonte || '')} <a href="${esc(a.fonte)}" target="_blank" rel="noopener nofollow">Traders Union</a>.</p>
` : ''}            <div class="bq-post__cta">
              <p><strong>${esc(B.cta_titulo)}</strong> ${esc(B.cta_texto)}</p>
              <a class="btn btn--primary" href="${AFF}" target="_blank" rel="noopener sponsored nofollow">${esc(B.cta_botao)}</a>
            </div>
            <div class="ap__fim">
              <p>${esc(T.atualizado)}: <time datetime="${atual}">${fmtCurta(atual, idioma.codigo)}</time></p>
              <div class="ap__acoes">${vis(' ap__vis--pilula')}<button class="ap__compartilhar" type="button">${esc(T.compartilhar)} <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button></div>
            </div>
            <div class="ap__autorbox">
              <img class="ap__avatar ap__avatar--g" src="/assets/img/marca-duotide.png" alt="" width="96" height="96" loading="lazy" decoding="async">
              <div><strong>${autor}</strong><p>${esc(T.bio)}</p></div>
              <a class="btn ap__equipe" href="${home}${slugSobre(pasta)}/">${esc(T.equipe_btn)}</a>
            </div>
          </div>
        </div>
        <aside class="ap__rel">
          <h2>${esc(T.relacionados)}</h2>
          <div class="bq__grade bq__grade--3">
${outros.map(o => `            <a class="bq__card" href="${o.href}"><img src="${o.img}" alt="" width="1024" height="512" loading="lazy" decoding="async"><span class="bq__titulo">${esc(o.titulo)}</span><span class="bq__meta">${fmtData(o.data, idioma.codigo)} · ${leitura(o.leitura)}</span></a>`).join('\n')}
          </div>
        </aside>
      </div>
    </article>
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
