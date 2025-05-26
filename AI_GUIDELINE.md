# 🤖 AI_GUIDELINES.md - Diretrizes para IAs do Projeto Ialum

## 📋 SOBRE ESTE DOCUMENTO
Este documento orienta IAs futuras sobre as decisões arquiteturais do projeto Ialum. Leia COMPLETAMENTE antes de sugerir mudanças.

---

## 🎯 CONTEXTO DO PROJETO

### **Sobre o Ialum**
- **Tipo:** SaaS brasileiro para automação de marketing jurídico educativo
- **Público:** Advogados e escritórios de advocacia
- **Objetivo:** Criar e publicar conteúdo automatizado em redes sociais
- **Diferencial:** Foco em segurança e conteúdo jurídico especializado

### **Stack Tecnológico**
- **Frontend:** HTML/CSS/JavaScript vanilla (SEM frameworks)
- **Backend:** N8N (automação) + Supabase (banco + auth)
- **IA:** 
  - **Texto:** OpenAI (conteúdo principal)
  - **Pesquisa:** Perplexity + Anthropic
  - **Imagens:** OpenAI DALL-E 3 + Google Gemini
  - **Vídeos:** Google Gemini
  - **Templates:** Bannerbear (montagem final)
- **Deploy:** EasyPanel com Nixpacks
- **Pagamento:** Stripe + PagSeguro

### **Ambiente de Desenvolvimento**
- **Editor:** Visual Studio Code
- **Versionamento:** GitHub (via interface VS Code)
- **Deploy:** Automático via EasyPanel
- **Git:** NÃO fornecer comandos git

---

## 🏗️ DECISÕES ARQUITETURAIS CRÍTICAS

### **1. SEM FRAMEWORKS DE BUILD**
- ❌ NÃO usar Webpack, Vite, Rollup
- ❌ NÃO usar React, Vue, Angular
- ✅ JavaScript vanilla com módulos simples
- **Motivo:** Arquivos pequenos para IAs + simplicidade

### **2. ESTRUTURA DE PASTAS DEFINITIVA**
```
ialum_vs1/
├── public/              # Nginx serve tudo aqui
│   ├── css/
│   │   ├── base/       # reset, variables, typography
│   │   ├── components/ # buttons, forms, cards
│   │   └── pages/      # landing, dashboard, etc
│   ├── js/
│   │   ├── core/       # api, auth, router
│   │   ├── components/ # modular
│   │   └── pages/      # específico
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── index.html      # landing
│   ├── login.html      # login
│   └── app.html        # SPA container
│
├── app/                # Protegido pelo N8N
│   └── templates/      # Apenas HTMLs do SPA
│       ├── pages/
│       └── components/
│
├── nixpacks.toml      # Config do EasyPanel
└── AI_GUIDELINES.md   # Este arquivo
```

### **3. CONFIGURAÇÃO EASYPANEL/NIXPACKS**
```toml
# nixpacks.toml
providers = ["staticfile"]
[staticDirs]
"/" = "public"
```
**Importante:** EasyPanel serve `/public/` como raiz

### **4. SISTEMA DE SEGURANÇA**
- **Autenticação:** Supabase Auth + JWT
- **Multi-tenant:** RLS com tenant_id
- **Navegação:** Tokens temporários para ações sensíveis
- **Dados sensíveis:** Inline nos templates HTML, nunca em JS

---

## 📏 REGRAS PARA ARQUIVOS

### **TAMANHOS MÁXIMOS**
- CSS: ~150 linhas
- JS: ~200 linhas
- HTML: ~300 linhas
- **Excedeu?** Dividir em múltiplos arquivos

### **NOMENCLATURA**
```
[contexto]-[função].[ext]

Exemplos:
- dashboard-widgets.css
- topicos-validation.js
- auth-utils.js
```

### **CABEÇALHO OBRIGATÓRIO**
```javascript
/**
 * dashboard-widgets.js
 * Descrição: Widgets do dashboard principal
 * Dependências: api.js, utils.js
 * Usado em: dashboard.html
 * Tamanho alvo: <200 linhas
 */
```

### **CAMINHOS DE ARQUIVOS**
```html
<!-- SEMPRE usar / no início (caminho absoluto) -->
<link rel="stylesheet" href="/css/landing.css">
<script src="/js/landing.js"></script>

<!-- NUNCA usar -->
<link rel="stylesheet" href="css/landing.css">  ❌
<link rel="stylesheet" href="./css/landing.css"> ❌
```

---

## 🔧 PADRÕES DE CÓDIGO

### **SISTEMA DE MÓDULOS**
```javascript
// NÃO usar import/export ES6
import { api } from './api.js'; ❌

// USAR objeto global
window.IalumModules = window.IalumModules || {};
window.IalumModules.API = {
    async call(endpoint) { ... }
};
```

### **ORDEM DE CARREGAMENTO CSS**
```html
<!-- 1. Base (reset, variáveis) -->
<link rel="stylesheet" href="/css/base/reset.css">
<link rel="stylesheet" href="/css/base/variables.css">

<!-- 2. Componentes -->
<link rel="stylesheet" href="/css/components/buttons.css">

<!-- 3. Página específica -->
<link rel="stylesheet" href="/css/pages/dashboard.css">
```

### **CONVENÇÕES CSS**
```css
/* BEM simplificado */
.component {}
.component__element {}
.component--modifier {}

/* Variáveis no :root */
:root {
    --primary: #2563eb;
    --spacing-sm: 8px;
}
```

---

## 🗄️ BANCO DE DADOS

### **Multi-tenant com tenant_id**
- Banco compartilhado
- RLS em todas as tabelas
- UUID para tenant_id

### **Sistema de IDs**
- **user_id:** Integer auto-increment
- **base_id:** 5 dígitos aleatórios
- **full_id:** base_id + plataforma (ex: "12345-IGcars")

### **Fluxo de Status**
```
Topics: ideia → rascunho → embasado
Publications: rascunho → aprovado → agendado → publicado
```

---

## 🚫 O QUE NÃO FAZER

1. ❌ Sugerir frameworks ou bundlers
2. ❌ Criar arquivos >200 linhas
3. ❌ Usar import/export ES6
4. ❌ Colocar dados sensíveis em JS
5. ❌ Mudar estrutura de pastas
6. ❌ Fornecer comandos git
7. ❌ Usar caminhos relativos

---

## ✅ CHECKLIST PARA IA

Antes de criar/modificar código:
- [ ] Arquivo terá <200 linhas?
- [ ] Nome descritivo do arquivo?
- [ ] Cabeçalho com dependências?
- [ ] Caminho usa / absoluto?
- [ ] Segue padrão de módulos?
- [ ] Dados sensíveis protegidos?
- [ ] Documentado onde adicionar no HTML?

---

## 📝 EXEMPLO DE RESPOSTA IDEAL

```
"Vou criar a validação de formulário em arquivo separado:

📄 /public/js/components/form-validator.js (120 linhas)
- Validação genérica para forms
- Dependências: utils.js
- Adicionar em login.html após core/utils.js

O arquivo segue o padrão de módulos do projeto e fica dentro do limite de linhas."
```

---

_Mantenha este documento atualizado com novas decisões arquiteturais_