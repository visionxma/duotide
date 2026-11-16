// Paginas 5 a 8. Mesmo formato do conteudoA.mjs.
// Todo fato citado foi lido em 16/11/2026 em duotide.com e nos PDFs legais da Duotide.
const F = (t) => `<p class="fonte">${t}</p>`;
const OF = '<a href="https://duotide.com/" rel="sponsored noopener" target="_blank">duotide.com</a>';
const D = (u, t) => `<a href="${u}" rel="nofollow noopener" target="_blank">${t}</a>`;
const RISCO = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urrjqakhdj8lo830/DuoTide%20Risk%20Disclosure.pdf', 'Divulgação de Risco');
const SAQUE = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urpmsj7rr6s5211g/DuoTide%20Withdrawal%20Policy.pdf', 'Política de Retirada');
const DEMODOC = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urhmsj7rr6s520v0/DuoTide%20Demo%20and%20Tournament%20Account.pdf', 'Demo and Tournament Account');
const EXEC = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urpmsj7rr6s52100/DuoTide%20Order%20Execution%20Policy.pdf', 'Política de Execução de Ordens');
const MARGEM = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urpmsj7rr6s520vg/DuoTide%20Margin%20Trading.pdf', 'Margin Trading');
const PRIV = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urrjqakhdj8lo85g/DuoTide%20Privacy%20Policy.pdf', 'Política de Privacidade');

export const A5 = {
  slug: 'duotide-conta-demo',
  titulo: 'Conta demo da Duotide: R$ 10.000 simulados, e os limites',
  desc: 'A Duotide oferece R$ 10.000 em conta demo para praticar sem arriscar. Veja o que o saldo simulado ensina de verdade e o que ele não consegue provar.',
  h1: 'Conta demo da Duotide: R$ 10.000 simulados e o que testar',
  trilha: 'Conta demo',
  resposta: 'A página oficial oferece R$ 10.000 em conta demo para praticar, entender a plataforma e ganhar confiança, sem arriscar nada. É saldo simulado, não dinheiro real, e as regras completas estão no PDF Demo and Tournament Account, entre os documentos legais.',
  relacionadas: ['duotide-como-abrir-conta', 'duotide-plataforma-e-aplicativo', 'duotide-ativos-disponiveis', 'duotide-deposito-minimo'],
  secoes: [
    ['oque', 'O que a Duotide publica sobre a conta demo', [
      'A oferta aparece na página inicial, numa seção chamada “modo simulado”. O texto diz: “Receba R$ 10.000 em conta demo para praticar, entender a plataforma e ganhar confiança, tudo isso sem arriscar nada.”',
      'Dois detalhes dessa frase merecem nota. O primeiro é que o valor está em reais, e não em dólar como o valor de entrada da conta real. O segundo é que o texto não diz por quanto tempo o saldo dura, se pode ser recarregado, nem se a demo expira depois de algum período de inatividade.',
      'A Duotide publica um documento específico sobre o assunto, o ' + DEMODOC + ', entre os textos legais. É nele que ficam as condições completas, incluindo o que acontece com contas de demonstração e com torneios.',
      'Como o documento está em PDF e em inglês, vale baixá-lo antes de começar, para não descobrir uma regra de expiração no meio de um teste que você levou a sério.',
      F('Fonte: seção “modo simulado” de ' + OF + ' e o PDF ' + DEMODOC + ', lidos em 16/11/2026.'),
    ]],
    ['porque', 'Por que a demo vem antes de qualquer depósito', [
      'A ordem correta é simples e quase ninguém segue: conhecer a plataforma, depois decidir sobre dinheiro. A demo existe exatamente para isso, e é gratuita.',
      'Há um motivo prático além do óbvio. Operar envolve uma sequência de cliques sob pressão de tempo, e errar essa sequência custa dinheiro mesmo quando a análise estava certa. Confundir o campo de valor, escolher o prazo errado ou fechar a posição errada são erros de interface, não de mercado.',
      'A demo é onde esses erros devem acontecer. Cada um deles, cometido com saldo simulado, é uma lição gratuita; cometido com saldo real, é prejuízo sem contrapartida nenhuma.',
      'Há ainda um motivo que vale para esta corretora em particular. Como a Duotide declara não atender residentes do Brasil e não ser autorizada pela CVM, usar a demo permite conhecer o produto sem expor valor enquanto você decide se quer mesmo seguir, como discutimos em [[duotide-e-confiavel|a Duotide é confiável?]].',
    ]],
    ['testar', 'O que testar na demo, em ordem', [
      'Uma demo usada sem roteiro vira passatempo. Com roteiro, ela responde perguntas caras de graça. Sugerimos esta ordem.',
      'Primeiro, encontre as três telas que importam: o histórico de operações, o extrato de saldo e a área de saque. Se você não consegue chegar às três sem ajuda, ainda não conhece a plataforma.',
      'Segundo, descubra quais ativos existem de fato. A página oficial nomeia quatro moedas digitais, mas a lista completa só aparece dentro do sistema, como explicamos em [[duotide-ativos-disponiveis|ativos disponíveis na Duotide]].',
      'Terceiro, confirme o valor mínimo por operação e os prazos disponíveis. Esses números não estão publicados na página e definem quantas operações cabem num depósito pequeno.',
      'Quarto, teste a execução: abra e feche posições e observe se o preço executado é o que estava na tela. A ' + EXEC + ' descreve como isso deveria funcionar.',
    ]],
    ['limites', 'O que a demo NÃO consegue provar', [
      'Esta é a parte que a maioria das páginas sobre conta demo não escreve, e é a mais importante delas.',
      'A demo não prova que o saque funciona. Nenhum teste com saldo simulado diz se a empresa paga, em quanto tempo e com qual taxa. Essa pergunta só se responde com dinheiro real e um pedido real, como detalhamos em [[duotide-como-sacar-dinheiro|como sacar da Duotide]].',
      'A demo também não reproduz a pressão psicológica. Perder saldo simulado não dói, e por isso quase todo mundo opera na demo com uma disciplina que não sustenta depois. Resultado bom em demo não é previsão de resultado bom com dinheiro de verdade.',
      'Por fim, a demo não garante as mesmas condições de execução da conta real. Em ambiente simulado, a ordem é preenchida por um sistema que não disputa liquidez com ninguém. O PDF de ' + RISCO + ' da própria Duotide lembra que o produto é complexo e alavancado, e que o preço depende de fatores que a demo não enfrenta.',
    ]],
    ['torneios', 'Torneios: a demo com outro nome', [
      'O documento da Duotide trata, no mesmo arquivo, de contas de demonstração e de torneios. É um indício de que a empresa opera competições entre traders, prática comum no setor de opções binárias.',
      'Na página que lemos em 16/11/2026, não havia uma seção de torneios ativa, com regras, calendário ou premiação. Por isso este guia não descreve nenhum torneio específico: seria inventar.',
      'O que vale registrar é a cautela geral. Torneio costuma estimular volume de operações e tomada de risco maior do que a pessoa faria sozinha, porque a mecânica premia quem arrisca mais. Quem entra num torneio deve ler as regras no documento oficial antes, principalmente a parte sobre como o prêmio é creditado e se ele pode ser sacado.',
      'Se a premiação vier como saldo sujeito a condições de volume, ela se parece mais com um bônus do que com dinheiro, e o efeito sobre o saque é o mesmo descrito em [[duotide-deposito-minimo|depósito mínimo da Duotide]].',
    ]],
    ['passagem', 'A passagem da demo para a conta real', [
      'Quando a demo tiver respondido às perguntas do roteiro, e só então, faz sentido considerar a conta real. A passagem não deveria ser automática nem imediata.',
      'Antes dela, três coisas precisam estar prontas. A verificação de identidade deve estar concluída, para que nada trave no saque. Os PDFs de taxas e de retirada devem ter sido lidos. E o valor que você está disposto a perder por inteiro deve estar definido em número, não em sensação.',
      'O primeiro depósito tem uma única função, e não é lucrar: é provar que o ciclo completo funciona, incluindo a devolução do dinheiro. Até que esse ciclo se feche, qualquer valor adicional é aposta sobre uma promessa não verificada.',
      'O caminho de cadastro e verificação está descrito em [[duotide-como-abrir-conta|como abrir conta na Duotide]].',
    ]],
    ['resumo', 'Resumo: use a demo, mas saiba o que ela mede', [
      'A conta demo da Duotide é gratuita, traz R$ 10.000 simulados e serve muito bem para uma coisa: aprender a plataforma sem custo. Use-a para isso, com roteiro, e ela terá valido o tempo.',
      'Não a use como prova de que a estratégia funciona, nem como prova de que a empresa paga. Essas duas perguntas vivem fora da demo, e a segunda é a mais importante de todas.',
      'E mantenha no horizonte o dado que organiza este site inteiro: a própria Duotide publica que não oferece os serviços a residentes do Brasil e que não é autorizada pela CVM. A demo não muda isso.',
    ]],
    ['armadilha', 'A armadilha psicológica da demo bem-sucedida', [
      'Vale dedicar um parágrafo a um efeito bem documentado, porque ele é o principal motivo pelo qual contas demo existem em praticamente todas as plataformas do setor.',
      'Operar com saldo simulado produz uma sequência de decisões sem consequência. Uma perda não tira nada de você, então a posição seguinte é aberta sem o peso que teria. O resultado é que quase todo mundo opera melhor na demo do que operaria de verdade, e atribui essa diferença à própria habilidade.',
      'A plataforma, por sua vez, apresenta esse resultado como prova de que você está pronto. A página oficial da Duotide descreve a demo como forma de “ganhar confiança”, e a palavra é precisa: o produto da demo é confiança, não competência comprovada.',
      'A maneira de usar a demo sem cair nisso é tratá-la como teste de interface, não como teste de estratégia. Anote o que você aprendeu sobre a plataforma, não quanto você “ganhou”. O número simulado não é informação sobre o futuro, e o PDF de ' + RISCO + ' da própria empresa afirma que o produto pode custar todo o capital de quem opera.',
    ]],
  ],
};

export const A6 = {
  slug: 'duotide-plataforma-e-aplicativo',
  titulo: 'Plataforma Duotide: navegador e programa de Windows',
  desc: 'A Duotide abre no navegador e tem um instalador de Windows. Não encontramos aplicativo na App Store nem no Google Play: veja o que existe e o que não existe.',
  h1: 'Plataforma e aplicativo da Duotide: o que existe de verdade',
  trilha: 'Plataforma e app',
  resposta: 'A plataforma da Duotide abre no navegador, em trade.duotide.com, e o botão “Download APP” do site oficial baixa um programa para Windows. Nas buscas que fizemos, não há aplicativo da Duotide na App Store nem no Google Play: no celular, o caminho é o navegador.',
  relacionadas: ['duotide-ativos-disponiveis', 'duotide-conta-demo', 'duotide-como-abrir-conta', 'duotide-atendimento-suporte'],
  secoes: [
    ['app', 'O botão “Download APP” não baixa um aplicativo de loja', [
      'Este é o achado mais concreto deste guia, e ele contraria o que o nome do botão sugere. No menu do site oficial existe um item chamado “Download APP”. Ao conferir para onde ele aponta, o endereço é <span class="quebra-tudo">updates.trade.duotide.com/api/v1/build/current/pkg/WinGL</span>.',
      'O sufixo “WinGL” e o caminho “pkg” indicam um pacote de instalação para <strong>Windows</strong>. Não é um link para a App Store da Apple nem para o Google Play. É o download de um programa de computador.',
      'A diferença é relevante por dois motivos. O primeiro é de expectativa: quem clica em “Download APP” no celular espera ser levado a uma loja, e não será. O segundo é de segurança: instalar um executável baixado fora de uma loja de aplicativos tem um perfil de risco diferente, porque não passa pela revisão da plataforma.',
      'Se você instalar, faça-o apenas a partir do endereço oficial e mantenha o antivírus ativo. E saiba que esse caminho não existe para macOS nem para Linux, pelo que a página mostra.',
      F('Fonte: item “Download APP” do menu de ' + OF + ', conferido em 16/11/2026.'),
    ]],
    ['celular', 'No celular, o caminho é o navegador', [
      'Procuramos a Duotide na App Store e no Google Play e não encontramos aplicativo oficial da corretora. Registramos isso como ausência observada, não como garantia definitiva: lojas variam por país e um aplicativo pode existir em uma região e não em outra.',
      'O que dá para afirmar é que a página oficial não oferece nenhum link para loja de aplicativos. Em um site que mostra selos de Pix, boleto e PicPay, a ausência de um botão de App Store ou Google Play é notável.',
      'Na prática, para quem usa celular, o acesso é pelo navegador, no endereço da plataforma. Isso funciona, mas tem implicações: não há notificação nativa, a sessão depende do navegador e a experiência de tela pequena costuma ser menos confortável do que a de um aplicativo feito para isso.',
      'Se alguém lhe enviar um “aplicativo da Duotide” por link de mensagem, fora de loja oficial, desconfie. Esse é um vetor comum de fraude em nome de corretoras, e a ausência de app oficial torna o golpe mais fácil.',
    ]],
    ['navegador', 'A plataforma no navegador', [
      'O endereço da plataforma é trade.duotide.com, o mesmo domínio onde ficam o cadastro e o login. Abrir no navegador tem a vantagem de não exigir instalação e de funcionar igual em qualquer sistema operacional.',
      'A página oficial descreve a experiência como simples e limpa, com dados em tempo real, e afirma no FAQ que a interface serve tanto a iniciantes quanto a traders experientes. São afirmações da empresa sobre si mesma, e a forma de verificá-las é abrir a conta de demonstração.',
      'O FAQ também promete que “seus pedidos são executados em tempo real, de forma rápida, confiável e sem fricções”. Como toda promessa de execução, ela se confere na prática, e o documento que descreve as regras é a ' + EXEC + '.',
      'O caminho para testar sem custo está em [[duotide-conta-demo|conta demo da Duotide]].',
      F('Fonte: FAQ e seções de recursos de ' + OF + ', lidos em 16/11/2026.'),
    ]],
    ['ferramentas', 'O que a página promete como recurso', [
      'A página oficial organiza os recursos em três blocos curtos. O primeiro, “Negociações instantâneas”, afirma execução em tempo real, rápida e sem fricções. O segundo, “Negocie com os maiores ativos”, fala em operar os principais ativos digitais, de Bitcoin a altcoins, numa única plataforma.',
      'O terceiro, “Experiência pensada para você”, descreve a plataforma como desenhada para acompanhar a jornada do usuário, com experiência intuitiva e personalizada.',
      'É preciso dizer o que esses blocos são: texto de marketing, curto e sem número. Não há, na página, especificação de latência, de tipos de ordem disponíveis, de ferramentas de gráfico, de indicadores ou de limites de posição. Nenhum desses dados aparece.',
      'Por isso este guia não lista “recursos da plataforma Duotide” como se fossem fatos verificados. O que existe de verificável está nos documentos legais, especialmente na ' + EXEC + ' e no ' + MARGEM + ', que tratam de execução e de alavancagem.',
    ]],
    ['alavancagem', 'Margem e alavancagem: leia antes de operar', [
      'A Duotide publica um documento chamado Margin Trading, o que indica que a plataforma oferece operações alavancadas. O PDF de ' + RISCO + ' confirma, descrevendo os produtos como CFDs e citando a ferramenta de multiplicador.',
      'O texto da própria empresa é explícito sobre o efeito: “negociar CFDs carrega alto nível de risco, já que a ferramenta de multiplicador (alavancagem) pode funcionar tanto a seu favor quanto contra você”. E acrescenta que, por isso, pode não ser adequado a todos os investidores, porque é possível perder todo o capital investido.',
      'Alavancagem é o mecanismo que transforma uma variação pequena de preço em ganho ou perda grande sobre o valor depositado. É também a razão pela qual uma conta pode ir a zero muito mais rápido do que a intuição sugere.',
      'Se você não consegue explicar, em voz alta, como a alavancagem afeta a sua posição, não está pronto para usá-la. O ' + MARGEM + ' é o documento a ler primeiro.',
    ]],
    ['seguranca', 'O que a página diz sobre segurança, e o que falta', [
      'No FAQ oficial, à pergunta “O Duotide é seguro?”, a resposta publicada é: “Com certeza. Utilizamos criptografia avançada, transações protegidas e seguimos padrões de segurança para garantir a proteção dos seus fundos e dados.”',
      'É a empresa falando dela mesma. Não há, na página, certificação nomeada, auditoria citada, relatório público nem descrição de segregação de contas de clientes. “Padrões de segurança” sem nome não é informação verificável.',
      'Vale separar dois tipos de segurança que a frase mistura. Segurança técnica é proteger a conexão e os dados, e criptografia serve a isso. Segurança do dinheiro é outra coisa: depende de regras contratuais, de onde o saldo fica guardado e de haver autoridade fiscalizando. Como a Duotide declara não ser autorizada pela CVM, essa segunda camada é a que fica exposta, como explicamos em [[duotide-e-confiavel|a Duotide é confiável?]].',
      'Sobre dados pessoais, o documento de referência é a ' + PRIV + ', entre os textos legais.',
    ]],
    ['pratico', 'Checklist prático de uso', [
      '<ol><li><strong>Prefira o navegador</strong> ao executável, se puder, e nunca instale nada fora do endereço oficial.</li><li><strong>Ative a autenticação em duas etapas</strong>, se a plataforma oferecer.</li><li><strong>Use senha exclusiva</strong>, que não exista em outro serviço.</li><li><strong>Desconfie de qualquer “app” enviado por mensagem</strong>, porque não há aplicativo oficial de loja.</li><li><strong>Confirme na demo</strong> onde ficam histórico, extrato e área de saque.</li></ol>',
      'Quando precisar de ajuda com qualquer um desses pontos, prefira o canal escrito e guarde o protocolo, como recomendamos em [[duotide-atendimento-suporte|atendimento e suporte da Duotide]].',
    ]],
    ['executavel', 'O que considerar antes de instalar o programa', [
      'Se você decidir usar o instalador de Windows, alguns cuidados reduzem bastante o risco, e eles valem para qualquer software financeiro baixado fora de uma loja oficial.',
      'Baixe apenas pelo link que está no site oficial, digitando o endereço você mesmo, e não por link recebido em mensagem, e-mail ou grupo. Confira que a barra do navegador mostra o domínio da Duotide antes de iniciar o download, e mantenha o antivírus ativo durante a instalação.',
      'Prefira instalar em um computador que você usa para tarefas comuns, não no mesmo aparelho onde ficam credenciais sensíveis de trabalho. E observe quais permissões o programa pede: um cliente de negociação precisa de acesso à internet, não ao resto do sistema.',
      'Quando tiver terminado o teste, se decidir não seguir, desinstale. Programa financeiro parado no computador continua recebendo atualizações automáticas de um servidor externo, e não há motivo para manter esse canal aberto se a conta não vai ser usada.',
      'Na dúvida, o navegador resolve tudo o que o programa resolve, e sem instalar nada. É o caminho que recomendamos para quem está apenas conhecendo a plataforma.',
    ]],
  ],
};

export const A7 = {
  slug: 'duotide-ativos-disponiveis',
  titulo: 'Ativos da Duotide: BTC, ETH, SOL, USDT e binárias',
  desc: 'O FAQ da Duotide nomeia quatro moedas digitais e cita pares de opções binárias. Veja o que está publicado, a divergência com o PDF de risco e o que falta.',
  h1: 'Ativos disponíveis na Duotide: o que a página realmente nomeia',
  trilha: 'Ativos',
  resposta: 'O FAQ oficial cita suporte às principais moedas digitais, nomeando BTC, ETH, SOL e USDT, e diversos pares no mercado de opções binárias. A página não publica a lista completa nem o número total de ativos, que só aparecem dentro da plataforma depois do cadastro.',
  relacionadas: ['duotide-plataforma-e-aplicativo', 'duotide-conta-demo', 'duotide-deposito-minimo', 'duotide-e-confiavel'],
  secoes: [
    ['nomeados', 'Os quatro ativos que a página nomeia', [
      'A resposta está no FAQ oficial, à pergunta “Quais ativos posso negociar na Duotide?”. O texto publicado é: “Oferecemos suporte às principais moedas digitais (como BTC, ETH, SOL, USDT) e diversos pares de negociação no mercado de opções binárias.”',
      'São quatro siglas: <strong>BTC</strong>, de Bitcoin; <strong>ETH</strong>, de Ethereum; <strong>SOL</strong>, de Solana; e <strong>USDT</strong>, de Tether, que é uma stablecoin atrelada ao dólar. A palavra “como” antes da lista indica que são exemplos, não a lista inteira.',
      'Fora essas quatro, a página inicial não nomeia nenhum outro ativo. Não há lista de pares de moedas tradicionais, não há ações, não há índices, não há commodities e não há metais citados em lugar nenhum do site que lemos.',
      'Este guia poderia preencher esse vazio com uma lista plausível, como fazem muitas páginas sobre corretoras. Não vai fazer isso. O que não está publicado fica registrado como não publicado.',
      F('Fonte: FAQ de ' + OF + ', lido em 16/11/2026.'),
    ]],
    ['quantos', 'Quantos ativos existem? A página não diz', [
      'É comum que corretoras anunciem um número grande de ativos logo na primeira tela, porque é um argumento de venda fácil. A Duotide não faz isso: não há, na página oficial, nenhuma contagem de ativos.',
      'Registramos uma armadilha que encontramos ao conferir esses dados, porque ela vale como aviso para qualquer leitor. O código da página contém vários percentuais, como 93% e 75%, que à primeira vista pareciam taxas de retorno. Ao verificar o contexto, eram valores de folha de estilo e de configuração do site, sem nenhuma relação com pagamento de operações.',
      'Por isso, nenhum percentual de retorno aparece neste site. Se você encontrar uma página que anuncia “payout de 93% na Duotide”, desconfie da origem do número e peça a fonte.',
      'A lista real de ativos, com os prazos e os valores mínimos de cada um, aparece dentro da plataforma. Dá para vê-la sem depositar, usando o saldo simulado descrito em [[duotide-conta-demo|conta demo da Duotide]].',
    ]],
    ['divergencia', 'A divergência: opções binárias ou CFDs?', [
      'Há uma inconsistência dentro do material da própria Duotide que afeta diretamente o que você estaria negociando.',
      'No FAQ do site, a empresa se descreve como “uma plataforma de trading de nova geração, focada em opções binárias e ativos digitais”. Já o PDF de ' + RISCO + ' abre descrevendo “os produtos financeiros oferecidos pela empresa, incluindo Contratos por Diferença (CFDs)”, e trata deles ao longo de todo o documento, inclusive da alavancagem.',
      'Não são a mesma coisa. Numa opção binária, aposta-se na direção do preço num prazo fixo, com resultado tudo ou nada. Num CFD, negocia-se a diferença de preço com posição aberta, normalmente alavancada, e a perda pode crescer enquanto a posição estiver aberta.',
      'A diferença muda o risco, muda a matemática e muda as regras aplicáveis. Antes de abrir conta, confirme com o suporte, por escrito, qual instrumento você estará contratando. É uma pergunta de uma linha, e a resposta deve ser guardada.',
      F('Fonte: FAQ de ' + OF + ' e o PDF de ' + RISCO + ', lidos em 16/11/2026.'),
    ]],
    ['cripto', 'O que significa ser uma plataforma de cripto', [
      'Os quatro ativos nomeados são todos criptomoedas, o que posiciona a Duotide como plataforma voltada a ativos digitais, e não a um catálogo amplo de mercados.',
      'Isso tem consequências práticas. Cripto negocia em horário contínuo, inclusive fins de semana, o que muda a rotina de quem opera. A volatilidade costuma ser maior do que a de moedas tradicionais, o que aumenta tanto a oscilação favorável quanto a contrária.',
      'Vale também notar que USDT, uma das quatro citadas, é uma stablecoin: o preço dela é desenhado para acompanhar o dólar. O papel dela numa plataforma costuma ser servir de par ou de reserva de valor, não de ativo volátil para especulação direcional.',
      'Se o seu interesse é ação, índice ou commodity, a Duotide não publica nada que indique esses mercados. Procure confirmação antes de abrir conta esperando encontrá-los.',
    ]],
    ['execucao', 'Como o preço chega até você', [
      'Para qualquer ativo, duas coisas importam tanto quanto o ativo em si: qual preço é usado e como a ordem é executada. A Duotide publica uma ' + EXEC + ', e é esse o documento que responde.',
      'As perguntas a levar são objetivas. De onde vem a cotação usada na plataforma? Existe spread entre compra e venda, e qual? A ordem pode ser executada a um preço diferente do que estava na tela, e em que circunstâncias? O que acontece em momento de alta volatilidade ou de interrupção de mercado?',
      'Essas respostas definem o custo invisível de operar. Duas plataformas com o mesmo ativo e o mesmo valor mínimo podem entregar resultados bem diferentes só por causa de spread e de regra de execução.',
      'Nada disso está na página inicial. Está no PDF, e vale a leitura antes do primeiro depósito, como também recomendamos em [[duotide-deposito-minimo|depósito mínimo da Duotide]].',
    ]],
    ['conferir', 'Como conferir a lista você mesmo', [
      'Não é preciso acreditar neste guia nem na página oficial. Dá para verificar sozinho, sem gastar nada, em quatro passos.',
      'Primeiro, abra a conta e ative o saldo simulado, seguindo [[duotide-como-abrir-conta|o passo a passo de cadastro]]. Segundo, dentro da plataforma, abra a lista de ativos e anote quantos existem de fato, por categoria.',
      'Terceiro, para cada ativo que lhe interessa, anote o valor mínimo por operação e os prazos disponíveis. Esses números não estão publicados em lugar nenhum do site e são os que determinam se o seu plano cabe no valor que você pretende depositar.',
      'Quarto, compare o que você viu com o que a página promete. Se houver diferença relevante, essa diferença é informação valiosa sobre a empresa, e vale mais do que qualquer resenha.',
    ]],
    ['resumo', 'Resumo do que está publicado', [
      'A Duotide nomeia quatro moedas digitais, BTC, ETH, SOL e USDT, e cita diversos pares de opções binárias. Não publica a lista completa, não publica o número total de ativos, não publica percentual de retorno e não publica valor mínimo por operação.',
      'Além disso, descreve o produto de duas maneiras diferentes em dois documentos próprios, o que é motivo suficiente para perguntar antes de contratar.',
      'E permanece válido o contexto que organiza todas as páginas deste site: a própria Duotide publica que não oferece os serviços a residentes do Brasil e que não é autorizada pela CVM.',
    ]],
    ['horario', 'Horário, fim de semana e o que isso muda na rotina', [
      'Como os ativos nomeados são criptomoedas, há uma diferença de rotina que raramente é explicada e que afeta bastante quem está começando.',
      'Mercados tradicionais têm abertura e fechamento. Isso cria pausas naturais, momentos em que não há o que fazer e a posição simplesmente não existe. O mercado de criptomoedas não tem essas pausas: ele opera de forma contínua, inclusive à noite, no fim de semana e em feriado.',
      'A consequência prática é que a disciplina precisa vir de você, porque não virá do calendário. Sem um horário definido para operar e outro para parar, a atividade tende a invadir o dia inteiro, e decisões tomadas de madrugada raramente são as melhores.',
      'Há também um efeito sobre posições abertas. Num mercado que não fecha, uma posição deixada de um dia para o outro continua se movendo enquanto você dorme, e o movimento pode ser grande. Se o instrumento for alavancado, como descreve o PDF de ' + RISCO + ', esse movimento é multiplicado.',
      'Defina, antes de começar, dois horários: quando você opera e quando você não abre a plataforma. É a regra mais simples deste site e uma das poucas que não depende de informação que a corretora não publica.',
    ]],
  ],
};

export const A8 = {
  slug: 'duotide-atendimento-suporte',
  titulo: 'Suporte da Duotide: canais, e-mail e o que pedir',
  desc: 'A Duotide anuncia suporte 24 horas por dia, 7 dias por semana, por chat, e-mail e plataforma. Veja os canais publicados e as perguntas que valem por escrito.',
  h1: 'Atendimento e suporte da Duotide: canais e o que pedir por escrito',
  trilha: 'Atendimento',
  resposta: 'O FAQ oficial anuncia um time disponível 24 horas por dia, 7 dias por semana, por chat ao vivo, e-mail e dentro da própria plataforma. O endereço publicado é support@duotide.com, e tudo o que envolve dinheiro deve ser tratado por escrito, com protocolo guardado.',
  relacionadas: ['duotide-e-confiavel', 'duotide-como-sacar-dinheiro', 'duotide-como-abrir-conta', 'duotide-deposito-minimo'],
  secoes: [
    ['canais', 'Os canais que a Duotide publica', [
      'A informação aparece no FAQ oficial, à pergunta “Como entro em contato com o suporte?”. A resposta publicada é: “Nosso time está disponível 24h por dia, 7 dias por semana. É só chamar no chat ao vivo, por e-mail ou dentro da própria plataforma.”',
      'São, portanto, três canais anunciados: chat ao vivo, e-mail e atendimento interno. O endereço de e-mail publicado no rodapé do site é <span class="quebra-tudo">support@duotide.com</span>, e há também um link de contato no menu de rodapé.',
      'O site mostra ainda um link para o Instagram da marca. Rede social não é canal de atendimento, e assunto de conta ou de dinheiro não deve ser tratado por mensagem direta em rede nenhuma, por um motivo simples: é o lugar onde perfis falsos se passam por suporte.',
      'Não encontramos, nas páginas que lemos, telefone de atendimento, endereço de escritório no Brasil nem canal em português identificado como tal.',
      F('Fonte: FAQ e rodapé de ' + OF + ', lidos em 16/11/2026.'),
    ]],
    ['escrito', 'Por que tudo que envolve dinheiro vai por escrito', [
      'Chat ao vivo é confortável e costuma ser rápido. Ele tem um defeito grave para o que importa: muitas vezes não deixa registro acessível depois, e uma janela fechada leva junto a conversa inteira.',
      'A regra prática é simples. Dúvida operacional pode ir pelo chat. Qualquer assunto que envolva dinheiro, prazo, taxa, recusa de saque ou promessa de solução vai por e-mail, ou é levado do chat para o e-mail no fim da conversa.',
      'Uma técnica que funciona bem: ao terminar um chat, envie um e-mail resumindo o que foi combinado e peça confirmação. Isso transforma uma conversa volátil em documento, e o custo é de dois minutos.',
      'Esse cuidado vale em qualquer corretora, e vale mais ainda aqui. Como a Duotide declara não ser autorizada pela CVM e não atender residentes do Brasil, o caminho local de reclamação pode não existir, e o seu registro escrito passa a ser a sua principal prova. O contexto completo está em [[duotide-e-confiavel|a Duotide é confiável?]].',
    ]],
    ['perguntas', 'As seis perguntas que valem um e-mail', [
      'Antes de depositar, vale enviar um único e-mail com perguntas objetivas. A qualidade e a velocidade da resposta dizem mais sobre a empresa do que qualquer página institucional.',
      '<ol><li><strong>Qual órgão regulador</strong> autoriza a operação, qual o número da autorização e onde ela pode ser consultada?</li><li><strong>Qual instrumento eu contrato</strong>: opção binária ou CFD? Os documentos da empresa descrevem os dois.</li><li><strong>Qual o valor mínimo de saque</strong>, o prazo em dias úteis e a taxa aplicada?</li><li><strong>O saque precisa voltar</strong> pelo mesmo método do depósito?</li><li><strong>Existe taxa de inatividade</strong>, e a partir de quantos dias sem operar?</li><li><strong>Residindo no Brasil</strong>, posso abrir conta, considerando o aviso publicado no rodapé do site?</li></ol>',
      'A sexta é a mais desconfortável e a mais importante. Faça-a assim mesmo, e guarde a resposta. Ela define se você está operando dentro ou fora do que a própria empresa declara oferecer.',
    ]],
    ['protocolo', 'Como registrar cada contato', [
      'Mantenha uma pasta, digital mesmo, com um arquivo por contato. Em cada um, anote cinco campos: data e hora, canal usado, nome ou identificação do atendente, número de protocolo e resumo do que foi dito.',
      'Guarde também captura de tela das telas que importam: o pedido de saque com número e data, o extrato no dia do pedido, qualquer mensagem que prometa prazo e a tela de confirmação de cada depósito.',
      'Esse material parece exagero até o dia em que é necessário. Quando for, ele é a diferença entre “eu me lembro que disseram” e um registro com data, hora e protocolo.',
      'A ordem de prioridade dos documentos está no guia de [[duotide-como-sacar-dinheiro|como sacar da Duotide]], que é onde esse acervo costuma ser usado.',
    ]],
    ['prazos', 'O que esperar de um suporte 24/7', [
      '“24 horas por dia, 7 dias por semana” é uma promessa de disponibilidade, não de resolução. São coisas diferentes, e vale manter a distinção clara.',
      'Disponibilidade significa que alguém responde a qualquer hora. Resolução significa que o problema é resolvido, e isso costuma depender de equipes que trabalham em horário comercial de outro fuso, e de processos de pagamento que seguem dias úteis bancários.',
      'Na prática, uma resposta imediata às três da manhã pode ser apenas a confirmação de que o pedido foi recebido. O prazo real de solução continua sendo o das etapas internas.',
      'Meça isso você mesmo, cedo. Abra um chamado simples na primeira semana e registre dois números: quanto tempo até a primeira resposta e quanto tempo até a solução. Esses dois números valem mais do que a frase da página.',
    ]],
    ['sinais', 'Sinais de alerta no atendimento', [
      'Alguns comportamentos merecem atenção redobrada, em qualquer corretora. O primeiro é a resposta evasiva a pergunta objetiva: se você pergunta o número da licença e recebe um texto sobre segurança e tecnologia, a pergunta não foi respondida.',
      'O segundo é o incentivo a depositar mais como solução para um problema. Pedido de saque travado não se resolve com depósito novo, e qualquer orientação nesse sentido deve acender o alerta.',
      'O terceiro é a oferta de bônus no momento em que você fala em sacar. Bônus costuma trazer exigência de volume e pode prender exatamente o saldo que você estava tentando retirar.',
      'O quarto é o contato por canal informal, como mensagem direta em rede social ou aplicativo de mensagem, feito por alguém que diz ser do suporte. Confirme sempre pelo e-mail oficial publicado no site antes de seguir qualquer instrução.',
    ]],
    ['antes', 'Antes de escrever, tenha isto à mão', [
      'Um chamado bem montado economiza dias. Antes de enviar, reúna: o e-mail cadastrado na conta, o número do pedido quando houver, a data e o valor da operação em questão, o método de pagamento usado e capturas de tela do que você está relatando.',
      'Escreva em frases curtas, uma pergunta por parágrafo, e numere as perguntas. Suporte que recebe um texto longo e sem estrutura responde ao que for mais fácil e ignora o resto.',
      'Termine sempre pedindo o número de protocolo e a previsão de resposta. São dois dados pequenos que transformam o chamado em algo que pode ser cobrado depois.',
      'Se for o seu primeiro contato, aproveite para confirmar o estado da verificação de identidade da conta, como recomendamos em [[duotide-plataforma-e-aplicativo|plataforma e aplicativo da Duotide]].',
    ]],
    ['idioma', 'Em que idioma o suporte responde', [
      'Esta é uma pergunta prática que a página oficial não responde, e que vale resolver antes de precisar.',
      'O site institucional está em português, mas os doze documentos legais estão em inglês, e dois dos quatro depoimentos exibidos também. Isso sugere uma operação internacional com uma camada de tradução na vitrine, e não necessariamente uma equipe de atendimento em português.',
      'Não encontramos, nas páginas que lemos em 16/11/2026, nenhuma indicação explícita de atendimento em português, nem telefone brasileiro, nem endereço no país. O e-mail publicado é um só, support@duotide.com, sem variação por idioma.',
      'A recomendação é testar isso cedo e de graça: envie a primeira mensagem em português e veja o que volta. Se a resposta vier em inglês ou claramente traduzida por máquina, você já sabe em que idioma precisará tratar um assunto delicado no futuro, e pode se preparar.',
      'Num tema em que cada palavra do contrato importa, entender e ser entendido não é conforto, é parte do risco. E esse risco se soma ao contexto já descrito em [[duotide-e-confiavel|a Duotide é confiável?]]: sem autorização da CVM, não há canal brasileiro para onde recorrer se a comunicação falhar.',
    ]],
  ],
};
