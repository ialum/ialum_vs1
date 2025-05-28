# vs3 - Segurança - Ialum

## 🛡️ PRINCÍPIOS DE SEGURANÇA

1. **Defense in Depth:** Múltiplas camadas de proteção
2. **Zero Trust:** Sempre validar, nunca assumir
3. **Least Privilege:** Acesso mínimo necessário
4. **Audit Everything:** Log completo de ações

---

## 🔐 AUTENTICAÇÃO E AUTORIZAÇÃO

### **Autenticação (Quem é você?)**
```javascript
// Supabase Auth
- Email/senha com bcrypt
- JWT (24h) + Refresh tokens
- 2FA opcional para admins
- Rate limit: 5 tentativas/10min
```

### **Autorização (O que pode fazer?)**
```javascript
ROLES:
├── admin (tudo no tenant)
├── editor (criar/editar no tenant)
├── reviewer (aprovar no tenant)
├── viewer (somente leitura no tenant)
└── editor_ialum (operador Ialum multi-tenant)

PERMISSIONS editor_ialum:
{
  "can_access_multiple_tenants": true,
  "can_use_beta_features": true,
  "can_create_as_ialum": true,
  "visible_as_ialum_operator": true,
  "credit_source": "ialum_pool",
  "requires_client_approval": true,
  "max_tenants_per_day": 10
}

PERMISSIONS padrão:
{
  "can_create_posts": true,
  "can_approve_posts": false,
  "can_use_ai": true,
  "can_manage_billing": false
}
```

---

## 🔄 SISTEMA DE TOKENS DE NAVEGAÇÃO

### **Conceito:**
Toda navegação sensível usa token temporário único

### **Implementação:**
```javascript
// 1. Gerar token
const token = await criarTokenAcao('edit', {
  publication_id: 123,
  return_url: '/central'
});

// 2. Navegar com token
window.location = `/topico/12345?t=${token}`;

// 3. Validar no destino
const dados = await validarToken(token);
if (!dados) redirect('/erro-403');
```

### **Ações que exigem token:**
- ✅ Editar tópicos/publicações
- ✅ Aprovar conteúdo
- ✅ Acessar financeiro
- ✅ Alterar configurações
- ✅ Operações em lote

---

## 🗄️ SEGURANÇA NO BANCO

### **Row Level Security (RLS)**
```sql
-- Isolamento por tenant (usuários normais)
CREATE POLICY tenant_isolation ON topics
USING (
  tenant_id = current_tenant_id() 
  OR 
  (user_role() = 'editor_ialum' AND tenant_has_assisted_service())
);

-- Log especial para editores Ialum
CREATE POLICY ialum_audit ON topics
FOR INSERT
USING (user_role() = 'editor_ialum')
WITH CHECK (
  created_by_ialum = true
);
```

### **Campos Sensíveis:**
```sql
ENCRYPTED: cpf, cnpj, access_tokens
HASHED: action_tokens (SHA256)
MASKED: logs após 90 dias
```

### **Soft Delete:**
- Nunca deletar dados permanentemente
- Campo `active` ou `status = 'arquivado'`

---

## 📊 RISK SCORING AUTOMÁTICO

### **Eventos Monitorados:**
```javascript
PONTUAÇÃO:
├── Login falho: +10
├── Token inválido: +20
├── Acesso negado: +15
├── Navegação suspeita: +25
├── IP diferente: +5
└── Editor Ialum em horário incomum: +30

AÇÕES:
├── Score > 50: Alerta admin
├── Score > 100: Exigir 2FA
├── Score > 150: Bloquear 24h
└── Score > 200: Bloquear conta

EXCEÇÕES para editor_ialum:
├── Multi-tenant permitido
├── IPs variados esperados
└── Score threshold maior (300)
```

### **Padrões Suspeitos:**
- IDs sequenciais nas URLs
- Múltiplos tokens inválidos
- Velocidade anormal entre páginas
- Tentativas de acesso direto

---

## 🌐 SEGURANÇA N8N/WEBHOOKS

### **Webhooks Públicos (APIs externas)**
```javascript
VALIDAÇÃO:
├── Signature verification
├── IP whitelist por serviço
├── Payload máximo: 1MB
└── Rate limit: 100/min

IPS PERMITIDOS:
├── Meta: 173.252.74.0/24
├── Stripe: 54.187.174.169
└── Bannerbear: 54.229.85.0/24
```

### **Webhooks Privados (Frontend → N8N)**
```javascript
HEADERS OBRIGATÓRIOS:
Authorization: Bearer {jwt}
X-Tenant-ID: {tenant_uuid}
X-Signature: {hmac_sha256}
X-Timestamp: {unix_timestamp}
```

---

## 💳 SEGURANÇA FINANCEIRA

### **Fluxo de Pagamento:**
```
1. Frontend envia package_id
2. Backend valida preço real
3. Gateway processa pagamento
4. Webhook confirma (assinado)
5. Créditos adicionados
```

### **Anti-fraude:**
- Validação dupla de saldo
- Webhook signatures
- Prevenção pagamento duplicado
- Log completo com IP

---

## 📋 COMPLIANCE

### **LGPD:**
- Consentimento explícito
- Direito ao esquecimento
- Portabilidade de dados
- DPO designado

### **Dados de Pagamento:**
- PCI DSS via Stripe/PagSeguro
- Não armazenamos cartões
- Tokens seguros para recorrência

---

## 🚨 RESPOSTA A INCIDENTES

### **Detecção:**
```javascript
ALERTAS CRÍTICOS (imediato):
├── Múltiplos logins falhos
├── Tentativa de SQL injection
├── Token reuse
└── Mass data access

WARNINGS (diário):
├── Padrões anômalos
├── Picos de uso
└── Erros de integração
```

### **Plano de Ação:**
```
NÍVEL 1 (Suspeita):
└── Aumentar logs + monitorar

NÍVEL 2 (Confirmado):
├── Bloquear tenant
├── Revogar tokens
└── Notificar equipe

NÍVEL 3 (Breach):
├── Isolar sistema
├── Backup restore
└── Notificar autoridades
```

---

## 🔧 IMPLEMENTAÇÃO PRÁTICA

### **Checklist de Segurança:**
```
PRÉ-DEPLOY:
☐ Secrets em env vars
☐ HTTPS configurado
☐ RLS ativo em todas tabelas
☐ Rate limiting configurado
☐ Backup automático

PÓS-DEPLOY:
☐ Scan de vulnerabilidades
☐ Teste de penetração
☐ Monitoramento ativo
☐ Incident response drill
```

### **Para Desenvolvedores:**
```javascript
// SEMPRE validar no backend
if (!validateToken(token)) throw 403;
if (!checkPermission(user, action)) throw 403;
if (!verifyTenant(tenant_id)) throw 403;

// Para editores Ialum
if (user.role === 'editor_ialum') {
  validateIalumAccess(tenant_id);
  logIalumAction(action, tenant_id);
  markContentAsIalumCreated();
}

// NUNCA confiar no frontend
const price = getPackagePrice(package_id); // Não usar preço do frontend
const data = sanitizeInput(user_input); // Sempre sanitizar
```

---

## 📈 MÉTRICAS DE SEGURANÇA

### **KPIs:**
- Uptime: >99.9%
- Failed login rate: <1%
- Token validation: >98%
- Incident response: <2h
- Zero data breaches

### **Monitoramento:**
- Logs centralizados
- Alertas automáticos
- Dashboard de segurança
- Relatórios mensais