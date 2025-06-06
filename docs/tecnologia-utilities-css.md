# Sistema CSS do Ialum - Guia de Referência

## 🤖 Diretrizes para IA

**IMPORTANTE**: Antes de gerar qualquer código HTML/CSS, você DEVE:
1. **Usar APENAS classes existentes** documentadas neste arquivo - nunca crie CSS customizado
2. **Sempre preferir utilitárias** para espaçamento (`mt-lg`), cores (`text-primary`), layout (`flex`)
3. **Componentes antes de customização** - use `btn btn-primary` ao invés de criar novos estilos
4. **Variáveis CSS obrigatórias** - use `var(--spacing-md)` ao invés de `16px`
5. **Mobile-first sempre** - use classes como `mobile-hidden desktop-block` para responsividade

Este documento é sua referência completa. Se uma classe não está aqui, ela não existe no sistema.

## 📁 Estrutura de Arquivos

```
public/css/
├── index.css           # CSS para páginas públicas (landing, login)
├── app.css            # CSS completo para aplicação SPA
├── base/              # Fundação do sistema de design
│   ├── 01-variables.css    # Variáveis e design tokens
│   ├── 02-reset.css        # Reset CSS normalizado
│   ├── 03-typography.css   # Sistema tipográfico
│   ├── 04-layouts.css      # Sistema de layout e grid
│   ├── 05-buttons.css      # Sistema completo de botões
│   ├── 06-forms.css        # Sistema completo de formulários
│   └── utilities/          # Classes utilitárias atômicas
├── core/              # Sistema para interação JavaScript
│   ├── dom.css            # Classes para manipulação DOM
│   ├── loader.css         # Estados de carregamento
│   └── ui.css             # Animações e feedback visual
├── components/        # Componentes reutilizáveis
└── pages/            # Estilos específicos de páginas
```

## 🎨 Sistema de Variáveis CSS

### Cores
```css
/* Cores principais */
--primary: #2563eb;      /* Azul principal */
--secondary: #10b981;    /* Verde secundário */
--success: #10b981;      /* Verde sucesso */
--warning: #f59e0b;      /* Amarelo aviso */
--error: #ef4444;        /* Vermelho erro */
--info: #3b82f6;         /* Azul informação */

/* Escala de cinza */
--gray-50 até --gray-900

/* Variações com transparência */
--primary-light, --primary-lighter, --primary-dark
--black-alpha-{10,20,30...90}
--white-alpha-{10,20,30...90}
```

### Espaçamentos
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

### Tipografia
```css
--font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
```

### Sistema de Temas
```css
/* Variáveis semânticas - USE SEMPRE ESTAS */
--theme-bg-primary         /* Background principal (cards, modals) */
--theme-bg-secondary       /* Background secundário (containers) */
--theme-bg-tertiary        /* Background terciário (sidebar) */
--theme-bg-elevated        /* Elementos elevados (dropdowns) */
--theme-bg-overlay         /* Overlays e modals */

--theme-text-primary       /* Texto principal */
--theme-text-secondary     /* Texto secundário */
--theme-text-tertiary      /* Texto auxiliar, placeholders */
--theme-text-inverse       /* Texto em fundos escuros */

--theme-border-primary     /* Bordas principais */
--theme-border-secondary   /* Bordas mais visíveis */
--theme-border-focus       /* Bordas de foco */

--theme-surface-hover      /* Estado hover */
--theme-surface-active     /* Estado ativo */
--theme-surface-disabled   /* Estado desabilitado */

/* COMO USAR TEMAS */
/* ✅ CORRETO - sempre use variáveis semânticas */
.meu-componente {
    background: var(--theme-bg-primary);
    color: var(--theme-text-primary);
    border: 1px solid var(--theme-border-primary);
}

/* ❌ ERRADO - nunca use cores diretas */
.meu-componente {
    background: var(--white);
    color: var(--dark);
    border: 1px solid var(--gray-200);
}
```

## 🛠️ Classes Utilitárias

### Espaçamento
```html
<!-- Margin -->
<div class="mt-lg">Margin top large</div>
<div class="mx-auto">Margin horizontal auto (centraliza)</div>
<div class="my-xl">Margin vertical extra large</div>

<!-- Padding -->
<div class="p-md">Padding médio em todos os lados</div>
<div class="px-lg py-sm">Padding horizontal e vertical diferentes</div>

<!-- Gap (para flex/grid) -->
<div class="flex gap-md">Espaçamento entre items flex</div>
```

### Cores
```html
<!-- Texto -->
<p class="text-primary">Texto primário</p>
<p class="text-muted">Texto desabilitado</p>
<p class="text-error">Texto de erro</p>

<!-- Background -->
<div class="bg-primary text-white">Background primário</div>
<div class="bg-gray-100">Background cinza claro</div>
```

### Display e Posicionamento
```html
<!-- Display -->
<div class="block">Display block</div>
<div class="flex">Display flex</div>
<div class="grid">Display grid</div>
<div class="hidden">Oculto</div>

<!-- Flex utilities -->
<div class="flex justify-between items-center">
  <span>Esquerda</span>
  <span>Direita</span>
</div>

<!-- Posicionamento -->
<div class="relative">
  <div class="absolute top-0 right-0">Canto superior direito</div>
</div>
```

### Responsividade
```html
<!-- Visibilidade por dispositivo -->
<button class="desktop-only">Visível apenas no desktop</button>
<span class="mobile-only">Visível apenas no mobile</span>

<!-- Utilitárias responsivas -->
<div class="mobile-block desktop-flex">Block no mobile, flex no desktop</div>
```

## 📦 Sistema de Componentes

### Botões
```html
<!-- Cores -->
<button class="btn btn-primary">Primário</button>
<button class="btn btn-secondary">Secundário</button>
<button class="btn btn-success">Sucesso</button>
<button class="btn btn-warning">Aviso</button>
<button class="btn btn-error">Erro</button>

<!-- Variantes -->
<button class="btn btn-outline btn-primary">Contorno</button>
<button class="btn btn-ghost btn-primary">Ghost</button>
<button class="btn btn-soft btn-primary">Suave</button>

<!-- Tamanhos -->
<button class="btn btn-xs">Extra pequeno</button>
<button class="btn btn-sm">Pequeno</button>
<button class="btn">Normal</button>
<button class="btn btn-lg">Grande</button>
<button class="btn btn-xl">Extra grande</button>

<!-- Estados -->
<button class="btn btn-primary is-loading">Carregando...</button>
<button class="btn btn-primary" disabled>Desabilitado</button>

<!-- Especiais -->
<button class="btn btn-circle">⚙️</button>
<button class="btn btn-icon">🔍</button>
```

### Formulários
```html
<!-- Grupo de formulário -->
<div class="form-group">
  <label class="form-label">Nome completo</label>
  <input type="text" class="form-control" placeholder="Digite seu nome">
  <div class="form-text">Texto de ajuda</div>
</div>

<!-- Tamanhos -->
<input class="form-control form-control-sm" placeholder="Pequeno">
<input class="form-control" placeholder="Normal">
<input class="form-control form-control-lg" placeholder="Grande">

<!-- Select -->
<select class="form-select">
  <option>Selecione uma opção</option>
  <option>Opção 1</option>
</select>

<!-- Checkbox/Radio -->
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="check1">
  <label class="form-check-label" for="check1">Aceitar termos</label>
</div>

<!-- Switch -->
<div class="form-switch">
  <input class="form-switch-input" type="checkbox" id="switch1">
  <label class="form-switch-label" for="switch1">Ativar notificações</label>
</div>

<!-- Estados de validação -->
<input class="form-control is-valid" value="email@exemplo.com">
<input class="form-control is-invalid" value="email-invalido">
```

### Cards
```html
<!-- Card básico -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título do Card</h3>
  </div>
  <div class="card-body">
    <p>Conteúdo do card</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary btn-sm">Ação</button>
  </div>
</div>

<!-- Card de estatística -->
<div class="card card-stat">
  <div class="stat-icon">📊</div>
  <div class="stat-content">
    <div class="stat-number">1,234</div>
    <div class="stat-label">Total de Publicações</div>
    <div class="stat-change positive">+12% este mês</div>
  </div>
</div>

<!-- Variações -->
<div class="card card-primary">Card colorido</div>
<div class="card card-outline">Card com contorno</div>
<div class="card card-hover">Card com hover</div>
```

### Badges
```html
<!-- Cores -->
<span class="badge badge-primary">Primário</span>
<span class="badge badge-success">Sucesso</span>
<span class="badge badge-warning">Aviso</span>
<span class="badge badge-error">Erro</span>

<!-- Tamanhos -->
<span class="badge badge-xs">XS</span>
<span class="badge badge-sm">SM</span>
<span class="badge">Normal</span>
<span class="badge badge-lg">LG</span>

<!-- Variantes -->
<span class="badge badge-outline badge-primary">Contorno</span>
<span class="badge badge-soft badge-primary">Suave</span>

<!-- Especiais -->
<span class="badge badge-dot badge-success">Online</span>
<span class="badge badge-counter">42</span>
```

## 🏗️ Sistema de Layout

### Containers
```html
<div class="container">Container padrão (max-width: 1280px)</div>
<div class="container-sm">Container pequeno (max-width: 640px)</div>
<div class="container-lg">Container grande (max-width: 1536px)</div>
<div class="container-fluid">Container fluido (100%)</div>
```

### Grid System
```html
<!-- Grid com colunas definidas -->
<div class="grid grid-cols-3 gap-lg">
  <div>Coluna 1</div>
  <div>Coluna 2</div>
  <div>Coluna 3</div>
</div>

<!-- Grid responsivo automático -->
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

### Stack (Espaçamento Vertical)
```html
<div class="stack">
  <h2>Título</h2>
  <p>Parágrafo com espaçamento automático</p>
  <button class="btn btn-primary">Botão</button>
</div>
```

## 🎯 Sistema Core (JavaScript)

### Classes DOM
```html
<!-- Visibilidade -->
<div class="dom-show">Visível via JS</div>
<div class="dom-hide">Oculto via JS</div>

<!-- Estados -->
<div class="dom-active">Ativo</div>
<div class="dom-selected">Selecionado</div>
<div class="dom-expanded">Expandido</div>
```

### Loading States
```html
<!-- Overlay de carregamento -->
<div class="loader-overlay">
  <div class="loader-spinner"></div>
</div>

<!-- Botão carregando -->
<button class="btn btn-primary is-loading">
  <span class="loader-spinner"></span>
  Processando...
</button>

<!-- Skeleton loading -->
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-title"></div>
<div class="skeleton skeleton-avatar"></div>
```

### Animações UI
```html
<!-- Classes de animação -->
<div class="ui-fade-in">Fade in</div>
<div class="ui-slide-up">Slide up</div>
<div class="ui-shake">Shake</div>
<div class="ui-highlight">Highlight</div>
```

## 🌙 Sistema de Temas (Claro/Escuro)

### Como Trocar Tema

#### Via JavaScript (Recomendado)
```javascript
import { State } from '/js/core/state.js';

// Definir tema
State.set('theme', 'dark');    // Tema escuro
State.set('theme', 'light');   // Tema claro

// Obter tema atual
const currentTheme = State.get('theme') || 'light';

// Toggle entre temas
const newTheme = currentTheme === 'light' ? 'dark' : 'light';
State.set('theme', newTheme);
```

#### Via Atributo HTML
```html
<!-- Tema claro (padrão) -->
<html>

<!-- Tema escuro -->
<html data-theme="dark">
```

### Interface de Configuração

O sistema inclui uma página completa para configuração de temas:
- **Localização**: Configurações → Sistema
- **Preview visual** dos temas antes de aplicar
- **Persistência automática** via localStorage
- **Aplicação instantânea** em toda a aplicação

### Exemplo de Uso nos Componentes

```css
/* ✅ CORRETO - Use sempre variáveis semânticas */
.card {
    background: var(--theme-bg-primary);
    color: var(--theme-text-primary);
    border: 1px solid var(--theme-border-primary);
}

.card:hover {
    background: var(--theme-surface-hover);
}

.form-input {
    background: var(--theme-bg-primary);
    color: var(--theme-text-primary);
    border: 1px solid var(--theme-border-primary);
}

.form-input:focus {
    border-color: var(--theme-border-focus);
}

/* ❌ ERRADO - Nunca use cores fixas */
.card {
    background: var(--white);      /* Não funciona no tema escuro */
    color: var(--dark);           /* Não funciona no tema escuro */
}
```

### Migração de Componentes Existentes

Se você encontrar um componente usando cores fixas:

```css
/* ANTES - cores fixas */
.meu-componente {
    background: var(--gray-50);
    color: var(--dark);
    border: 1px solid var(--gray-200);
}

/* DEPOIS - variáveis semânticas */
.meu-componente {
    background: var(--theme-bg-secondary);
    color: var(--theme-text-primary);
    border: 1px solid var(--theme-border-primary);
}
```

### Testando Temas

1. **Acesse** Configurações → Sistema
2. **Teste ambos os temas** clicando nos previews
3. **Verifique** se todos os componentes estão legíveis
4. **Confirme** que as cores fazem sentido contextualmente

## 📏 Convenções e Boas Práticas

### 1. **Sempre use variáveis CSS**
```css
/* ✅ Correto */
color: var(--primary);
margin: var(--spacing-md);

/* ❌ Errado */
color: #2563eb;
margin: 16px;
```

### 2. **Use classes utilitárias do sistema**
```html
<!-- ✅ Correto -->
<div class="flex justify-between p-lg bg-gray-100">

<!-- ❌ Errado -->
<div style="display: flex; justify-content: space-between; padding: 24px;">
```

### 3. **Componentes antes de CSS customizado**
```html
<!-- ✅ Correto: usar componente existente -->
<button class="btn btn-primary">Clique</button>

<!-- ❌ Errado: criar classe customizada -->
<button class="meu-botao-especial">Clique</button>
```

### 4. **Responsividade com classes do sistema**
```html
<!-- ✅ Correto -->
<div class="mobile-hidden desktop-block">

<!-- ❌ Errado -->
@media (min-width: 768px) { .minha-classe { display: block; } }
```

### 5. **Ordem de importação**
```css
/* 1. Base (fundação) */
@import './base/index.css';

/* 2. Core (sistema) */
@import './core/index.css';

/* 3. Components (reutilizáveis) */
@import './components/index.css';

/* 4. Pages (específicos) */
@import './pages/index.css';
```

## 🚀 Como Usar

### Para Programadores
1. **Sempre consulte** as variáveis CSS antes de criar valores
2. **Use utilitárias** para espaçamento, cores e layout
3. **Componentes prontos** para botões, forms, cards, badges
4. **Evite CSS inline** ou classes customizadas
5. **Mobile first** - teste sempre em dispositivos móveis

### Para IA
1. **Leia os arquivos CSS** antes de gerar código
2. **Use apenas classes existentes** no sistema
3. **Mantenha consistência** com padrões estabelecidos
4. **Não crie CSS customizado** sem necessidade extrema
5. **Respeite a hierarquia** base → core → components → pages

## 📝 Exemplos Práticos

### Página Completa
```html
<div class="container py-xl">
  <div class="stack">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-lg">
      <h1 class="text-2xl font-bold">Título da Página</h1>
      <button class="btn btn-primary">Nova Ação</button>
    </div>
    
    <!-- Grid de cards -->
    <div class="grid-cards">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">Card 1</h3>
          <p class="text-muted">Descrição do card</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Formulário Completo
```html
<form class="card">
  <div class="card-header">
    <h3 class="card-title">Configurações</h3>
  </div>
  <div class="card-body">
    <div class="stack">
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input type="text" class="form-control" required>
      </div>
      
      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select class="form-select">
          <option>Selecione...</option>
        </select>
      </div>
      
      <div class="form-switch">
        <input type="checkbox" class="form-switch-input" id="ativo">
        <label class="form-switch-label" for="ativo">Ativo</label>
      </div>
    </div>
  </div>
  <div class="card-footer">
    <div class="flex justify-end gap-md">
      <button type="button" class="btn btn-ghost">Cancelar</button>
      <button type="submit" class="btn btn-primary">Salvar</button>
    </div>
  </div>
</form>
```

## 📋 Status da Migração para Temas

### ✅ Arquivos Atualizados com Sistema de Temas

**Base CSS:**
- ✅ `01-variables.css` - Sistema de temas implementado
- ✅ `04-layouts.css` - Migrado para variáveis semânticas

**Componentes:**
- ✅ `card-list.css` - Totalmente migrado
- ✅ `sidebar.css` - Totalmente migrado  
- ✅ `header.css` - Totalmente migrado

**Limpeza Realizada:**
- ✅ Removido `@media (prefers-color-scheme: dark)` de todos os componentes
- ✅ Substituído cores fixas por variáveis semânticas
- ✅ Sistema centralizado em `variables.css`

### 🚀 Como Verificar se um Componente Está Atualizado

Um componente está **corretamente migrado** quando:

```css
/* ✅ CORRETO - usa variáveis semânticas */
.meu-componente {
    background: var(--theme-bg-primary);
    color: var(--theme-text-primary);
    border: 1px solid var(--theme-border-primary);
}

/* ❌ ERRADO - usa cores fixas */
.meu-componente {
    background: var(--white);
    color: var(--dark);
    border: 1px solid var(--gray-200);
}
```

### 📝 Para Novos Componentes

Sempre use as variáveis semânticas de tema ao criar novos componentes:

1. **Backgrounds**: `--theme-bg-primary`, `--theme-bg-secondary`, `--theme-bg-tertiary`
2. **Textos**: `--theme-text-primary`, `--theme-text-secondary`, `--theme-text-tertiary`  
3. **Bordas**: `--theme-border-primary`, `--theme-border-secondary`
4. **Estados**: `--theme-surface-hover`, `--theme-surface-active`

---

_Última atualização: Janeiro 2025_
_Sistema CSS modular, escalável e otimizado para performance_
_Sistema de temas claro/escuro implementado e totalmente funcional_