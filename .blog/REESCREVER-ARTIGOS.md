# Reescrever artigos do blog no formato novo

Você reescreve, em português do Brasil, os artigos da sua lista. Cada artigo é um JSON em
`/Users/alexandrehenrique/duotide/.blog/artigos/<slug>.json`. Modelo pronto e aprovado:
`.blog/artigos/o-que-e-o-rsi-indice-de-forca-relativa.json`. **Leia esse arquivo antes de começar.**

Por que o formato mudou: o blog precisa de conteúdo que um texto genérico não tem — resposta direta,
números reais tirados de cotações de verdade, exemplo prático, como usar e erros comuns.

## O que entregar em cada JSON

Mantenha **sem mudar**: `slug`, `pauta`, `categoria`, `data`, `tipo` (se existir), `fonte` (se existir).
Reescreva ou crie:

- `titulo`: claro, com o termo que a pessoa busca no Google. Sem aspas duplas.
- `descricao`: até 155 caracteres, sem aspas duplas.
- `resposta`: 2 a 4 frases que respondem à pergunta do título de forma direta. Texto puro (pode ter `<strong>`).
- `revisado`: `"2026-10-08"`.
- `leitura`: minutos (palavras ÷ 200, arredondado).
- `grafico` (quando fizer sentido, veja abaixo).
- `corpo`: HTML só com `<p>`, `<h2>`, `<h3>`, `<ul class="check-list">`, `<li>`, `<strong>`, `<em>`. Sem links, sem imagens.

## Estrutura do corpo

Siga a do modelo, adaptando ao assunto:

1. 1 ou 2 parágrafos de abertura (sem repetir a resposta rápida).
2. `<h2>O que é …</h2>` (quando for um conceito).
3. `<h2>Como calcular …</h2>` (quando houver fórmula) — com o cálculo feito passo a passo **com números reais** do ativo do gráfico.
4. `<h2>Exemplo real: …</h2>` com o marcador `<!--grafico-->` onde o gráfico entra e 2 ou 3 situações reais lidas no gráfico (data, preço, o que aconteceu depois).
5. `<h2>Como usar …</h2>` com `<h3>` para cada leitura/uso, incluindo **limitações**.
6. `<h2>Erros comuns …</h2>` (o título começa com "Erros comuns") com `<ul class="check-list">`.
7. Parágrafo final sugerindo praticar na conta demo e registrar os resultados.

Artigos que não são de indicador (psicologia, gestão de risco, iniciantes, estratégias gerais): mesma ideia —
resposta rápida, explicação, **exemplo prático com números** (de preferência reais: ex. calcular tamanho de posição
com o ATR real do BTC), como fazer, erros comuns. Use gráfico só se ele ajudar de verdade.

Notícias (`"tipo": "noticia"`): mantenha formato de notícia e os fatos originais; acrescente `resposta` (resumo em 2 frases),
`revisado`, e, se houver um ativo cotado envolvido, um gráfico `preco` dele. Não precisam de "Erros comuns".

Tamanho: 900 a 1.500 palavras (notícias podem ser menores, mínimo 500).

## Gráficos com dados reais

No JSON: `"grafico": {"ativo": "BTCUSDT", "fonte": "binance", "indicador": "rsi", "inicio": "2026-04-01", "fim": "2026-10-07", "params": {"periodo": 14}}`

- `indicador`: `rsi`, `macd`, `bollinger`, `sma`, `ema`, `cruzamento` (params `periodos: [50, 200]`, `tipo: "sma"|"ema"`),
  `estocastico`, `atr`, `adx`, `cci`, `williams`, `obv`, `preco` (só velas). `sma`/`ema` aceitam `params.periodos: [20, 50]`.
- Ativos já baixados (veja `ls .blog/dados/`; **não baixe de novo um ativo que já existe**, os artigos citam esses números): BTCUSDT, ETHUSDT, ^GSPC, ^IXIC, ^BVSP, ^TNX, EURUSD=X, GBPUSD=X, USDJPY=X, USDBRL=X, GC=F, AAPL, NVDA, MSFT, GOOGL, AMZN, TSLA, SPY, BOVA11.SA e outros.
  Outro ativo: `node .blog/graficos.js baixar <TICKER> yahoo` (ex. `GOOGL`, `TSLA`, `CL=F`, `GBPUSD=X`, `^IXIC`).
- Janela: 4 a 9 meses de diário costuma ficar bom (até ~200 velas). Datas disponíveis até 2026-10-07.
- Escolha o ativo que combina com o tema (forex → `EURUSD=X`; ações → `AAPL`/`NVDA`/`^GSPC`; ouro → `GC=F`; cripto → `BTCUSDT`).
  Varie: não use BTC em todos.

**Todo número de mercado no texto tem de sair de** `node .blog/graficos.js fatos <slug>` (rode depois de gravar o `grafico` no JSON)
ou de um cálculo seu sobre `.blog/dados/<ATIVO>.json` (ex.: `node -e` lendo o arquivo). Nunca invente preço, data ou valor de
indicador. Confira as contas antes de escrever (some, divida, arredonde com cuidado). Valores em dólar: `US$ 1.234,56`.

## Regras de texto

- Português do Brasil **com acentos** (vários artigos antigos estão sem acento: corrija).
- Fatos verdadeiros e verificáveis; nada de promessa de ganho, "estratégia infalível" ou recomendação de compra/venda.
- Os exemplos descrevem o que aconteceu, não o que vai acontecer — diga isso quando couber.
- Não cite nem promova corretoras; o site cuida das chamadas.
- Pode reaproveitar o que estava certo no texto antigo.

## Como trabalhar

1. Leia o modelo e o JSON antigo.
2. Grave o `grafico` (se houver), rode `fatos`, escreva o texto com esses números.
3. Grave o JSON com a ferramenta Write (JSON válido, UTF-8, `indent` de 2 espaços).
4. Rode `node /Users/alexandrehenrique/duotide/.blog/verificar-artigo.js <slug>` e corrija até dar `ok`.
5. Não mexa em nenhum outro arquivo, não rode git, não rode o montador do site.
6. Termine com uma linha por artigo: slug, ok/erro, indicador e ativo do gráfico.
