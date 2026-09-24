# Instruções para traduzir o site duotide.com.br

O site `duotide.com.br` é um portal **informativo e não oficial** sobre a corretora
Duotide, escrito em português do Brasil e mantido por afiliação (os botões de cadastro
levam à plataforma parceira). Ele está sendo publicado em 17 idiomas, cada um numa
pasta (`/en/`, `/es/`…). Você traduz **um** idioma.

## O que você recebe e o que entrega

- Fonte (não altere): `/Users/alexandrehenrique/duotide/.i18n/fonte/`
  - 34 arquivos `<chave>.html`, um por página;
  - `_chrome.json`: textos fixos (menu, rodapé, pop-up, metadados).
- Entrega: `/Users/alexandrehenrique/duotide/.i18n/<pasta>/`
  - os mesmos 34 `<chave>.html`, com o **mesmo nome de arquivo**;
  - `_chrome.json` com as **mesmas chaves**, valores traduzidos.
- Não escreva nada fora da sua pasta. Não rode git. Não mexa nas páginas do site.

Cada arquivo de página tem quatro blocos. Mantenha os marcadores exatamente:

```
<!--slug-->duotide-saque<!--/slug-->
<!--title-->…<!--/title-->
<!--description-->…<!--/description-->
<!--corpo-->
…HTML…
<!--/corpo-->
```

## Regras de HTML (o verificador cobra todas)

1. **Traduza só o texto**: o conteúdo entre as tags e os valores de `alt`,
   `aria-label`, `title` e `placeholder`.
2. **Não mude nenhuma tag nem nenhum outro atributo**: `href`, `src`, `class`, `id`,
   `data-*`, `rel`, `target`, `width`… ficam idênticos, na mesma ordem. Não acrescente
   nem remova elementos, nem mesmo `<strong>`, `<br>` ou `<a>`. Os links internos
   continuam apontando para o caminho em português (`/duotide-saque/`); o montador
   converte depois para a versão no seu idioma.
3. Os links de cadastro (`https://trade.safirion.com/…`) ficam intocados.
4. HTML válido: `&` dentro de texto como `&amp;`; nunca `<` ou `>` soltos.
5. `title` e `description` sem aspas duplas (`"`) e sem `<` `>`.
6. Código de programa, URLs e domínios exibidos como texto (ex.: `cvm.gov.br`)
   ficam como estão.

## Slug (o endereço da página no seu idioma)

- Só `a-z`, `0-9` e hífen, sem acento. Único dentro do idioma.
- Home (`inicio.html`): slug **vazio**. Blog (`blog.html`): slug **`blog`**.
- Idiomas de alfabeto latino (en, es, de, fil, fr, id, it, sv, tr, vi): traduza as
  palavras do slug para o idioma, sem acentos. Ex.: es `duotide-es-confiable`,
  de `duotide-seriositaet`, fr `duotide-avis-fiable`.
- Idiomas de outro alfabeto (ar, bn, hi, ru, th, zh): use palavras em inglês.
  Ex.: `duotide-withdrawal`.
- Páginas da Duotide mantêm o prefixo `duotide-`. Pense no que a pessoa digita no
  Google no seu idioma (ex.: en `duotide-review`, `duotide-withdrawal`).

## Como traduzir o texto

- **Qualidade de nativo.** Texto natural, fluente, no registro de um site de
  finanças sério, não tradução literal. Adapte expressões idiomáticas.
- **SEO.** O `title` (ideal ≤ 60 caracteres, com "Duotide" quando a fonte tem) e a
  `description` (ideal ≤ 155) devem usar os termos que as pessoas realmente buscam no
  seu idioma (ex.: en "Is Duotide Legit?", "Duotide Review"; es "¿Duotide es
  confiable?"). O `h1` segue a mesma ideia.
- **Nomes próprios** ficam: Duotide, Safirion, Fox On, Obynex, Avalon, On Broker,
  Astron, TradingView, InfoMoney, Money Times, Investing.com, Reclame Aqui, Pix.
  Siglas como KYC, 2FA, CVM, SVG, CDI, Selic, IPCA ficam; explique na primeira vez
  em que aparecem na página se o leitor do seu idioma não as conhece.
- **O site foi escrito para brasileiros; o leitor agora pode estar em qualquer país.**
  - Afirmações sobre o Brasil continuam verdadeiras e **devem continuar ditas como
    sendo sobre o Brasil**: "não é autorizada pela CVM" → "não é autorizada pela CVM,
    a reguladora de valores mobiliários do Brasil".
  - Onde o texto manda consultar a CVM, oriente a consultar **também o regulador
    financeiro do país do leitor**. Pode citar o regulador principal do país do seu
    idioma (ex.: de BaFin, fr AMF, it CONSOB, es CNMV, tr SPK, id OJK, th SEC
    Thailand, hi SEBI, sv Finansinspektionen), **sempre como "verifique no registro
    de…", nunca afirmando se a Duotide é ou não autorizada lá.**
  - Pix, Receita Federal, imposto de renda, Reclame Aqui, R$: mantenha a informação
    e deixe claro que se refere ao Brasil.
- **Não invente nada.** Não acrescente promessas, números, prazos, garantias, bônus
  ou qualidades que a fonte não diz. Não suavize os avisos de risco nem o aviso de
  "site não oficial". Não escreva que a Duotide "é confiável" ou "é segura" se a
  fonte não afirma isso.
- Números e datas: mesmos valores; formato local (vírgula/ponto) é bem-vindo.
- Árabe: escreva em árabe, sem acrescentar `dir` nem outros atributos (o montador
  cuida disso). Chinês: simplificado. Filipino: filipino padrão (base tagalo), com
  empréstimos do inglês onde soa natural.
- `_chrome.json`: mantenha `{ano}` e `{n}` exatamente. `rodape.legal` já é a versão
  internacional do aviso; traduza fielmente. A chave `_nota` pode ficar como está.

## Como trabalhar

1. Leia `_chrome.json` e três ou quatro páginas antes de começar, para pegar o tom e
   manter a terminologia **consistente** em todo o idioma (o mesmo termo para
   "corretora", "saque", "depósito", "conta demo" em todas as páginas).
2. Traduza os 34 arquivos e o `_chrome.json`, gravando cada um com a ferramenta Write.
3. Rode `node /Users/alexandrehenrique/duotide/.i18n/verificar.js <pasta>` e corrija
   **todos os ERROs**. Rode de novo até dar `0 erro(s)`.
4. Leia os AVISOs: "palavras que parecem português" pode ser nome próprio (ok) ou
   trecho esquecido (corrija). Títulos longos: encurte se passar muito de 65.
5. Termine com um resumo curto: quantos arquivos, resultado final do verificador e
   qualquer decisão de tradução que mereça atenção.
