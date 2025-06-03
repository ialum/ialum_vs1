# vs2 - Decisões Arquiteturais - Banco de Dados Ialum

## 🏗️ DECISÕES FUNDAMENTAIS

### **1. ARQUITETURA MULTI-TENANT**
- **Escolha:** Banco compartilhado com tenant_id em cada tabela
- **Alternativa rejeitada:** Schema separado por cliente
- **Motivo:** Simplicidade para MVP, facilidade de manutenção
- **Segurança:** Row Level Security (RLS) do Supabase

### **2. IDENTIFICADORES**
**Ver estrutura completa em 0_0-Instrucoes.md - Seção 3**

**Implementação no Banco:**
- **tenant.id:** UUID para cada banca
- **user.id:** UUID para cada usuário
- **topic.id:** UUID único + topic.base_id (5 dígitos)
- **publication.id:** UUID único + publication.base_id ("IG_carrossel_12345")
- **Motivo:** UUIDs para segurança, base_ids para usabilidade

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

**IMPORTANTE: Ver definições completas em 0_0-Instrucoes.md**

```sql
-- TOPICS: apenas 1 campo status
topics.status: 'ideia' | 'rascunho' | 'embasado'

-- PUBLICATIONS: 2 campos de status
publications.status: 'ideia' | 'rascunho' | 'concluido' | 'agendado' | 'publicado'
publications.action_status: null | 'pausado' | 'erro' | 'arquivado'
```

**Fluxo Visual:**
```
TOPICS STATUS (simples):
ideia → rascunho → embasado

PUBLICATION STATUS (principal + ação):
Status Principal: ideia → rascunho → concluido → agendado → publicado
Status de Ação:   [pode adicionar: pausado, erro ou arquivado em qualquer momento]
```

- **Exemplo**: Uma publicação pode ter `status='publicado'` e `action_status='erro'`
- **Motivo:** Manter histórico do fluxo principal mesmo com ações aplicadas
- **Clareza:** Status de topics é simples, publications tem duplo status

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
**Ver estrutura em 0_0-Instrucoes.md**

- **publication.base_id:** Prefixo_tipo_baseId
- **Exemplos:**
  - IG_carrossel_12345
  - IG_stories_12345  
  - LI_post_12345
- **Motivo:** Identificação visual clara da rede/tipo
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

### **22. BANCO DE IMAGENS PRESET (image-bank)**
- **is_preset:** Marca imagens como preset do tema
- **usage_count:** Contador de uso para analytics
- **Organização:** Por tema jurídico
- **Motivo:** Reutilização eficiente de assets

---

## 🚨 ESTADOS E FLUXOS

### **23. STATUS DE TOPICS** 
**Ver seção 7 acima e 0_0-Instrucoes.md para definições completas**
- Apenas 3 status: ideia, rascunho, embasado

### **24. STATUS DE PUBLICATION**
**Ver seção 7 acima e 0_0-Instrucoes.md para definições completas**
- Status Principal: ideia, rascunho, concluido, agendado, publicado
- Status de Ação (campo separado): pausado, erro, arquivado

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
- **Role-based:** ialum_master, ialum_editor, ialum_partner, admin, editor, reviewer, viewer
- **Granular:** JSON com permissões específicas
- **Exemplo:** can_create, can_approve, can_billing
- **Multi-tenant:** ialum_editor (funcionários) e ialum_partner (parceiros externos)

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

---

## 🤝 ESTRUTURA PARA PARCEIROS

### **37. SISTEMA DE PARCEIROS IALUM**

**Tabela users - campos adicionais:**
```sql
user_role: 'ialum_master' | 'ialum_editor' | 'ialum_partner' | 'admin' | 'editor' | 'reviewer' | 'viewer'
user_subtype: 'employee' | 'partner' | null -- para diferenciar funcionários de parceiros
partner_company: string -- nome da agência/empresa do parceiro
```

**Nova tabela: partner_permissions**
```sql
CREATE TABLE partner_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Permissões específicas por tenant
  can_create_topics boolean DEFAULT true,
  can_embased_topics boolean DEFAULT true,
  can_create_publications boolean DEFAULT true,
  can_edit_publications boolean DEFAULT true,
  can_approve boolean DEFAULT false,
  can_publish boolean DEFAULT false,
  
  -- Configuração de créditos
  default_credit_source varchar(20) CHECK (default_credit_source IN ('ialum_pool', 'tenant_pool')) DEFAULT 'ialum_pool',
  allow_credit_choice boolean DEFAULT true,
  
  -- Período de validade
  valid_from timestamp DEFAULT now(),
  valid_until timestamp, -- null = permanente
  
  -- Auditoria
  created_at timestamp DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_at timestamp DEFAULT now(),
  
  -- Índices
  UNIQUE(partner_user_id, tenant_id),
  INDEX idx_partner_tenant (partner_user_id, tenant_id),
  INDEX idx_partner_validity (partner_user_id, valid_from, valid_until)
);
```

### **38. AUDITORIA PARA PARCEIROS**

**Campos adicionais em todas as tabelas de conteúdo:**
```sql
created_by_type: 'tenant_user' | 'ialum_editor' | 'ialum_partner'
created_by_company: string -- preenchido quando ialum_partner
```

**Tabela credits_transactions - campo adicional:**
```sql
credit_source: 'ialum_pool' | 'tenant_pool' -- origem dos créditos usados
```

### **39. POLÍTICAS RLS PARA PARCEIROS**

```sql
-- Política para parceiros acessarem apenas tenants autorizados
CREATE POLICY partner_tenant_access ON ALL TABLES
FOR ALL USING (
  -- Não é parceiro OU
  current_user_role() != 'ialum_partner' 
  OR 
  -- É parceiro E tem permissão para este tenant
  (
    current_user_role() = 'ialum_partner' 
    AND 
    tenant_id IN (
      SELECT tenant_id 
      FROM partner_permissions
      WHERE partner_user_id = auth.uid()
      AND (valid_until IS NULL OR valid_until > now())
    )
  )
);

-- Política para registrar origem correta em logs
CREATE POLICY partner_audit_trail ON system_logs
FOR INSERT WITH CHECK (
  CASE 
    WHEN current_user_role() = 'ialum_partner' THEN 
      user_type = 'ialum_partner' AND partner_company IS NOT NULL
    ELSE true
  END
);
```

### **40. ÍNDICES PARA PERFORMANCE DE PARCEIROS**

```sql
-- Índice para busca rápida de tenants autorizados
CREATE INDEX idx_partner_active_tenants 
ON partner_permissions(partner_user_id, tenant_id) 
WHERE valid_until IS NULL OR valid_until > now();

-- Índice para relatórios por parceiro
CREATE INDEX idx_content_by_partner 
ON topics(created_by, created_at) 
WHERE created_by_type = 'ialum_partner';

CREATE INDEX idx_publications_by_partner 
ON publications(created_by, created_at) 
WHERE created_by_type = 'ialum_partner';
```