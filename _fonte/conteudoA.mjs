// Paginas 1 a 4. Cada secao: [id, titulo, [blocos]]. Bloco que comeca com "<" e HTML pronto;
// o resto vira paragrafo. [[slug|texto]] vira link interno e e conferido pelo gerador.
// Todo fato citado foi lido em 16/11/2026 em duotide.com e nos PDFs legais da Duotide.
const F = (t) => `<p class="fonte">${t}</p>`;
const OF = '<a href="https://duotide.com/" rel="sponsored noopener" target="_blank">duotide.com</a>';
const D = (u, t) => `<a href="${u}" rel="nofollow noopener" target="_blank">${t}</a>`;
const RISCO = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urrjqakhdj8lo830/DuoTide%20Risk%20Disclosure.pdf', 'Divulgação de Risco');
const TAXAS = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urpmsj7rr6s5210g/DuoTide%20General%20Fees%20Policy.pdf', 'Taxas Gerais');
const SAQUE = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urpmsj7rr6s5211g/DuoTide%20Withdrawal%20Policy.pdf', 'Política de Retirada');
const AML = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urrjqakhdj8lo850/DuoTide%20AML%20and%20KYC.pdf', 'Política de AML e KYC');
const TERMOS = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urrjqakhdj8lo860/DuoTide%20General%20Terms%20and%20Conditions.pdf', 'Termos e Condições');
const DEMODOC = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urhmsj7rr6s520v0/DuoTide%20Demo%20and%20Tournament%20Account.pdf', 'Demo and Tournament Account');
const REEMB = D('https://fsms.trade.duotide.com/storage/public/cv/sg/urpmsj7rr6s52110/DuoTide%20Refund%20Policy.pdf', 'Política de Reembolso');

export const A1 = {
  slug: 'duotide-e-confiavel',
  titulo: 'A Duotide é confiável? O que a corretora publica',
  desc: 'A Duotide declara que não atende residentes do Brasil nem é autorizada pela CVM. Veja quem opera, os documentos legais e o que ela não publica.',
  h1: 'A Duotide é confiável? O que dá para verificar antes de depositar',
  trilha: 'A Duotide é confiável?',
  resposta: 'Esta é a resposta curta, e ela vem da própria empresa: a Duotide publica que não oferece os serviços a residentes do Brasil e que não é autorizada pela CVM. Ela identifica quem a opera e publica doze documentos legais, mas não cita nenhuma licença de regulador.',
  relacionadas: ['duotide-como-abrir-conta', 'duotide-deposito-minimo', 'duotide-como-sacar-dinheiro', 'duotide-atendimento-suporte'],
  secoes: [
    ['aviso', 'O aviso que a própria Duotide publica sobre o Brasil', [
      'Quase toda página que responde “a corretora X é confiável?” começa listando vantagens. Esta começa por um texto que a própria Duotide escreveu e deixou no rodapé do site dela, porque ele muda o peso de tudo o que vem depois.',
      'O texto diz, com estas palavras: “A Duotide e quaisquer de seus serviços não são destinados ou oferecidos a residentes do Brasil. A Duotide não anuncia seus serviços no Brasil ou para usuários residentes no Brasil e nenhum conteúdo neste website poderá ser interpretado desta forma. A Duotide não está autorizada pela Comissão de Valores Mobiliários do Brasil a ofertar publicamente ou intermediar ofertas de valores mobiliários no Brasil.”',
      'São duas afirmações diferentes no mesmo parágrafo. A primeira é comercial: a empresa declara que não dirige a oferta a quem mora aqui. A segunda é regulatória: ela declara que não tem autorização da CVM, autoridade do mercado de capitais brasileiro.',
      'Vale notar a tensão dessa página. O mesmo site que publica o aviso está escrito em português, mostra selos de Pix, boleto, TED e PicPay, e anuncia conta demo em reais. Registramos as duas coisas porque as duas estão lá, e quem decide é você.',
      F('Fonte: rodapé de ' + OF + ', lido em 16/11/2026.'),
    ]],
    ['quatro', 'Confiança é uma pergunta que se divide em quatro', [
      'Quando alguém pergunta se uma corretora é confiável, costuma querer saber uma de quatro coisas: se a empresa existe e tem endereço, se existe autoridade fiscalizando, se o dinheiro entra e sai como prometido e se alguém responde quando algo dá errado. Cada uma pede uma checagem diferente, e nenhuma se resolve com adjetivo.',
      'Este guia segue essa divisão, sem dar nota e sem substituir o seu teste. Uma ressalva vale para tudo o que vem a seguir: o texto descreve páginas lidas em 16 de novembro de 2026, e o que vale é o que estiver na tela da sua conta no dia do depósito.',
    ]],
    ['quem', 'Quem opera a Duotide, e onde', [
      'O rodapé oficial identifica a operadora: <strong>Sunset Horizon LLC</strong>, com endereço em Lighthouse Trust Nevis Ltd, Suite 1, A.L. Evelyn Ltd Building, Main Street, Charlestown, Nevis, e número de empresa <strong>L 22994</strong>. Nevis é uma ilha do Caribe, parte de São Cristóvão e Neves.',
      'As transações de pagamento ficam com outra empresa: a <strong>SUNSET HORIZON CY LTD</strong>, registro <strong>HE464961</strong>, com endereço em Koutsoventi 6, Agios Athanasios, 4101 Limassol, Chipre. Ou seja, quem opera a marca e quem movimenta o dinheiro são entidades distintas, em países distintos.',
      'Essa separação é comum no setor e não é, por si, sinal de problema. Ela tem uma consequência prática: uma disputa sobre a conta e uma disputa sobre um pagamento podem envolver empresas e jurisdições diferentes, nenhuma delas brasileira. Guarde os dois nomes junto dos comprovantes, porque é deles que uma reclamação precisa.',
      F('Fonte: rodapé de ' + OF + ', lido em 16/11/2026.'),
    ]],
    ['regulador', 'O que a página não diz: licença e regulador', [
      'Esta é a parte que mais pesa, e por isso vem sem rodeio: nas páginas públicas que lemos, a Duotide <strong>não cita nenhuma licença, registro ou órgão regulador</strong>. Não aparece autoridade brasileira nem estrangeira, e o único órgão nomeado é a CVM, justamente para dizer que a empresa não tem autorização dela.',
      'Isso não prova que não exista autorização em algum lugar. Prova que você não deve presumir que exista. A diferença importa: presumir é o que leva alguém a depositar achando que há uma autoridade cuidando do caso, quando talvez não haja nenhuma.',
      'O que dá para fazer é perguntar. Escreva ao suporte pedindo o nome do órgão que autoriza a operação, o número da autorização e onde ela pode ser consultada. Uma empresa autorizada responde isso em uma linha, e a demora já é informação. O guia de [[duotide-atendimento-suporte|atendimento e suporte]] mostra como abrir esse pedido.',
      F('Fonte: páginas públicas de ' + OF + ' e os documentos legais, lidos em 16/11/2026. Ausência de citação não prova ausência de autorização.'),
    ]],
    ['documentos', 'Os doze documentos legais que ela publica', [
      'A Duotide mantém um centro de documentos razoavelmente completo para o setor. Em 16/11/2026 havia doze arquivos: Termos e Condições Gerais, Privacidade, Cookies, Execução de Ordens, Taxas Gerais, AML e KYC, Contas Demo e de Torneio, Divulgação de Risco, Política de Retirada, Margin Trading, Reembolso e Pagamentos.',
      'Publicar os documentos é um bom sinal de transparência, porque é neles que ficam as regras que importam quando há disputa. Vale registrar a limitação honesta: todos estão em PDF e em inglês, o que reduz bastante a chance de serem lidos por um público brasileiro. Antes de depositar, abra três deles — a ' + SAQUE + ', as ' + TAXAS + ' e a ' + REEMB + ' —, que respondem às perguntas mais caras.',
      F('Fonte: centro de documentos legais da Duotide, em fsms.trade.duotide.com, lido em 16/11/2026.'),
    ]],
    ['divergencia', 'A empresa descreve o produto de dois jeitos', [
      'Há uma divergência dentro do material da própria Duotide que vale conhecer antes de qualquer coisa. No FAQ do site, ela se apresenta como “uma plataforma de trading de nova geração, focada em opções binárias e ativos digitais”.',
      'Já o PDF de ' + RISCO + ' descreve outra coisa: “os produtos financeiros oferecidos pela empresa, incluindo Contratos por Diferença (CFDs), são produtos financeiros complexos”, com alavancagem, e afirma que negociar CFDs “carrega alto nível de risco”. Opção binária e CFD não são o mesmo instrumento, e as regras de cada um mudam.',
      'Não vamos escolher uma das versões por você: as duas saíram da mesma empresa. Leia o documento de risco antes de abrir a conta e confirme com o suporte, por escrito, qual instrumento você contrata. Em [[duotide-ativos-disponiveis|ativos disponíveis]] detalhamos o que cada texto afirma.',
      F('Fonte: FAQ de ' + OF + ' e o PDF de ' + RISCO + ', lidos em 16/11/2026.'),
    ]],
    ['risco', 'O aviso de risco, nas palavras da própria Duotide', [
      'O rodapé da página inicial traz este texto: “As operações financeiras neste site podem envolver riscos. Usar as ferramentas e serviços aqui fornecidos pode levar a perdas financeiras, inclusive à perda total dos fundos da sua conta Duotide. Avalie os riscos e fale com um consultor financeiro independente antes de fazer qualquer negociação.”',
      'O PDF de risco é mais duro que o rodapé. Ele diz que negociar os instrumentos oferecidos “é muito especulativo e altamente arriscado” e que o produto não serve ao público em geral, apenas a quem puder assumir financeiramente a perda do valor inteiro investido. A perda de <strong>todos</strong> os fundos é descrita como possível pela própria empresa, e nenhuma ferramenta da plataforma elimina isso.',
    ]],
    ['depoimentos', 'Os depoimentos da página não são avaliação independente', [
      'A página oficial traz quatro depoimentos em carrossel, assinados por nomes como Leo Carter, Marcos Oliveira, Elena Reyes e Letícia Mello, todos rotulados apenas como “Trader”. Não há data, link de perfil nem qualquer forma de conferir que a pessoa existe. Dois dos quatro estão em inglês, num site escrito em português.',
      'Trate como material de marketing, que é o que é: seleção feita pela empresa, em página da empresa. Avaliação independente se procura fora, em relatos recentes de quem conseguiu sacar, que é o momento em que uma corretora se revela.',
    ]],
    ['checklist', 'Checklist antes do primeiro depósito', [
      '<ol><li><strong>Releia o aviso sobre o Brasil</strong> no rodapé do site oficial e decida se quer seguir sabendo dele.</li><li><strong>Escreva ao suporte</strong> perguntando sobre licença, regulador e qual instrumento você contrata, e guarde a resposta.</li><li><strong>Leia três PDFs</strong>: Política de Retirada, Taxas Gerais e Reembolso.</li><li><strong>Use a conta demo</strong> antes de qualquer valor real; veja [[duotide-conta-demo|como funciona a conta demo]].</li><li><strong>Comece pelo mínimo</strong> e trate o valor como perdido: [[duotide-deposito-minimo|o que o depósito mínimo significa na prática]].</li><li><strong>Teste o saque</strong> cedo, com valor pequeno.</li></ol>',
      'Quem faz esses seis passos troca a pergunta “a Duotide é confiável?” por outra, bem melhor: “o que a Duotide me provou até agora?”. Essa se responde com evidência, não com adjetivo.',
    ]],
    ['resumo', 'O resumo honesto', [
      'A Duotide publica quem a opera, onde fica, o registro das duas empresas, doze documentos legais e um aviso de risco claro. Em compensação, não publica licença nem regulador, deixa saque e taxas apenas nos PDFs, descreve o produto de duas formas diferentes e declara, por escrito, que não atende residentes do Brasil e não é autorizada pela CVM.',
      'A conclusão cautelosa é esta: quem entrar precisa aceitar o risco de perda total declarado pela empresa, entrar pelo menor valor possível e testar o saque cedo. Este site é de parceiro, independente, não é o site da Duotide e não recebe depósito.',
    ]],
  ],
};

export const A2 = {
  slug: 'duotide-como-abrir-conta',
  titulo: 'Como abrir conta na Duotide: passo a passo e avisos',
  desc: 'O cadastro da Duotide pede e-mail e senha, e a verificação vem depois. Veja o passo a passo, os documentos do KYC e o aviso sobre residentes do Brasil.',
  h1: 'Como abrir conta na Duotide, e o que conferir antes',
  trilha: 'Como abrir conta',
  resposta: 'O cadastro fica em trade.duotide.com e é curto: dados de contato, senha e aceite dos termos. A verificação de identidade vem depois, descrita na política de AML e KYC. Antes disso, pese o aviso do próprio site de que o serviço não é oferecido a residentes do Brasil.',
  relacionadas: ['duotide-e-confiavel', 'duotide-conta-demo', 'duotide-deposito-minimo', 'duotide-plataforma-e-aplicativo'],
  secoes: [
    ['antes', 'O que decidir antes de clicar em “Comece agora”', [
      'O botão principal do site oficial chama-se “COMECE AGORA” e leva ao endereço de cadastro em trade.duotide.com. Abrir conta leva poucos minutos. A parte que leva tempo, e que quase ninguém faz, é a que vem antes.',
      'Antes de criar a conta, há uma informação que a própria Duotide publica e que deveria entrar na decisão: no rodapé do site oficial, ela afirma que seus serviços não são destinados nem oferecidos a residentes do Brasil, e que não é autorizada pela Comissão de Valores Mobiliários a ofertar ou intermediar valores mobiliários no país.',
      'Isso não é detalhe burocrático. Significa que, se algo der errado, o caminho brasileiro de reclamação provavelmente não estará disponível, porque não há autorização local que o sustente. A leitura completa está em [[duotide-e-confiavel|a Duotide é confiável?]].',
      'A segunda decisão é sobre o valor. O documento de risco da própria empresa diz que o produto só serve a quem pode assumir a perda integral do que investiu. Defina esse número antes de abrir a conta, não depois de ver a tela de depósito.',
      F('Fonte: rodapé e botões de ' + OF + ', lidos em 16/11/2026.'),
    ]],
    ['passos', 'O cadastro, etapa por etapa', [
      'O fluxo que a Duotide descreve é curto. Primeiro, você abre o endereço de cadastro, que é uma página da plataforma, não do site institucional. Depois informa os dados de contato e cria uma senha. Em seguida aceita os termos e a política de privacidade. Por fim, confirma o acesso e cai na plataforma.',
      'A página oficial não publica a lista exata de campos do formulário, e este guia não vai inventá-la. O que dá para afirmar, a partir do FAQ, é que o cadastro foi desenhado para ser rápido, e que a plataforma oferece tanto a conta de demonstração quanto a real.',
      'Um cuidado vale para qualquer corretora: use um e-mail que você controla de verdade e uma senha exclusiva, que não exista em nenhum outro serviço. A recuperação da conta e todo o contato com o suporte vão depender desse e-mail.',
      'Depois de entrar, resista ao impulso de depositar na mesma sessão. O caminho que faz sentido é conhecer a plataforma primeiro, com o saldo simulado que a empresa oferece, como explicamos em [[duotide-conta-demo|conta demo da Duotide]].',
      F('Fonte: FAQ e botões de ' + OF + ', lidos em 16/11/2026.'),
    ]],
    ['kyc', 'A verificação de identidade vem depois', [
      'A Duotide publica uma ' + AML + ', que trata de prevenção à lavagem de dinheiro e de conhecimento do cliente. É o documento que descreve a verificação de identidade: quais documentos são aceitos, quando são exigidos e o que acontece se não forem entregues.',
      'Na prática do setor, esse tipo de verificação costuma pedir documento de identidade com foto e comprovante de endereço recente, e costuma ser acionada no momento do saque, não no do depósito. A Duotide não publica, na página inicial, o gatilho exato nem o prazo de análise.',
      'A ordem importa muito mais do que parece. Quando a verificação só é exigida na hora de sacar, o dinheiro já está depositado, e qualquer dificuldade de documentação acontece com o seu saldo lá dentro. É por isso que vale completar a verificação assim que possível, e não esperar.',
      'Se faltar algum documento, descubra isso no primeiro dia e não no dia em que quiser o dinheiro de volta. O guia de [[duotide-como-sacar-dinheiro|como sacar da Duotide]] explica por que esse teste precoce é a medida mais útil que existe.',
      F('Fonte: ' + AML + ', entre os documentos legais da Duotide.'),
    ]],
    ['termos', 'O que você aceita ao marcar a caixa', [
      'Marcar o aceite dos ' + TERMOS + ' é um ato jurídico, mesmo que leve um segundo. Esse documento, somado à Política de Execução de Ordens e à de Margin Trading, define como as ordens são executadas, o que acontece em caso de disputa e qual lei rege o contrato.',
      'Há um ponto que merece atenção especial em qualquer corretora de fora: a cláusula de foro e lei aplicável. Como a operadora está em Nevis e os pagamentos em Chipre, é razoável esperar que o contrato não seja regido pela lei brasileira. Confira isso no documento antes de aceitar.',
      'Também vale ler o que o contrato diz sobre encerramento de conta e sobre recusa de operações. São as cláusulas que costumam ser acionadas justamente nos momentos de conflito, e lê-las depois não ajuda em nada.',
      'Nada disso é motivo automático de alarme: é o padrão de contrato internacional. É motivo para saber onde você está pisando antes de pisar.',
    ]],
    ['idade', 'Idade, país e dados pessoais', [
      'Produtos financeiros alavancados são, por regra geral do setor e pelo próprio texto de risco da Duotide, destinados a maiores de 18 anos, com capacidade de assumir perdas. Este site trata o produto como para maiores de idade.',
      'Sobre o país de residência, vale repetir o que já está dito: a Duotide declara não oferecer os serviços a residentes do Brasil. Informar residência no Brasil num cadastro cujo site diz não atender o Brasil é uma contradição que merece ser resolvida com o suporte, por escrito, antes do depósito, e não depois.',
      'Quanto aos dados pessoais, a Política de Privacidade da Duotide é o documento que descreve o que é coletado, por quanto tempo e com quem é compartilhado. Como ela está em PDF e em inglês, reserve alguns minutos para lê-la com calma.',
      'Guarde cópia de tudo o que enviar: documento, comprovante, protocolo e data. É o material que sustenta qualquer pedido futuro.',
    ]],
    ['erros', 'Cinco erros comuns na abertura de conta', [
      '<ol><li><strong>Depositar na primeira sessão</strong>, antes de conhecer a plataforma e de ler a política de saque.</li><li><strong>Reaproveitar senha</strong> de outro serviço, o que transforma um vazamento alheio em problema seu.</li><li><strong>Pular a verificação</strong> e descobrir o que falta só na hora de sacar.</li><li><strong>Aceitar bônus</strong> sem ler as condições, que costumam travar o saldo até um volume de operações.</li><li><strong>Ignorar o aviso do Brasil</strong>, que é a linha mais importante do site oficial.</li></ol>',
      'Os cinco têm a mesma raiz: pressa. O setor inteiro é desenhado para que o cadastro seja rápido e a leitura, lenta. Inverter essa ordem é a vantagem que está ao alcance de qualquer pessoa.',
    ]],
    ['depois', 'O que fazer na primeira semana', [
      'Uma rotina simples separa quem testa de quem aposta. Na primeira semana, use apenas o saldo simulado e anote o que não entendeu. Procure, dentro da plataforma, onde ficam o histórico de operações, o extrato e a área de saque, e confirme que consegue chegar aos três sem ajuda.',
      'Ainda nessa semana, abra um pedido de suporte com uma pergunta objetiva — sobre licença, sobre prazo de saque, sobre qual instrumento é negociado — e meça o tempo de resposta e a qualidade dela. Isso é informação de verdade sobre a empresa, e custa apenas um e-mail. Veja em [[duotide-atendimento-suporte|atendimento e suporte]] o que perguntar.',
      'Só depois disso, se ainda fizer sentido, considere o menor valor real possível, e faça um saque de teste assim que ele estiver disponível. A plataforma em si está descrita em [[duotide-plataforma-e-aplicativo|plataforma e aplicativo]].',
      'Se em qualquer um desses passos a resposta não vier, ou vier evasiva, você terá descoberto algo importante antes de arriscar dinheiro. Esse é o objetivo.',
    ]],
  ],
};

export const A3 = {
  slug: 'duotide-deposito-minimo',
  titulo: 'Depósito mínimo da Duotide: U$ 10 e o que falta saber',
  desc: 'O FAQ da Duotide diz que dá para começar com U$ 10. Veja os meios de pagamento mostrados na página, as taxas que só estão no PDF e o que conferir antes.',
  h1: 'Depósito mínimo da Duotide: U$ 10, e o que a página não diz',
  trilha: 'Depósito mínimo',
  resposta: 'O FAQ oficial afirma que a Duotide foi criada para tornar as operações acessíveis começando com apenas U$ 10. A página mostra selos de Pix, boleto, TED e cartão, mas não publica tabela de taxas, limites por método nem valor mínimo por operação.',
  relacionadas: ['duotide-como-sacar-dinheiro', 'duotide-e-confiavel', 'duotide-como-abrir-conta', 'duotide-conta-demo'],
  secoes: [
    ['numero', 'O número publicado, e de onde ele vem', [
      'O valor aparece uma vez na página oficial, dentro da resposta à pergunta “O que é a Duotide?”. O texto diz que a plataforma foi criada “para tornar as operações mais rápidas, intuitivas e acessíveis — começando com apenas U$ 10”.',
      'Vale ler com atenção o que essa frase é e o que ela não é. Ela é uma afirmação de que dá para começar com dez dólares. Ela não é uma tabela de depósito mínimo por método de pagamento, que é o que normalmente varia: um boleto costuma ter mínimo diferente de um cartão, e um Pix, outro.',
      'A página também não publica valor mínimo por operação, que é número diferente do depósito mínimo. Em plataformas desse tipo, é comum existir um valor mínimo por negociação, e ele define quantas operações cabem dentro de um depósito pequeno. A Duotide não divulga o dela.',
      'Por isso a recomendação é a mesma de sempre: o número que vale é o que aparece na área de depósito da sua conta, no dia, para o método que você escolher. Trate os U$ 10 como ordem de grandeza, não como garantia.',
      F('Fonte: FAQ de ' + OF + ', lido em 16/11/2026.'),
    ]],
    ['dolar', 'U$ 10 em dólar, e o que isso faz com a conta', [
      'O valor é publicado em dólar, não em reais. Isso tem três consequências que aparecem no extrato e que muita gente só percebe depois.',
      'A primeira é o câmbio. Dez dólares viram um valor em reais que muda todo dia, e a cotação usada pela plataforma ou pelo meio de pagamento normalmente não é a cotação comercial que se vê no noticiário.',
      'A segunda é o custo do meio de pagamento. Cartão internacional costuma ter IOF e spread do emissor; carteiras digitais costumam ter taxa própria de conversão. Esses custos não são da corretora, mas saem do seu bolso e entram na conta antes mesmo da primeira operação.',
      'A terceira é o caminho de volta. Se você deposita em reais e o saldo é em dólar, o saque faz a conversão de novo, e a diferença entre as duas conversões é custo puro. Em depósito pequeno, esse custo pesa proporcionalmente mais. O guia de [[duotide-como-sacar-dinheiro|como sacar da Duotide]] trata disso.',
    ]],
    ['meios', 'Os meios de pagamento que a página mostra', [
      'A página oficial exibe uma fileira de selos de pagamento. Em 16/11/2026 eram oito: <strong>Pix</strong>, <strong>boleto</strong>, <strong>Boleto Rápido</strong>, <strong>TED</strong>, <strong>PicPay</strong>, <strong>Mastercard</strong>, <strong>AdvCash</strong> e <strong>Perfect Money</strong>. Seis dos oito são claramente voltados ao público brasileiro.',
      'É preciso dizer o que um selo é: uma imagem na página. Ele não informa limite mínimo, limite máximo, prazo de compensação, taxa nem se o método está realmente disponível para a sua conta hoje. Nada disso é publicado ao lado dos selos.',
      'Há também a tensão já registrada neste site: a presença de Pix, boleto e PicPay convive, na mesma página, com o aviso de que a Duotide não oferece seus serviços a residentes do Brasil. Registramos as duas coisas porque as duas estão publicadas.',
      'O lugar onde os métodos aparecem com números é a área de depósito, dentro da conta, depois do cadastro descrito em [[duotide-como-abrir-conta|como abrir conta na Duotide]].',
      F('Fonte: selos de pagamento exibidos em ' + OF + ', lidos em 16/11/2026.'),
    ]],
    ['taxas', 'Taxas: o que existe, e onde está', [
      'A página inicial não publica tabela de taxas. A Duotide mantém um documento chamado Taxas Gerais, em PDF, entre os textos legais, e é nele que ficam as respostas sobre custo.',
      'As perguntas que esse documento precisa responder são sempre as mesmas, e vale levá-las anotadas: existe taxa de depósito por método? Existe taxa de saque, fixa ou percentual? Qual o spread aplicado na conversão de moeda? Existe taxa de inatividade depois de quantos dias sem operar? Existe custo de rolagem ou de manutenção de posição?',
      'A taxa de inatividade merece destaque porque é a que surpreende mais gente. É comum, no setor, que uma conta parada passe a ser debitada depois de alguns meses, e que um saldo pequeno seja consumido sem que ninguém perceba. Se você pretende testar e deixar parado, essa é a linha a procurar.',
      'Leia o ' + TAXAS + ' antes do primeiro depósito, não depois. Ele é curto comparado ao que custa descobrir o conteúdo dele pela experiência.',
      F('Fonte: documento ' + TAXAS + ', entre os textos legais da Duotide.'),
    ]],
    ['bonus', 'Bônus e promoções: a letra miúda que trava o saque', [
      'A Duotide publica uma política de códigos promocionais entre seus documentos, o que indica que promoções existem. Este guia não vai descrever ofertas específicas, porque elas mudam e não estavam detalhadas na página que lemos.',
      'O que vale dizer é a regra geral do setor, que raramente falha: bônus de depósito costuma vir com exigência de volume negociado antes que o saldo possa ser sacado. Em alguns casos, aceitar um bônus impede o saque até que um múltiplo do valor seja movimentado em operações.',
      'Na prática, um bônus pode transformar dinheiro seu, que poderia voltar a qualquer momento, em saldo preso a uma meta. Quem só quer testar a plataforma com valor pequeno quase sempre está melhor recusando.',
      'Se decidir aceitar, leia antes a condição exata e guarde cópia dela. A pergunta a fazer ao [[duotide-atendimento-suporte|suporte da Duotide]] é simples: “aceitando este bônus, qual volume preciso negociar antes de poder sacar meu depósito?”.',
    ]],
    ['quanto', 'Quanto depositar, se decidir depositar', [
      'Existe um critério que não depende de opinião e que a própria Duotide sustenta. O PDF de ' + RISCO + ' afirma que o produto só é adequado a quem é capaz de assumir financeiramente a perda do valor total investido.',
      'Aplicado, esse critério vira uma pergunta objetiva: qual valor, se desaparecer inteiro amanhã, não muda nada na sua vida? Esse é o teto. Não é o valor que você “acha que vai dar certo”, nem o que caberia no cartão.',
      'A segunda regra é que o primeiro depósito não deve ser o maior que você pretende fazer. O primeiro depósito tem uma função: provar que o ciclo completo funciona, incluindo o saque. Até que esse ciclo se feche, qualquer valor adicional é aposta sobre uma promessa não verificada.',
      'Antes mesmo disso, vale lembrar que dá para conhecer a plataforma sem nenhum valor real, com o saldo simulado descrito em [[duotide-conta-demo|conta demo da Duotide]].',
    ]],
    ['checklist', 'O que conferir na tela antes de confirmar', [
      '<ol><li><strong>O valor em reais</strong> que será efetivamente debitado, e não só o valor em dólar.</li><li><strong>A taxa do método</strong> escolhido, se houver, somada à do seu banco ou cartão.</li><li><strong>O prazo de compensação</strong> informado para aquele método.</li><li><strong>Se há bônus</strong> marcado por padrão, e desmarcá-lo se não quiser.</li><li><strong>O estado da verificação</strong> da sua conta, para não descobrir pendência só no saque.</li></ol>',
      'Guarde o comprovante e o protocolo de cada depósito, com data e valor. Em qualquer discussão futura, o que vale é o registro, não a lembrança. E a leitura que organiza tudo isso está em [[duotide-e-confiavel|a Duotide é confiável?]].',
    ]],
    ['contexto', 'O depósito pequeno não é proteção suficiente', [
      'Existe uma ideia confortável que vale desmontar: a de que depositar pouco resolve o problema. Depositar U$ 10 limita a perda a dez dólares, e isso é verdade. Mas o valor pequeno não responde a nenhuma das perguntas que realmente importam.',
      'Ele não diz se o saque funciona, porque dez dólares podem ficar abaixo do mínimo de retirada que a Política de Retirada estabelece. Nesse caso, o dinheiro entra e não tem como sair, não por má-fé, mas por regra. É um cenário comum e totalmente previsível para quem leu o PDF antes.',
      'Por isso, o primeiro depósito precisa ser calibrado por uma conta diferente: ele deve ser o menor valor que ainda permita um saque válido. Se o mínimo de saque for maior que o mínimo de depósito, é o mínimo de saque que define o seu primeiro aporte.',
      'Essa é mais uma razão para ler a política antes, e não depois. O guia de [[duotide-como-sacar-dinheiro|como sacar da Duotide]] explica onde essa informação mora e o que fazer com ela. E vale lembrar o contexto maior, já registrado em [[duotide-como-abrir-conta|como abrir conta]]: a própria Duotide declara não oferecer os serviços a residentes do Brasil.',
    ]],
  ],
};

export const A4 = {
  slug: 'duotide-como-sacar-dinheiro',
  titulo: 'Como sacar dinheiro da Duotide: o que está publicado',
  desc: 'A Duotide não publica saque mínimo nem prazo na página: as regras estão na Política de Retirada, em PDF. Veja o que conferir e como fazer o saque de teste.',
  h1: 'Como sacar dinheiro da Duotide, e o que conferir antes',
  trilha: 'Como sacar',
  resposta: 'A página inicial da Duotide não explica o saque. As regras estão na Política de Retirada, publicada em PDF entre os documentos legais. Saque mínimo, prazo e lista de métodos não aparecem no site, e a medida mais útil é fazer um saque pequeno de teste cedo.',
  relacionadas: ['duotide-deposito-minimo', 'duotide-e-confiavel', 'duotide-atendimento-suporte', 'duotide-como-abrir-conta'],
  secoes: [
    ['silencio', 'O que a página oficial diz sobre saque: quase nada', [
      'Começamos pelo que não existe, porque é informação tão útil quanto o que existe. A página inicial da Duotide, lida em 16/11/2026, não publica valor mínimo de saque, não publica prazo em dias ou horas, não lista os métodos disponíveis para retirada e não informa se há taxa.',
      'Isso contrasta com a forma como o depósito é tratado. O valor de entrada aparece no FAQ, e os selos de pagamento ocupam uma faixa visível da página. A assimetria entre as duas pontas é comum no setor, e é justamente por isso que vale notá-la.',
      'As regras existem: elas estão na ' + SAQUE + ', entre os documentos legais, em PDF. Mas um PDF em inglês, fora do fluxo da página, não é o mesmo que um número publicado ao lado do botão.',
      'Para quem está decidindo, a leitura prática é esta: você vai precisar buscar ativamente a informação de saque, e ela não virá até você.',
      F('Fonte: ' + OF + ' e a ' + SAQUE + ', lidos em 16/11/2026.'),
    ]],
    ['politica', 'O que procurar na Política de Retirada', [
      'Abrir o PDF sem saber o que procurar é perder tempo. Leve esta lista de seis perguntas e procure a resposta de cada uma.',
      'Primeira: qual o valor mínimo de saque? Segunda: qual o prazo entre o pedido e o pagamento, e se esse prazo conta em dias úteis. Terceira: existe taxa de saque, e ela é fixa ou percentual? Quarta: o saque precisa voltar pelo mesmo método do depósito? Quinta: há limite de saques por período? Sexta: em que situações um saque pode ser recusado ou suspenso.',
      'A quarta pergunta costuma pegar as pessoas de surpresa. É regra comum, por exigências de prevenção à lavagem de dinheiro, que o dinheiro volte pelo mesmo caminho por onde entrou, e até o mesmo valor. Quem depositou por um método que não recebe não vai conseguir sacar por ele.',
      'A sexta é a mais importante de todas, porque descreve o cenário em que você mais vai precisar do documento. Leia essa parte com calma e guarde uma cópia do PDF na data em que aceitou os termos.',
      F('Fonte: ' + SAQUE + ' da Duotide.'),
    ]],
    ['kyc', 'A verificação costuma ser cobrada no saque', [
      'A Duotide publica uma ' + AML + ', que descreve a verificação de identidade do cliente. No setor, é no pedido de saque que essa verificação costuma ser acionada, mesmo quando o depósito foi aceito sem ela.',
      'A sequência típica é esta: a conta é aberta rapidamente, o depósito entra sem fricção, e a exigência de documento aparece quando o cliente pede o dinheiro de volta. Não há nada de ilegal nisso, mas o efeito prático é que qualquer problema de documentação acontece com o seu saldo já depositado.',
      'A proteção é simples e está ao seu alcance: complete a verificação no primeiro dia, antes de depositar qualquer valor. Se faltar um documento, você descobre com a conta vazia, e não com dinheiro dentro.',
      'O [[duotide-como-abrir-conta|guia de abertura de conta]] detalha esse ponto e explica por que a ordem dos passos importa tanto.',
    ]],
    ['teste', 'O saque de teste: a medida mais útil que existe', [
      'Se este guia inteiro fosse reduzido a uma recomendação, seria esta: faça um saque pequeno assim que tiver saldo disponível, antes de depositar qualquer valor maior.',
      'O motivo é que o saque é o único momento em que uma corretora prova o que promete. Depositar é fácil em todas elas, porque é do interesse delas que seja. A devolução do dinheiro é o teste real, e ele custa pouco para ser feito.',
      'Um saque de teste responde, de uma vez, a perguntas que nenhum texto responde: o pedido é aceito? Em quanto tempo o dinheiro chega? O valor que chega é o que foi pedido, ou veio descontado? A verificação estava mesmo completa? O suporte responde se algo travar?',
      'Anote a data e a hora do pedido e a data e a hora do recebimento. Esse número é seu, é verificado e vale mais do que qualquer promessa de “saques rápidos”.',
    ]],
    ['prazos', 'Por que o dinheiro demora, quando demora', [
      'Um saque passa por etapas, e cada uma tem seu próprio tempo. Primeiro, a corretora analisa e aprova o pedido. Depois, ela envia o pagamento ao processador. Em seguida, o processador executa. Por fim, o seu banco credita.',
      'No caso da Duotide, as transações de pagamento são geridas por uma empresa separada, a SUNSET HORIZON CY LTD, sediada em Chipre. Isso acrescenta uma camada: o dinheiro não sai direto da operadora para você.',
      'Prazos anunciados costumam cobrir apenas a primeira etapa, a da aprovação interna. O tempo total até o dinheiro aparecer na sua conta é sempre maior, e envolve dias úteis, fuso horário e eventuais feriados bancários de outro país.',
      'Por isso, ao medir o seu saque de teste, meça o ciclo inteiro, do pedido ao crédito. É esse número que você vai usar para planejar.',
    ]],
    ['travou', 'O que fazer se o saque não sair', [
      '<ol><li><strong>Confira o estado da verificação</strong> da conta e resolva qualquer pendência de documento.</li><li><strong>Confirme a regra do mesmo método</strong>: o saque pode precisar voltar pelo caminho do depósito.</li><li><strong>Verifique se há bônus ativo</strong> travando o saldo até um volume de operações.</li><li><strong>Abra um chamado por escrito</strong>, com número do pedido, data, valor e método, e guarde o protocolo.</li><li><strong>Releia a Política de Retirada</strong> na seção de recusa e suspensão.</li></ol>',
      'Prefira sempre o canal escrito ao chat que não gera registro. O guia de [[duotide-atendimento-suporte|atendimento e suporte]] explica o que pedir e como documentar o pedido.',
      'E lembre-se do contexto: a Duotide declara não ser autorizada pela CVM e não oferecer serviços a residentes do Brasil. Isso significa que o caminho de reclamação local pode não existir, o que torna o registro escrito ainda mais importante.',
    ]],
    ['antes', 'Checklist antes do primeiro saque', [
      'Reúna, numa pasta só, o comprovante de cada depósito, o extrato de operações, a cópia do PDF da Política de Retirada na versão que você aceitou, o protocolo de cada contato com o suporte e o registro da verificação concluída.',
      'Confira se os dados bancários ou da carteira estão exatamente iguais aos do titular da conta. Divergência de nome entre a conta da corretora e a conta de destino é uma das causas mais comuns de saque recusado, e é totalmente evitável.',
      'Peça o saque num dia útil, de manhã, e não na sexta à noite ou em véspera de feriado. Isso não muda a regra, mas encurta o relógio e facilita a leitura do que aconteceu.',
      'Por fim, não deposite mais nada até que o primeiro saque tenha sido concluído. A plataforma em si, descrita em [[duotide-plataforma-e-aplicativo|plataforma e aplicativo]], continua disponível para estudo enquanto você espera.',
    ]],
    ['bonus', 'Bônus, torneio e prêmio podem travar o saldo', [
      'Há uma categoria de saldo que não se comporta como dinheiro, e ela é a causa mais frequente de saque recusado em corretoras deste tipo: o saldo vindo de bônus, promoção ou premiação de torneio.',
      'A Duotide publica uma política de códigos promocionais e um documento sobre contas de demonstração e torneios, o que indica que as duas coisas existem na plataforma. Este guia não descreve ofertas específicas, porque elas mudam e não estavam detalhadas na página que lemos em 16/11/2026.',
      'A regra geral do setor, no entanto, raramente falha: valor concedido costuma vir atrelado a uma exigência de volume negociado antes de poder ser retirado, e essa exigência às vezes contamina também o depósito feito junto. O efeito prático é que dinheiro que poderia voltar a qualquer momento passa a depender de uma meta de operações.',
      'Antes de aceitar qualquer bônus, faça uma pergunta de uma linha ao suporte e guarde a resposta: “aceitando isto, qual volume preciso negociar antes de poder sacar o meu depósito?”. Se a resposta for vaga, recuse. Quem só quer testar a plataforma quase sempre está melhor sem promoção nenhuma, como também explicamos em [[duotide-deposito-minimo|depósito mínimo da Duotide]].',
    ]],
  ],
};
