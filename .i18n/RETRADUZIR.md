# Retradução de páginas cujo texto em português mudou

As páginas abaixo tiveram o texto em português reescrito. Os arquivos em
`/Users/alexandrehenrique/duotide/.i18n/fonte/` já estão atualizados; as traduções
antigas no seu idioma ficaram velhas e o verificador vai acusá-las.

Páginas a retraduzir (6):
`inicio.html`, `duotide-e-confiavel.html`, `duotide-login.html`,
`duotide-corretora.html`, `duotide-e-seguro.html`, `duotide-app.html`

Regras — além de tudo o que está em `INSTRUCOES-TRADUCAO.md`, que continua valendo:

1. **Mantenha exatamente o mesmo slug** que já está em `<!--slug-->` do arquivo
   atual do seu idioma. O endereço dessas páginas já está publicado; mudar o slug
   quebra links.
2. Traduza o arquivo inteiro de novo a partir da fonte nova (a estrutura mudou).
   Pode reaproveitar `title` e `description` atuais se ainda combinarem com a página;
   a fonte manteve os mesmos.
3. Mantenha a terminologia que o seu idioma já usa nas outras 28 páginas e no
   `_chrome.json` (leia duas ou três delas antes).
4. Este texto é de marketing (tom mais vendedor): traduza com o mesmo tom, sem
   acrescentar nem tirar afirmações. Números (+270 ativos, 80%, 15 dias) ficam iguais.
5. Onde a fonte fala da CVM ou do Brasil, mantenha como sendo sobre o Brasil.
6. Não mexa nos outros 28 arquivos nem no `_chrome.json`.
7. Rode `node /Users/alexandrehenrique/duotide/.i18n/verificar.js <pasta>` até 0 erros.
