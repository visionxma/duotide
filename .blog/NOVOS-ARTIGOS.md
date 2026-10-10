# Escrever artigos NOVOS do blog

Você recebe um lote em `/Users/alexandrehenrique/duotide/.blog/lotes-novos/<site>-NN.json`: 10 itens com
`site`, `slug`, `titulo`, `tipo`, `categoria`, `ativo`, `angulo` e `pasta` (a pasta do site onde o artigo mora).

O formato e as regras são os de `/Users/alexandrehenrique/duotide/.blog/REESCREVER-ARTIGOS.md` (leia inteiro) e o
modelo é `/Users/alexandrehenrique/duotide/.blog/artigos/o-que-e-o-rsi-indice-de-forca-relativa.json`.
A diferença é que o artigo não existe: você cria do zero.

## Para cada item

- Grave em `<pasta>/.blog/artigos/<slug>.json` (nunca na Duotide se o item for de outro site).
- Campos: `pauta` = o slug, `slug`, `titulo` (pode melhorar o da pauta), `descricao`, `categoria` (a da pauta),
  `data`: `"2026-10-09"`, `revisado`: `"2026-10-09"`, `resposta`, `leitura`, `grafico` (quando couber), `corpo`.
  Notícias de atualidade (`tipo: "atualidade"`) levam também `"tipo": "noticia"`.
- O texto não cita a marca do site (Duotide, Fox On, Astron, Avalon) nem corretora nenhuma.
- **Dados do gráfico no próprio site:** use `node <pasta>/.blog/graficos.js fatos <slug>` (lê `<pasta>/.blog/dados/`).
  Ativo que falta: `node <pasta>/.blog/graficos.js baixar <TICKER> yahoo|binance` (nunca com `--forcar`).
- **Problemas do cliente** (saque, verificação, KYC, operação fechada): explique como funciona em corretoras em geral,
  com o que é comum e o que conferir; nunca invente prazo, taxa ou procedimento de uma marca.
- **Atualidade:** só o que os dados mostram até 07/10/2026; não atribua causa a um movimento sem fonte; calendário
  (CPI, Fed, payroll) só com data que você tem certeza — na dúvida, diga para conferir no calendário oficial.
- Tema fiscal: regra geral e "confira a regra em vigor", nunca valor ou alíquota que você não tem certeza.
- Rode `node <pasta>/.blog/verificar-artigo.js <slug>` (dentro da pasta do site) até dar `ok`.
- Não mexa em nenhum outro arquivo, não rode git, não rode o montador.

Termine com uma linha por artigo: slug, ok/erro, indicador e ativo do gráfico.

## Câmbio do Yahoo (=X): abertura não confiável
Nos arquivos de câmbio do Yahoo a abertura vem igual ao fechamento do mesmo dia. O gráfico já desenha a vela com a
abertura = fechamento anterior, mas **os números que você calcula** não: para padrão de vela, corpo, pavio ou "dia de
alta/baixa" em câmbio, use como abertura o fechamento do dia anterior — ou prefira um ativo que não seja câmbio
(ouro, índices, ações, cripto). Fechamento, máxima e mínima de câmbio estão certos.
