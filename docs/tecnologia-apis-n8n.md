# APIs N8N - Sistema Ialum

Este documento detalha todas as APIs do backend N8N utilizadas pelo sistema Ialum.

## 🔐 AUTENTICAÇÃO

### **Login**
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "usuario@example.com",
  "password": "senha123"
}

Response Success (200):
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid-123",
    "email": "usuario@example.com",
    "role": "admin",
    "tenant_id": "uuid-tenant",
    "tenant_name": "Banca Silva"
  }
}

Response Error (401):
{
  "error": "Credenciais inválidas"
}
```

### **Refresh Token**
```
POST /api/auth/refresh
Authorization: Bearer JWT_TOKEN

Response Success (200):
{
  "token": "NEW_JWT_TOKEN"
}
```

### **Logout**
```
POST /api/auth/logout
Authorization: Bearer JWT_TOKEN

Response Success (200):
{
  "message": "Logout realizado com sucesso"
}
```

---

## 📝 TÓPICOS

### **Listar Tópicos**
```
GET /api/topics
Authorization: Bearer JWT_TOKEN
Query Parameters:
  - status: ideia|rascunho|embasado (opcional)
  - theme_id: UUID (opcional)
  - search: string (opcional)
  - page: number (default: 1)
  - limit: number (default: 20)

Response Success (200):
{
  "topics": [
    {
      "id": "uuid-topic-1",
      "base_id": "12345",
      "title": "Contrato de Energia Solar",
      "subject": "Direitos do consumidor",
      "status": "embasado",
      "theme": {
        "id": "uuid-theme",
        "name": "Energia Solar",
        "icon": "☀️"
      },
      "lawyer": {
        "id": "uuid-lawyer",
        "name": "Dr. Silva"
      },
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-16T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### **Criar Tópico**
```
POST /api/topics
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "title": "Novo Tópico Jurídico",
  "subject": "Breve descrição",
  "theme_id": "uuid-theme",
  "lawyer_id": "uuid-lawyer"
}

Response Success (201):
{
  "id": "uuid-new-topic",
  "base_id": "67890",
  "title": "Novo Tópico Jurídico",
  "status": "ideia",
  "created_at": "2024-01-20T10:00:00Z"
}
```

### **Atualizar Tópico**
```
PUT /api/topics/:id
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "title": "Título Atualizado",
  "subject": "Descrição atualizada",
  "status": "rascunho",
  "embassment": "Texto do embasamento jurídico..."
}

Response Success (200):
{
  "id": "uuid-topic",
  "title": "Título Atualizado",
  "status": "rascunho",
  "updated_at": "2024-01-20T11:00:00Z"
}
```

### **Deletar Tópico**
```
DELETE /api/topics/:id
Authorization: Bearer JWT_TOKEN

Response Success (200):
{
  "message": "Tópico arquivado com sucesso"
}
```

---

## 📱 PUBLICAÇÕES

### **Listar Publicações**
```
GET /api/publications
Authorization: Bearer JWT_TOKEN
Query Parameters:
  - topic_id: UUID (opcional)
  - platform: instagram|linkedin|tiktok (opcional)
  - status: ideia|rascunho|concluido|agendado|publicado (opcional)
  - action_status: pausado|erro|arquivado (opcional)

Response Success (200):
{
  "publications": [
    {
      "id": "uuid-pub-1",
      "base_id": "IG_carrossel_12345",
      "topic_id": "uuid-topic",
      "platform": "instagram",
      "type": "carrossel",
      "status": "concluido",
      "action_status": null,
      "scheduled_date": null,
      "elements": [
        {
          "order": 1,
          "type": "cover",
          "title": "Título do Slide",
          "content": "Conteúdo do slide",
          "media_url": "https://..."
        }
      ]
    }
  ]
}
```

### **Criar Publicação**
```
POST /api/publications
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "topic_id": "uuid-topic",
  "platform": "instagram",
  "type": "carrossel",
  "elements": [
    {
      "order": 1,
      "type": "cover",
      "title": "Seus Direitos",
      "content": "Saiba mais sobre..."
    }
  ]
}

Response Success (201):
{
  "id": "uuid-new-pub",
  "base_id": "IG_carrossel_12345",
  "status": "rascunho",
  "created_at": "2024-01-20T12:00:00Z"
}
```

### **Agendar Publicação**
```
POST /api/publications/:id/schedule
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "scheduled_date": "2024-01-25T14:00:00Z",
  "timezone": "America/Sao_Paulo"
}

Response Success (200):
{
  "id": "uuid-pub",
  "status": "agendado",
  "scheduled_date": "2024-01-25T14:00:00Z"
}
```

---

## 🤖 IA E GERAÇÃO

### **Gerar Embasamento**
```
POST /api/ai/embassment
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "topic_id": "uuid-topic",
  "research_type": "complete|legal|jurisprudence",
  "narrative": "jornada_heroi"
}

Response Success (200):
{
  "embassment": "Texto completo do embasamento...",
  "references": [
    "Lei nº 14.300/2022",
    "STJ - REsp 1.234.567"
  ],
  "credits_used": 1
}
```

### **Gerar Publicação**
```
POST /api/ai/publication
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "topic_id": "uuid-topic",
  "platform": "instagram",
  "type": "carrossel",
  "style": "educativo",
  "slides_count": 10
}

Response Success (200):
{
  "elements": [
    {
      "order": 1,
      "type": "cover",
      "title": "Título Gerado",
      "content": "Conteúdo gerado",
      "image_prompt": "Prompt para imagem"
    }
  ],
  "caption": "Legenda gerada",
  "hashtags": ["#direito", "#advocacia"],
  "credits_used": 1
}
```

### **Gerar Imagem**
```
POST /api/ai/image
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "prompt": "Advogado moderno explicando direitos",
  "theme_id": "uuid-theme",
  "use_brand_colors": true
}

Response Success (200):
{
  "image_url": "https://cdn.ialum.com/images/generated-123.png",
  "credits_used": 1
}
```

---

## ⚙️ CONFIGURAÇÕES

### **Obter Configurações da Banca**
```
GET /api/settings/tenant
Authorization: Bearer JWT_TOKEN

Response Success (200):
{
  "tenant": {
    "id": "uuid-tenant",
    "name": "Banca Silva Advogados",
    "display_name": "banca_silva",
    "visual_identity": {
      "logo_url": "https://...",
      "primary_color": "#2563EB",
      "secondary_color": "#10B981",
      "font_primary": "Inter",
      "font_text": "Roboto"
    },
    "themes": [
      {
        "id": "uuid-theme-1",
        "name": "Energia Solar",
        "description": "Contratos e direitos...",
        "icon": "☀️"
      }
    ],
    "narratives": [
      {
        "id": "jornada_heroi",
        "name": "Jornada do Herói",
        "description": "Advogado como salvador..."
      }
    ]
  }
}
```

### **Atualizar Configurações**
```
PUT /api/settings/tenant
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "visual_identity": {
    "primary_color": "#1E40AF",
    "secondary_color": "#059669"
  }
}

Response Success (200):
{
  "message": "Configurações atualizadas com sucesso"
}
```

---

## 💳 CRÉDITOS E BILLING

### **Obter Saldo**
```
GET /api/billing/balance
Authorization: Bearer JWT_TOKEN

Response Success (200):
{
  "balance": 150,
  "plan": "professional",
  "monthly_limit": 500,
  "used_this_month": 234,
  "reset_date": "2024-02-01"
}
```

### **Histórico de Uso**
```
GET /api/billing/history
Authorization: Bearer JWT_TOKEN
Query Parameters:
  - start_date: YYYY-MM-DD
  - end_date: YYYY-MM-DD

Response Success (200):
{
  "transactions": [
    {
      "id": "uuid-transaction",
      "type": "ai_embassment",
      "credits": 1,
      "credit_source": "ialum_pool",
      "description": "Embasamento para tópico #12345",
      "created_at": "2024-01-20T10:30:00Z",
      "user": {
        "id": "uuid-user",
        "name": "João Silva",
        "role": "editor"
      }
    }
  ],
  "summary": {
    "total_used": 45,
    "ialum_pool": 40,
    "tenant_pool": 5
  }
}
```

---

## 📊 RELATÓRIOS

### **Métricas de Publicações**
```
GET /api/reports/publications
Authorization: Bearer JWT_TOKEN
Query Parameters:
  - start_date: YYYY-MM-DD
  - end_date: YYYY-MM-DD
  - platform: instagram|linkedin|tiktok (opcional)

Response Success (200):
{
  "metrics": {
    "total_publications": 45,
    "by_status": {
      "publicado": 30,
      "agendado": 10,
      "concluido": 5
    },
    "by_platform": {
      "instagram": 25,
      "linkedin": 15,
      "tiktok": 5
    },
    "engagement": {
      "total_views": 15000,
      "total_likes": 450,
      "total_comments": 89,
      "avg_engagement_rate": 3.5
    }
  },
  "top_publications": [
    {
      "id": "uuid-pub",
      "base_id": "IG_carrossel_12345",
      "title": "Direitos do Consumidor",
      "views": 2500,
      "engagement_rate": 5.2
    }
  ]
}
```

---

## 🔧 WEBHOOKS (N8N → Frontend)

### **Notificação de Publicação**
```
POST /webhook/publication-status
Headers:
  X-Webhook-Secret: SHARED_SECRET

Request:
{
  "publication_id": "uuid-pub",
  "status": "publicado",
  "platform": "instagram",
  "published_at": "2024-01-25T14:00:00Z",
  "platform_post_id": "123456789",
  "metrics": {
    "initial_reach": 150
  }
}
```

### **Atualização de Créditos**
```
POST /webhook/credits-update
Headers:
  X-Webhook-Secret: SHARED_SECRET

Request:
{
  "tenant_id": "uuid-tenant",
  "new_balance": 145,
  "transaction": {
    "type": "purchase",
    "amount": 100,
    "payment_id": "stripe_123"
  }
}
```

---

## 🚨 TRATAMENTO DE ERROS

### **Códigos de Status HTTP**
- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida
- `401`: Não autenticado
- `403`: Sem permissão
- `404`: Recurso não encontrado
- `422`: Dados inválidos
- `429`: Rate limit excedido
- `500`: Erro interno do servidor

### **Formato de Erro Padrão**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descrição legível do erro",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

### **Rate Limiting**
- **Padrão**: 100 requisições por minuto
- **IA**: 10 requisições por minuto
- **Upload**: 20 requisições por hora

Headers de resposta:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642076400
```

---

## 🔌 INTEGRAÇÃO COM MCP SERVERS

### **Invocar Agente IA**
```
POST /api/mcp/invoke
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

Request:
{
  "agent": "ialum-juridico",
  "action": "research",
  "context": {
    "topic_id": "uuid-topic",
    "theme": "energia_solar",
    "depth": "complete"
  }
}

Response Success (200):
{
  "result": {
    "research": "Conteúdo pesquisado...",
    "sources": ["Lei X", "Jurisprudência Y"]
  },
  "credits_used": 1,
  "processing_time": 2.5
}
```