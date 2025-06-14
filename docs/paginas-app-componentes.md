# Componentes Modulares Ialum

Os componentes modulares foram criados para compartilhar inclusive a montagem visual, com campos que apenas somem e aparecem dependendo do modo. Tudo para que seja o mais otimizado quanto possível para desenvolver e oferecer manutenção ao codigo posteriromente.

## 1. Componente Busca
----------------------------------------------------------------------

### Estrutura Base:
- **Campo de input principal**
  - Placeholder contextual que explica o que será buscado
  - Ícone de busca (lupa)

- **Sistema de Cache**
  - Cache local de 200 tópicos e resumo das suas publicações mais recentes
  - Atualização ao clicar no campo (se último update > 5 minutos)
  - Indicador visual de atualização em andamento

- **Filtros Fixos por Contexto**
  - **Status de Tópicos**: Ideia, Rascunho, Embasado.
  - **Período de Criação de Tópicos**: Últimos 7 dias, 30 dias, 3 meses, 6 meses, Personalizado
  - **Status de Publicações**: Ideia, rascunho, concluido, publicado, etc ( diferente dos status de tópicos )
  - **Agendamentos de Publicações**: Últimos 7 dias, 30 dias, 3 meses, 6 meses, Personalizado
  - **Temas Jurídicos**: Lista predefinida dos temas da banca
  - **Redes Sociais**: Instagram, LinkedIn, Twitter/X, Facebook, etc de acordo com integrações ativas da banca

- **Ordenadores**
  - **Padrão**: Mais recentes primeiro
  - **Alfabética**: A-Z / Z-A
  - **Relevância**: Baseado em engajamento (quando aplicável)
  - **Data de Publicação**: Para conteúdos agendados e publicados

### Comportamentos:
- **Busca em tempo real**
  - Debounce de 300ms
  - Mínimo 3 caracteres para iniciar
  - Destaque dos termos buscados nos resultados

- **Autocomplete inteligente**
  - Sugestões baseadas em:
    - Histórico de buscas do usuário
    - Tópicos mais acessados
    - Correspondências parciais
  - Máximo 10 sugestões no dropdown

- **Gestão de Estados**
  - **Inicial**: Campo vazio com placeholder
  - **Focado**: Exibe filtros disponíveis e histórico
  - **Digitando**: Loading indicator sutil
  - **Com resultados**: Lista de resultados + contador
  - **Sem resultados**: Mensagem contextual + sugestões
  - **Erro**: Mensagem de erro + ação de retry

### Variações por Página:

1. **Busca em Tópicos**
   - Placeholder: "Busque por tópicos, ID ou Assunto.."
   - Retorna: Lista de componentes Tópico (modo topico-card_lista + publi-mini_lista)
   - Filtros clicáveis: Status do Tópico, Temas e Períodos
   - Ordenação: Recentes, a-z, tema, status
   - Opção ativa/desativa: Arquivados ( para pesquisar em arquivados )

2. **Busca em Embasamentos**
   - Placeholder: "Busque por tópicos, ID ou Assunto.."
   - Retorna: Lista suspensa com até 10 resultados clicáveis, o que ao clicar expande para edição ( topico-full )
   - Filtros clicáveis: Status do Tópico, Temas e Períodos
   - Ordenação: Status do tópico: ideia, rascunho embasamento
   - Comportamento especial: Auto-seleciona primeiro resultado

3. **Busca em Publicações**
   - Placeholder: "Busque por tópicos, e ids Embasados"
   - Filtros escondidos: Status do Tópico = embasado
   - Retorna: Lista de componentes Tópico (modo topic-card_lista + publi-norm_lista)
   - Filtros clicáveis: Temas Jurídicos, Redes Sociais e Períodos
   - Ordenação: Recentes, a-z, tema, status

4. **Busca em páginas de Redação especifica**
   - Placeholder: "Busque por tópicos, IDs com Publicações"
   - Filtros escondidos: Tópicos que possuem publicações da rede social ex. instagram associados ao tópico.
   - Retorna: Lista suspensa com até 10 resultados clicáveis, o que ao clicar expande para edição da publica ( publi-full )
   - Filtros clicáveis: Status do Tópico, Temas e Períodos
   - Ordenação: mais recente
   - Comportamento especial: Auto-seleciona primeiro resultado

## 2. Componente Tópico
----------------------------------------------------------------------

### Estrutura de Dados:
- **Identificação**
  - ID: 5 dígitos (ex: 12345)
  - Advogado responsável (obrigatório)
  - Data de criação/modificação
  
- **Dados principais**
  - Título (obrigatório)
  - Assunto (descrição curta do tópico)
  - Tema jurídico vinculado
  - Status do tópico: (APENAS 3 status - ver 0_0-Instrucoes.md)
    - **Ideia**: Conceito inicial
    - **Rascunho**: Em elaboração  
    - **Embasado**: Desenvolvimento jurídico completo
  
- **Estrutura Visual do componente Tópico**:
  - Título em destaque ( canto superior esquerdo)
  - Status do tópico (canto superior direito)
  - id e data ultima modificação (pequeno abaixo do título a esquerda )
  - Advogado responsável ( a direita na mesma linha do id e ultima modificação)
  - Tema juridico ( a esquerda abaixo da linha de id, data e advogado)
  - Assunto ( ao lado do icone do tema juridico )

### Regras de Negócio:

- **Elementos vinculados**
  - Tópico sempre vinculado a um unico advogado
  - Embasamento (ID: embasa_12345) - atual: 1 por tópico - múltiplos embasamentos futuros
  - Publicações agrupadas:
    - Publicações herdam o ID do tópico com prefixos fixos
    - Instagram Carrossel (ID: IG_carrossel_12345)
    - Instagram Post Único (ID: IG_post_12345)
    - LinkedIn Artigo (ID: LI_artigo_12345)
    - Outras redes com prefixo similar

- **Ações do Tópico**:
  - Editar informações básicas
  - visualizar / adicionar / editar embasamento
  - Visualizar / adicionar publicações vinculadas
  - Duplicar tópico
  - Arquivar
  - Excluir ( só aparece se publicação ja estiver Arquivada )

- **Por Status**:
  - Ideia: ícone de lâmpada, cor amarela
  - Rascunho: ícone de lápis, cor marrom claro
  - Embasado: ícone de livro, cor azul

### Modos de Exibição Componente Tópico:

1. **topico-full-edit** (Visualização detalhada)
   - **Estrutura Visual**:
     - Estrutura visual padrão com campos editaveis
     - Ocupando a largura toda a página

   - **Seção de Embasamento vinculado full-edit**:
     - Exibe componente embasamento vinculado (se houver)
     - Botão "Adicionar Embasamento" vinculado (se não houver)
   
   - **Seção de Publicações Vinculadas full-edit**:
     - Exibe componente publicação vinculado (se houver)
     - Botão "Adicionar publicação" vinculado (se não houver)
     - ususario pode adicionar novas publicações rapidamente
     - clicando em editar publicação, pede se quer salvar e direciona para página de Redação especifica.


2. **Modo topico-card-lista-view** (Resultado de busca)
   - **Estrutura Visual**:
     - Estrutura visual padrão com campos não editaveis
     - Exibição em formato de card de 300px de largura
        - **Comportamento**:
          - Hover: destaque visual
          - Click: seleciona e abre a página de embasamento para edição de tópico no modo full-edit
          - Estado selecionado: borda destacada

   - **Seção de Embasamento vinculado**:
     - Não exibe
   
   - **Seção de Publicações Vinculadas mini-lista-view**:
     - Exibe componente publicação vinculado (se houver)


3. **Modo topico-card-lista-edit** (Resultado de busca)
   - **Estrutura Visual**:
     - Estrutura visual padrão com tópico não editável, mas com campos da sessão publicação editavel.
     - Exibição em formato de card de 300px de largura
        - **Comportamento**:
          - Hover: destaque visual
          - Click: seleciona e abre a página de embasamento para edição de tópico no modo full-edit
          - Estado selecionado: borda destacada

   - **Seção de Embasamento vinculado**:
     - Não exibe
   
   - **Seção de Publicações Vinculadas card-lista-edit**:
     - Exibe componente publicação vinculado (se houver)
     - Permite adicionar nova publicação de todas as redes ativas.
     - botão editar leva para a página de redação especifica da rede  tipo de publicação.

## 3. Componente Publicação
----------------------------------------------------------------------

### Estrutura de Dados:
- **Identificação**
  - ID herdado do tópico com prefixo da rede (ex: IG_carrossel_12345)
  - Rede social vinculada (Instagram, LinkedIn, TikTok, Facebook, etc)
  - Tipo de publicação (Carrossel, Stories, Post único, Artigo)
  - Data de criação/modificação
  
- **Dados principais**
  - Título do tópico (herdado)
  - Img de thumbnail da publicação (ou img defaul do tipo de publicação)
  - Quantidade de slides/imagens
  - Status da publicação: (2 tipos de status - ver 0_0-Instrucoes.md)
    - Status Principal: **Ideia**, **Rascunho**, **Concluído**, **Agendado**, **Publicado**
    - Status de Ação (opcional): **Pausado**, **Erro**, **Arquivado**
    - NOTA: Status de ação não substitui o principal, coexistem

  
- **Estrutura Visual do componente Publicação**:
  - Rede social e tipo (canto superior esquerdo)
  - Título do tópico (abaixo da rede social)
  - Quantidade de slides/pronto ( barra de progressso abaixo do título)
  - Status da publicação (canto superior direito)
  - Botões de ação (Editar, Agente de IA para o tipo específico de publicação)
  - Ícone de ação especial (excluir publicação, mas não tópico)
  - Preview da primeira imagem/slide (quando aplicável se não usar default do tipo de publição)
  - Icone do tema juridico herdado do tópico a esquerda da img preview

### Regras de Negócio:

- **Elementos vinculados**
  - Publicação sempre vinculada a um tópico
  - Uma publicação por tipo de publicação da rede por tópico ( ex. um carrossel e um stories para instagram do topico x )
  - Herda informações do tópico pai
  - Pode ter múltiplas publicações de diferentes redes sociais.
  - paginas de criação/edição de publicações especificas para cada rede social.
  - 1 componente de criação/edição *específico* para cada tipo de publicação/rede

- **Ações da Publicação**:
  - Editar conteúdo de cada tipo de publicação/rede com caraterísticas particulares
  - Duplicar publicação ( não é possivel, pois só é permidita uma, seria necessario duplicar o tópico inteiro)
  - Agendar/Reagendar
  - Visualizar preview
  - Excluir
  - Duplicar Tópico
  - Gerar imagens a partir do prompt de cada slide em massa
  - Criar publicação a partir do texto,  imgentes  templates selecionados em cada slide, em massa ( ex. carrossel ou gerar videos em reels)

- **Barra de e evolução e Status**:
  - Ideia: fundo cinza claro
  - Rascunho: fundo rosado, sem data
  - Concluído: fundo verde claro, botão "Agendar"
  - Agendado: fundo verde, exibe data/hora
  - Publicado: fundo azul claro, botão "Duplicar Tópico"


### Modos de Exibição Componente Publicação:

1. **publi-mini-lista-view** (Visualização mínima)
   - **Estrutura Visual**:
     - Lista compacta de publicações dentro do card de tópico
     - Exibe: Rede + tipo, quantidade de slides, status
     - Sem botões de ação visíveis
     - Altura reduzida (~40px por publicação)
   
   - **Comportamento**:
     - Apenas visualização
     - Sem interação direta
     - Indicador visual de status por cor de fundo

2. **publi-card-edit-contraido** (Card editável contraído)
   - **Estrutura Visual**:
     - Card de publicação com preview contraído
     - Exibe: Rede + tipo, título, quantidade slides, status
     - Botões: "Editar" e botão específico do tipo (ex: "Idlun Carrossel")
     - Ícone de ação especial (lixeira)
     - Preview em miniatura da publicação
   
   - **Comportamento**:
     - Botão "Editar": abre página específica da rede
     - Botão IAlum Redator: ação rápida contextual abre agente especifico daquele tipo de publicação/rede
     - Dropdown "agendar" para publicações concluídas
     - Hover: destaque visual

3. **publi-card-edit-expandido** (Card editável expandido)
   - **Estrutura Visual**:
     - Card expandido mostrando opções de criação
     - Seção superior: publicação atual (se houver)
     - Seção inferior: grid de opções para adicionar novas publicações
     - Ícones das redes sociais disponíveis (ex. Instagram, TikTok, Facebook, LinkedIn)
     - Tipos de publicação por rede (ex. Carrossel, Stories)
     - Informações detalhadas: quantidade slides, compatibilidade, CTAs
   
   - **Comportamento**:
     - Click nos ícones de rede: seleciona/deseleciona
     - Exibe tipos disponíveis por rede selecionada
     - Botão "Adicionar Publicações ao Tópico"
     - Expansão suave com animação

4. **publi-full-edit** (Edição completa na página de embasamento)
   - **Estrutura Visual**:
     - Largura total dentro da seção de publicações
     - Grid de botões para seleção de rede social
     - Lista de publicações existentes com todas as informações
     - Opção de adicionar múltiplas publicações simultaneamente
     - Exibe detalhes completos: tipo, quantidade, compatibilidade, CTAs
   
   - **Comportamento**:
     - Botão "Adicionar Publicações ao Tópico"
     - Permite criar múltiplas publicações de diferentes redes
     - Botões de edição levam para página específica da rede
     - Indicadores visuais de compatibilidade entre redes

5. **publi-agenda** (Visualização de agendamentos)
   - **Estrutura Visual**:
     - Organização por semanas
     - Separação entre "Agendadas" e "Não agendadas"
     - Card compacto com informações essenciais
     - Botões de ação: "Duplicar", "Editar", "Agendar"
     - Dropdown de data/hora para agendamento
   
   - **Comportamento**:
     - Arrastar publicações entre seções
     - Agendamento automático ao mover para semana
     - Edição rápida de data/hora
     - Duplicação para criar variações
     - Filtragem por semana/período

### Sistema de Templates Configuráveis:

Os templates visuais são configurados através da integração com Bannerbear e gerenciados na área de Configurações > Templates. Cada template define:

- **Tipo de publicação/rede**: Para qual combinação de rede social e tipo de publicação será usado
- **Campos dinâmicos**: Quais campos serão preenchidos durante a criação (ex: cor da fonte, imagem de fundo, texto título, texto conteúdo, texto especial)
- **Estrutura visual**: Layout base que será aplicado às publicações
- **Regras de aplicação**: Condições para uso automático ou sugestão do template

#### Tipos de campos configuráveis nos templates:
- **Textos**: Título, subtítulo, conteúdo, rodapé, CTA
- **Imagens**: Fundo, ícones, logos, elementos decorativos
- **Estilos**: Cores, fontes, tamanhos, espaçamentos
- **Elementos especiais**: QR codes, gráficos, tabelas

### Componentes de Edição Específicos por Tipo de Publicação:

Cada tipo de publicação possui seu próprio componente de edição com características únicas, acessível através das páginas de Redação específicas de cada rede social. Os templates configurados são aplicados nestes componentes.

#### 1. **Instagram Carrossel (publi-edit-instagram-carrossel)**
- **Campos específicos**:
  - Slides (até 10 imagens)
  - Formato de imagem: 4:5 (retrato: 1080 x 1350px)
  - Legenda principal (até 2.200 caracteres)
  - Hashtags (até 30)
  - Localização
  - Marcação de pessoas
  - Alt text para cada imagem

- **Funcionalidades**:
  - Editor de slides com drag & drop
  - Aplicação de templates configurados
  - Geração de imagens com IA via prompts
  - Seleção de imagens do banco por tema jurídico
  - Preview em dispositivo móvel
  - Sugestões de hashtags relevantes
  - Preenchimento dos campos definidos no template selecionado

#### 2. **Instagram Stories (publi-edit-instagram-stories)**
- **Campos específicos**:
  - Mídia única (imagem ou vídeo até 15s)
  - Formato: 9:16 (vertical)
  - Stickers interativos (enquete, quiz, perguntas)
  - Música de fundo
  - Localização
  - Menções (@)
  - Link (se disponível)

- **Funcionalidades**:
  - Biblioteca de stickers
  - Editor de texto sobre imagem
  - Filtros e efeitos
  - Preview vertical
  - Aplicação de templates configurados

#### 3. **Instagram Reels (publi-edit-instagram-reels)**
- **Campos específicos**:
  - Vídeo único (até 90 segundos)
  - Formato: 9:16 (vertical)
  - Música/áudio
  - Legenda (até 2.200 caracteres)
  - Hashtags
  - Capa do reel
  - Localização

- **Funcionalidades**:
  - Seleção de áudio/música
  - Editor de capa
  - Preview vertical
  - Sugestões de tendências

#### 4. **TikTok Carrossel (publi-edit-tiktok-carrossel)**
- **Campos específicos**:
  - Slides (até 35 imagens)
  - Formato: 9:16 (vertical obrigatório)
  - Música de fundo (obrigatória)
  - Descrição (até 2.200 caracteres)
  - Hashtags
  - Duração por slide

- **Funcionalidades**:
  - Sincronização com música
  - Transições entre slides
  - Aplicação de templates verticais configurados
  - Preview com áudio

#### 5. **TikTok Vídeo (publi-edit-tiktok-video)**
- **Campos específicos**:
  - Vídeo único (até 10 minutos)
  - Formato: 9:16 (vertical)
  - Música/som original
  - Descrição (até 2.200 caracteres)
  - Hashtags
  - Capa do vídeo
  - Efeitos e filtros

- **Funcionalidades**:
  - Biblioteca de sons
  - Editor de capa
  - Sugestões de hashtags trending
  - Preview vertical

#### 6. **LinkedIn Artigo (publi-edit-linkedin-artigo)**
- **Campos específicos**:
  - Título do artigo
  - Corpo do texto (rich text, sem limite)
  - Imagem de capa
  - Tags (até 5)
  - Configurações de visibilidade

- **Funcionalidades**:
  - Editor rich text completo
  - Inserção de imagens no corpo
  - Formatação profissional
  - Preview desktop/mobile
  - SEO optimization

#### 7. **LinkedIn Post (publi-edit-linkedin-post)**
- **Campos específicos**:
  - Texto (até 3.000 caracteres)
  - Imagens (até 9) ou vídeo
  - Documento/PDF anexo
  - Hashtags
  - Menções de empresas/pessoas

- **Funcionalidades**:
  - Editor de texto com formatação
  - Upload de documentos
  - Preview profissional
  - Agendamento em horário comercial

#### 8. **Facebook Post (publi-edit-facebook-post)**
- **Campos específicos**:
  - Texto (sem limite prático)
  - Imagens (até 10) ou vídeo
  - Sentimento/atividade
  - Localização
  - Marcação de pessoas
  - Configurações de privacidade

- **Funcionalidades**:
  - Editor multimedia
  - Álbum de fotos
  - Preview desktop/mobile
  - Crossposting para Instagram

#### 9. **Twitter/X Thread (publi-edit-twitter-thread)**
- **Campos específicos**:
  - Tweets encadeados (até 25)
  - Cada tweet: 280 caracteres
  - Imagens (até 4 por tweet)
  - GIFs
  - Enquetes
  - Hashtags

- **Funcionalidades**:
  - Contador de caracteres por tweet
  - Numeração automática
  - Preview da thread completa
  - Otimização de engajamento

### Características Comuns a Todos os Editores:
- Preview em tempo real
- Salvamento automático de rascunho
- Integração com banco de imagens (image-bank)
- Geração de texto com IA
- Validação de requisitos da rede
- Botão "Publicar agora" ou "Agendar"
- Aplicação de templates configurados em Configurações > Templates
- Campos dinâmicos baseados no template selecionado
- Integração com Bannerbear para geração de imagens

## 4. Componente Calendário
----------------------------------------------------------------------

### Estrutura de Dados:
- **Navegação temporal**
  - Mês/ano atual
  - Navegação entre meses
  - Indicadores visuais de publicações

- **Dados por dia**
  - Quantidade de publicações agendadas
  - Thumbnails das publicações
  - Status das publicações
  - Horários de publicação

### Modos de Exibição:

1. **calendario-dashboard** (Visão mensal completa)
   - **Estrutura Visual**:
     - Grid de 7x5 (dias da semana x semanas)
     - Altura fixa para consistência visual
     - Navegação de meses nas laterais
     - Indicadores visuais de quantidade
   
   - **Comportamento**:
     - Click no dia → Modal com publicações
     - Hover → Preview rápido
     - Navegação → Atualiza mês exibido

2. **calendario-mini** (Widget lateral)
   - **Estrutura Visual**:
     - Versão compacta
     - Apenas indicadores de dias com conteúdo
     - Mês atual destacado
   
   - **Comportamento**:
     - Click → Navega para dia específico
     - Sincronizado com visualização principal