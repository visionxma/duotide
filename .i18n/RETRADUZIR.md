# Retradução de página cujo texto em português mudou

A página abaixo foi reescrita em português. O arquivo em
`/Users/alexandrehenrique/duotide/.i18n/fonte/` já está atualizado; a tradução antiga
no seu idioma ficou velha e o verificador vai acusá-la.

Página a retraduzir: `duotide-conta-demo.html` (conta demo, reescrita no formato demo x conta real). Mantenha "R$ 10.000" como valor (é em reais, não converta).

Regras — além de tudo o que está em `INSTRUCOES-TRADUCAO.md`, que continua valendo:

1. **Mantenha exatamente o mesmo slug** que já está em `<!--slug-->` do arquivo atual
   do seu idioma. O endereço já está publicado.
2. Traduza o arquivo inteiro de novo a partir da fonte nova (a estrutura mudou).
   Pode reaproveitar `title` e `description` atuais.
3. Mantenha a terminologia do seu idioma (leia o `_chrome.json` e uma ou duas páginas).
4. Texto curto e direto, tom de marketing; não acrescente nem tire afirmações.
5. Não mexa em nenhum outro arquivo.
6. Rode `node /Users/alexandrehenrique/duotide/.i18n/verificar.js <pasta>` até 0 erros.
