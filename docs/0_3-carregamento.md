# vs5 - Arquivos e Carregamento do framework Ialum

## 🛠️ Stack Tecnológica

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** N8N + Supabase
- **IA:** 
  - Texto: OpenAI
  - Pesquisa: Perplexity + Anthropic
  - Imagens: DALL-E 3 image1 + Gemini
  - Vídeos: Gemini veo 3
  - Templates: Bannerbear
- **Deploy:** EasyPanel com Nixpacks

## 🗺️ ESTRUTURA DE ARQUIVOS DO PROJETO

```
ialum_vs1/
├── public/                    (servido pelo nginx - tudo público)
│   ├── index.html            (landing page)
│   ├── login.html            (página de login)
│   ├── app.html              (SPA - container da área logada)
│   │
│   ├── css/                  (estilos organizados)
│   │   ├── base/             (reset, variables, typography)
│   │   ├── components/       (buttons, forms, cards, sidebar)
│   │   └── pages/            (dashboard, configuracoes, topicos)
│   │
│   ├── js/                   (lógica modular)
│   │   ├── core/             (api, auth, router, utils)
│   │   ├── components/       (sidebar, notifications, search)
│   │   └── pages/            (lógica específica por página)
│   │       ├── configuracoes/
│   │       │   ├── main.js          (controlador principal)
│   │       │   ├── conta.js         (aba conta)
│   │       │   ├── banca.js         (aba banca)
│   │       │   ├── integracoes.js   (aba integrações)
│   │       │   └── publicador.js    (aba publicador)
│   │       ├── topicos/
│   │       │   ├── main.js
│   │       │   └── lista.js
│   │       └── dashboard/
│   │           └── main.js
│   │
│   ├── app/                  (área logada - organização)
│   │   ├── views/            (HTML das páginas - só o miolo)
│   │   │   ├── configuracoes.html
│   │   │   ├── topicos.html
│   │   │   ├── dashboard.html
│   │   │   └── agendamentos.html
│   │   └── components/       (componentes HTML reutilizáveis)
│   │       ├── card-topico.html
│   │       └── form-filters.html
│   │
│   └── assets/               (recursos estáticos)
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── docs/                     (documentação)
├── nixpacks.toml            (configuração do deploy)
└── README.md
```

## 🎯 CONCEITOS FUNDAMENTAIS

### **1. Separação Clara**
- **Área Pública:** Landing, login (arquivos completos)
- **Área Logada:** SPA com carregamento dinâmico
- **N8N (Backend):** Apenas dados via API (sem templates)

### **2. Carregamento de Páginas**
```javascript
// Página = HTML (estrutura) + JS (comportamento / main.js + arquivos separados para cada aba para fim de organização)
Clique no menu → Busca HTML → Carrega JS → Inicializa
```

### **3. Arquitetura Modular**
- **HTML:** Apenas estrutura (sem lógica)
- **JS:** Separado por página e por aba
- **CSS:** Componentes reutilizáveis

---

## 📄 ANATOMIA DE UMA PÁGINA

### **Exemplo: Configurações**

#### **1. HTML Base (`app.html`)**
```html
<div class="app-container">
    <aside class="sidebar"><!-- Menu fixo --></aside>
    <main>
        <header class="top-bar"><!-- Header fixo --></header>
        <div id="page-content">
            <!-- CONTEÚDO DINÂMICO AQUI -->
        </div>
    </main>
</div>
```

#### **2. View HTML (`app/views/configuracoes.html`)**
```html
<!-- APENAS o miolo da página -->
<div class="configuracoes-container">
    <div class="tabs-nav">
        <button data-tab="conta" class="active">Conta</button>
        <button data-tab="banca">Banca</button>
        <button data-tab="integracoes">Integrações</button>
    </div>
    
    <div class="tabs-content">
        <div id="tab-conta" class="tab-pane active"></div>
        <div id="tab-banca" class="tab-pane"></div>
        <div id="tab-integracoes" class="tab-pane"></div>
    </div>
</div>
```

#### **3. JavaScript Principal (`js/pages/configuracoes/main.js`)**
```javascript
/**
 * configuracoes/main.js
 * Controlador principal da página de configurações
 * Gerencia as abas e carrega módulos específicos
 */

export async function init() {
    // Bind dos botões de abas
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => loadTab(btn.dataset.tab));
    });
    
    // Carrega aba inicial
    await loadTab('conta');
}

async function loadTab(tabName) {
    // Remove active de todas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Ativa a selecionada
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Carrega módulo da aba
    const module = await import(`./${tabName}.js`);
    module.init();
}
```

#### **4. JavaScript da Aba (`js/pages/configuracoes/conta.js`)**
```javascript
/**
 * configuracoes/conta.js
 * Lógica específica da aba Conta
 * Tamanho alvo: <150 linhas
 */

export function init() {
    const container = document.getElementById('tab-conta');
    
    // Renderiza o conteúdo
    container.innerHTML = getTemplate();
    
    // Bind dos eventos
    bindEvents();
    
    // Carrega dados
    loadData();
}

function getTemplate() {
    return `
        <form id="form-conta" class="config-form">
            <div class="form-group">
                <label>Nome Completo</label>
                <input type="text" name="nome" class="form-input">
            </div>
            <!-- resto do formulário -->
        </form>
    `;
}

function bindEvents() {
    document.getElementById('form-conta').addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
    e.preventDefault();
    // Salva via API
}
```

---

## 🔄 FLUXO DE NAVEGAÇÃO

```
1. Usuário clica em "Configurações" no menu
         ↓
2. Router identifica a rota (#configuracoes)
         ↓
3. Carrega o HTML: fetch('/app/views/configuracoes.html')
         ↓
4. Insere no #page-content
         ↓
5. Carrega o JS: import('/js/pages/configuracoes/main.js')
         ↓
6. Inicializa: main.init()
         ↓
7. Carrega aba padrão
```

---

## 📏 REGRAS E PADRÕES

### **CSS Base Obrigatório**
SEMPRE use as definições do CSS base para manter consistência:

**Cores**: Use apenas variáveis CSS definidas em `variables.css`
```css
/* ✅ CORRETO */
color: var(--primary);
background: var(--gray-100);

/* ❌ ERRADO */
color: #2563eb;
background: #f3f4f6;
```

**Botões**: Use APENAS classes base em `base/buttons.css`
```html
<!-- ✅ CORRETO -->
<button class="btn btn-primary">Salvar</button>
<button class="btn btn-secondary btn-sm">Cancelar</button>
<button class="btn btn-outline btn-primary">Editar</button>

<!-- ❌ ERRADO -->
<button style="background: blue; padding: 8px;">Salvar</button>
<!-- ❌ ERRADO: Não crie CSS customizado para botões -->
<button class="custom-button">Botão</button>
```

**Tipografia**: Use classes base em `base/typography.css`
```html
<!-- ✅ CORRETO -->
<h3 class="text-xl font-semibold">Título</h3>
<p class="text-muted">Descrição</p>

<!-- ❌ ERRADO -->
<h3 style="font-size: 20px; font-weight: 600;">Título</h3>
```

**Espaçamentos**: Use variáveis de espaçamento
```css
/* ✅ CORRETO */
margin: var(--spacing-md);
padding: var(--spacing-sm) var(--spacing-lg);

/* ❌ ERRADO */
margin: 16px;
padding: 8px 24px;
```

### **Estrutura CSS Base**
```
css/base/
├── reset.css          # Reset CSS global
├── variables.css      # Variáveis CSS (cores, espaçamentos, etc)
├── typography.css     # Fontes, headings, texto
└── buttons.css        # Botões base do sistema

css/components/
├── page-layout.css    # Layout base das páginas (page-container, page-header, etc)
├── tabs.css           # Sistema de abas reutilizável (tabs-nav, tab-btn, etc)
├── config-list.css    # Componente de listas CRUD
├── forms.css          # Formulários base
├── sidebar.css        # Menu lateral
├── cards.css          # Cards reutilizáveis
├── notifications.css  # Sistema de notificações
└── [outros...]        # Mais componentes modulares

IMPORTANTE: NÃO há components/buttons.css - usar apenas base/buttons.css
```

### **Tamanhos Máximos**
- HTML views: ~100 linhas (só estrutura)
- JS principal: ~150 linhas
- JS de aba: ~150 linhas
- CSS por página: ~200 linhas
- CSS base: ~150 linhas por arquivo

### **Nomenclatura**
```
HTML: kebab-case.html
JS: camelCase.js
CSS: kebab-case.css
IDs: kebab-case
Classes: kebab-case com BEM
```

### **Organização de Imports**
```javascript
// 1. Core primeiro
import { api } from '/js/core/api.js';
import { utils } from '/js/core/utils.js';

// 2. Components
import { showToast } from '/js/components/notifications.js';

// 3. Específicos da página
import { validateForm } from './validators.js';
```

---

## 🎨 COMPONENTES REUTILIZÁVEIS

### **HTML Components**
```
app/components/
├── card-topico.html      (template de card)
├── modal-confirm.html    (modal de confirmação)
└── loading-spinner.html  (indicador de carregamento)
```

### **Uso:**
```javascript
// Busca componente uma vez
const cardTemplate = await fetch('/app/components/card-topico.html');

// Usa múltiplas vezes
topicos.forEach(topico => {
    container.innerHTML += cardTemplate.replace('{{title}}', topico.title);
});
```

---

## 🚀 VANTAGENS DESTA ESTRUTURA

1. **Modular:** Arquivos pequenos, fáceis de manter
2. **Performance:** Carrega só o necessário
3. **IA-Friendly:** Arquivos <200 linhas
4. **Organizado:** Separação clara de responsabilidades
5. **Escalável:** Fácil adicionar novas páginas/abas

---

## 📝 EXEMPLO: ADICIONAR NOVA PÁGINA

### **1. Criar a view HTML**
```bash
public/app/views/relatorios.html
```

### **2. Criar o JS principal**
```bash
public/js/pages/relatorios/main.js
```

### **3. Criar CSS se necessário**
```bash
public/css/pages/relatorios.css
```

### **4. Adicionar no router**
```javascript
routes['relatorios'] = {
    view: '/app/views/relatorios.html',
    controller: '/js/pages/relatorios/main.js'
};
```

### **5. Adicionar no menu**
```html
<a href="#relatorios" class="nav-item">
    <span class="nav-icon">📊</span>
    <span class="nav-text">Relatórios</span>
</a>
```

---

## 🔧 DESENVOLVIMENTO LOCAL

```bash
# Estrutura pronta para:
- Live reload com VS Code Live Server
- Debug direto no browser
- Sem necessidade de build
```

---

_Última atualização: Janeiro 2025_  
_Esta estrutura prioriza clareza e manutenibilidade_