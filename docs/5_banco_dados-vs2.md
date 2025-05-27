# vs2 - Decisões Arquiteturais - Banco de Dados Ialum

## 🏗️ DECISÕES FUNDAMENTAIS

### **1. ARQUITETURA MULTI-TENANT**
- **Escolha:** Banco compartilhado com tenant_id em cada tabela
- **Alternativa rejeitada:** Schema separado por cliente
- **Motivo:** Simplicidade para MVP, facilidade de manutenção
- **Segurança:** Row Level Security (RLS) do Supabase

### **2. IDENTIFICADORES**
- **tenant_id:** UUID/string ("banca_silva_7a8b9c2d1e4f") para segurança
- **user_id:** Integer auto-increment (1, 2, 3...) para simplicidade
- **base_id:** String 5 dígitos aleatórios ("12345") para conteúdo
- **full_id:** Composição base_id + plataforma ("12345-IGcars")
- **Motivo:** Tenant UUID evita ataques de enumeração, base_id permite múltiplas publicações

### **3. NOMENCLATURA**
- **Idioma:** Inglês para variáveis e tabelas do banco
- **Frontend:** Português para interface do usuário
- **Exemplo banco:** `topics` (não content ou conteudo)
- **Exemplo frontend:** "Tópicos" (não topics ou content)
- **Motivo:** Padronização internacional no código, clareza para usuário brasileiro

---

## 🔒 SEGURANÇA DE NAVEGAÇÃO

### **4. SISTEMA DE TOKENS TEMPORÁRIOS**
- **Decisão:** Usar tokens SHA256 para todas navegações sensíveis
- **Validade:** 5 minutos por padrão (configurável)
- **Uso único:** Token marcado como usado após validação
- **Motivo:** Prevenir ataques de enumeração e acesso não autorizado

### **5. AUDITORIA COMPLETA**
- **navigation_security:** Log de todas navegações entre páginas
- **user_risk_scores:** Sistema de pontuação de risco automático
- **Bloqueio automático:** Score > 200 pontos bloqueia usuário
- **Motivo:** Detectar e prevenir comportamentos anômalos

---

## 📝 ESTRUTURA DE CONTEÚDO

### **6. SEPARAÇÃO TOPICS → PUBLICATIONS**
- **Topics:** Base informacional (tema, pesquisa, assunto)
- **Publications:** Instâncias por plataforma (Instagram, LinkedIn)
- **Motivo:** 1 tópico jurídico pode gerar múltiplas publicações
- **Novo:** base_id único para agrupar publicações relacionadas

### **7. FLUXO DE STATUS REFORMULADO**
```
TOPICS STATUS:
- ideia → rascunho → embasado

PUBLICATION STATUS:
- rascunho → aprovado → agendado → publicado
                ↓          ↓           ↓
            pausado      erro      arquivado
```
- **Motivo:** Separar processo criativo (topics) do operacional (publications)
- **Clareza:** Status de topics não conflita com status de publications

### **8. DUPLICAÇÃO E VERSIONAMENTO**
- **source_topic_id:** Rastreia origem de tópicos duplicados
- **version:** Contador simples de versão
- **Uso:** Duplicar para novo mês, nova abordagem, atualização legal
- **MVP:** Sem versionamento complexo, apenas rastreamento simples

### **9. SISTEMA DE PROMPTS**
- **Nova tabela:** publication_prompts
- **Armazena:** Prompts de IA e imagens geradas
- **Motivo:** Histórico de criação e reuso de prompts bem-sucedidos

### **9. GRANULARIDADE DE TEMPLATES**
- **Decisão:** Template por element_type, não por publicação
- **Exemplo:** Template específico para "capa", outro para "conteúdo"
- **Motivo:** Flexibilidade máxima, reutilização de elementos

### **10. ESTRUTURA DE ELEMENTOS**
```sql
publication_elements:
- element_type: "cover", "content", "cta", "image", "video"
- element_order: 1, 2, 3... (sequência no carrossel)
- title: título do slide
- content_text: texto completo do slide
- template_id: template específico deste elemento
```

---

## 💳 SISTEMA DE CRÉDITOS

### **11. COBRANÇA DE CRÉDITOS**
- **Cobra:** research (1), content_creation (1), image_generation (1)
- **Gratuito:** edições manuais, agendamentos, publicações
- **Controle:** credits_transactions com rastreamento detalhado
- **Motivo:** Cobrir custos de APIs externas (OpenAI, Bannerbear)

### **12. CONTROLE DE SALDO**
- **credits_balance:** saldo atual por tenant
- **credits_transactions:** histórico detalhado de uso
- **Validação:** Sistema impede uso sem créditos suficientes

---

## 📱 INTEGRAÇÃO COM PLATAFORMAS

### **13. ESTRUTURA DE PLATAFORMAS**
- **platforms:** tabela mestre (Instagram, TikTok, LinkedIn)
- **tenant_integrations:** conexões específicas por cliente
- **Preparado para:** Novas redes sociais no futuro
- **Configuração:** JSON flexível para dados específicos

### **14. SISTEMA DE IDs COMPOSTOS**
- **Formato:** base_id + plataforma + tipo
- **Exemplos:**
  - 12345-IGcars (Instagram Carrossel)
  - 12345-IGstor (Instagram Stories)
  - 12345-LIpost (LinkedIn Post)
- **Motivo:** Identificação única e legível
- **Regra:** 1 publicação por tipo/plataforma por tópico

### **15. METADADOS POR TIPO**
- **publication_metadata:** JSON flexível
- **Instagram Carousel:** caption, hashtags
- **Instagram Reels:** audio_name, location, share_reels_feed
- **LinkedIn Post:** post_text, call_to_action
- **Motivo:** Cada plataforma tem campos únicos

---

## 🔧 RELACIONAMENTOS E INTEGRIDADE

### **16. FOREIGN KEYS**
- **Configuração:** ON UPDATE CASCADE
- **Motivo:** Se ID pai mudar, filhos atualizam automaticamente
- **Exemplo:** Se topics.id muda, publications.topic_id acompanha

### **17. SOFT DELETE**
- **Posts:** Campo "status" para arquivar
- **Usuários:** Campo "active" para desativar
- **Motivo:** Preservar histórico, facilitar auditoria

---

## 📊 PERFORMANCE E ESCALABILIDADE

### **18. CAMPOS JSON**
- **Uso:** Dados flexíveis (metadata, configurações)
- **Não uso:** Dados que precisam de busca/filtro
- **Indexação:** Campos JSON podem ser indexados se necessário

### **19. TIMESTAMPS**
- **Padrão:** created_at, updated_at em todas as tabelas
- **Timezone:** UTC no banco, conversão no frontend
- **Auditoria:** system_logs para ações importantes

---

## 🎨 BANNERBEAR INTEGRATION

### **20. TEMPLATE VARIABLES**
- **bannerbear_template_uid:** ID único do template no Bannerbear
- **template_config:** JSON com variáveis disponíveis
- **element_data:** JSON com dados específicos por elemento
- **Processamento:** Campo "processed" indica se mídia foi gerada

### **21. MEDIA WORKFLOW**
1. Element criado com template_id
2. Bannerbear processa usando bannerbear_template_uid
3. Media_url preenchida com resultado
4. Processed = true

### **22. BANCO DE IMAGENS PRESET**
- **is_preset:** Marca imagens como preset do tema
- **usage_count:** Contador de uso para analytics
- **Organização:** Por tema jurídico
- **Motivo:** Reutilização eficiente de assets

---

## 🚨 ESTADOS E FLUXOS

### **23. STATUS DE TOPICS**
- **ideia:** Apenas título e assunto básico
- **rascunho:** Conteúdo inicial sem embasamento completo
- **embasado:** Pesquisas completas, pronto para gerar publicações

### **24. STATUS DE PUBLICATION**
- **rascunho:** Em construção/edição
- **aprovado:** Pronto para agendar
- **agendado:** Programado para publicação
- **publicado:** Publicado com sucesso
- **erro:** Falha na publicação
- **pausado:** Temporariamente suspenso
- **arquivado:** Removido do fluxo ativo

---

## 🛡️ SEGURANÇA

### **25. ROW LEVEL SECURITY (RLS)**
```sql
CREATE POLICY "tenant_isolation" ON posts 
FOR ALL USING (
  tenant_id = (
    SELECT tenant_id 
    FROM users 
    WHERE users.id = auth.uid()
  )
);
```

### **26. PERMISSÕES DE USUÁRIO**
- **Role-based:** admin, editor, reviewer, viewer
- **Granular:** JSON com permissões específicas
- **Exemplo:** can_create, can_approve, can_billing

### **27. TOKENS DE NAVEGAÇÃO**
- **Todas ações sensíveis:** Requerem token temporário
- **Rastreamento:** Todas navegações são auditadas
- **Risk scoring:** Sistema automático de detecção de anomalias

---

## 🔄 DECISÕES DE IMPLEMENTAÇÃO

### **28. MIGRATIONS**
- **Ordem:** Core tables → Security → Features → Optimizations
- **Rollback:** Sempre preparar scripts de volta
- **Versionamento:** Migrations numeradas sequencialmente

### **29. INDEXAÇÃO**
```sql
-- Índices críticos para performance
CREATE INDEX idx_publications_tenant_date ON publications(tenant_id, scheduled_date);
CREATE INDEX idx_topics_theme_status ON topics(theme_id, status);
CREATE INDEX idx_elements_publication_order ON publication_elements(publication_id, element_order);
CREATE INDEX idx_action_tokens_composite ON action_tokens(tenant_id, user_id, used, expires_at);
```

---

## 📈 ROADMAP DE EVOLUÇÃO

### **30. PRÓXIMAS FEATURES**
- **Colaboração:** Comentários em posts
- **Versionamento:** Histórico de mudanças
- **Analytics:** Métricas avançadas por tema
- **IA Enhancement:** Sugestões automáticas
- **Templates compartilhados:** Entre tenants

### **31. ESCALABILIDADE**
- **Particionamento:** Por tenant_id se necessário
- **Caching:** Redis para dados frequentes
- **CDN:** Para media_urls das imagens
- **Arquivamento:** Dados antigos para tabelas históricas

---

## 🔑 DECISÕES CRÍTICAS PARA MVP

### **32. SIMPLIFICAÇÕES ACEITAS**
- **Sem versionamento:** Por enquanto, apenas estado atual
- **Sem multi-idioma:** Interface apenas em PT-BR
- **Sem colaboração real-time:** Edições sequenciais
- **Motivo:** Foco no core business primeiro

### **34. GESTÃO DE MÚLTIPLAS PUBLICAÇÕES**
- **Regra:** 1 publicação por tipo/plataforma por tópico
- **Duplicação:** Se precisar nova versão, duplica o tópico inteiro
- **Rastreamento:** source_topic_id mantém histórico
- **Busca inteligente:** Sugere tópicos similares antes de criar novo

### **35. BUSCA INTELIGENTE**
- **Central de Tópicos:** Campo de busca com sugestões
- **Funcionalidade:** Busca por título, assunto, tema
- **Sugestões:** Mostra tópicos similares ao digitar
- **Ação rápida:** "Criar novo baseado em [tópico similar]"
- **MVP:** Busca simples por palavras-chave

### **36. PREPARAÇÕES FUTURAS**
- **Estrutura pronta para:** Multi-idioma (campos TEXT)
- **Campos JSON:** Permitem extensibilidade
- **Tabelas de log:** Base para analytics futuro
- **Segurança robusta:** Desde o início