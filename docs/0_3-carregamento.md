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

### **Cores disponíveis:**
```html
<!-- Botões sólidos -->
<button class="btn btn-primary">Primário</button>
<button class="btn btn-secondary">Secundário</button>
<button class="btn btn-success">Sucesso</button>
<button class="btn btn-warning">Aviso</button>
<button class="btn btn-error">Erro</button>
<button class="btn btn-info">Informação</button>
<button class="btn btn-dark">Escuro</button>
<button class="btn btn-light">Claro</button>

<!-- Botões outline (contorno) -->
<button class="btn btn-outline btn-primary">Primário</button>
<button class="btn btn-outline btn-error">Excluir</button>

<!-- Botões ghost (sem borda) -->
<button class="btn btn-ghost btn-primary">Ghost</button>

<!-- Botões soft (fundo claro) -->
<button class="btn btn-soft btn-primary">Soft</button>
```

### **Tamanhos:**
```html
<button class="btn btn-xs">Extra pequeno</button>
<button class="btn btn-sm">Pequeno</button>
<button class="btn">Normal</button>
<button class="btn btn-lg">Grande</button>
<button class="btn btn-xl">Extra grande</button>
```

### **Botões especiais:**
```html
<!-- Botão circular -->
<button class="btn btn-circle btn-primary">🔍</button>

<!-- Botão de ícone -->
<button class="btn btn-icon btn-primary">⚙️</button>

<!-- Botão flutuante -->
<button class="btn btn-float btn-primary">+</button>

<!-- Botão full width -->
<button class="btn btn-primary btn-block">Largura total</button>
```

### **Estados:**
```html
<!-- Loading -->
<button class="btn btn-primary btn-loading">Carregando...</button>

<!-- Desabilitado -->
<button class="btn btn-primary" disabled>Desabilitado</button>

<!-- Ativo -->
<button class="btn btn-primary active">Ativo</button>
```

### **Grupos:**
```html
<!-- Grupo horizontal -->
<div class="btn-group">
    <button class="btn btn-outline btn-secondary">Esquerda</button>
    <button class="btn btn-outline btn-secondary">Centro</button>
    <button class="btn btn-outline btn-secondary">Direita</button>
</div>

<!-- Grupo vertical -->
<div class="btn-group-vertical">
    <button class="btn btn-outline btn-secondary">Top</button>
    <button class="btn btn-outline btn-secondary">Bottom</button>
</div>
```

### **❌ NUNCA FAÇA:**
```html
<!-- ❌ CSS inline -->
<button style="background: blue;">Botão</button>

<!-- ❌ Classes customizadas -->
<button class="custom-button">Botão</button>

<!-- ❌ CSS específico de componente -->
.meu-componente .btn-especial { ... }
```

**Formulários**: Use APENAS classes base em `base/forms.css`

### **Inputs básicos:**
```html
<!-- Input de texto -->
<div class="form-group">
    <label class="form-label">Nome completo</label>
    <input type="text" class="form-control" placeholder="Digite seu nome">
    <div class="form-text">Texto de ajuda opcional</div>
</div>

<!-- Textarea -->
<div class="form-group">
    <label class="form-label">Descrição</label>
    <textarea class="form-control form-textarea" placeholder="Descreva..."></textarea>
</div>

<!-- Select -->
<div class="form-group">
    <label class="form-label">Estado</label>
    <select class="form-select">
        <option>Selecione...</option>
        <option>São Paulo</option>
        <option>Rio de Janeiro</option>
    </select>
</div>
```

### **Tamanhos de inputs:**
```html
<input class="form-control form-control-xs" placeholder="Extra pequeno">
<input class="form-control form-control-sm" placeholder="Pequeno">
<input class="form-control" placeholder="Normal">
<input class="form-control form-control-lg" placeholder="Grande">
<input class="form-control form-control-xl" placeholder="Extra grande">
```

### **Checkboxes e Radios:**
```html
<!-- Checkbox -->
<div class="form-check">
    <input class="form-check-input" type="checkbox" id="check1">
    <label class="form-check-label" for="check1">Aceito os termos</label>
</div>

<!-- Radio -->
<div class="form-check">
    <input class="form-check-input" type="radio" name="opcao" id="radio1">
    <label class="form-check-label" for="radio1">Opção 1</label>
</div>

<!-- Switch/Toggle -->
<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="switch1">
    <label class="form-check-label" for="switch1">Ativar notificações</label>
</div>

<!-- Inline -->
<div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="inline" id="inline1">
    <label class="form-check-label" for="inline1">Sim</label>
</div>
<div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="inline" id="inline2">
    <label class="form-check-label" for="inline2">Não</label>
</div>
```

### **Input Groups:**
```html
<!-- Com ícone/texto -->
<div class="input-group">
    <div class="input-group-prepend">
        <span class="input-group-text">@</span>
    </div>
    <input type="text" class="form-control" placeholder="Username">
</div>

<!-- Com botão -->
<div class="input-group">
    <input type="text" class="form-control" placeholder="Buscar...">
    <div class="input-group-append">
        <button class="btn btn-primary" type="button">🔍</button>
    </div>
</div>
```

### **Estados de validação:**
```html
<!-- Campo válido -->
<input type="email" class="form-control is-valid" value="email@example.com">
<div class="valid-feedback">Email válido!</div>

<!-- Campo inválido -->
<input type="email" class="form-control is-invalid" value="email-inválido">
<div class="invalid-feedback">Por favor, insira um email válido.</div>

<!-- Campo obrigatório -->
<div class="form-group required">
    <label class="form-label">Email</label>
    <input type="email" class="form-control" required>
</div>
```

### **Layouts de formulário:**
```html
<!-- Formulário em linha -->
<div class="form-row">
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Nome">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Sobrenome">
    </div>
</div>

<!-- Grid de formulário -->
<div class="form-grid form-grid-3">
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Campo 1">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Campo 2">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Campo 3">
    </div>
</div>
```

### **Labels flutuantes:**
```html
<div class="form-floating">
    <input type="email" class="form-control" id="email" placeholder="name@example.com">
    <label for="email">Endereço de email</label>
</div>
```

### **Upload de arquivos:**
```html
<!-- Input file simples -->
<div class="form-file">
    <input type="file" class="form-file-input" id="file">
    <label class="form-file-label" for="file">Escolher arquivo</label>
</div>

<!-- Dropzone -->
<div class="form-dropzone">
    <p>Arraste arquivos aqui ou clique para selecionar</p>
    <input type="file" multiple style="display: none;">
</div>
```

### **Range/Slider:**
```html
<div class="form-group">
    <label class="form-label">Volume: <span id="volume-value">50</span></label>
    <input type="range" class="form-range" min="0" max="100" value="50" id="volume">
</div>
```

**Layouts**: Use APENAS classes base em `base/layouts.css`

### **Containers:**
```html
<div class="container">Container padrão (1200px)</div>
<div class="container-sm">Container pequeno (800px)</div>
<div class="container-lg">Container grande (1400px)</div>
<div class="container-fluid">Container fluido (100%)</div>
```

### **Grid System:**
```html
<!-- Grid básico -->
<div class="grid grid-cols-3 gap-lg">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>

<!-- Grid responsivo -->
<div class="grid-responsive">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>

<!-- Grid para cards -->
<div class="grid-cards">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
</div>
```

### **Flex Layouts:**
```html
<div class="flex justify-between items-center">
    <div>Esquerda</div>
    <div>Direita</div>
</div>

<div class="flex flex-col gap-md">
    <div>Item 1</div>
    <div>Item 2</div>
</div>
```

### **Stack Layouts (Espaçamento Vertical):**
```html
<div class="stack-lg">
    <h2>Título</h2>
    <p>Parágrafo com espaçamento automático</p>
    <button class="btn btn-primary">Botão</button>
</div>
```

**Utilities**: Use classes em `base/utilities.css`

### **Spacing:**
```html
<!-- Margin -->
<div class="mt-lg mb-xl mx-auto">Margem top/bottom/center</div>

<!-- Padding -->
<div class="p-lg">Padding em todos os lados</div>
<div class="px-md py-sm">Padding horizontal e vertical</div>
```

### **Colors:**
```html
<!-- Text colors -->
<p class="text-primary">Texto primário</p>
<p class="text-muted">Texto muted</p>
<p class="text-error">Texto de erro</p>

<!-- Background colors -->
<div class="bg-primary text-white">Background primário</div>
<div class="bg-light">Background claro</div>
```

### **Display & Layout:**
```html
<div class="flex justify-center items-center">Centro total</div>
<div class="grid grid-cols-2 gap-md">Grid 2 colunas</div>
<div class="hidden mobile-block">Oculto no desktop, visível no mobile</div>
```

### **Transform & Animation:**
```html
<div class="hover-lift transition-all">Hover com elevação</div>
<div class="hover-scale">Hover com escala</div>
<button class="btn btn-primary btn-loading">Botão loading</button>
```

**Cards**: Use sistema em `components/cards.css`

### **Cards básicos:**
```html
<!-- Card padrão -->
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Título do Card</h3>
        <span class="card-icon">📊</span>
    </div>
    <div class="card-body">
        <p>Conteúdo do card</p>
    </div>
    <div class="card-footer">
        <div class="card-actions">
            <button class="btn btn-primary btn-sm">Ação</button>
        </div>
    </div>
</div>

<!-- Card de estatística -->
<div class="card card-stat">
    <div class="stat-number">1,234</div>
    <div class="stat-label">Total de Usuários</div>
    <div class="stat-change positive">+12% desde ontem</div>
</div>

<!-- Card com imagem -->
<div class="card">
    <div class="card-image">
        <img src="image.jpg" alt="Imagem">
    </div>
    <div class="card-body">
        <h3 class="card-title">Card com Imagem</h3>
    </div>
</div>
```

### **Variações de Cards:**
```html
<!-- Tamanhos -->
<div class="card card-sm">Card pequeno</div>
<div class="card card-lg">Card grande</div>

<!-- Cores -->
<div class="card card-primary">Card primário</div>
<div class="card card-success">Card sucesso</div>

<!-- Estilos -->
<div class="card card-outline">Card com contorno</div>
<div class="card card-elevated">Card elevado</div>
<div class="card card-action">Card clicável</div>
```

### **Grupos de Cards:**
```html
<!-- Grid automático -->
<div class="card-group">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
</div>

<!-- Flex deck -->
<div class="card-deck">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
</div>
```

**Badges**: Use sistema em `components/badges.css`

### **Badges básicos:**
```html
<!-- Cores básicas -->
<span class="badge badge-primary">Primário</span>
<span class="badge badge-success">Sucesso</span>
<span class="badge badge-warning">Aviso</span>
<span class="badge badge-error">Erro</span>
<span class="badge badge-info">Info</span>

<!-- Tamanhos -->
<span class="badge badge-xs badge-secondary">Extra pequeno</span>
<span class="badge badge-sm badge-primary">Pequeno</span>
<span class="badge badge-primary">Normal</span>
<span class="badge badge-lg badge-primary">Grande</span>

<!-- Estilos -->
<span class="badge badge-outline badge-primary">Contorno</span>
<span class="badge badge-soft badge-primary">Suave</span>
```

### **Badges especiais:**
```html
<!-- Badge de notificação (contador) -->
<span class="badge badge-notification badge-error">3</span>

<!-- Badge com status -->
<span class="badge badge-status badge-success">
    <span class="badge-status-icon"></span>
    Online
</span>

<!-- Badge removível -->
<span class="badge badge-primary badge-removable">
    Tag removível
    <button class="badge-remove">×</button>
</span>

<!-- Badge de prioridade -->
<span class="badge badge-priority-high">Alta</span>
<span class="badge badge-priority-medium">Média</span>
<span class="badge badge-priority-low">Baixa</span>

<!-- Badges jurídicos específicos -->
<span class="badge badge-juridico">⚖️ Direito Civil</span>
<span class="badge badge-processo-ativo">Processo Ativo</span>
<span class="badge badge-processo-pendente">Pendente</span>
```

### **Grupos de badges:**
```html
<div class="badge-group">
    <span class="badge badge-primary">Tag 1</span>
    <span class="badge badge-secondary">Tag 2</span>
    <span class="badge badge-success">Tag 3</span>
</div>
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

### **Estrutura CSS Base (SEMPRE OBRIGATÓRIO)**
```
css/base/
├── reset.css          # Reset CSS global
├── variables.css      # Variáveis CSS (cores, espaçamentos, etc)
├── typography.css     # Fontes, headings, texto
├── buttons.css        # Sistema completo de botões (160+ variações)
├── forms.css          # Sistema completo de formulários (400+ variações)
├── layouts.css        # Sistema de layouts e grids
└── utilities.css      # Classes utilitárias (spacing, colors, etc.)

css/components/
├── page-layout.css    # Layout base das páginas (DEPRECIADO - usar base/layouts.css)
├── header.css         # Header/top-bar com hamburger, AI agent e notificações
├── tabs.css           # Sistema de abas reutilizável (tabs-nav, tab-btn, etc)
├── config-list.css    # Componente de listas CRUD
├── sidebar.css        # Menu lateral
├── cards.css          # Sistema completo de cards (30+ variações)
├── badges.css         # Sistema completo de badges/etiquetas (50+ variações)
├── notifications.css  # Sistema de notificações
└── [outros...]        # Mais componentes modulares

IMPORTANTE: 
- NÃO há components/buttons.css - usar apenas base/buttons.css
- NÃO há components/forms.css - usar apenas base/forms.css

### **Sistema de Visibilidade por Dispositivo**
Use classes utilitárias para mostrar/ocultar elementos:

```html
<!-- Visível apenas no desktop -->
<button class="btn desktop-only">Botão PC</button>

<!-- Visível apenas no mobile -->
<span class="mobile-only">Texto Mobile</span>

<!-- Breakpoint: 768px -->
```
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