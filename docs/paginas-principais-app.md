# Navegação e Arquitetura Modular das Páginas

O Ialum utiliza uma arquitetura baseada em componentes modulares reutilizáveis.

# 1. Layout Base (Aplicação)

Todas as páginas internas seguem a mesma estrutura de layout:

## Estrutura Principal

- **Sidebar (250px)**
  - **Logo Ialum** (topo)
  
  - **Menu de navegação principal**:
    - Dashboard
    - Tópicos
    - Embasamentos
    - Publicações
    - Redação
      - Instagram
      - TicTok
      - Facebook
      - etc.
    - Agendamentos
    - Relatórios
       
  - **Menu de configurações**:
    - Configurações
      - Banca
      - Banco de Imagens (image-bank)
      - Templates
      - Integrações
      - Sistema
    - Ajuda
    
  - **Área do usuário** (footer do sidebar):
    - Conta
      - Usuarios
      - Financeiro
      - Parcerias
    - Nome/email do usuário
    - Botão Sair

- **Área de Conteúdo Principal**
  - Header da página com contexto
  - Componentes modulares responsivos
  - Layout adaptativo mobile-first
  - Grid system para organização de cards e módulos

## 1.1 Componentes Estruturais

### Header
- **Logo**: Link para dashboard
- **IA de Contexto**:
  - toda página terá um agente de IA que o ajuda com as tarefas daquele contexto 
- **Notificações**: 
  - Ícone com badge de contagem
  - Dropdown com notificações recentes

### Sidebar
- **Navegação Principal**: Ícone + Label
- **Estado Ativo**: Destaque visual + borda lateral
- **Colapsível**: Em telas menores (< 768px)
- **Footer do Sidebar**: Links de ajuda, ususario e logout

### Área de Conteúdo
- **Padding**: 24px em desktop, 16px em mobile
- **Max-width**: 1200px com margin auto
- **Background**: Cinza claro (#f5f5f5)

## 1.2 Componentes principais
 - mantê-los documentados separados no arquivo /docs/0_2-componentes.md
 
**IMPORTANTE**: Os detalhes de comportamento, validações, regras de negócio e estruturas de dados de cada componente estão documentados em `/docs/0_2-componentes.md`. Este arquivo (0_1-paginas.md) foca no layout e navegação entre páginas.


# 2. Associação de Componentes e fluxo de navegação por página

## 2.1 Dashboard

No dashboard apresentaremos o calendário(componente) de publicação do mes com a maior evidência seguido de uma lista de todos os agentes de IA disponíveis com uma breve descrição de como funcionam cada um deles, para o usuário descobrir como e quando utiliza-los. Cards com resumos de relatórios também estarão disponíveis mais abaixo.

### Componentes Area de conteúdo:
1. **Uso do componente Calendário - modo dashboard:**
    - Visão do mes completa
    - Navegação entre meses (setas < >)
    - Thumbnail e status das publicações

2. **Cards de Agentes de IA (Grid secundário)**
    - Lista de agentes ativos
    - Status de cada agente
    - Últimas atividades
  
3. **Cards de Relatórios (Grid secundário)**
    - Resumo de performance
    - Indicadores chave
    - Link para relatórios completos
   
4. **Cards adicionais**
    - Notificações importantes

### Fluxo de Navegação:
- **Click no calendário**:
  - Dia com publicação → Abre modal com detalhes das publicações do dia
  - Dia vazio → Abre modal para criar nova publicação
  - Navegação de meses → Atualiza visualização do calendário

- **Cards de Agentes de IA**:
  - Click no card → Abre chat com o agente específico
  - Botão "Ver todos" → Navega para página de ajuda com lista completa

- **Cards de Relatórios**:
  - Click no card → Navega para página de relatórios com filtro aplicado
  - Hover → Preview dos dados principais

- **Notificações**:
  - Click → Ação específica (ex: ir para publicação agendada)
  - Marcar como lida → Remove destaque visual

## 2.2 Tópicos

Página dedicada à gestão e organização de todos os tópicos jurídicos da banca.

### Componentes Área de conteúdo:
1. **Componente Busca - modo tópicos**
   - Busca por título, ID ou assunto
   - Filtros: Status, Temas, Períodos
   - Ordenação: Recentes, A-Z, tema, status

2. **Lista de Tópicos (Grid principal)**
   - Componente Tópico - modo topico-card-lista-view
   - Exibe publicações vinculadas no modo publi-mini-lista-view
   - Paginação ou scroll infinito

3. **Botão de Ação Flutuante**
   - "Novo Tópico" → Abre modal de criação

### Fluxo de Navegação:
- **Click no tópico** → Navega para página de embasamento
- **Busca** → Filtra resultados em tempo real
- **Filtros** → Atualiza lista dinamicamente
- **Novo tópico** → Modal → Após criar, navega para embasamento

## 2.3 Embasamentos

Página para edição detalhada de tópicos e seus embasamentos jurídicos.

### Componentes Área de conteúdo:
1. **Componente Busca - modo embasamentos**
   - Auto-seleciona primeiro resultado
   - Dropdown com até 10 resultados

2. **Componente Tópico - modo topico-full-edit**
   - Campos editáveis do tópico
   - Seção de embasamento expandida
   - Seção de publicações vinculadas

3. **Editor de Embasamento**
   - Rich text editor
   - Templates jurídicos
   - Citações e referências

### Fluxo de Navegação:
- **Busca** → Seleciona tópico → Carrega no modo full-edit
- **Salvar** → Atualiza status do tópico
- **Adicionar publicação** → Abre seletor de redes sociais
- **Editar publicação** → Navega para página de redação específica

## 2.4 Publicações

Central de gerenciamento de todas as publicações criadas.

### Componentes Área de conteúdo:
1. **Componente Busca - modo publicações**
   - Busca apenas tópicos embasados
   - Filtros: Temas, Redes Sociais, Períodos

2. **Lista de Tópicos com Publicações**
   - Componente Tópico - modo topico-card-lista-edit
   - Publicações no modo publi-card-edit-contraido
   - Opção de expandir para publi-card-edit-expandido

3. **Ações Rápidas**
   - Adicionar publicação
   - Agendar múltiplas
   - Duplicar selecionadas

### Fluxo de Navegação:
- **Expandir publicação** → Mostra opções de criação
- **Editar** → Navega para página de redação
- **Agendar** → Abre dropdown de data/hora
- **Adicionar** → Expande card com seletor de redes

## 2.5 Redação (Instagram/TikTok/Facebook/etc)

Páginas específicas para criação e edição de conteúdo por rede social.

### Componentes Área de conteúdo:
1. **Componente Busca - modo redação específica**
   - Filtra tópicos com publicações da rede
   - Auto-seleciona primeiro resultado

2. **Editor Específico da Rede**
   - Instagram: Componente publi-full-carrossel-expandido
   - TikTok: Editor de vídeo vertical
   - LinkedIn: Editor de artigo
   - Facebook: Editor multipropósito

3. **Preview em Tempo Real**
   - Simulação da publicação
   - Contador de caracteres
   - Validações específicas

4. **Ferramentas de IA**
   - Geração de texto
   - Sugestões de hashtags
   - Criação de imagens

### Fluxo de Navegação:
- **Busca** → Carrega publicação para edição
- **Templates** → Aplica formato predefinido
- **Gerar com IA** → Processa e preenche campos
- **Salvar** → Retorna ao estado anterior ou permanece
- **Publicar** → Agenda ou publica imediatamente

## 2.6 Agendamentos

Visualização e gestão de todas as publicações agendadas.

### Componentes Área de conteúdo:
1. **Navegação por Semanas**
   - Tabs de semanas
   - Navegação entre períodos

2. **Seção Agendadas**
   - Componente publi-agenda
   - Organização por data/hora
   - Indicadores visuais de status

3. **Seção Não Agendadas**
   - Publicações concluídas sem data
   - Drag & drop para agendar

4. **Calendário Lateral**
   - Mini calendário para navegação rápida
   - Destaque de dias com publicações

### Fluxo de Navegação:
- **Arrastar publicação** → Agenda automaticamente
- **Click em data** → Abre seletor de horário
- **Editar** → Navega para página de redação
- **Duplicar** → Cria cópia com novo agendamento

## 2.7 Relatórios

Dashboard analítico com métricas de desempenho.

### Componentes Área de conteúdo:
1. **Filtros Globais**
   - Período (data inicial/final)
   - Redes sociais
   - Tipos de conteúdo
   - Advogados

2. **Cards de Métricas Principais**
   - Total de publicações
   - Engajamento médio
   - Alcance total
   - Taxa de crescimento

3. **Gráficos Interativos**
   - Linha: Evolução temporal
   - Pizza: Distribuição por rede
   - Barras: Comparativo de desempenho

4. **Tabela de Publicações**
   - Lista detalhada com métricas
   - Exportação para Excel/PDF
   - Ordenação por colunas

### Fluxo de Navegação:
- **Aplicar filtros** → Atualiza todos os componentes
- **Click em gráfico** → Drill-down nos dados
- **Exportar** → Gera arquivo com dados filtrados
- **Click em publicação** → Abre detalhes em modal

## 2.8 Configurações

Hub central para todas as configurações do sistema.

### Subpáginas:

#### Banca
- Dados da empresa
- Logo e identidade visual
- Temas jurídicos
- Configurações de conteúdo

#### Image Bank
- Upload de imagens
- Organização por pastas
- Tags e categorização
- Integração com IA de imagem

#### Integrações
- Conexão com redes sociais
- APIs de terceiros
- Webhooks
- Logs de integração

#### Sistema
- Preferências gerais
- Notificações
- Backup
- Atualizações

### Fluxo de Navegação:
- **Menu lateral** → Navega entre subpáginas
- **Salvar** → Aplica configurações
- **Testar integração** → Valida conexão
- **Restaurar padrões** → Reset de configurações

## 2.9 Ajuda

Central de suporte e documentação.

### Componentes Área de conteúdo:
1. **Busca de Ajuda**
   - FAQ
   - Tutoriais
   - Documentação

2. **Agentes de IA**
   - Lista completa com descrições
   - Como usar cada agente
   - Exemplos práticos

3. **Tutoriais em Vídeo**
   - Guias passo a passo
   - Casos de uso
   - Melhores práticas

4. **Contato com Suporte**
   - Chat ao vivo
   - Ticket de suporte
   - Base de conhecimento

### Fluxo de Navegação:
- **Busca** → Resultados relevantes
- **Categoria** → Lista de artigos
- **Vídeo** → Player inline
- **Contato** → Formulário ou chat


