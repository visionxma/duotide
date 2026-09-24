// Monta o site multilíngue a partir das páginas em português + traduções em .i18n/<pasta>/.
//   node .i18n/montar.js
// O que faz:
//   1. Gera /<pasta>/…/index.html para cada idioma cuja tradução passa no verificador.
//   2. Nas páginas em português: hreflang, seletor de idioma e pop-up (idempotente).
//   3. Refaz sitemap_index.xml, page-/post-sitemap.xml, sitemap-<pasta>.xml, sitemap.xml e llms.txt.
// Idioma com tradução incompleta é pulado inteiro (não entra em hreflang nem em sitemap).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const SITE = 'https://duotide.com.br';
const HOJE = new Date().toISOString().slice(0, 10) + 'T12:00:00-03:00';
const AFF_BASE = 'https://trade.safirion.com/register?aff=836698&aff_model=revenue&afftrack=';
const IDIOMAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'idiomas.json'), 'utf8'));
const PT = IDIOMAS[0];
const ROTAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'fonte/_rotas.json'), 'utf8')); // chave -> rota pt
const CHAVES = Object.keys(ROTAS);
const CHROME_PT = JSON.parse(fs.readFileSync(path.join(__dirname, 'fonte/_chrome.json'), 'utf8'));

// Itens do menu: chave do texto em _chrome.nav -> chave da página
const MENU = [['home', 'inicio'], ['confiavel', 'duotide-e-confiavel'], ['login', 'duotide-login'],
  ['corretora', 'duotide-corretora'], ['seguro', 'duotide-e-seguro'], ['app', 'duotide-app'],
  ['melhores', 'melhores-corretoras'], ['blog', 'blog']];
const LINKS_RODAPE = [['faq', 'duotide-perguntas-frequentes'], ['sobre', 'sobre'], ['avaliamos', 'como-avaliamos'],
  ['risco', 'aviso-de-risco'], ['contato', 'contato'], ['privacidade', 'privacidade'], ['termos', 'termos']];

const ler = p => fs.readFileSync(p, 'utf8');
const escAttr = s => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');
const escXml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const decod = s => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const texto = h => decod(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const aff = idioma => AFF_BASE + (idioma === PT ? 'duotide' : 'duotide-' + idioma.pasta);

// ---------------------------------------------------------------- traduções
function partes(html) {
  const p = {};
  for (const k of ['slug', 'title', 'description', 'corpo']) p[k] = html.match(new RegExp(`<!--${k}-->([\\s\\S]*?)<!--/${k}-->`))[1];
  p.slug = p.slug.trim(); p.title = p.title.trim(); p.description = p.description.trim();
  return p;
}
const prontos = [PT];
const trad = {}; // pasta -> { chrome, paginas: {chave: partes} }
for (const idioma of IDIOMAS.slice(1)) {
  const dir = path.join(__dirname, idioma.pasta);
  if (!fs.existsSync(dir)) { console.log(`- ${idioma.codigo}: sem tradução, pulado`); continue; }
  try {
    execFileSync('node', [path.join(__dirname, 'verificar.js'), idioma.pasta], { stdio: 'pipe' });
  } catch (e) {
    const fim = e.stdout.toString().trim().split('\n').pop();
    console.log(`- ${idioma.codigo}: verificador reprovou (${fim}), pulado`);
    continue;
  }
  const paginas = {};
  for (const c of CHAVES) paginas[c] = partes(ler(path.join(dir, c + '.html')));
  trad[idioma.pasta] = { chrome: JSON.parse(ler(path.join(dir, '_chrome.json'))), paginas };
  prontos.push(idioma);
}

// ---------------------------------------------------------------- endereços
function caminho(idioma, chave) {
  if (idioma === PT) return ROTAS[chave] === '' ? '/' : `/${ROTAS[chave]}/`;
  const base = `/${idioma.pasta}/`;
  if (chave === 'inicio') return base;
  const slug = trad[idioma.pasta].paginas[chave].slug;
  return chave.startsWith('blog__') ? `${base}blog/${slug}/` : `${base}${slug}/`;
}
const chavePorRotaPt = Object.fromEntries(CHAVES.map(c => [caminho(PT, c), c]));
const chrome = idioma => idioma === PT ? CHROME_PT : trad[idioma.pasta].chrome;

// ---------------------------------------------------------------- blocos comuns
const GLOBO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';

function seletor(idioma, chave) {
  if (prontos.length < 2) return '';
  const C = chrome(idioma);
  const itens = prontos.map(i => {
    const href = chave ? caminho(i, chave) : caminho(i, 'inicio');
    const atual = i === idioma ? ' aria-current="true"' : '';
    return `            <li><a href="${href}" hreflang="${i.codigo}" lang="${i.codigo}"${atual}>${i.nome} <small>${i.pasta || 'pt'}</small></a></li>`;
  }).join('\n');
  return `<details class="idioma">
          <summary aria-label="${escAttr(C.idioma_aria)}">${GLOBO}<span>${idioma.pasta || 'pt'}</span></summary>
          <ul class="idioma__lista">
${itens}
          </ul>
        </details>`;
}

function hreflang(chave) {
  const linhas = prontos.map(i => `  <link rel="alternate" hreflang="${i.codigo}" href="${SITE}${caminho(i, chave)}">`);
  const padrao = prontos.find(i => i.pasta === 'en') || PT;
  linhas.push(`  <link rel="alternate" hreflang="x-default" href="${SITE}${caminho(padrao, chave)}">`);
  return `<!--hreflang-->\n${linhas.join('\n')}\n  <!--/hreflang-->`;
}

function popup(idioma) {
  const P = chrome(idioma).popup;
  return `<template id="pp-modelo">
    <div class="pp pp--bonus" role="dialog" aria-modal="true" aria-labelledby="ppTit">
      <div class="pp__cx" tabindex="-1">
        <button class="pp__x" type="button" aria-label="${escAttr(P.fechar)}">&#10005;</button>
        <div class="pp__cont">
          <h2 id="ppTit"><span class="pp__l1">${P.linha1}</span> <span class="pp__l2">${P.linha2}</span></h2>
          <p>${P.texto}</p>
          <a class="pp__btn" href="${aff(idioma)}" target="_blank" rel="noopener sponsored nofollow">${P.botao}</a>
          <p class="pp__mini">${P.mini}</p>
        </div>
        <div class="pp__fig" aria-hidden="true">
          <img src="/assets/img/popup-bonus.svg" alt="" width="520" height="480" loading="lazy" decoding="async">
        </div>
      </div>
    </div>
  </template>`;
}

function menuUl(idioma, chaveAtual) {
  const C = chrome(idioma);
  return `<ul>\n${MENU.map(([k, c]) => {
    const atual = c === chaveAtual ? ' aria-current="page"' : '';
    return `          <li><a href="${caminho(idioma, c)}"${atual}>${C.nav[k]}</a></li>`;
  }).join('\n')}\n        </ul>`;
}

// Menu "Empresa" do rodapé: os mesmos 6 itens do rodapé da velocbroker.com.br
const MENU_RODAPE = [['home', 'inicio'], ['confiavel', 'duotide-e-confiavel'], ['login', 'duotide-login'],
  ['corretora', 'duotide-corretora'], ['seguro', 'duotide-e-seguro'], ['app', 'duotide-app']];
function menuRodape(idioma, chaveAtual) {
  const C = chrome(idioma);
  return `<ul>\n${MENU_RODAPE.map(([k, c]) => {
    const atual = c === chaveAtual ? ' aria-current="page"' : '';
    const rotulo = k === 'home' ? C.nav.home : C.rodape.menu[k];
    return `            <li><a href="${caminho(idioma, c)}"${atual}>${rotulo}</a></li>`;
  }).join('\n')}\n          </ul>`;
}

function cabecalho(idioma, chave, chaveMenu) {
  const C = chrome(idioma);
  return `<header class="site-header">
    <div class="container site-header__inner">
      <div class="site-header__left">
        <a class="site-logo" href="${caminho(idioma, 'inicio')}" aria-label="${escAttr(C.logo_aria)}">
          <span class="wordmark">
          <img class="wordmark__badge-img" src="/assets/img/marca-duotide.png"
               alt="" aria-hidden="true" width="36" height="36" decoding="async">
          <span class="wordmark__text">Duotide</span>
        </span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false"
                aria-controls="menu-principal" aria-label="${escAttr(C.menu_abrir)}"
                data-abrir="${escAttr(C.menu_abrir)}" data-fechar="${escAttr(C.menu_fechar)}">
          <span></span>
        </button>
        ${seletor(idioma, chave)}
      </div>
      <nav class="site-nav" id="menu-principal" aria-label="${escAttr(C.nav_aria)}">
        ${menuUl(idioma, chaveMenu)}
      </nav>
      <div class="site-header__actions">
        <a class="btn btn--primary btn--sm" href="${aff(idioma)}"
           target="_blank" rel="noopener sponsored nofollow">${C.criar_conta}</a>
        <a class="btn btn--outline btn--sm" href="${caminho(idioma, 'duotide-login')}">${C.entrar}</a>
      </div>
    </div>
  </header>`;
}

function rodape(idioma, chaveMenu) {
  const C = chrome(idioma), R = C.rodape;
  const ano = new Date().getFullYear();
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <span class="site-logo"><span class="wordmark">
            <img class="wordmark__badge-img" src="/assets/img/marca-duotide.png"
                 alt="" aria-hidden="true" width="46" height="46" decoding="async">
            <span class="wordmark__text">Duotide</span>
          </span></span>
          <p class="footer__copy">${R.copy1.replace('{ano}', ano)}<br>
            ${R.copy2}<br>
            ${R.copy3}</p>
        </div>
        <div class="footer__nav footer__empresa">
          <h2>${R.empresa}</h2>
          ${menuRodape(idioma, chaveMenu)}
        </div>
        <div class="footer__nav footer__contact">
          <h2>${R.contato}</h2>
          <p><a href="mailto:contato@duotide.com.br">contato@duotide.com.br</a></p>
        </div>
      </div>
      <div class="footer__legal">
        <p>${R.legal}</p>
        <p class="footer__links">
${LINKS_RODAPE.map(([k, c]) => `          <a href="${caminho(idioma, c)}">${R.links[k]}</a>`).join('\n')}
        </p>
      </div>
    </div>
  </footer>`;
}

// ---------------------------------------------------------------- página traduzida
function mapearLinks(html, idioma) {
  return html
    .replace(/href="(?:https:\/\/duotide\.com\.br)?(\/[^"#?]*)([#?][^"]*)?"/g, (m, rota, resto = '') => {
      const c = chavePorRotaPt[rota];
      return c ? `href="${caminho(idioma, c)}${resto}"` : m;
    })
    .replace(/https:\/\/trade\.safirion\.com\/register\?aff=836698&(?:amp;)?aff_model=revenue&(?:amp;)?afftrack=duotide(?![-\w])/g, aff(idioma));
}

function jsonLd(ptJson, idioma, chave, p, corpoTrad) {
  const C = chrome(idioma);
  const url = SITE + caminho(idioma, chave);
  const urlPt = SITE + caminho(PT, chave);
  const h1 = texto((corpoTrad.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, p.title])[1]);
  const g = JSON.parse(ptJson)['@graph'];
  const trocaId = s => typeof s === 'string' ? s.replace(urlPt, url) : s;
  const out = [];
  for (const n0 of g) {
    const n = JSON.parse(JSON.stringify(n0));
    for (const k of ['@id', 'url']) if (n[k] && n[k].startsWith(urlPt)) n[k] = trocaId(n[k]);
    for (const k of ['breadcrumb', 'mainEntityOfPage']) if (n[k] && n[k]['@id']) n[k]['@id'] = trocaId(n[k]['@id']);
    switch (n['@type']) {
      case 'Organization': n.description = C.meta.org_desc; break;
      case 'WebSite': n.description = C.meta.site_desc; n.inLanguage = idioma.codigo; break;
      case 'FinancialService': n.description = C.meta.corretora_desc; delete n.areaServed; break;
      case 'BreadcrumbList': {
        const trilha = corpoTrad.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/);
        const itens = trilha ? [...trilha[0].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => {
          const href = (m[1].match(/href="([^"]+)"/) || [])[1];
          return { nome: texto(m[1]), url: href ? SITE + href : url };
        }) : [{ nome: C.nav.home, url }];
        n.itemListElement = itens.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nome, item: it.url }));
        break;
      }
      case 'FAQPage': {
        const qs = [...corpoTrad.matchAll(/<details class="faq__item">\s*<summary>([\s\S]*?)<\/summary>\s*<div class="faq__answer">([\s\S]*?)<\/div>\s*<\/details>/g)];
        if (!qs.length) continue;
        n.mainEntity = qs.map(m => ({ '@type': 'Question', name: texto(m[1]), acceptedAnswer: { '@type': 'Answer', text: texto(m[2]) } }));
        break;
      }
      default: // WebPage, Article, ContactPage, AboutPage
        n.name = decod(p.title); n.description = decod(p.description); n.inLanguage = idioma.codigo;
        if ('headline' in n) n.headline = h1;
    }
    out.push(n);
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': out }, null, 2);
}

function paginaTraduzida(idioma, chave) {
  const ptHtml = ler(path.join(RAIZ, ROTAS[chave], 'index.html'));
  const p = trad[idioma.pasta].paginas[chave];
  const C = chrome(idioma);
  const url = SITE + caminho(idioma, chave);
  const corpo = mapearLinks(p.corpo.trim(), idioma);
  const h1 = texto((corpo.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, p.title])[1]);
  // item do menu marcado na página pt (blog posts marcam "Blog", por exemplo)
  const hrefAtual = (ptHtml.match(/<nav class="site-nav"[\s\S]*?<a href="([^"]+)" aria-current="page"/) || [])[1];
  const chaveMenu = hrefAtual ? chavePorRotaPt[hrefAtual] : null;

  let h = ptHtml;
  h = h.replace(/<html lang="[^"]*"[^>]*>/, `<html lang="${idioma.codigo}" dir="${idioma.dir}" data-tema="dark" data-tv="${idioma.tv}">`);
  h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${p.title}</title>`);
  h = h.replace(/(<meta name="description" content=")[^"]*"/, (m, a) => a + escAttr(decod(p.description)) + '"');
  h = h.replace(/\s*<meta name="keywords" content="[^"]*">/, '');
  h = h.replace(/(<link rel="canonical" href=")[^"]*"/, (m, a) => a + url + '"');
  h = h.replace(/(<meta property="og:locale" content=")[^"]*"/, (m, a) => a + idioma.og + '"');
  h = h.replace(/(<meta property="og:(?:title)" content=")[^"]*"/, (m, a) => a + escAttr(decod(p.title)) + '"');
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*"/, (m, a) => a + escAttr(decod(p.title)) + '"');
  h = h.replace(/(<meta property="og:description" content=")[^"]*"/, (m, a) => a + escAttr(decod(p.description)) + '"');
  h = h.replace(/(<meta name="twitter:description" content=")[^"]*"/, (m, a) => a + escAttr(decod(p.description)) + '"');
  h = h.replace(/(<meta property="og:url" content=")[^"]*"/, (m, a) => a + url + '"');
  h = h.replace(/(<meta property="og:image:alt" content=")[^"]*"/, (m, a) => a + escAttr(C.meta.og_alt_prefixo + h1) + '"');
  h = h.replace(/(<meta name="twitter:label1" content=")[^"]*"/, (m, a) => a + escAttr(C.meta.escrito_por) + '"');
  h = h.replace(/(<meta name="twitter:label2" content=")[^"]*"/, (m, a) => a + escAttr(C.meta.tempo_leitura) + '"');
  h = h.replace(/(<meta name="twitter:data2" content=")(\d+)[^"]*"/, (m, a, n) => `${a}${escAttr((+n === 1 ? C.meta.minuto : C.meta.minutos).replace('{n}', n))}"`);
  h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (m, j) => `<script type="application/ld+json">\n${jsonLd(j, idioma, chave, p, corpo)}\n</script>`);
  h = h.replace(/\s*<!--hreflang-->[\s\S]*?<!--\/hreflang-->/, '');
  h = h.replace(/(<link rel="canonical" href="[^"]*">)/, (m, a) => a + '\n  ' + hreflang(chave));
  h = h.replace(/<a class="skip-link" href="#conteudo">[^<]*<\/a>/, () => `<a class="skip-link" href="#conteudo">${C.pular}</a>`);
  h = h.replace(/<header class="site-header">[\s\S]*?<\/header>/, () => cabecalho(idioma, chave, chaveMenu));
  h = h.replace(/(?:<nav class="breadcrumb"[\s\S]*?<\/nav>\s*)?<main[\s\S]*?<\/main>/, () => corpo);
  h = h.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, () => rodape(idioma, chaveMenu));
  h = h.replace(/(<button class="to-top" type="button" aria-label=")[^"]*"/, (m, a) => a + escAttr(C.topo_aria) + '"');
  h = h.replace(/\s*<template id="pp-modelo">[\s\S]*?<\/template>/, '');
  h = h.replace(/(\s*<script src="\/assets\/js\/main\.js)/, (m, a) => '\n  ' + popup(idioma) + a);
  return h;
}

// ---------------------------------------------------------------- páginas em português (idempotente)
function ajustarPt(arquivo, chave) {
  let h = ler(arquivo);
  h = h.replace(/<html lang="pt-BR"(?: dir="ltr")?(?: data-tema="dark")?(?: data-tv="[^"]*")?>/, () => `<html lang="pt-BR" dir="ltr" data-tema="dark" data-tv="${PT.tv}">`);
  h = h.replace(/\s*<!--hreflang-->[\s\S]*?<!--\/hreflang-->/, '');
  if (chave) h = h.replace(/(<link rel="canonical" href="[^"]*">)/, (m, a) => a + '\n  ' + hreflang(chave));
  h = h.replace(/\s*<details class="idioma">[\s\S]*?<\/details>/, '');
  const sel = seletor(PT, chave);
  h = h.replace(/(<span><\/span>\s*<\/button>)\s*/, (m, a) => a + (sel ? '\n        ' + sel : '') + '\n      ');
  h = h.replace(/(<button class="nav-toggle"[^>]*aria-label="Abrir menu de navegação")(?![^>]*data-abrir)/,
    `$1\n                data-abrir="Abrir menu de navegação" data-fechar="Fechar menu de navegação"`);
  const hrefPt = (h.match(/<nav class="site-nav"[\s\S]*?<a href="([^"]+)" aria-current="page"/) || [])[1];
  h = h.replace(/(<div class="footer__nav footer__empresa">\s*<h2>[^<]*<\/h2>\s*)<ul>[\s\S]*?<\/ul>/,
    (m, a) => a + menuRodape(PT, hrefPt ? chavePorRotaPt[hrefPt] : null));
  h = h.replace(/\s*<template id="pp-modelo">[\s\S]*?<\/template>/, '');
  h = h.replace(/(\s*<script src="\/assets\/js\/main\.js)/, (m, a) => '\n  ' + popup(PT) + a);
  fs.writeFileSync(arquivo, h);
}

// ---------------------------------------------------------------- sitemaps e llms.txt
function imagens(html) {
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0];
  return [...new Set([...main.matchAll(/<img[^>]+src="(\/[^"]+)"/g)].map(m => SITE + m[1]))];
}
function urlset(lista) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${lista.map(u => `\t<url>
\t\t<loc>${escXml(u.loc)}</loc>
\t\t<lastmod>${u.lastmod}</lastmod>
${u.alternados.map(a => `\t\t<xhtml:link rel="alternate" hreflang="${a.codigo}" href="${escXml(a.href)}"/>\n`).join('')}${u.imagens.map(i => `\t\t<image:image>\n\t\t\t<image:loc>${escXml(i)}</image:loc>\n\t\t</image:image>\n`).join('')}\t</url>`).join('\n')}
</urlset>
`;
}

function main() {
  // datas anteriores (sitemap.xml em pt), para não inventar lastmod
  const antigo = fs.existsSync(path.join(RAIZ, 'sitemap.xml')) ? ler(path.join(RAIZ, 'sitemap.xml')) : '';
  const lastmodPt = Object.fromEntries([...antigo.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map(m => [m[1], m[2]]));

  // 1. idiomas traduzidos: pasta regenerada do zero
  const lastmodTrad = {};
  for (const idioma of prontos.slice(1)) {
    const destino = path.join(RAIZ, idioma.pasta);
    const anterior = {};
    if (fs.existsSync(destino)) {
      // guarda o conteúdo anterior para manter o lastmod de páginas que não mudaram
      for (const c of CHAVES) {
        const f = path.join(RAIZ, caminho(idioma, c), 'index.html');
        if (fs.existsSync(f)) anterior[c] = ler(f);
      }
      if (!/^[a-z]{2,3}$/.test(idioma.pasta)) throw new Error('pasta suspeita: ' + idioma.pasta);
      fs.rmSync(destino, { recursive: true });
    }
    for (const c of CHAVES) {
      const html = paginaTraduzida(idioma, c);
      const f = path.join(RAIZ, caminho(idioma, c), 'index.html');
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, html);
      const sitemapAntigo = path.join(RAIZ, `sitemap-${idioma.pasta}.xml`);
      const velho = fs.existsSync(sitemapAntigo) ? (ler(sitemapAntigo).match(new RegExp(`<loc>${escXml(SITE + caminho(idioma, c)).replace(/[.?]/g, '\\$&')}</loc>\\s*<lastmod>([^<]+)`)) || [])[1] : null;
      lastmodTrad[idioma.pasta + c] = anterior[c] === html && velho ? velho : HOJE;
    }
  }

  // 2. português
  for (const c of CHAVES) ajustarPt(path.join(RAIZ, ROTAS[c], 'index.html'), c);
  for (const extra of ['404.html', 'noticias/index.html', '.noticias/modelo.html']) {
    const f = path.join(RAIZ, extra);
    if (fs.existsSync(f)) ajustarPt(f, null);
  }

  // 3. sitemaps
  const alternados = c => [...prontos.map(i => ({ codigo: i.codigo, href: SITE + caminho(i, c) })),
    { codigo: 'x-default', href: SITE + caminho(prontos.find(i => i.pasta === 'en') || PT, c) }];
  const entradaPt = c => {
    const loc = SITE + caminho(PT, c);
    return { loc, lastmod: lastmodPt[loc] || HOJE, imagens: imagens(ler(path.join(RAIZ, ROTAS[c], 'index.html'))), alternados: alternados(c), post: c.startsWith('blog__') };
  };
  const pts = CHAVES.map(entradaPt);
  const noticias = { loc: SITE + '/noticias/', lastmod: HOJE, imagens: imagens(ler(path.join(RAIZ, 'noticias/index.html'))), alternados: [], post: false };
  const paginasPt = [...pts.filter(u => !u.post), noticias].sort((a, b) => a.loc === SITE + '/' ? -1 : b.loc === SITE + '/' ? 1 : 0);
  const postsPt = pts.filter(u => u.post);
  fs.writeFileSync(path.join(RAIZ, 'page-sitemap.xml'), urlset(paginasPt));
  fs.writeFileSync(path.join(RAIZ, 'post-sitemap.xml'), urlset(postsPt));
  fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'), urlset([...paginasPt, ...postsPt].map(u => ({ ...u, alternados: [] }))));
  const indice = [['post-sitemap.xml', postsPt], ['page-sitemap.xml', paginasPt]];
  for (const f of fs.readdirSync(RAIZ)) if (/^sitemap-[a-z]+\.xml$/.test(f)) fs.rmSync(path.join(RAIZ, f));
  for (const idioma of prontos.slice(1)) {
    const lista = CHAVES.map(c => ({ loc: SITE + caminho(idioma, c), lastmod: lastmodTrad[idioma.pasta + c],
      imagens: imagens(ler(path.join(RAIZ, caminho(idioma, c), 'index.html'))), alternados: alternados(c) }));
    fs.writeFileSync(path.join(RAIZ, `sitemap-${idioma.pasta}.xml`), urlset(lista));
    indice.push([`sitemap-${idioma.pasta}.xml`, lista]);
  }
  const recente = l => l.map(u => u.lastmod).sort((a, b) => new Date(b) - new Date(a))[0];
  fs.writeFileSync(path.join(RAIZ, 'sitemap_index.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indice.map(([f, l]) => `\t<sitemap>\n\t\t<loc>${SITE}/${f}</loc>\n\t\t<lastmod>${recente(l)}</lastmod>\n\t</sitemap>`).join('\n')}
</sitemapindex>
`);

  // 4. llms.txt: seção de idiomas (substitui a anterior, se houver)
  const llmsF = path.join(RAIZ, 'llms.txt');
  let llms = ler(llmsF).replace(/\n## Other languages[\s\S]*$/, '\n').trimEnd() + '\n';
  if (prontos.length > 1) {
    llms += `\n## Other languages\n\n${prontos.slice(1).map(i => `- [Duotide — ${i.nome}](${SITE}/${i.pasta}/): ${decod(trad[i.pasta].paginas.inicio.description)}`).join('\n')}\n`;
  }
  fs.writeFileSync(llmsF, llms);

  console.log(`\nidiomas no ar: ${prontos.map(i => i.codigo).join(', ')}`);
  console.log(`${prontos.length - 1} idioma(s) traduzido(s) × ${CHAVES.length} páginas = ${(prontos.length - 1) * CHAVES.length} páginas geradas`);
}
main();
