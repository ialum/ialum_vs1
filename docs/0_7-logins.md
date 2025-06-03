# Gerenciamento de Usuários e Acessos - Detalhamento

Este documento detalha todas as páginas relacionadas ao gerenciamento de usuários, logins, acessos e funcionalidades administrativas do sistema Ialum.

## 🔑 ESTRUTURA DE ACESSOS

### **Tipos de Usuários**

1. **ialum_master** - Administrador supremo do sistema Ialum
2. **ialum_editor** - Funcionários Ialum com acesso multi-tenant
3. **ialum_partner** - Parceiros externos (agências/freelancers) com acesso a bancas específicas
4. **admin** - Administrador da banca (tenant)
5. **editor** - Editor de conteúdo da banca
6. **reviewer** - Revisor de conteúdo da banca
7. **viewer** - Visualizador (somente leitura)

---

## 🚪 PÁGINAS DE LOGIN

### **1. LOGIN PRINCIPAL**

**Rota**: `/login`

#### **Componentes**
- Logo Ialum centralizada
- Formulário de login
  - Email
  - Senha
  - Checkbox "Manter conectado"
- Link "Esqueci minha senha"
- Link "Criar conta" (para novas bancas)
- Indicador de ambiente (produção/teste)

#### **Validações**
- Email válido
- Senha mínimo 8 caracteres
- Rate limiting: 5 tentativas em 10 minutos
- Captcha após 3 tentativas falhas

#### **Fluxo de Autenticação**
1. Validação de credenciais
2. Verificação de tenant ativo
3. Checagem de 2FA (se habilitado)
4. Geração de JWT token
5. Redirecionamento baseado em role

---

### **2. LOGIN MULTI-TENANT (IALUM)**

**Rota**: `/admin/login`

#### **Componentes**
- Logo Ialum com badge "Admin"
- Formulário especializado
  - Email corporativo Ialum
  - Senha
  - Código 2FA (obrigatório)
- Indicador de segurança elevada

#### **Validações Adicionais**
- Domínio @ialum.com.br obrigatório
- 2FA sempre ativo
- IP whitelist
- Horário de acesso permitido

#### **Pós-Login**
- Dashboard administrativo
- Lista de tenants disponíveis
- Métricas globais do sistema

---

## 👥 PÁGINAS DE GERENCIAMENTO DE USUÁRIOS

### **3. CADASTRO DE USUÁRIOS (TENANT)**

**Rota**: `/app/conta/usuarios`

#### **Listagem de Usuários**
- Tabela com todos os usuários do tenant
- Colunas: Nome, Email, Cargo, Status, Último acesso
- Filtros: Por cargo, status, busca
- Ações: Editar, Ativar/Desativar, Logs

#### **Adicionar Usuário**
Modal com campos:
- Nome completo
- Email
- Cargo/Role
- Departamento (opcional)
- Telefone (opcional)
- Permissões customizadas

#### **Editar Usuário**
- Todos os campos do cadastro
- Histórico de ações
- Reset de senha
- Forçar logout
- Alterar permissões

#### **Permissões Granulares**
```javascript
{
  // Conteúdo
  "can_create_topics": true,
  "can_edit_topics": true,
  "can_delete_topics": false,
  "can_publish": true,
  "can_schedule": true,
  
  // Financeiro
  "can_view_billing": false,
  "can_manage_billing": false,
  
  // Configurações
  "can_access_settings": true,
  "can_edit_settings": false,
  
  // Relatórios
  "can_view_reports": true,
  "can_export_reports": false
}
```

---

### **4. PERFIL DO USUÁRIO**

**Rota**: `/app/conta/perfil`

#### **Seções**

**4.1 Dados Pessoais**
- Foto de perfil
- Nome completo
- Email (somente leitura)
- Telefone
- Cargo/Função
- Bio/Descrição

**4.2 Configurações de Acesso**
- Alterar senha
- Ativar/Desativar 2FA
- Sessões ativas
- Dispositivos autorizados

**4.3 Preferências**
- Notificações email
- Notificações push
- Idioma
- Fuso horário
- Tema (claro/escuro)

**4.4 Atividades Recentes**
- Últimos logins
- Ações realizadas
- IPs de acesso
- Alertas de segurança

---

## 💳 PÁGINAS FINANCEIRAS

### **5. GERENCIAMENTO FINANCEIRO**

**Rota**: `/app/conta/financeiro`

#### **Dashboard Financeiro**
- Saldo atual de créditos
- Consumo do mês
- Próxima renovação
- Histórico de uso

#### **Dados da Empresa (Faturamento)**
- Razão social
- CNPJ
- Inscrição Estadual (opcional)
- Endereço completo
- Telefone comercial
- Email para notas fiscais
- Responsável financeiro
- **Validações**: CNPJ válido, email válido

#### **Planos e Assinaturas**
- Plano atual
- Benefícios incluídos
- Comparativo de planos
- Botão de upgrade

#### **Compra de Créditos**
- Pacotes disponíveis
- Preços e descontos
- Formas de pagamento
- Histórico de compras

#### **Faturas e Pagamentos**
- Lista de faturas
- Status (pago/pendente)
- Download de notas fiscais
- Métodos de pagamento salvos

#### **Relatórios Financeiros**
- Consumo por período
- Consumo por usuário
- Consumo por tipo (IA, imagens)
- Exportar para Excel

---

## 🤝 PÁGINAS DE PARCERIAS

### **6. GESTÃO DE PARCERIAS**

**Rota**: `/app/conta/parcerias`

#### **Para Bancas (Tenants)**
- Status da parceria com Ialum
- Benefícios ativos
- Termos e condições
- Solicitar suporte assistido

#### **Para Ialum (Admin)**
- Lista de parceiros
- Níveis de parceria
- Comissionamento
- Relatórios de performance

---

## 🛡️ PÁGINA ADMINISTRATIVA IALUM

### **7. ADMIN DASHBOARD**

**Rota**: `/admin/dashboard`
**Acesso**: Apenas `ialum_master`

#### **Métricas Globais**
- Total de tenants ativos
- Usuários totais
- Consumo de recursos
- Receita mensal
- Tickets de suporte

#### **Ações Rápidas**
- Criar novo tenant
- Broadcast mensagem
- Manutenção do sistema
- Backup manual

---

### **8. GERENCIAMENTO MULTI-TENANT**

**Rota**: `/admin/multi-tenant`
**Acesso**: Apenas `ialum_master`

#### **8.1 Gestão de Tenants**

**Listagem de Tenants**
```
┌─────────────────────────────────────────────────────┐
│ Tenant ID │ Nome Banca │ Status │ Plano │ Usuários │
├─────────────────────────────────────────────────────┤
│ uuid-123  │ Banca Silva│ Ativo  │ Pro   │ 5/10     │
│ uuid-456  │ Banca Lima │ Ativo  │ Basic │ 2/5      │
│ uuid-789  │ Banca Santos│ Trial │ Trial │ 1/3      │
└─────────────────────────────────────────────────────┘
```

**Ações por Tenant**
- Ver detalhes completos
- Ativar/Desativar
- Alterar plano
- Resetar senha admin
- Ver logs de acesso
- Autorizar editor_ialum

#### **8.2 Gestão de Editores Ialum**

**Listagem de Operadores**
```
┌────────────────────────────────────────────────────────┐
│ Nome │ Email │ Status │ Tenants Hoje │ Score │ Ações │
├────────────────────────────────────────────────────────┤
│ João │ joao@ialum│ Ativo │ 3/10 │ 95 │ [Ver][Edit] │
│ Maria│ maria@ialum│ Ativo │ 7/10 │ 98 │ [Ver][Edit] │
└────────────────────────────────────────────────────────┘
```

**Criar Novo Editor Ialum**
- Dados pessoais
- Credenciais de acesso
- Limites diários
- Horários permitidos
- Tenants iniciais autorizados

**Autorização de Acesso a Tenant**
```
Formulário de Autorização:
┌─────────────────────────────────────┐
│ Editor: João Silva                   │
│ Tenant: Banca Lima Legal            │
│                                     │
│ Período de Acesso:                  │
│ ○ Permanente                        │
│ ● Temporário                        │
│   De: [01/01/2024]                  │
│   Até: [31/01/2024]                 │
│                                     │
│ Permissões Especiais:               │
│ ☑ Criar conteúdo                   │
│ ☑ Editar conteúdo                  │
│ ☐ Aprovar conteúdo                 │
│ ☐ Publicar conteúdo                │
│ ☑ Usar créditos Ialum              │
│                                     │
│ Motivo/Observações:                 │
│ [Suporte para criação de conteúdo  │
│  durante período de alta demanda]   │
│                                     │
│ [Cancelar] [Autorizar]              │
└─────────────────────────────────────┘
```

#### **8.3 Monitoramento de Atividades**

**Dashboard de Atividades Multi-tenant**
- Gráfico de acessos por hora
- Tenants mais acessados
- Ações realizadas por tipo
- Alertas de comportamento suspeito

**Logs Detalhados**
```
┌──────────────────────────────────────────────────────────┐
│ Data/Hora │ Editor │ Tenant │ Ação │ Detalhes │ IP     │
├──────────────────────────────────────────────────────────┤
│ 10:30:45  │ João   │ Banca A│ Login│ Sucesso  │ 1.2.3.4│
│ 10:35:12  │ João   │ Banca A│ Criar│ Topic #123│ 1.2.3.4│
│ 11:15:00  │ João   │ Banca B│ Login│ Sucesso  │ 1.2.3.4│
└──────────────────────────────────────────────────────────┘
```

#### **8.4 Configurações de Segurança Multi-tenant**

**Regras Globais**
- Máximo de tenants por dia por editor
- Horários permitidos para acesso
- IPs autorizados
- Tempo máximo de sessão por tenant

**Risk Scoring Específico**
- Threshold para editor_ialum: 300 pontos
- Ações automáticas por score
- Notificações para admin

---

### **9. PÁGINA DE AUTORIZAÇÃO PARA CLIENTE**

**Rota**: `/app/autorizar-ialum`
**Acesso**: Apenas `admin` do tenant

#### **Solicitação de Serviço Assistido**

**Formulário de Solicitação**
```
┌─────────────────────────────────────────┐
│ Solicitar Serviço Assistido Ialum       │
├─────────────────────────────────────────┤
│                                         │
│ Período desejado:                       │
│ ○ 1 semana                             │
│ ● 1 mês                                 │
│ ○ 3 meses                              │
│ ○ Personalizado: [___] a [___]         │
│                                         │
│ Tipo de ajuda necessária:              │
│ ☑ Criação de conteúdo                  │
│ ☑ Revisão e melhoria                   │
│ ☐ Agendamento de publicações           │
│ ☑ Estratégia de conteúdo               │
│                                         │
│ Volume esperado:                        │
│ [20] publicações por mês                │
│                                         │
│ Observações:                            │
│ [Precisamos de ajuda para aumentar     │
│  nossa presença digital...]             │
│                                         │
│ ⓘ Um operador Ialum terá acesso aos    │
│   seus tópicos e publicações durante    │
│   o período autorizado.                 │
│                                         │
│ [Cancelar] [Enviar Solicitação]         │
└─────────────────────────────────────────┘
```

**Gerenciar Autorizações Ativas**
- Lista de autorizações vigentes
- Histórico de acessos do editor_ialum
- Logs de ações realizadas
- Opção de revogar acesso

---

## 🔒 SEGURANÇA E AUDITORIA

### **10. LOGS DE ACESSO E SEGURANÇA**

**Rota**: `/app/conta/seguranca`

#### **Para Usuários Normais**
- Histórico de login
- Dispositivos autorizados
- Alertas de segurança
- Configurar 2FA

#### **Para Admins de Tenant**
- Logs de todos os usuários
- Tentativas de acesso negado
- Ações administrativas
- Exportar logs

#### **Para Ialum Master**
- Logs globais do sistema
- Análise de comportamento
- Detecção de anomalias
- Resposta a incidentes

---

## 📊 RELATÓRIOS DE ACESSO

### **11. ANALYTICS DE USUÁRIOS**

**Métricas Disponíveis**
- Usuários ativos por período
- Horários de pico de uso
- Features mais utilizadas
- Taxa de adoção de novas funcionalidades

**Para Editor Ialum**
- Tenants atendidos
- Publicações criadas por tenant
- Tempo médio por tenant
- Score de qualidade

---

## 🤝 SISTEMA DE PARCEIROS IALUM

### **12. GESTÃO DE PARCEIROS**

**Rota**: `/admin/parceiros`
**Acesso**: Apenas `ialum_master`

#### **12.1 Diferenças entre Editor e Partner**

**ialum_editor** (Funcionário Ialum):
- Funcionário interno da Ialum
- Acesso a qualquer tenant com serviço assistido ativo
- Limite de 10 tenants diferentes por dia
- Identificado sempre como "Operador Ialum"

**ialum_partner** (Parceiro Externo):
- Agências, freelancers ou parceiros comerciais
- Acesso APENAS a tenants específicos autorizados
- Sem limite diário (acessa apenas os permitidos)
- Identificado como "Parceiro [Nome/Empresa]"

#### **12.2 Sistema de Créditos Flexível**

**Para TODOS os operadores multi-tenant (ialum_editor e ialum_partner)**:
- Podem escolher origem dos créditos por operação
- Opções: Pool Ialum ou Pool do Tenant
- Configuração de origem padrão por usuário
- Registro detalhado da origem em cada uso

#### **12.3 Cadastro de Parceiro**

**Formulário de Novo Parceiro**:
```
┌─────────────────────────────────────────┐
│ CADASTRAR NOVO PARCEIRO                  │
├─────────────────────────────────────────┤
│                                         │
│ Nome: [_______________________]         │
│ Email: [_____________________]          │
│ Empresa (opcional): [________]          │
│ Telefone: [_________________]           │
│                                         │
│ BANCAS AUTORIZADAS:                     │
│ ☑ Banca Silva Legal                     │
│ ☐ Banca Lima Advogados                 │
│ ☑ Banca Santos & Associados            │
│ ☐ Banca Costa Jurídico                 │
│                                         │
│ PERMISSÕES:                             │
│ ☑ Criar tópicos                        │
│ ☑ Embasar tópicos                      │
│ ☑ Criar publicações                    │
│ ☑ Editar publicações                   │
│ ☐ Aprovar conteúdo                     │
│ ☐ Publicar direto                      │
│                                         │
│ CRÉDITOS PADRÃO:                        │
│ ● Pool Ialum                            │
│ ○ Pool do Tenant                        │
│ ☑ Permitir escolha por operação        │
│                                         │
│ [Cancelar] [Criar Parceiro]             │
└─────────────────────────────────────────┘
```

#### **12.4 Dashboard de Parceiros**

**Lista de Parceiros Ativos**:
```
┌────────────────────────────────────────────────────────────┐
│ Nome │ Empresa │ Bancas │ Status │ Criado em │ Ações      │
├────────────────────────────────────────────────────────────┤
│ João │ XYZ Digital │ 3 │ Ativo │ 01/01/24 │ [Ver][Edit] │
│ Maria│ Freelancer │ 2 │ Ativo │ 15/01/24 │ [Ver][Edit] │
│ Pedro│ ABC Agency │ 5 │ Pausado│ 20/12/23 │ [Ver][Edit] │
└────────────────────────────────────────────────────────────┘
```

#### **12.5 Relatório Detalhado por Parceiro**

```
RELATÓRIO DE ATIVIDADES - PARCEIRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Período: 01/03/2024 a 31/03/2024
Parceiro: João Silva
Empresa: Agência XYZ Digital

POR BANCA:
┌──────────────────────────────────────────────┐
│ BANCA SILVA LEGAL                            │
│                                              │
│ TÓPICOS:                                     │
│ • Tópicos criados: 12                        │
│ • Tópicos embasados: 10                      │
│ • Taxa de embasamento: 83%                   │
│                                              │
│ PUBLICAÇÕES:                                 │
│ • Publicações criadas: 15                    │
│ • Publicações editadas: 8                    │
│ • Status: 10 publicadas, 5 agendadas        │
│                                              │
│ CRÉDITOS:                                    │
│ • Créditos Ialum usados: 18                  │
│ • Créditos Banca usados: 2                   │
│ • Total: 20                                  │
├──────────────────────────────────────────────┤
│ BANCA SANTOS & ASSOCIADOS                    │
│                                              │
│ TÓPICOS:                                     │
│ • Tópicos criados: 25                        │
│ • Tópicos embasados: 20                      │
│ • Taxa de embasamento: 80%                   │
│                                              │
│ PUBLICAÇÕES:                                 │
│ • Publicações criadas: 30                    │
│ • Publicações editadas: 15                   │
│ • Status: 25 publicadas, 5 rascunho         │
│                                              │
│ CRÉDITOS:                                    │
│ • Créditos Ialum usados: 40                  │
│ • Créditos Banca usados: 8                   │
│ • Total: 48                                  │
└──────────────────────────────────────────────┘

RESUMO GERAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tópicos criados: 37
• Tópicos embasados: 30 (81%)
• Publicações criadas: 45
• Publicações editadas: 23
• Taxa de publicação: 77%

CRÉDITOS TOTAIS:
• Pool Ialum: 58 créditos
• Pool Bancas: 10 créditos
• Total geral: 68 créditos

PERFORMANCE:
• Média de tópicos/dia: 1.2
• Média de publicações/dia: 1.5
• Taxa de aproveitamento: 85%

[Exportar PDF] [Exportar Excel]
```

#### **12.6 Interface de Uso de Créditos**

Quando qualquer operador multi-tenant (editor ou parceiro) for usar IA:

```
┌─────────────────────────────────────┐
│ Gerar Conteúdo com IA               │
├─────────────────────────────────────┤
│ Operação: Embasar tópico            │
│                                     │
│ Usar créditos de:                   │
│ ○ Pool Ialum (Saldo: 500)          │
│ ● Pool Banca Silva (Saldo: 120)    │
│                                     │
│ ⓘ Esta operação consumirá 1 crédito │
│                                     │
│ [Cancelar] [Gerar]                  │
└─────────────────────────────────────┘
```

#### **12.7 Gestão de Permissões por Banca**

**Editar Acesso do Parceiro**:
```
┌─────────────────────────────────────────┐
│ Parceiro: João Silva                     │
│ Banca: Banca Silva Legal                 │
├─────────────────────────────────────────┤
│                                         │
│ PERÍODO DE ACESSO:                      │
│ ○ Permanente                            │
│ ● Temporário                            │
│   De: [01/03/2024]                      │
│   Até: [31/12/2024]                     │
│                                         │
│ PERMISSÕES NESTA BANCA:                 │
│ ☑ Criar tópicos                        │
│ ☑ Embasar tópicos                      │
│ ☑ Criar publicações                    │
│ ☑ Editar publicações                   │
│ ☐ Aprovar conteúdo                     │
│ ☐ Publicar direto                      │
│                                         │
│ ORIGEM DE CRÉDITOS PADRÃO:             │
│ ● Pool Ialum                            │
│ ○ Pool desta Banca                      │
│                                         │
│ [Revogar Acesso] [Salvar Alterações]    │
└─────────────────────────────────────────┘
```

#### **12.8 Auditoria de Parceiros**

**Logs Específicos**:
- Todas as ações são registradas com `created_by_type: 'ialum_partner'`
- Campo adicional `partner_company` identifica a empresa
- Rastreamento de origem dos créditos em cada operação
- Alertas automáticos para comportamentos suspeitos

#### **12.9 Implementação no Banco de Dados**

**Alterações necessárias**:

```sql
-- Tabela users (adicionar campos)
user_subtype: 'employee' | 'partner' | null
partner_company: string -- nome da agência/empresa

-- Nova tabela: partner_permissions
CREATE TABLE partner_permissions (
  id uuid PRIMARY KEY,
  partner_user_id uuid REFERENCES users(id),
  tenant_id uuid REFERENCES tenants(id),
  can_create_topics boolean DEFAULT true,
  can_embased_topics boolean DEFAULT true,
  can_create_publications boolean DEFAULT true,
  can_edit_publications boolean DEFAULT true,
  can_approve boolean DEFAULT false,
  can_publish boolean DEFAULT false,
  default_credit_source 'ialum' | 'tenant' DEFAULT 'ialum',
  allow_credit_choice boolean DEFAULT true,
  valid_from timestamp DEFAULT now(),
  valid_until timestamp, -- null = permanente
  created_at timestamp DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Logs de créditos (adicionar campo)
credit_source: 'ialum_pool' | 'tenant_pool'
```

---

## 🚀 FLUXOS ESPECIAIS

### **Onboarding de Nova Banca**
1. Cadastro inicial
2. Verificação de email
3. Configuração da banca
4. Criação do primeiro usuário admin
5. Tour guiado

### **Processo de Autorização Editor Ialum**
1. Banca solicita serviço assistido
2. Ialum analisa e aprova
3. Designa editor_ialum
4. Cliente recebe notificação
5. Editor começa a trabalhar

### **Recuperação de Acesso**
1. Link "Esqueci senha"
2. Email de verificação
3. Token temporário (15 min)
4. Nova senha
5. Forçar novo login

---

## 💡 BOAS PRÁTICAS

### **Para Admins de Tenant**
- Revisar logs semanalmente
- Manter usuários atualizados
- Usar roles apropriados
- Ativar 2FA para admins

### **Para Ialum Master**
- Monitorar editor_ialum diariamente
- Revisar autorizações mensalmente
- Manter documentação atualizada
- Treinar novos operadores

### **Para Editor Ialum**
- Sempre se identificar ao cliente
- Registrar motivo das ações
- Respeitar limites diários
- Comunicar anomalias