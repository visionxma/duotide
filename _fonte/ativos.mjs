





import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/home/victor/.jarvis/design-engine/node_modules/playwright/index.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = '/home/victor/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome';
const LIMA = '#D2FE00';
const PRETO = '#07090B';


const MARCA = `<circle fill="#fff" cx="148.2" cy="62.67" r="22.43"/><ellipse fill="${LIMA}" cx="148.2" cy="65.73" rx="22.43" ry="20.39"/><path fill="#fff" d="M168.23,56.33c1.85,1.39,1.69,4.46,1.64,6.98-.02.78-.65,1.4-1.43,1.4h-7.07c-.77,0-1.37-.6-1.43-1.37-.48-6.88-9-15.66-15.61-13.09-14.86,5.78-9.01,38.78-32.11,36.55-21.34-2.06-12.36-36.3-34.09-35.23-.8.04-1.48-.58-1.51-1.38-.08-2.68-.7-6.94,1.2-7.56,10.22-2.35,19.82,5.17,24.12,13.9,2.69,5.46,4.61,23.98,14.2,19.82,6.43-2.79,8.06-17.9,11.8-24.14,11.09-18.46,32.01-14.78,39.76,3.47.11.26.3.46.53.63Z"/><circle cx="148.71" cy="63.18" r="14.78"/>`;

const CX0 = 69, CY0 = 36, CW = 102, CH = 53;

function icone(lado, raio, fundo = PRETO) {
  const folga = lado * 0.13;
  const esc = (lado - folga * 2) / CW;
  const tx = folga - CX0 * esc;
  const ty = (lado - CH * esc) / 2 - CY0 * esc;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado}" height="${lado}">
<rect width="${lado}" height="${lado}" rx="${raio}" fill="${fundo}"/>
<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${esc.toFixed(4)})">${MARCA}</g>
</svg>`;
}

fs.writeFileSync(path.join(RAIZ, 'assets/favicon.svg'), icone(512, 96));




{
  const lado = 512, folga = lado * 0.04;
  const esc = (lado - folga * 2) / CW;
  const tx = folga - CX0 * esc;
  const ty = (lado - CH * esc) / 2 - CY0 * esc;
  fs.writeFileSync(path.join(RAIZ, 'assets/img/duotide-marca.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado}" height="${lado}">
<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${esc.toFixed(4)})">${MARCA}</g>
</svg>`);
}

const navegador = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await navegador.newContext({ deviceScaleFactor: 1 });
const pg = await ctx.newPage();

async function png(svg, lado, destino) {
  await pg.setViewportSize({ width: lado, height: lado });
  await pg.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg}`);
  await pg.waitForTimeout(120);
  await pg.screenshot({ path: path.join(RAIZ, destino), omitBackground: true });
}
await png(icone(512, 96), 512, 'assets/img/duotide-icone-512.png');
await png(icone(192, 36), 192, 'assets/img/duotide-icone-192.png');
await png(icone(180, 0), 180, 'assets/img/duotide-apple-touch-icon.png');
await png(icone(48, 8), 48, 'assets/img/duotide-icone-48.png');


const logo = fs.readFileSync(path.join(RAIZ, 'assets/img/duotide-logo.png')).toString('base64');
const manrope = fs.readFileSync(path.join(RAIZ, 'assets/fontes/manrope-800.woff2')).toString('base64');
const manrope5 = fs.readFileSync(path.join(RAIZ, 'assets/fontes/manrope-500.woff2')).toString('base64');
const cab = fs.readFileSync(path.join(RAIZ, 'assets/fontes/cabinet-grotesk-800.woff2')).toString('base64');

const og = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:M;src:url(data:font/woff2;base64,${manrope}) format("woff2");font-weight:800}
@font-face{font-family:M;src:url(data:font/woff2;base64,${manrope5}) format("woff2");font-weight:500}
@font-face{font-family:C;src:url(data:font/woff2;base64,${cab}) format("woff2");font-weight:800}
*{box-sizing:border-box;margin:0}
body{width:1600px;height:1036px;background:${PRETO};font-family:M,sans-serif;color:#fff;overflow:hidden;position:relative}
.luz{position:absolute;inset:0;background:
  radial-gradient(60% 55% at 84% 12%, rgba(210,254,0,.20), transparent 68%),
  radial-gradient(55% 48% at 8% 86%, rgba(210,254,0,.11), transparent 70%)}
.grao{position:absolute;inset:0;opacity:.06;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.c{position:relative;height:100%;padding:92px 104px;display:flex;flex-direction:column;justify-content:space-between}
img.lg{height:76px;width:auto}
h1{font-family:C,M,sans-serif;font-weight:800;font-size:116px;line-height:.98;letter-spacing:-.03em;max-width:17ch}
h1 em{font-style:normal;color:${LIMA}}
p.sb{font-weight:500;font-size:37px;line-height:1.35;color:rgba(255,255,255,.80);max-width:34ch;margin-top:30px}
.f{display:flex;gap:16px}
.t{flex:1;border:1px solid rgba(255,255,255,.17);border-radius:20px;padding:22px 26px;background:rgba(255,255,255,.045)}
.t b{display:block;font-family:C,M,sans-serif;font-weight:800;font-size:44px;color:${LIMA};line-height:1}
.t span{display:block;font-weight:500;font-size:23px;color:rgba(255,255,255,.76);margin-top:8px;line-height:1.25}
.pe{display:flex;align-items:center;justify-content:space-between;gap:24px;font-size:25px;color:rgba(255,255,255,.62);font-weight:500}
.pe b{color:${LIMA};font-weight:800}
</style>
<div class="luz"></div><div class="grao"></div>
<div class="c">
  <div>
    <img class="lg" src="data:image/png;base64,${logo}" alt="">
    <h1 style="margin-top:46px">O que a Duotide<br><em>publica de verdade.</em></h1>
    <p class="sb">Guia de parceiro, em português: depósito, saque, conta demo, ativos e quem opera a corretora — com a fonte de cada número.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:30px">
    <div class="f">
      <div class="t"><b>U$ 10</b><span>para começar, segundo o site oficial</span></div>
      <div class="t"><b>R$ 10.000</b><span>na conta demo, segundo o site oficial</span></div>
      <div class="t"><b>24/7</b><span>suporte anunciado</span></div>
      <div class="t"><b>CVM</b><span>a Duotide declara que não é autorizada</span></div>
    </div>
    <div class="pe"><span>duotide.com.br</span><span>Operar envolve risco de perder <b>todo</b> o dinheiro</span></div>
  </div>
</div>`;

await pg.setViewportSize({ width: 1600, height: 1036 });
await pg.setContent(og);
await pg.waitForTimeout(600);
await pg.screenshot({ path: path.join(RAIZ, 'assets/img/duotide-og.jpg'), type: 'jpeg', quality: 90 });

await navegador.close();
console.log('ok: favicon.svg, 4 icones PNG e a previa 1600x1036');
