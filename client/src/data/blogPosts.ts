export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: string;
  readTime: string;
  content: ContentBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "quanto-custa-video-institucional",
    title: "Quanto custa um vídeo institucional em 2026?",
    excerpt:
      "As variáveis que realmente definem o preço de um vídeo institucional, faixas de referência por tipo de produção e como pedir um orçamento que não vai mudar depois.",
    date: "2026-08-28",
    category: "Produção de Vídeo",
    readTime: "6 min de leitura",
    content: [
      {
        type: "p",
        text: "Essa é a primeira pergunta que quase todo cliente faz — e a resposta honesta é \"depende\". Não porque agência gosta de ser vaga, mas porque vídeo institucional não é um produto padronizado como uma embalagem ou uma peça gráfica. O preço varia de acordo com decisões que o próprio cliente toma ao longo do processo. Este guia existe pra você entender quais são essas decisões antes de pedir orçamentos, assim você compara propostas de forma justa e evita duas armadilhas comuns: pagar caro por algo simples, ou contratar barato e receber um vídeo que não representa a marca.",
      },
      { type: "h2", text: "O que realmente muda o preço" },
      {
        type: "list",
        items: [
          "Duração final do vídeo — 30 segundos custam menos que 3 minutos, mas não é uma conta linear: os primeiros 60 segundos concentram a maior parte do custo de roteiro e direção.",
          "Número de locações — cada endereço novo significa deslocamento de equipe, tempo de setup de luz e som, e geralmente um dia de gravação a mais.",
          "Elenco — usar apenas colaboradores da empresa custa menos do que contratar atores profissionais, mas nem sempre transmite a mesma naturalidade.",
          "Captação aérea — imagens de drone agregam produção, mas exigem piloto certificado pela ANAC e um dia de gravação dedicado quando o local exige autorização.",
          "Complexidade de edição — motion graphics, trilha sonora licenciada e correção de cor avançada aumentam o tempo de pós-produção.",
          "Prazo de entrega — pedidos urgentes (menos de 2 semanas) costumam ter um adicional, porque a equipe precisa reorganizar a agenda.",
        ],
      },
      { type: "h2", text: "Faixas de referência por tipo de produção" },
      {
        type: "p",
        text: "Os números abaixo são referências de mercado para produções em cidades do interior de São Paulo, com uma equipe pequena (1 a 3 pessoas) e um dia de captação. Eles servem para você ter uma régua ao conversar com fornecedores — o valor final sempre depende do escopo definido no briefing.",
      },
      {
        type: "list",
        items: [
          "Vídeo institucional simples (até 1 minuto, uma locação, sem elenco contratado): geralmente fica na faixa de entrada de produções profissionais.",
          "Vídeo institucional completo (1 a 3 minutos, múltiplas locações, depoimentos, trilha licenciada): investimento intermediário, é o formato mais comum para apresentação comercial.",
          "Vídeo institucional premium (com drone, elenco profissional, motion graphics e múltiplos dias de gravação): investimento mais alto, indicado para empresas que vão usar a peça por anos em várias frentes — site, feiras, apresentações a investidores.",
        ],
      },
      { type: "h2", text: "O que deve estar incluso em qualquer orçamento" },
      {
        type: "list",
        items: [
          "Reunião de briefing e roteiro aprovado antes da gravação",
          "Diária de captação com equipe e equipamento",
          "Edição com pelo menos uma rodada de ajustes",
          "Entrega em formato otimizado para os canais que você vai usar (site, Instagram, YouTube)",
        ],
      },
      {
        type: "quote",
        text: "Se uma proposta não menciona rodada de ajustes, pergunte antes de fechar — é a diferença entre receber o vídeo pronto ou pagar de novo por uma alteração.",
      },
      { type: "h2", text: "Como pedir um orçamento que não muda depois" },
      {
        type: "p",
        text: "O jeito mais rápido de estourar o orçamento é receber uma proposta genérica e só descobrir os detalhes durante a produção. Antes de pedir cotação, escreva em duas ou três frases: qual é o objetivo do vídeo (institucional pro site, captação de investidores, treinamento interno), onde ele vai ser usado, e se você já tem ideia de duração e locações. Com isso em mãos, qualquer produtora séria consegue te dar um valor fechado — não uma faixa que \"pode variar\".",
      },
      {
        type: "p",
        text: "Na WK Media, a gente sempre começa pelo briefing antes de falar em número. É mais rápido pra você e evita orçamento chutado. Se quiser, manda pra gente o que você tem em mente e devolvemos uma proposta fechada.",
      },
    ],
  },
  {
    slug: "como-escolher-agencia-marketing-sorocaba",
    title: "Agência de marketing digital em Sorocaba: como escolher a certa",
    excerpt:
      "Um roteiro prático para avaliar propostas de agências locais — o que perguntar, quais sinais indicam profissionalismo e quais são os principais motivos de contratos que dão errado.",
    date: "2026-09-04",
    category: "Estratégia",
    readTime: "7 min de leitura",
    content: [
      {
        type: "p",
        text: "Sorocaba tem um número crescente de agências e freelancers oferecendo marketing digital, e isso é bom — significa mais opção e preços mais competitivos. O problema é que também fica mais difícil comparar propostas que, na superfície, prometem praticamente a mesma coisa: \"aumentar suas vendas\", \"gerar mais leads\", \"crescer nas redes sociais\". Este guia é um roteiro prático para você separar quem realmente vai entregar resultado de quem só vende promessa.",
      },
      { type: "h2", text: "Peça para ver portfólio de verdade, não só prints bonitos" },
      {
        type: "p",
        text: "Qualquer agência consegue mostrar posts com design bonito. O que você precisa perguntar é: qual foi o resultado desse trabalho? Um post pode ter 10 mil curtidas e zero conversão em venda — ou 200 curtidas e ter sido responsável por 15 orçamentos fechados. Peça exemplos de clientes em setores parecidos com o seu, e pergunte diretamente qual métrica de negócio (não de vaidade) aquele trabalho moveu.",
      },
      { type: "h2", text: "Entenda quem realmente vai atender você" },
      {
        type: "p",
        text: "Muitas agências fazem a reunião de vendas com o sócio ou diretor, mas o dia a dia do seu projeto é conduzido por um estagiário ou por um freelancer terceirizado que você nunca vai conhecer. Não tem nada de errado nisso — mas você precisa saber com antecedência. Pergunte quem vai ser seu ponto de contato direto e com que frequência vocês vão se falar.",
      },
      { type: "h2", text: "Desconfie de contrato de fidelidade muito longo sem cláusula de saída" },
      {
        type: "p",
        text: "É normal agências pedirem um período mínimo de contrato — a estratégia de marketing leva tempo para mostrar resultado, e contratos muito curtos não fazem sentido para nenhum dos lados. O sinal de alerta é a ausência de uma cláusula de saída clara, ou multas desproporcionais caso você queira encerrar antes do prazo. Leia esse trecho do contrato com atenção antes de assinar.",
      },
      { type: "h2", text: "Pergunte como funciona o relatório de resultados" },
      {
        type: "list",
        items: [
          "Com que frequência você recebe relatório (semanal, quinzenal, mensal)?",
          "O relatório mostra métricas de negócio (leads, vendas, custo por aquisição) ou só métricas de vaidade (alcance, curtidas)?",
          "Você tem acesso direto às contas de anúncio e redes sociais, ou fica dependente da agência para qualquer dado?",
        ],
      },
      {
        type: "quote",
        text: "Se a agência hesitar em te dar acesso direto às suas próprias contas de anúncio, isso é um sinal de alerta sério.",
      },
      { type: "h2", text: "Serviço integrado x fragmentado" },
      {
        type: "p",
        text: "Empresas pequenas frequentemente contratam um freelancer pra rede social, outro pra tráfego pago, e mais um pra vídeo — cada um trabalhando sem saber o que o outro está fazendo. O resultado costuma ser comunicação desalinhada: a campanha de anúncio leva pra um site que não conversa com o vídeo institucional, que por sua vez não segue a mesma identidade visual das redes sociais. Uma agência que entende o negócio como um todo consegue alinhar essas frentes — e isso normalmente custa menos do que somar três fornecedores separados.",
      },
      { type: "h2", text: "As perguntas que você deveria fazer em toda reunião comercial" },
      {
        type: "list",
        items: [
          "Vocês já atenderam alguma empresa do meu setor? Como foi o resultado?",
          "Quem exatamente vai cuidar do meu projeto no dia a dia?",
          "Como vocês medem sucesso — e com que frequência eu vejo esse número?",
          "O que está incluso no valor mensal e o que é cobrado à parte?",
          "Qual é a cláusula de saída do contrato?",
        ],
      },
      {
        type: "p",
        text: "Se uma agência responde essas cinco perguntas com clareza e sem enrolação, é um bom sinal. Se a conversa fica vaga ou desvia pra outro assunto, vale desconfiar.",
      },
    ],
  },
  {
    slug: "video-ou-foto-onde-investir-primeiro",
    title: "Vídeo ou foto: onde investir primeiro com verba curta",
    excerpt:
      "Quando o orçamento não dá pra tudo de uma vez, esse é o critério prático pra decidir entre produção de vídeo e fotografia comercial primeiro — sem depender de achismo.",
    date: "2026-09-11",
    category: "Estratégia",
    readTime: "5 min de leitura",
    content: [
      {
        type: "p",
        text: "Essa dúvida aparece o tempo todo em reuniões de briefing: \"se eu só posso investir em uma coisa agora, é vídeo ou foto?\". Não existe resposta universal, mas existe um critério prático que resolve a maioria dos casos — e não tem a ver com gosto pessoal, tem a ver com onde o seu cliente toma a decisão de compra.",
      },
      { type: "h2", text: "Primeiro, identifique onde sua venda acontece" },
      {
        type: "p",
        text: "Se o seu cliente decide comprar depois de ver seu produto em detalhe — cardápio de restaurante, imóvel, peça de roupa, ambiente de um espaço — a fotografia comercial tende a gerar retorno mais rápido. Imagens de qualidade em alta resolução, bem iluminadas e com boa composição, resolvem a maior parte do trabalho de convencimento nesses casos.",
      },
      {
        type: "p",
        text: "Se a decisão de compra depende de confiança, explicação de processo ou de entender como um serviço funciona — consultoria, clínica, empresa B2B, curso — o vídeo costuma converter melhor, porque transmite autoridade e humaniza a marca de um jeito que foto sozinha não consegue.",
      },
      { type: "h2", text: "Um jeito rápido de decidir" },
      {
        type: "list",
        items: [
          "Seu produto é visualmente atrativo por si só (comida, ambiente, produto físico)? → comece pela fotografia.",
          "Seu serviço é intangível ou precisa de explicação (consultoria, saúde, tecnologia)? → comece pelo vídeo.",
          "Sua venda depende de confiança na equipe ou no fundador? → comece pelo vídeo.",
          "Você vai usar a peça principalmente no Instagram/feed, onde o consumo é rápido? → fotografia rende mais peças com o mesmo investimento.",
          "Você vai usar a peça principalmente no site ou em apresentação comercial? → vídeo costuma ter mais impacto nesses formatos.",
        ],
      },
      { type: "h2", text: "O erro mais comum: tentar fazer os dois pela metade" },
      {
        type: "p",
        text: "Quando a verba é curta, a tentação é dividir o investimento entre vídeo e foto — e o resultado costuma ser as duas peças abaixo do padrão que representaria bem a marca. Um ensaio fotográfico completo, bem feito, geralmente gera mais retorno do que um vídeo institucional apressado, e vice-versa. Escolher uma frente e fazer com qualidade rende mais do que fazer as duas pela metade.",
      },
      {
        type: "quote",
        text: "Prioridade não é sobre o que é mais bonito — é sobre onde seu público toma a decisão de comprar.",
      },
      { type: "h2", text: "E quando o orçamento crescer" },
      {
        type: "p",
        text: "A boa notícia é que essa não é uma escolha permanente. A maioria dos nossos clientes começa com uma frente e, alguns meses depois, já está investindo na segunda — com a vantagem de já ter aprendido, com dados reais, o que funciona melhor pro negócio deles. Comece pela frente que resolve o seu momento atual, meça o resultado, e expanda a partir daí.",
      },
    ],
  },
  {
    slug: "filmagem-com-drone-rbac-100-o-que-checar",
    title: "Filmagem com drone para empresas: o que mudou com o RBAC 100 e o que checar antes de contratar",
    excerpt:
      "A ANAC trocou a regra que valia há quase uma década. Veja o que muda na prática pra quem contrata imagem aérea, o checklist de documentos que você deve exigir do fornecedor e quanto tempo a autorização de voo tira do seu cronograma.",
    date: "2026-09-22",
    category: "Produção de Vídeo",
    readTime: "7 min de leitura",
    content: [
      {
        type: "p",
        text: "Imagem aérea virou item quase obrigatório em vídeo institucional, lançamento imobiliário e registro de obra. O que muita empresa não sabe é que contratar drone não é como contratar um fotógrafo: existe aeronave, espaço aéreo e regra federal envolvida — e parte da responsabilidade respinga em quem contratou, não só em quem pilotou. Em junho de 2026 a ANAC publicou o RBAC 100, que substituiu o antigo RBAC-E 94, a norma que valia desde 2017. Se você vai contratar drone nos próximos meses, vale entender o que mudou antes de assinar.",
      },
      { type: "h2", text: "O que o RBAC 100 muda na prática" },
      {
        type: "list",
        items: [
          "Autorização de voo para todo tipo de operação — o pedido pelo SARPAS, sistema do DECEA, passa a ser exigido em qualquer voo, sem a antiga isenção por altura ou tipo de espaço aéreo.",
          "Operações divididas por categoria de risco — a categoria aberta cobre a maioria dos trabalhos de imagem (voo visual, até 120 metros, drone leve); voos acima de 25 kg, além do alcance visual ou acima de 120 metros caem na categoria específica, que exige avaliação de risco aprovada.",
          "Exame teórico da ANAC para piloto remoto — a comprovação começa a ser cobrada em fiscalização a partir de 1º de janeiro de 2027, então esse é o ponto que separa fornecedor preparado de fornecedor improvisado nos próximos meses.",
          "Cobertura de seguro por danos a terceiros exigida para operação não recreativa — ou seja, todo trabalho comercial.",
          "Cadastro da aeronave no SISANT continua obrigatório para drones acima de 250 gramas, com código de identificação vinculado ao operador.",
          "Equipamento com homologação da ANATEL — vale para o controle e para o enlace de vídeo, e é o item que mais passa despercebido em drone comprado fora do país.",
        ],
      },
      { type: "h2", text: "O checklist que você deve pedir antes de fechar" },
      {
        type: "p",
        text: "Você não precisa virar especialista em regulamentação aeronáutica. Precisa fazer quatro perguntas — e um fornecedor sério responde todas sem hesitar:",
      },
      {
        type: "list",
        items: [
          "Qual é o número de cadastro do drone no SISANT?",
          "Você vai solicitar autorização no SARPAS para a data e o endereço da gravação? Com quanto tempo de antecedência?",
          "A operação tem cobertura de seguro por danos a terceiros? Pode me enviar o comprovante?",
          "Quem vai pilotar tem o exame teórico da ANAC? (Ainda não é exigido em fiscalização, mas vira obrigatório em 2027 — e quem já fez está à frente.)",
        ],
      },
      {
        type: "quote",
        text: "Se o fornecedor responde \"relaxa, ninguém fiscaliza isso\", o problema não é a fiscalização. É que ele também vai relaxar no resto da produção.",
      },
      { type: "h2", text: "As limitações que afetam o seu roteiro" },
      {
        type: "p",
        text: "Algumas restrições mudam o que é possível gravar, e é melhor descobrir isso no briefing do que no dia da diária. Na categoria aberta, o voo acontece até 120 metros acima do solo, sempre dentro do alcance visual do piloto, e com distância horizontal mínima de 30 metros de pessoas que não fazem parte da operação. Na prática, isso significa que aquele plano descendo sobre a equipe reunida no pátio ou sobre o público de um evento exige planejamento: área isolada, pessoas cientes e posicionadas, ou enquadramento diferente.",
      },
      {
        type: "p",
        text: "Proximidade de aeroporto é outro ponto. Sorocaba tem aeroporto com movimento relevante, e boa parte da região metropolitana cai em áreas com restrição de altura ou necessidade de coordenação prévia. Não significa que não dá pra voar — significa que o pedido precisa sair com antecedência e que a altura disponível pode ser menor do que a máxima da regra.",
      },
      { type: "h2", text: "Quanto tempo a autorização tira do cronograma" },
      {
        type: "p",
        text: "Esse é o item que mais atrapalha quem deixa o drone pra decidir na última hora. O prazo de solicitação varia conforme o tipo de operação: voos simples em categoria aberta podem ser solicitados com cerca de 30 minutos de antecedência, mas aerolevantamento pede alguns dias corridos, e operações mais complexas pedem mais de uma semana. Somando a isso a necessidade eventual de coordenação por proximidade de aeroporto, o recado prático é simples: decida sobre o drone na reunião de briefing, não na véspera da gravação.",
      },
      { type: "h2", text: "Quando drone vale a pena — e quando é só custo extra" },
      {
        type: "list",
        items: [
          "Vale quando a escala é o argumento de venda: área construída, extensão de terreno, obra em andamento, planta industrial, evento grande.",
          "Vale quando o vídeo precisa situar o espectador geograficamente — condomínio, loteamento, fazenda, empreendimento.",
          "Não vale quando o vídeo é sobre pessoas, processo ou serviço em ambiente interno: dois planos aéreos genéricos no começo não salvam um roteiro fraco.",
          "Não vale quando exige um dia inteiro de diária para render cinco segundos de vídeo que ninguém vai lembrar.",
        ],
      },
      {
        type: "p",
        text: "O erro mais comum é tratar o aéreo como enfeite. Quando a imagem aérea entra com função — mostrar tamanho, mostrar contexto, mostrar transformação — ela justifica o custo com folga. Quando entra só porque \"ficou na moda\", é a primeira coisa que o cliente corta no orçamento seguinte.",
      },
      { type: "h2", text: "Resumo pra levar pra reunião" },
      {
        type: "p",
        text: "Drone regularizado tem cadastro, autorização, seguro e piloto preparado. Custa um pouco mais do que a oferta mais barata que você vai encontrar, e essa diferença é exatamente o que separa um contrato tranquilo de um problema com a sua marca envolvida. Decida no briefing, peça os documentos por escrito e trate o aéreo como parte do roteiro, não como cereja.",
      },
      {
        type: "p",
        text: "Na WK Media, a filmagem com drone entra no orçamento já com autorização e documentação inclusas — sem custo surpresa no meio da produção. Se quiser, manda o local e a data que a gente verifica antes se o voo é viável ali.",
      },
    ],
  },
  {
    slug: "busca-com-ia-o-que-muda-para-empresa-local",
    title: "Seu cliente perguntou pra IA, não pro Google: o que muda pra uma empresa local",
    excerpt:
      "A busca está migrando pra respostas geradas por IA, e isso já mexe no tráfego de quem depende do Google. O que os dados mostram até agora, o que continua valendo e o que fazer nos próximos meses sem cair em modismo.",
    date: "2026-09-24",
    category: "Tendências",
    readTime: "7 min de leitura",
    content: [
      {
        type: "p",
        text: "Até pouco tempo atrás, o caminho era sempre o mesmo: a pessoa pesquisava no Google, olhava os primeiros resultados, clicava em dois ou três sites e decidia. Hoje uma parte crescente desse percurso termina antes do clique — ou no resumo gerado por IA no topo da página de busca, ou direto dentro de um chatbot, onde a pessoa pergunta \"qual a melhor opção de X aqui perto\" e recebe uma recomendação pronta, com duas ou três marcas citadas. Se a sua empresa não está entre essas marcas, ela simplesmente não entrou na conversa.",
      },
      { type: "h2", text: "O que os dados já mostram" },
      {
        type: "p",
        text: "Não é previsão de futurologia — os números de 2025 e 2026 já desenham o cenário:",
      },
      {
        type: "list",
        items: [
          "Quando a página de resultados exibe um resumo gerado por IA, cerca de 8% dos usuários clicam em um link tradicional; sem o resumo, esse número é praticamente o dobro (Pew Research, 2025).",
          "Os resumos de IA do Google alcançam algo na casa de 2 bilhões de usuários por mês, em mais de 200 países (Google, 2025).",
          "O tráfego que chega aos sites vindo de ferramentas de IA cresceu em ritmo de três dígitos no último ano, ainda partindo de uma base pequena.",
          "Esse tráfego costuma ser mais qualificado: visitas mais longas, menos rejeição e taxa de conversão melhor do que a média da busca orgânica tradicional (Semrush e Adobe, 2025).",
        ],
      },
      {
        type: "p",
        text: "Junte as duas pontas e você tem o retrato real: menos cliques no total, mas cliques melhores. Quem lê esse cenário só pela queda de acessos entra em pânico à toa. Quem olha conversão entende o que está acontecendo — o filtro mudou de lugar.",
      },
      { type: "h2", text: "Por que isso não é o fim do SEO" },
      {
        type: "p",
        text: "Os modelos de IA não inventam recomendação do nada: eles se apoiam em conteúdo que existe na internet e em fontes que consideram confiáveis. Para negócio local, isso significa perfil do Google completo, avaliações reais, site com informação consistente, menções em veículos e diretórios da região. É praticamente a mesma lista de sempre — só que agora ela alimenta dois destinos: o ranqueamento clássico e a resposta que a IA monta.",
      },
      {
        type: "quote",
        text: "O jogo deixou de ser \"aparecer na primeira página\" e passou a ser \"ser citado na resposta\". A base de trabalho, porém, continua sendo a mesma.",
      },
      { type: "h2", text: "O que fazer nos próximos meses" },
      {
        type: "list",
        items: [
          "Responda perguntas de forma direta. Páginas que começam com um parágrafo objetivo respondendo a dúvida do título são muito mais fáceis de citar do que textos que enrolam três parágrafos antes de chegar ao ponto.",
          "Escreva do jeito que o cliente pergunta. Quem usa chatbot escreve frases inteiras — \"quanto custa um vídeo institucional em Sorocaba\", não \"vídeo institucional preço\". Use essas perguntas como títulos de seção no seu site.",
          "Mantenha dados de negócio idênticos em todos os canais. Nome, endereço, telefone e serviços iguais no site, no perfil do Google e nas redes. Informação conflitante é o jeito mais rápido de uma IA não confiar na sua empresa.",
          "Use dados estruturados no site (schema de negócio local, FAQ, serviços). É código invisível pro visitante e é o formato que máquina lê sem ambiguidade.",
          "Construa menções fora do seu site. Diretórios locais, associações comerciais, imprensa da região, parcerias. A IA cita quem aparece citado em mais de um lugar.",
          "Mantenha avaliações entrando de forma constante. Avaliação recente sinaliza negócio ativo tanto pro algoritmo de busca quanto pro modelo que resume as opções.",
          "Não bloqueie os rastreadores de IA sem pensar. Muita gente copiou configuração de bloqueio da internet sem entender que estava se tirando das respostas.",
        ],
      },
      { type: "h2", text: "Como medir sem se enganar" },
      {
        type: "p",
        text: "Dá pra acompanhar isso hoje, sem ferramenta cara. No seu analytics, separe as visitas cuja origem é uma ferramenta de IA — elas aparecem como referência de domínios de chatbots e assistentes. Olhe três coisas: volume dessas visitas mês a mês, quanto tempo elas ficam no site e quantas viram contato. Compare com o tráfego de busca tradicional.",
      },
      {
        type: "p",
        text: "E faça o teste manual, que é o mais revelador de todos: pergunte a dois ou três assistentes de IA o que o seu cliente perguntaria — \"melhor agência de marketing em Sorocaba\", \"produtora de vídeo perto de Votorantim\" — e veja quem aparece. Repita uma vez por mês. É de graça e mostra exatamente onde você está nessa nova disputa.",
      },
      { type: "h2", text: "O erro de correr atrás do modismo" },
      {
        type: "p",
        text: "Já existe gente vendendo \"otimização para IA\" como se fosse uma disciplina totalmente nova, com preço de novidade. Na prática, 80% do trabalho é o básico bem feito: conteúdo útil, dados consistentes, reputação real e site rápido. Os 20% restantes são ajustes de formato — responder direto, estruturar dados, cobrir as perguntas que as pessoas realmente fazem. Quem tentar pular o básico pra comprar o atalho vai pagar caro pelos dois.",
      },
      {
        type: "p",
        text: "A vantagem, pra empresa de porte médio da nossa região, é que a concorrência local ainda está majoritariamente parada nesse assunto. Quem organizar a casa agora entra nas respostas antes de virar disputa de todo mundo.",
      },
      {
        type: "p",
        text: "Se quiser um diagnóstico do quanto a sua empresa aparece hoje — na busca tradicional e nas respostas de IA — e um plano do que priorizar primeiro, é só chamar a WK Media.",
      },
    ],
  },
  {
    slug: "bastidores-diaria-gravacao-video-institucional",
    title: "Bastidores: o que acontece numa diária de gravação de vídeo institucional",
    excerpt:
      "O cliente vê um dia de gravação, mas o vídeo é decidido bem antes. Como a gente prepara, monta e conduz uma diária — e o checklist do que a sua empresa precisa deixar pronto pra não perder tempo nem dinheiro.",
    date: "2026-10-14",
    category: "Bastidores",
    readTime: "7 min de leitura",
    content: [
      {
        type: "p",
        text: "Pra quem contrata, a gravação de um vídeo institucional parece ser o dia em que a equipe chega, monta o equipamento e grava. Na prática, esse dia é só a parte visível. A qualidade do vídeo é decidida antes — no roteiro, na ordem das cenas, na escolha de quem vai falar — e depois, na edição. A diária em si é execução de um plano. Quando o plano não existe, ela vira improviso, e improviso custa caro: cenas que faltam, depoimento com ruído, luz diferente de uma tomada pra outra. Este é o passo a passo de como a gente conduz uma diária, pra você saber o que esperar e o que preparar do seu lado.",
      },
      { type: "h2", text: "Antes de chegar: o que já precisa estar decidido" },
      {
        type: "p",
        text: "Nenhuma diária começa sem quatro coisas aprovadas por escrito. Se alguma delas fica pra decidir no dia, o tempo de gravação vai embora em conversa.",
      },
      {
        type: "list",
        items: [
          "Roteiro aprovado — o que o vídeo precisa dizer, em que ordem e com que duração aproximada.",
          "Lista de cenas — cada plano que precisa existir, separado por ambiente: fachada, recepção, produção, equipe, produto, depoimentos.",
          "Ordem de gravação — organizada pela luz e pelo deslocamento, não pela ordem do roteiro. Área externa costuma ir de manhã cedo ou no fim da tarde; o que depende de máquina funcionando vai no horário em que ela está rodando.",
          "Quem aparece — nomes, cargos e autorização de uso de imagem assinada. Com a LGPD, isso não é burocracia: é o que garante que você pode usar o vídeo por anos sem dor de cabeça.",
        ],
      },
      { type: "h2", text: "Montagem: o áudio vem antes da câmera" },
      {
        type: "p",
        text: "Parece contraintuitivo, mas a primeira coisa que a gente checa ao chegar não é o enquadramento, é o som. Imagem razoável com áudio limpo funciona; imagem linda com áudio ruim não tem conserto na edição. Cada pessoa que vai falar usa um microfone de lapela sem fio próprio — trabalhamos com o Hollyland Lark M2 —, e antes de gravar qualquer coisa fazemos um teste de ruído do ambiente.",
      },
      {
        type: "p",
        text: "Em empresa da nossa região, o vilão quase sempre é o mesmo: ar-condicionado, compressor, empilhadeira passando, telefone tocando na sala ao lado. A gente identifica, pede pra desligar o que dá durante os depoimentos e, quando não dá, escolhe outro canto ou muda o horário. Dez minutos de teste economizam uma hora de retrabalho.",
      },
      { type: "h2", text: "Luz: consistência importa mais que quantidade" },
      {
        type: "p",
        text: "O erro mais comum em vídeo corporativo não é falta de luz, é mistura de luz: janela de um lado, lâmpada fluorescente do outro, cada uma com uma cor. O rosto fica com dois tons e a pele fica esverdeada. Por isso a gente define uma fonte principal — a janela, quando ela ajuda — e complementa com iluminação própria na mesma temperatura de cor, apagando o que estiver competindo. Em depoimento, dois pontos de luz bem posicionados resolvem quase todos os casos.",
      },
      { type: "h2", text: "Câmera, lentes e movimento" },
      {
        type: "list",
        items: [
          "Câmera mirrorless Sony com lente 18-50 para ambientes — recepção, galpão, fachada, onde é preciso mostrar o espaço inteiro.",
          "Lente 18-105 para depoimentos e detalhes — permite enquadrar de mais longe, com o fundo desfocado, o que deixa o entrevistado menos intimidado pela câmera em cima dele.",
          "Gimbal para planos em movimento — caminhar pela produção, acompanhar um processo, entrar num ambiente. É o que tira o vídeo do aspecto de foto parada.",
          "Tripé para tudo que é fixo — depoimento tremido não tem edição que salve.",
        ],
      },
      { type: "h2", text: "Depoimento: pergunta, não texto decorado" },
      {
        type: "p",
        text: "A forma mais rápida de um depoimento parecer falso é pedir pra pessoa decorar um texto. Ninguém fala como escreve. O que funciona é conversa: a gente faz perguntas abertas — \"como era antes?\", \"o que mudou?\", \"o que você diria pra quem está pensando nisso?\" — e deixa a pessoa responder do jeito dela. A primeira resposta quase sempre é aquecimento; a boa vem na segunda ou terceira tentativa, quando ela já esqueceu que está sendo gravada.",
      },
      {
        type: "quote",
        text: "Depoimento bom não é o mais bem falado. É o mais crível — e credibilidade vem de gente falando do jeito que fala no dia a dia.",
      },
      { type: "h2", text: "O checklist que pedimos ao cliente" },
      {
        type: "p",
        text: "Do seu lado, a diária rende muito mais se estes itens estiverem resolvidos antes de a equipe chegar:",
      },
      {
        type: "list",
        items: [
          "Ambientes arrumados e liberados nos horários combinados — mesa limpa, cabo escondido, material com marca de concorrente fora de quadro.",
          "Uniformes ou roupas definidos — sem listras finas e sem estampa pequena, que fazem a imagem \"tremer\" no vídeo.",
          "Pessoas que vão falar avisadas com antecedência, sabendo o assunto, mas sem roteiro decorado.",
          "Um responsável interno acompanhando a equipe o dia todo, com autonomia pra liberar acesso e resolver imprevistos.",
          "Autorizações de uso de imagem assinadas antes da gravação, não depois.",
          "Máquinas, produtos ou processos que precisam aparecer funcionando no horário combinado.",
        ],
      },
      { type: "h2", text: "Depois da diária" },
      {
        type: "p",
        text: "O material vai para dois lugares diferentes no mesmo dia — cópia de segurança antes de qualquer outra coisa. A partir daí vêm seleção dos melhores trechos, montagem seguindo o roteiro aprovado, trilha, correção de cor e tratamento de áudio. Você recebe uma primeira versão completa e tem uma rodada de ajustes incluída. A maior parte dos ajustes, quando o planejamento foi bem feito, é de detalhe: trocar um trecho de depoimento, ajustar um texto na tela, encurtar uma cena.",
      },
      {
        type: "p",
        text: "Esse é o ponto de todo o processo: quanto mais coisa decidida antes, menos surpresa depois. Se você está planejando um vídeo institucional e quer entender como seria a diária na sua empresa, manda pra gente o que você tem em mente — a gente devolve com a lista de cenas e a ordem de gravação sugerida, antes de falar em orçamento.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
