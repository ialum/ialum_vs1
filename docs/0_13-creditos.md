# Sistema de Créditos - Ialum

Este documento detalha o sistema completo de gerenciamento de créditos no Ialum, incluindo pools duplos, cobrança por operações de IA, controle de saldo e relatórios de uso.

## 💳 CONCEITO GERAL

### **O que são Créditos**
- Unidade de medida para operações que consomem recursos externos
- 1 crédito = 1 operação de IA (pesquisa, geração de conteúdo, imagem)
- Sistema de duplo pool: **Ialum Pool** + **Tenant Pool**

### **Operações que Consomem Créditos**
```javascript
COBRA CRÉDITOS:
├── Geração de embasamento (1 crédito)
├── Criação de publicação por IA (1 crédito)
├── Geração de imagem (1 crédito)
├── Análise de métricas avançada (1 crédito)
└── Pesquisa jurídica automatizada (1 crédito)

GRATUITO:
├── Edições manuais
├── Agendamentos
├── Publicações sem IA
├── Navegação no sistema
└── Relatórios básicos
```

---

## 🏊 SISTEMA DE DUPLO POOL

### **Ialum Pool (Créditos Corporativos)**
- **Fonte**: Fornecidos pela Ialum para funcionários e parceiros
- **Uso**: `ialum_editor` e `ialum_partner` podem usar
- **Renovação**: Mensal, automática
- **Limite**: Configurável por usuário/parceiro

### **Tenant Pool (Créditos da Banca)**
- **Fonte**: Comprados pelo cliente final
- **Uso**: Todos os usuários do tenant
- **Renovação**: Compra manual ou assinatura
- **Limite**: Baseado no plano contratado

### **Ordem de Prioridade**
```javascript
// Para ialum_editor e ialum_partner
1. Usuário escolhe fonte (se allow_credit_choice = true)
2. Se não escolher, usa default_credit_source
3. Se pool escolhido = 0, pergunta se quer usar outro
4. Se ambos = 0, bloqueia operação

// Para usuários normais
1. Sempre usa tenant_pool
2. Se = 0, bloqueia operação
```

---

## 💰 PLANOS E PACOTES

### **Planos de Assinatura**
```javascript
STARTER:
├── 50 créditos/mês
├── 1 usuário admin
├── 2 usuários editor
└── Suporte email

PROFESSIONAL:
├── 200 créditos/mês
├── Usuários ilimitados
├── Templates personalizados
└── Suporte priority

ENTERPRISE:
├── 500+ créditos/mês
├── Multi-tenant
├── API access
├── Suporte dedicado
└── ialum_editor (se contratado)
```

### **Pacotes Avulsos**
```javascript
PACK_50: R$ 49 (50 créditos)
PACK_100: R$ 89 (100 créditos) - 10% desc
PACK_250: R$ 199 (250 créditos) - 20% desc
PACK_500: R$ 349 (500 créditos) - 30% desc
```

---

## 🏗️ ESTRUTURA NO BANCO

### **Tabela: credits_balance**
```sql
CREATE TABLE credits_balance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  
  -- Saldos atuais
  tenant_pool_balance integer DEFAULT 0,
  tenant_pool_used_month integer DEFAULT 0,
  
  -- Configurações do plano
  plan_type varchar(20) CHECK (plan_type IN ('starter', 'professional', 'enterprise')),
  monthly_limit integer DEFAULT 50,
  
  -- Controle de renovação
  billing_cycle_start date DEFAULT date_trunc('month', now()),
  next_renewal date DEFAULT (date_trunc('month', now()) + interval '1 month'),
  
  -- Auditoria
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  
  UNIQUE(tenant_id)
);
```

### **Tabela: credits_transactions**
```sql
CREATE TABLE credits_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  user_id uuid REFERENCES users(id),
  
  -- Detalhes da transação
  type varchar(30) CHECK (type IN (
    'ai_embassment', 'ai_publication', 'ai_image', 
    'ai_analysis', 'purchase', 'renewal', 'refund'
  )),
  credits integer NOT NULL, -- positivo = ganho, negativo = gasto
  credit_source varchar(20) CHECK (credit_source IN ('ialum_pool', 'tenant_pool')),
  
  -- Contexto
  description text,
  related_topic_id uuid,
  related_publication_id uuid,
  
  -- Dados de pagamento (se aplicável)
  payment_id varchar(100),
  payment_provider varchar(20), -- stripe, pagseguro
  payment_amount decimal(10,2),
  
  -- Auditoria
  created_at timestamp DEFAULT now(),
  
  -- Índices
  INDEX idx_tenant_transactions (tenant_id, created_at),
  INDEX idx_user_transactions (user_id, created_at),
  INDEX idx_credit_source (credit_source, created_at)
);
```

### **Tabela: ialum_credits_balance**
```sql
CREATE TABLE ialum_credits_balance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  
  -- Saldos para funcionários/parceiros Ialum
  ialum_pool_balance integer DEFAULT 0,
  ialum_pool_used_month integer DEFAULT 0,
  
  -- Configurações
  monthly_limit integer DEFAULT 100, -- configurável por usuário
  
  -- Controle de renovação
  billing_cycle_start date DEFAULT date_trunc('month', now()),
  next_renewal date DEFAULT (date_trunc('month', now()) + interval '1 month'),
  
  -- Auditoria
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  
  UNIQUE(user_id),
  
  -- Apenas para ialum_editor e ialum_partner
  CONSTRAINT ialum_users_only CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE user_role IN ('ialum_editor', 'ialum_partner')
    )
  )
);
```

---

## ⚙️ OPERAÇÕES DE CRÉDITO

### **Consumo de Crédito**
```javascript
// Função principal
async function consumeCredits(userId, operation, creditSource, metadata) {
  const user = await getUser(userId);
  const tenant = await getTenant(user.tenant_id);
  
  // Validar permissões
  if (!canUseCredits(user, creditSource)) {
    throw new Error('Permissão negada para usar esta fonte de créditos');
  }
  
  // Verificar saldo
  const balance = await getCreditBalance(user, creditSource);
  if (balance < 1) {
    if (user.role in ['ialum_editor', 'ialum_partner'] && user.allow_credit_choice) {
      // Oferecer pool alternativo
      const altSource = creditSource === 'ialum_pool' ? 'tenant_pool' : 'ialum_pool';
      const altBalance = await getCreditBalance(user, altSource);
      if (altBalance >= 1) {
        return await askUserAlternativeSource(altSource);
      }
    }
    throw new Error('Saldo insuficiente');
  }
  
  // Consumir crédito
  await transaction(async (tx) => {
    // Deduzir saldo
    await updateBalance(user, creditSource, -1, tx);
    
    // Registrar transação
    await createTransaction({
      tenant_id: user.tenant_id,
      user_id: user.id,
      type: operation,
      credits: -1,
      credit_source: creditSource,
      description: getOperationDescription(operation),
      related_topic_id: metadata.topic_id,
      related_publication_id: metadata.publication_id
    }, tx);
  });
  
  return true;
}
```

### **Compra de Créditos**
```javascript
// Fluxo de compra
async function purchaseCredits(tenantId, packageId, paymentData) {
  const package = await getPackage(packageId);
  const tenant = await getTenant(tenantId);
  
  // Processar pagamento
  const payment = await processPayment({
    amount: package.price,
    currency: 'BRL',
    description: `${package.credits} créditos - ${tenant.name}`,
    customer: tenant.billing_info
  });
  
  if (payment.status === 'approved') {
    await transaction(async (tx) => {
      // Adicionar créditos
      await updateBalance(tenant, 'tenant_pool', +package.credits, tx);
      
      // Registrar transação
      await createTransaction({
        tenant_id: tenantId,
        user_id: paymentData.user_id,
        type: 'purchase',
        credits: package.credits,
        credit_source: 'tenant_pool',
        description: `Compra de ${package.credits} créditos`,
        payment_id: payment.id,
        payment_provider: payment.provider,
        payment_amount: package.price
      }, tx);
    });
  }
  
  return payment;
}
```

### **Renovação Mensal**
```javascript
// Job automático (1º dia do mês)
async function monthlyRenewal() {
  // Renovar tenant pools
  const tenants = await getTenantsForRenewal();
  for (const tenant of tenants) {
    if (tenant.plan_type !== 'pay_as_go') {
      await resetMonthlyCredits(tenant);
    }
  }
  
  // Renovar ialum pools
  const ialumUsers = await getIalumUsersForRenewal();
  for (const user of ialumUsers) {
    await resetIalumCredits(user);
  }
}
```

---

## 📊 RELATÓRIOS E ANALYTICS

### **Dashboard de Créditos**
```javascript
// API endpoint: GET /api/billing/dashboard
{
  "current_balance": 150,
  "monthly_used": 23,
  "monthly_limit": 200,
  "days_remaining": 8,
  "burn_rate": 2.9, // créditos/dia
  "projection": {
    "end_of_month": 47,
    "will_exceed": false
  },
  "top_operations": [
    { "type": "ai_publication", "count": 12, "percentage": 52 },
    { "type": "ai_embassment", "count": 8, "percentage": 35 },
    { "type": "ai_image", "count": 3, "percentage": 13 }
  ]
}
```

### **Histórico Detalhado**
```javascript
// API endpoint: GET /api/billing/history
{
  "transactions": [
    {
      "id": "uuid-123",
      "date": "2024-01-20T14:30:00Z",
      "type": "ai_publication",
      "credits": -1,
      "description": "Geração de carrossel Instagram para tópico #12345",
      "user": {
        "name": "João Silva",
        "role": "editor"
      },
      "credit_source": "tenant_pool"
    }
  ],
  "summary": {
    "total_used": 45,
    "by_source": {
      "tenant_pool": 40,
      "ialum_pool": 5
    },
    "by_operation": {
      "ai_publication": 25,
      "ai_embassment": 15,
      "ai_image": 5
    }
  }
}
```

### **Relatório para Parceiros**
```javascript
// Para ialum_partner - relatório de uso por tenant
{
  "partner_id": "uuid-partner",
  "period": "2024-01",
  "tenants_accessed": [
    {
      "tenant_id": "uuid-tenant-1",
      "tenant_name": "Banca Silva",
      "credits_used": 15,
      "operations": [
        { "type": "ai_publication", "count": 10 },
        { "type": "ai_embassment", "count": 5 }
      ],
      "content_created": {
        "topics": 8,
        "publications": 25
      }
    }
  ],
  "total_credits_used": 45,
  "credit_sources": {
    "ialum_pool": 30,
    "tenant_pool": 15
  }
}
```

---

## 🚨 ALERTAS E NOTIFICAÇÕES

### **Alertas de Saldo Baixo**
```javascript
TRIGGERS:
├── 20% do limite mensal: warning
├── 10% do limite mensal: critical
├── 0 créditos: blocked
└── Projeção > limite: forecast_alert

AÇÕES:
├── Email para admin
├── Notificação in-app
├── Sugestão de upgrade
└── Bloqueio preventivo
```

### **Alertas para Ialum**
```javascript
// Monitoramento de uso excessivo
IALUM_ALERTS:
├── Partner usando > 80% do limite: review_needed
├── Tenant com uso 300% acima da média: investigation
├── Operações falhando por crédito: system_issue
└── Padrão anômalo de uso: fraud_check
```

---

## 🔒 SEGURANÇA E CONTROLES

### **Validações**
```javascript
SECURITY_CHECKS:
├── Rate limiting: 10 operações/minuto
├── Dupla validação: frontend + backend
├── Log completo de transações
├── Impossibilidade de saldo negativo
└── Auditoria de operações suspeitas
```

### **Prevenção de Fraude**
```javascript
FRAUD_DETECTION:
├── Uso em horários anômalos
├── Spike súbito de operações
├── Padrões não humanos
├── IPs suspeitos
└── Operações sem contexto válido
```

---

## 🛠️ CONFIGURAÇÕES AVANÇADAS

### **Por Tenant**
```javascript
tenant_credit_config: {
  "auto_purchase": false,
  "low_balance_threshold": 20,
  "max_daily_usage": 50,
  "allow_overdraft": false,
  "preferred_payment_method": "stripe"
}
```

### **Por Usuário Ialum**
```javascript
ialum_user_config: {
  "monthly_limit": 100,
  "can_exceed_limit": false,
  "default_credit_source": "ialum_pool",
  "allow_credit_choice": true,
  "require_approval_over": 50
}
```

### **Por Parceiro**
```javascript
partner_config: {
  "global_monthly_limit": 200,
  "per_tenant_limit": 30,
  "can_use_tenant_credits": true,
  "require_justification": true,
  "auto_report_frequency": "weekly"
}
```

---

## 📈 MÉTRICAS DE NEGÓCIO

### **KPIs Operacionais**
- Taxa de conversão crédito → receita
- Custo por operação de IA
- Eficiência de uso (operações/crédito)
- Tempo médio entre compras

### **KPIs de Produto**
- Operações mais usadas
- Horários de pico
- Sazonalidade de uso
- Satisfação por tipo de operação

### **KPIs Financeiros**
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- Customer Lifetime Value
- Churn rate por esgotamento