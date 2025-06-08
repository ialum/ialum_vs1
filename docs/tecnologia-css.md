# Sistema CSS do Ialum - Guia Essencial

## 🎯 Regras Fundamentais

**IMPORTANTE**: O sistema CSS segue uma hierarquia rígida que DEVE ser respeitada:

### ❌ PROIBIDO
1. **NUNCA use variáveis CSS diretamente no HTML** (ex: `style="color: var(--primary)"`)
2. **NUNCA crie CSS customizado** - use apenas classes documentadas
3. **NUNCA modifique componentes base** - use as variações disponíveis

### ✅ OBRIGATÓRIO
1. **Use APENAS classes CSS do sistema** - se não está documentado, não existe
2. **Siga a hierarquia de componentes** - Cards resolvem 90% dos casos
3. **Mobile-first sempre** - todos os componentes são responsivos por padrão

## 📁 Arquitetura CSS - 3 Camadas

```
1. variables/    ❌ NUNCA usar diretamente no HTML
   └── Átomos do sistema (cores, espaçamentos, etc)

2. base/        ⚠️  Evitar uso direto (apenas emergências)
   └── Fundação (reset, typography, buttons, forms)

3. components/  ✅ SEMPRE usar estas classes no código
   ├── cards/     → 90% dos casos (CRUD universal)
   ├── forms/     → Formulários especializados BR
   ├── ui/        → Badges, tabs, etc
   └── layout/    → Estrutura da aplicação
```

## ⚙️ Sistema de Variáveis (Uso Interno)

**IMPORTANTE**: As variáveis CSS existem mas **NÃO devem ser usadas diretamente no HTML**. 
Use sempre as classes utilitárias fornecidas pelo sistema.

### Exemplos de Uso Correto:
```html
<!-- ✅ CORRETO - usar classes do sistema -->
<div class="bg-primary text-white p-md">
<button class="btn btn-primary">

<!-- ❌ ERRADO - nunca usar variáveis inline -->
<div style="background: var(--primary); padding: var(--spacing-md)">
```

## 🛠️ Classes Utilitárias Essenciais

### Espaçamento
- **Margin**: `m-{xs|sm|md|lg|xl}`, `mt-`, `mb-`, `mx-`, `my-`, `mx-auto`
- **Padding**: `p-{xs|sm|md|lg|xl}`, `pt-`, `pb-`, `px-`, `py-`
- **Gap**: `gap-{xs|sm|md|lg|xl}`

### Display & Layout
- **Display**: `block`, `flex`, `grid`, `hidden`
- **Flex**: `justify-{start|center|end|between}`, `items-{start|center|end}`
- **Responsivo**: `mobile-only`, `desktop-only`, `mobile-block desktop-flex`

### Cores & Texto
- **Texto**: `text-{primary|secondary|success|error|muted}`
- **Background**: `bg-{primary|secondary|gray-100|white}`
- **Tamanhos**: `text-{xs|sm|base|lg|xl|2xl}`

## 🧩 Hierarquia de Componentes - USE NESTA ORDEM!

### 1️⃣ Cards (90% dos casos) - SEMPRE tente usar primeiro!

- **CardList** (40%): Listas CRUD com edição inline expandível
- **CardForm** (30%): Formulários dinâmicos universais  
- **CardGrid** (15%): Grids responsivos com seleção
- **CardDisplay** (5%): Visualização formatada de dados

**📚 Exemplos completos em:** `/css/components/cards/exemplo-*.html`

### 2️⃣ Components Especializados (10% restantes)

- **Forms**: Color picker, file upload (padrões BR)
- **UI**: Badges, tabs, tooltips
- **Layout**: App structure, sidebar, header

### Estrutura Básica dos Cards

```html
<!-- Use sempre a estrutura semântica correta -->
<div class="card-list">           <!-- ou card-form, card-grid, card-display -->
  <div class="card-*-header">     <!-- Cabeçalho opcional -->
  <div class="card-*-content">    <!-- Conteúdo principal -->
  <div class="card-*-actions">    <!-- Ações/botões -->
</div>
```

**Modificadores disponíveis**: `--compact`, `--borderless`, `--horizontal`, `--elevated`
**Estados**: `--loading`, `--empty`, `--error`, `--success`
**Temas**: `data-theme="primary|secondary|success|warning|error"`

## 🎨 Componentes Base (Foundation)

### Botões
- **Cores**: `btn-{primary|secondary|success|warning|error}`
- **Variantes**: `btn-{outline|ghost|soft}`
- **Tamanhos**: `btn-{xs|sm|lg|xl}`
- **Estados**: `is-loading`, `disabled`

### Formulários  
- **Containers**: `form-group`, `form-label`, `form-control`, `form-text`
- **Inputs**: `form-control-{sm|lg}`, `form-select`
- **Checkboxes**: `form-check`, `form-switch`
- **Validação**: `is-valid`, `is-invalid`

### Elementos UI
- **Badges**: `badge-{color}`, `badge-{size}`, `badge-{variant}`
- **Cards genéricos**: `card`, `card-header`, `card-body`, `card-footer`

## 🏗️ Layout & Containers

- **Containers**: `container`, `container-{sm|lg|fluid}`
- **Grid**: `grid`, `grid-cols-{2|3|4}`, `grid-responsive`, `grid-cards`
- **Stack**: `stack` (espaçamento vertical automático)
- **Gaps**: `gap-{xs|sm|md|lg|xl}`

## 🎯 Classes para JavaScript

- **DOM**: `dom-{show|hide|active|selected|expanded}`
- **Loading**: `loader-overlay`, `loader-spinner`, `is-loading`
- **Skeleton**: `skeleton-{text|title|avatar}`
- **Animações**: `ui-{fade-in|slide-up|shake|highlight}`

## 🌙 Sistema de Temas

- **Troca de tema**: Via JavaScript com `State.set('theme', 'dark')`
- **Atributo HTML**: `<html data-theme="dark">`
- **Importante**: Componentes devem usar variáveis `--theme-*` (não cores diretas)

## 📏 Processo de Desenvolvimento

### 1. Hierarquia de Decisão
```
1º Tentar: Cards (90% dos casos)
2º Tentar: Componentes especializados  
3º Tentar: Classes utilitárias
4º Último recurso: CSS customizado (evitar!)
```

### 2. Checklist Rápido
- [ ] Usei componente Card primeiro?
- [ ] Evitei variáveis CSS inline?
- [ ] Usei classes do sistema?
- [ ] Testei responsividade?
- [ ] Verifiquei tema claro/escuro?

## 🚀 Guia Rápido de Uso

### Ordem de Prioridade
1. **Cards Components** → Resolvem 90% dos casos
2. **Classes Utilitárias** → Espaçamento, cores, layout
3. **Componentes Base** → Botões, forms, badges
4. **Nunca** → CSS inline ou customizado

### Onde Encontrar Exemplos
- **Cards completos**: `/css/components/cards/exemplo-*.html`
- **Padrões de uso**: Arquivos exemplo em cada pasta de componente
- **Casos reais**: Páginas da aplicação em `/app/views/`

## 📝 Exemplo Prático - Página CRUD Completa

```html
<!-- 90% dos casos resolvidos com Cards! -->
<div class="container py-xl">
  <!-- Cabeçalho da página -->
  <div class="flex justify-between items-center mb-lg">
    <h1 class="text-2xl">Minha Página</h1>
    <button class="btn btn-primary">Nova Ação</button>
  </div>
  
  <!-- Lista CRUD (CardList) -->
  <div class="card-list">
    <div class="card-list-item">
      <div class="card-list-header">
        <h3 class="card-list-title">Item 1</h3>
        <button class="card-list-toggle">⌄</button>
      </div>
      <!-- Formulário expansível aqui -->
    </div>
  </div>
</div>
```

**Mais exemplos**: Ver `/css/components/cards/exemplo-*.html`


## 🎯 **RESUMO EXECUTIVO - NOVA ARQUITETURA CSS**

### **Estrutura Modular Implementada**
✅ **Reorganização Completa** - CSS components organizados por categoria  
✅ **Alinhamento Total** - Estrutura espelha `/js/components/`  
✅ **90% Coverage** - Cards components cobrem quase todos os casos  
✅ **Sistema Hierárquico** - Imports otimizados com index.css por categoria  

### **Hierarquia de Uso (SEMPRE seguir esta ordem)**
1. **🧩 Cards** → CardList (40%) + CardForm (30%) + CardGrid (15%) + CardDisplay (5%)
2. **📝 Forms** → color-picker, file-upload (padrões brasileiros)
3. **🎨 UI** → badges, tabs (elementos visuais)
4. **🏗️ Layout** → app-layout, sidebar, header, notifications

### **Para IA: Processo de Implementação**
```html
<!-- 1º SEMPRE: Verificar se Cards resolve (90% dos casos) -->
<div class="card-list"><!-- CardList para CRUD --></div>
<div class="card-form"><!-- CardForm para formulários --></div>
<div class="card-grid"><!-- CardGrid para grids --></div>

<!-- 2º SE NECESSÁRIO: Componentes especializados -->
<div class="form-color-picker"><!-- Seletor de cores --></div>
<div class="form-file-upload"><!-- Upload de arquivos --></div>

<!-- 3º ÚLTIMO RECURSO: CSS customizado -->
```

### **Estado do Sistema**
- ✅ **Base CSS**: 100% funcional (variables, reset, typography, etc.)
- ✅ **Cards CSS**: 100% implementado e organizado em `/cards/`
- ✅ **Forms CSS**: 100% funcional e otimizado em `/forms/`
- ✅ **UI CSS**: 100% reorganizado em `/ui/`
- ✅ **Layout CSS**: 100% estruturado em `/layout/`
- ✅ **Sistema de Imports**: Otimizado com index.css hierárquico

---

_Última atualização: Janeiro 2025_  
_Sistema CSS 100% modular, escalável e alinhado com JavaScript_  
_Reorganização completa implementada e funcional_