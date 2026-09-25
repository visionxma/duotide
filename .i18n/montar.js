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
    return `            <li><a href="${href}" hreflang="${i.codigo}" lang="${i.codigo}"${atual}><img class="bandeira" src="/assets/img/bandeiras/${i.pasta || 'pt'}.svg" alt="" width="20" height="15" loading="lazy">${i.nome} <small>${i.pasta || 'pt'}</small></a></li>`;
  }).join('\n');
  return `<details class="idioma">
          <summary aria-label="${escAttr(C.idioma_aria)}"><img class="bandeira" src="/assets/img/bandeiras/${idioma.pasta || 'pt'}.svg" alt="" width="22" height="16"><span>${idioma.pasta || 'pt'}</span></summary>
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
          <picture><source media="(max-width: 799px)" srcset="/assets/img/popup-bonus-mob.webp"><img src="/assets/img/popup-bonus.webp" alt="" width="1034" height="960" loading="lazy" decoding="async"></picture>
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
          <p class="footer__suporte"><span>${R.suporte}</span><a href="mailto:suporte@duotide.com.br">suporte@duotide.com.br</a></p>
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

// ---------------------------------------------------------------- app: botões das lojas e topo da página
const APPLE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.37 12.73c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.19-1.73-1.35-.14-2.65.8-3.33.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.2 1.1-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.15.84-1.23 1.19-2.43 1.21-2.49-.03-.01-2.31-.89-2.33-3.52zM14.17 6.27c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.56.64-1.05 1.68-.92 2.67.97.07 1.97-.49 2.58-1.22z"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#34a853" d="M3.6 2.3 13.4 12l-9.8 9.7c-.35-.2-.6-.6-.6-1.1V3.4c0-.5.25-.9.6-1.1z"/><path fill="#fbbc04" d="m16.8 8.6-3.4 3.4 3.4 3.4 3.9-2.2c.8-.45.8-1.6 0-2.05z"/><path fill="#ea4335" d="M13.4 12 3.6 21.7c.3.2.75.25 1.15.02l12.05-6.3z"/><path fill="#4285f4" d="M13.4 12 16.8 8.6 4.75 2.28c-.4-.23-.85-.18-1.15.02z"/></svg>';
function lojas(idioma) {
  const L = chrome(idioma).lojas;
  const link = (icone, pre, nome) => `<a class="loja" href="${aff(idioma)}" target="_blank" rel="noopener sponsored nofollow">${icone}<span><small>${pre}</small>${nome}</span></a>`;
  return `<!--gerado-->${link(APPLE, L.apple_pre, L.apple)}${link(PLAY, L.google_pre, L.google)}<!--/gerado-->`;
}
function topoApp(idioma) {
  const C = chrome(idioma);
  return `<!--gerado--><section class="app-hero">
      <div class="container app-hero__inner">
        <h2 class="app-hero__titulo">${C.app.titulo}</h2>
        <div class="app-hero__palco">
          <div class="app-hero__mao">
            <img class="app-hero__tela" src="/assets/img/app/duotide-tela.svg" alt="" width="390" height="844" decoding="async" fetchpriority="high">
            <picture><source srcset="/assets/img/ot/mao.avif" type="image/avif"><img class="app-hero__foto" src="/assets/img/app/mao.webp" alt="" width="921" height="1272" decoding="async" fetchpriority="high"></picture>
          </div>
          <a class="app-qr" href="${aff(idioma)}" target="_blank" rel="noopener sponsored nofollow">
            <img src="/assets/img/qr/qr-${idioma.pasta || 'pt'}.svg" alt="QR code" width="120" height="120">
            <span><strong>${C.app.qr_titulo}</strong><em>${C.app.qr_cta} &rsaquo;</em></span>
          </a>
        </div>
        <div class="lojas lojas--centro">${lojas(idioma).replace(/<!--\/?gerado-->/g, "")}</div>
      </div>
    </section><!--/gerado-->`;
}
const GLOBO_WEB = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
const WIN = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 5.5 10.5 4.5v7H3zm8.5-1.1L21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zm8.5 0H21V21l-9.5-1.4z"/></svg>';
const MAC = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const HUAWEI = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11 20C8 15 6.5 10.5 8.2 6.5 10 7.5 11.2 11 11 20zm2 0c-.2-9 1-12.5 2.8-13.5C17.5 10.5 16 15 13 20zM10 20.2C6.8 18.6 3.8 16 3 12.7c2.5-.4 5.4 2.7 7 7.5zm4 0c1.6-4.8 4.5-7.9 7-7.5-.8 3.3-3.8 5.9-7 7.5z"/></svg>';
const GALAXY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 7V6a4 4 0 0 1 8 0v1h3.2l1 13.2A1.7 1.7 0 0 1 18.5 22h-13a1.7 1.7 0 0 1-1.7-1.8L4.8 7zm2 0h4V6a2 2 0 0 0-4 0z"/></svg>';
const ANDROID = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.5 9h11a1 1 0 0 1 1 1v7a4 4 0 0 1-4 4h-5a4 4 0 0 1-4-4v-7a1 1 0 0 1 1-1zm1-1a4.5 4.5 0 0 1 9 0zM9.5 5.5a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6zm5 0a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6zM7.6 2.3l1.3 2m7.5-2-1.3 2" stroke="currentColor" stroke-width="1.2"/></svg>';
function plataformas(idioma) {
  const P = chrome(idioma).plataformas, L = chrome(idioma).lojas;
  const botao = (icone, nome, href, externo = true) => `<a class="plat__btn" href="${href}"${externo ? ' target="_blank" rel="noopener sponsored nofollow"' : ''}>${icone}<span>${nome}</span></a>`;
  return `<!--gerado--><section class="plataformas">
      <div class="container">
        <h2 class="plataformas__titulo">${P.titulo} <span>${P.titulo2}</span></h2>
        <div class="plataformas__palco" aria-hidden="true">
          <div class="disp disp--tablet disp--foto"><img src="/assets/img/ot/tablet.avif" alt="" width="488" height="512" loading="lazy" decoding="async"><span class="tablet__marca"><img src="/assets/img/marca-duotide.png" alt="" width="64" height="64" loading="lazy"></span></div>
          <div class="disp disp--fone"><img src="/assets/img/app/duotide-tela.svg" alt="" width="390" height="844" loading="lazy" decoding="async"></div>
        </div>
        <div class="plataformas__cartao">
          <div class="plat">
            <h3>${P.desktop}</h3>
            <p>${P.desktop_txt}</p>
            <a class="plat__link" href="${aff(idioma)}" target="_blank" rel="noopener sponsored nofollow">${P.desktop_link} &rsaquo;</a>
            <div class="plat__botoes">${botao(WIN, 'Windows x32', aff(idioma))}${botao(WIN, 'Windows x64', aff(idioma))}${botao(MAC, 'macOS', aff(idioma))}${botao(GLOBO_WEB, P.webapp, aff(idioma))}</div>
          </div>
          <div class="plat plat--movel">
            <div class="plat__topo">
              <div>
                <h3>${P.movel}</h3>
                <p>${P.movel_txt}</p>
                <a class="plat__link" href="${caminho(idioma, 'duotide-app')}">${P.movel_link} &rsaquo;</a>
              </div>
              <img class="plat__qr" src="/assets/img/qr/qr-${idioma.pasta || 'pt'}.svg" alt="QR code" width="120" height="120" loading="lazy">
            </div>
            <div class="plat__botoes">${botao(APPLE, L.apple, aff(idioma))}${botao(PLAY, L.google, aff(idioma))}${botao(HUAWEI, 'Huawei', aff(idioma))}${botao(GALAXY, 'Galaxy Store', aff(idioma))}${botao(ANDROID, P.apk, aff(idioma))}</div>
          </div>
        </div>
      </div>
    </section><!--/gerado-->`;
}

// Preenche o que é gerado dentro do <main> (idempotente: limpa antes de preencher).
function gerados(h, idioma, chave) {
  h = h.replace(/\s*<!--gerado--><section[\s\S]*?<\/section><!--\/gerado-->/g, '');
  h = h.replace(/<!--gerado-->[\s\S]*?<!--\/gerado-->/g, '');
  h = h.replace(/<div class="lojas"><\/div>/g, () => `<div class="lojas">${lojas(idioma)}</div>`);
  if (chave === 'duotide-app') h = h.replace(/(<main id="conteudo">)/, (m, a) => a + '\n    ' + topoApp(idioma));
  if (chave === 'inicio') h = h.replace(/(<section class="faixa">[\s\S]*?<\/section>)/, (m, a) => a + '\n    ' + plataformas(idioma));
  return h;
}

// ---------------------------------------------------------------- layout da home
// Reorganiza o texto da home em blocos visuais SEM mudar a ordem nem o conteúdo dos
// elementos: só acrescenta invólucros <div … data-g>…</div><!--/g--> (que o extrair.js
// remove) e alguns trechos <!--gerado-->. Como a sequência de tags é a mesma em todos
// os idiomas, o mesmo layout vale para as 17 versões.
function filhosDiretos(html) {
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/g;
  const vazias = new Set(['img', 'br', 'hr', 'source', 'input', 'meta', 'link']);
  const out = []; let prof = 0, ini = -1, m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    const nome = m[1].toLowerCase(), fecha = m[0][1] === '/';
    if ((vazias.has(nome) || m[0].endsWith('/>')) && !fecha) { if (prof === 0) out.push({ ini: m.index, fim: re.lastIndex, tag: nome, abre: m[0] }); continue; }
    if (!fecha) { if (prof === 0) ini = m.index, out.tagAtual = { tag: nome, abre: m[0] }; prof++; }
    else { prof--; if (prof === 0) out.push({ ini, fim: re.lastIndex, ...out.tagAtual }); }
  }
  return out;
}
const tiraInvolucros = h => h.replace(/<div[^>]*\sdata-g(?:\s[^>]*)?>\s*/g, '').replace(/\s*<\/div><!--\/g-->/g, '');
function layoutHome(h, idioma) {
  h = tiraInvolucros(h);
  let sec = 0;
  return h.replace(/(<section class="bloco">\s*<div class="container">)([\s\S]*?)(<\/div>\s*<\/section>)/g, (tudo, a, miolo, z) => {
    sec++;
    const fs = filhosDiretos(miolo).map(f => ({ ...f, html: miolo.slice(f.ini, f.fim) }));
    const grupos = [];
    for (const f of fs) {
      if (f.tag === 'h2' || f.tag === 'h3' || !grupos.length) grupos.push([]);
      grupos[grupos.length - 1].push(f);
    }
    let lado = 0;
    const partes = grupos.map((g, gi) => {
      const ultimoDaHome = sec === 2 && gi === grupos.length - 1;
      const fig = g.filter(f => f.tag === 'figure');
      const resto = g.filter(f => f.tag !== 'figure');
      const txt = resto.map(f => f.html).join('\n');
      const temPassos = g.some(f => f.tag === 'ol');
      const temLista = g.some(f => f.tag === 'ul');
      const ehApp = g[0].tag === 'h3' && g.some(f => /class="lojas"/.test(f.abre || ''));
      if (ultimoDaHome) {
        const C = chrome(idioma);
        return `<div class="hb hb--cta" data-g>${txt}<!--gerado--><div class="btn-row btn-row--center"><a class="btn btn--primary btn--lg" href="${aff(idioma)}" target="_blank" rel="noopener sponsored nofollow">${C.criar_conta}</a></div><!--/gerado--></div><!--/g-->`;
      }
      if (ehApp) {
        return `<div class="hb hb--split hb--app" data-g><div class="hb__txt" data-g>${txt}</div><!--/g--><!--gerado--><div class="hb__midia hb__midia--bonus"><img src="/assets/img/ot/celular-bonus.avif" alt="" width="696" height="464" loading="lazy" decoding="async"></div><!--/gerado--></div><!--/g-->`;
      }
      if (fig.length === 1) {
        // mantém a ordem original: o que vem antes da foto, a foto, o que vem depois
        const k = g.indexOf(fig[0]);
        const antes = g.slice(0, k).map(f => f.html).join('\n');
        const depois = g.slice(k + 1).map(f => f.html).join('\n');
        const rev = (lado++ % 2) ? ' hb--rev' : '';
        return `<div class="hb hb--split${rev}" data-g><div class="hb__txt" data-g>${antes}</div><!--/g-->${fig[0].html}${depois ? `<div class="hb__fim" data-g>${depois}</div><!--/g-->` : ''}</div><!--/g-->`;
      }
      if (temPassos) return `<div class="hb hb--passos" data-g>${txt}</div><!--/g-->`;
      if (temLista) return `<div class="hb hb--recursos" data-g>${txt}</div><!--/g-->`;
      return `<div class="hb hb--cartoes" data-g>${txt}</div><!--/g-->`;
    });
    return a + '\n' + partes.join('\n') + '\n' + z;
  });
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
  h = gerados(h, idioma, chave);
  if (chave === 'inicio') h = layoutHome(h, idioma);
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
  if (!h.includes('footer__suporte')) h = h.replace(/(<p><a href="mailto:contato@duotide\.com\.br">contato@duotide\.com\.br<\/a><\/p>)/,
    (m, a) => a + '\n          <p class="footer__suporte"><span>' + CHROME_PT.rodape.suporte + '</span><a href="mailto:suporte@duotide.com.br">suporte@duotide.com.br</a></p>');
  const hrefPt = (h.match(/<nav class="site-nav"[\s\S]*?<a href="([^"]+)" aria-current="page"/) || [])[1];
  h = h.replace(/(<div class="footer__nav footer__empresa">\s*<h2>[^<]*<\/h2>\s*)<ul>[\s\S]*?<\/ul>/,
    (m, a) => a + menuRodape(PT, hrefPt ? chavePorRotaPt[hrefPt] : null));
  h = h.replace(/\s*<template id="pp-modelo">[\s\S]*?<\/template>/, '');
  h = h.replace(/(\s*<script src="\/assets\/js\/main\.js)/, (m, a) => '\n  ' + popup(PT) + a);
  if (chave) h = gerados(h, PT, chave);
  if (chave === 'inicio') h = layoutHome(h, PT);
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

  // 3b. páginas removidas: redirecionam para a home do idioma (evita 404 para quem vem do Google)
  const redir = path.join(__dirname, 'redirecionados.json');
  if (fs.existsSync(redir)) {
    for (const rota of JSON.parse(ler(redir))) {
      const pasta = rota.split('/')[1];
      const idioma = prontos.find(i => i.pasta === pasta) || PT;
      const alvo = idioma === PT ? '/' : `/${idioma.pasta}/`;
      const f = path.join(RAIZ, rota, 'index.html');
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, `<!DOCTYPE html>
<html lang="${idioma.codigo}">
<head>
<meta charset="UTF-8">
<title>Duotide</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${SITE}${alvo}">
<meta http-equiv="refresh" content="0; url=${alvo}">
<script>location.replace(${JSON.stringify(alvo)})</script>
</head>
<body><a href="${alvo}">Duotide</a></body>
</html>
`);
    }
  }

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
