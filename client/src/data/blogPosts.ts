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
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
