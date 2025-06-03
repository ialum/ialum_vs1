# 📋 INSTRUÇÕES TEMPORARIAS

## 🚀 Status Atual:
 - Validando e melhorando DOCUMENTAÇÃO DO SAAS IALUM
 - Desenvolvendo wireframe das páginas e comportamento dos componentes
 - backend funcionando apenas com a autenticação para testes.

## 🔄 Próximo:
 - depois de todas as páginas e componentes validadas vamos desenvolver o backend no n8n e supabase


## 📊 Foco Atual:
 - Melhora da navegação e funcionamento dos componentes do saas em wireframe com manutenção de documentação e estrutura de arquivos e códigos especialmente organizados

---

## 📋 CHECKLIST DE PÁGINAS DO SISTEMA

### Menu Principal
- [ ] Dashboard - `/app/dashboard` ⏳ Pendente
- [ ] Tópicos - `/app/topicos` 🚧 Em desenvolvimento
- [ ] Embasamentos - `/app/embasamentos` ⏳ Pendente
- [ ] Publicações - `/app/publicacoes` ⏳ Pendente

### Redação (Submenu)
- [ ] Instagram - `/app/redacao/instagram` ⏳ Pendente
- [ ] TikTok - `/app/redacao/tiktok` ⏳ Pendente
- [ ] Facebook - `/app/redacao/facebook` ⏳ Pendente
- [ ] LinkedIn - `/app/redacao/linkedin` ⏳ Pendente
- [ ] Twitter/X - `/app/redacao/twitter` ⏳ Pendente

### Menu Principal (continuação)
- [ ] Agendamentos - `/app/agendamentos` ⏳ Pendente
- [ ] Relatórios - `/app/relatorios` ⏳ Pendente

### Configurações (Submenu)
- [ ] Banca - `/app/configuracoes/banca` 🚧 Em desenvolvimento
- [ ] Banco de Imagens - `/app/configuracoes/banco-imagens` ⏳ Pendente
- [ ] Templates - `/app/configuracoes/templates` ⏳ Pendente
- [ ] Integrações - `/app/configuracoes/integracoes` ⏳ Pendente
- [ ] Sistema - `/app/configuracoes/sistema` ⏳ Pendente

### Ajuda
- [ ] Ajuda - `/app/ajuda` ⏳ Pendente

### Conta (Submenu)
- [ ] Usuários - `/app/conta/usuarios` ⏳ Pendente
- [ ] Financeiro - `/app/conta/financeiro` ⏳ Pendente
- [ ] Parcerias - `/app/conta/parcerias` ⏳ Pendente

### Legendas:
- ✅ Completo
- 🚧 Em desenvolvimento
- ⏳ Pendente
- 🔄 Necessita revisão

---

# 📖 GLOSSÁRIO IALUM - TERMOS E NOMENCLATURAS

## 1. TERMOS DE NEGÓCIO

### Entidades Principais
- **Tópico**: Unidade base de conteúdo jurídico que agrupa embasamento e publicações
- **Embasamento**: Desenvolvimento jurídico completo de um tópico com referências legais
- **Publicação**: Conteúdo adaptado de um tópico para uma rede social específica
- **Template**: Modelo visual configurável via Bannerbear para geração de imagens
- **Agente de IA**: Assistente inteligente especializado em tarefas específicas do sistema

### Conceitos Operacionais
- **Banca**: Escritório de advocacia (tenant no sistema multi-tenant)
- **Advogado**: Usuário responsável pela criação e gestão de conteúdo
- **Tema Jurídico**: Categoria de direito (ex: Trabalhista, Civil, Penal)
- **Agendamento**: Programação de publicação em data/hora específica

## 2. STATUS DO SISTEMA

### Status de Tópicos (status principal)
**IMPORTANTE**: Tópicos têm apenas 3 status possíveis
- **ideia**: Conceito inicial sem desenvolvimento
- **rascunho**: Em processo de elaboração
- **embasado**: Desenvolvimento jurídico completo

### Status de Publicações (status principal + status de ação)
**IMPORTANTE**: Publicações têm 2 tipos de status que coexistem

#### Status Principal (fluxo de criação):
- **ideia**: Conceito inicial de publicação
- **rascunho**: Conteúdo em elaboração
- **concluido**: Finalizado e pronto para agendar
- **agendado**: Com data/hora definida para publicação
- **publicado**: Já publicado na rede social

#### Status de Ação (podem sobrepor o principal):
- **pausado**: Temporariamente suspenso (mantém status principal)
- **erro**: Falha no processo de publicação (mantém status principal)
- **arquivado**: Removido do fluxo ativo (mantém status principal)

**Exemplo**: Uma publicação pode estar "concluido + arquivado" ou "publicado + erro"

## 3. PADRÕES DE IDENTIFICADORES

### IDs Primários (todos UUID para segurança)
- **tenant.id**: UUID único do tenant/banca
- **user.id**: UUID único do usuário  
- **topic.id**: UUID único do tópico
- **publication.id**: UUID único da publicação

### IDs de Referência/Exibição
- **topic.base_id**: 5 dígitos do tópico (ex: `12345`)
- **publication.base_id**: Prefixo + tipo + topic.base_id (ex: `IG_carrossel_12345`)
- **tenant.display_name**: Nome amigável (ex: `banca_silva`)
- **user.display_id**: Opcional para relatórios (ex: `USR001`)

### Prefixos de Rede Social
- **IG_**: Instagram
- **LI_**: LinkedIn
- **TT_**: TikTok
- **FB_**: Facebook
- **TW_**: Twitter/X

## 4. COMPONENTES PADRONIZADOS

### Componente Busca
- **busca-topicos**: Busca na página de tópicos
- **busca-embasamentos**: Busca na página de embasamentos
- **busca-publicacoes**: Busca na página de publicações
- **busca-redacao**: Busca nas páginas de redação específica

### Componente Tópico
- **topico-full-edit**: Visualização e edição completa
- **topico-card-lista-view**: Card em lista apenas visualização
- **topico-card-lista-edit**: Card em lista com edição de publicações

### Componente Publicação
- **publi-mini-lista-view**: Visualização mínima em lista
- **publi-card-edit-contraido**: Card editável contraído
- **publi-card-edit-expandido**: Card editável expandido
- **publi-full-edit**: Edição completa na página de embasamento
- **publi-agenda**: Visualização de agendamentos

### Componentes de Edição por Rede
- **publi-edit-instagram-carrossel**: Editor de carrossel Instagram
- **publi-edit-instagram-stories**: Editor de stories Instagram
- **publi-edit-instagram-reels**: Editor de reels Instagram
- **publi-edit-tiktok-carrossel**: Editor de carrossel TikTok
- **publi-edit-tiktok-video**: Editor de vídeo TikTok
- **publi-edit-linkedin-artigo**: Editor de artigo LinkedIn
- **publi-edit-linkedin-post**: Editor de post LinkedIn
- **publi-edit-facebook-post**: Editor de post Facebook
- **publi-edit-twitter-thread**: Editor de thread Twitter/X

### Componente Calendário
- **calendario-dashboard**: Visão mensal completa
- **calendario-mini**: Widget lateral compacto

## 5. CONVENÇÕES DE NOMENCLATURA

### Arquivos e Pastas
- **Idioma**: Inglês com hífens para separação
- **Exemplos corretos**:
  - `image-bank/` (não banco-images ou imageBank)
  - `user-profile/` (não perfil-usuario ou userProfile)
  - `api-config.js` (não apiConfig.js ou api_config.js)

### Variáveis no Código
- **Backend**: snake_case em inglês (ex: `user_id`, `created_at`)
- **Frontend JS**: camelCase em inglês (ex: `userId`, `createdAt`)
- **CSS Classes**: kebab-case em inglês (ex: `card-header`, `btn-primary`)

### Interface do Usuário
- **Labels e Textos**: Português brasileiro
- **Exemplos**:
  - Exibir: "Tópicos" (não Topics)
  - Exibir: "Publicações" (não Publications)
  - Exibir: "Configurações" (não Settings)

## 6. ROTAS E ENDPOINTS

### Padrão de Rotas Frontend
- `/app/dashboard` - Página inicial
- `/app/topicos` - Gestão de tópicos
- `/app/embasamentos` - Edição de embasamentos
- `/app/publicacoes` - Central de publicações
- `/app/redacao/[rede]` - Páginas de redação por rede
- `/app/agendamentos` - Calendário de agendamentos
- `/app/relatorios` - Dashboard analítico
- `/app/configuracoes/[secao]` - Configurações do sistema
- `/app/conta/[secao]` - Configurações do sistema

### Padrão de API Endpoints
- `GET /api/v1/topics` - Listar tópicos
- `POST /api/v1/topics` - Criar tópico
- `PUT /api/v1/topics/:id` - Atualizar tópico
- `DELETE /api/v1/topics/:id` - Arquivar tópico
- Mesmo padrão para `/publications`, `/templates`, etc.

## 7. TERMOS TÉCNICOS

### Arquitetura
- **Multi-tenant**: Múltiplas bancas no mesmo sistema
- **RLS**: Row Level Security (segurança em nível de linha)
- **JWT**: JSON Web Token para autenticação
- **RBAC**: Role-Based Access Control (controle de acesso por papel)

### Integrações
- **Bannerbear**: Serviço de geração automática de imagens
- **Supabase**: Backend as a Service (banco de dados e autenticação)
- **N8N**: Plataforma de automação de workflows

### Performance
- **Cache local**: Armazenamento temporário de 200 tópicos
- **Debounce**: Atraso de 300ms em buscas
- **Lazy loading**: Carregamento sob demanda
- **Code splitting**: Divisão de código por rotas