# Sistema de Notificações - Ialum

Este documento define o sistema básico de notificações do Ialum. **NOTA**: Este é um esboço inicial que será detalhado após finalização da documentação de APIs N8N e fluxo de publicações.

## 🔔 TIPOS DE NOTIFICAÇÃO

### **In-App (Sistema)**
- Alertas de publicação
- Confirmações de ações
- Status de processamento
- Erros críticos

### **Push/Email (Externas)**
- Falhas em publicações agendadas
- Créditos baixos
- Relatórios semanais
- Alertas de segurança

---

## 📱 CANAIS DE ENTREGA

### **Frontend Notifications**
- Toast messages
- Sidebar notifications
- Badge counters
- Modal alerts

### **External Channels**
- Email (transacional)
- Webhook callbacks
- Dashboard alerts

---

## ⚡ EVENTOS BÁSICOS

### **Publicação**
- Publicação bem-sucedida
- Falha na publicação
- Agendamento confirmado
- Métricas disponíveis

### **Sistema**
- Créditos esgotados
- Erro de integração
- Backup completo
- Manutenção programada

### **Segurança**
- Login suspeito
- Token inválido
- Tentativa de acesso negado

---

## 🚧 A DEFINIR

**Pendente após finalização:**
- Webhooks específicos do N8N
- Eventos detalhados do fluxo de publicação
- Integração com provedores de email
- Sistema de preferências de usuário
- Frequência e agrupamento
- Templates de mensagens

**Dependências:**
- `0_10-apis-n8n.md` (webhooks)
- `0_11-fluxo-publicacao.md` (eventos)