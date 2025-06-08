# Sistemas Core JavaScript do Ialum

## 🤖 IMPORTANTE PARA IA

**ANTES DE IMPLEMENTAR QUALQUER FUNCIONALIDADE**:
1. **SEMPRE verifique** se já existe em `/js/core/` ou `/js/components/` - não reinvente a roda!
2. **USE os sistemas existentes** - foram otimizados para performance e segurança
3. **IMPORTE corretamente** - use ES6 modules com caminhos relativos da nova estrutura
4. **SIGA os padrões** - mantenha consistência com o código existente
5. **NUNCA crie alternativas** - se existe `DOM.select()`, não use `querySelector()`
6. **REUTILIZE componentes** - CardForm, CardList, CardGrid e CardDisplay cobrem 90% dos casos

Este documento é sua referência completa dos sistemas disponíveis.

## 📁 Estrutura de Arquivos (Nova Arquitetura)

```
public/js/
├── core/                    # Sistemas fundamentais (SEMPRE USE!)
│   ├── api.js              # Chamadas HTTP e autenticação
│   ├── app.js              # Inicialização da aplicação
│   ├── backup.js           # Auto-save local de formulários
│   ├── cache.js            # Cache com expiração
│   ├── dom.js              # Manipulação segura do DOM
│   ├── loader.js           # Indicadores de carregamento
│   ├── router.js           # Sistema de rotas SPA
│   └── state.js            # Estado global reativo
├── components/             # Componentes modulares reutilizáveis
│   ├── cards/              # Componentes de cartão (CRUD completo)
│   │   ├── CardList.js     # Lista CRUD expansível (herói dos formulários)
│   │   ├── CardGrid.js     # Grid responsivo com seleção
│   │   ├── CardDisplay.js  # Visualização rica de dados
│   │   └── CardForm.js     # Formulário dinâmico universal
│   ├── forms/              # Sistema de formulários
│   │   ├── validators.js   # Validação brasileira completa
│   │   ├── formatters.js   # Formatação de dados BR
│   │   └── masks.js        # Máscaras de input
│   ├── ui/                 # Componentes de interface
│   │   ├── behaviors.js    # Comportamentos interativos
│   │   ├── CharCounter.js  # Contador de caracteres
│   │   ├── ColorPicker.js  # Seletor de cores
│   │   ├── EmojiPicker.js  # Seletor de emojis
│   │   ├── FileUpload.js   # Upload de arquivos
│   │   ├── FontSelector.js # Seletor de fontes
│   │   └── MarkdownEditor.js # Editor Markdown
│   └── layout/             # Componentes de layout
│       ├── notifications.js # Sistema de notificações
│       └── sidebar.js      # Menu lateral
└── pages/                  # Controladores de páginas
```

## 🛠️ Sistemas Core Disponíveis

### 1. **API** (api.js)
Sistema completo de requisições HTTP com autenticação integrada.

```javascript
import { API } from '/js/core/api.js';

// Autenticação
await API.auth.login(email, password);
await API.auth.logout();
await API.auth.verify();

// Buscar dados
const topics = await API.data.getTopics();
const topic = await API.data.getTopic(id);
const stats = await API.data.getDashboardStats();

// Ações
await API.actions.createTopic(data);
await API.actions.updateTopic(id, data);
await API.actions.saveSettings(settings);
```

### 2. **App** (app.js)
Inicialização e controle geral da aplicação.

```javascript
import { App } from '/js/core/app.js';

// Inicializa toda a aplicação (chamado uma vez)
App.init();
```

### 3. **Backup** (backup.js)
Auto-save automático de formulários no localStorage.

```javascript
import { Backup } from '/js/core/backup.js';

// Inicializar backup para uma página
Backup.init('configuracoes', {
    autoSave: true,      // Salva automaticamente (padrão: true)
    interval: 5000,      // Intervalo em ms (padrão: 5000)
    expiration: 7        // Dias até expirar (padrão: 7)
});

// Operações manuais
Backup.save('configuracoes');
Backup.restore('configuracoes');
Backup.clear('configuracoes');
```

### 4. **Cache** (cache.js)
Sistema de cache local com expiração automática.

```javascript
import { Cache } from '/js/core/cache.js';

// Armazenar com expiração (minutos)
Cache.set('topicos', dados, 30);

// Recuperar
const dados = Cache.get('topicos');

// Buscar ou criar cache
const topics = await Cache.getOrFetch('topicos', 
    async () => await API.data.getTopics(), 
    30
);

// Limpar
Cache.remove('topicos');
Cache.clear(); // Remove tudo
```

### 5. **DOM** (dom.js)
Manipulação segura e eficiente do DOM.

```javascript
import { DOM } from '/js/core/dom.js';

// Aguardar DOM carregar
DOM.ready(() => {
    // Código aqui
});

// Selecionar elementos
const btn = DOM.select('#meu-botao');
const items = DOM.selectAll('.item');

// Eventos (com cleanup automático)
DOM.on('#btn', 'click', (e) => console.log('Clicou!'));
DOM.delegate('.container', 'click', '.item', handler);

// Criar elementos
const div = DOM.create('div', {
    className: 'card',
    innerHTML: '<h3>Título</h3>'
});

// Manipular classes
DOM.addClass(element, 'active');
DOM.removeClass(element, 'hidden');
DOM.toggleClass(element, 'expanded');

// Visibilidade
DOM.show(element);
DOM.hide(element);

// Aguardar elemento aparecer
await DOM.waitFor('#dynamic-element');
```

### 6. **Formatters** (forms/formatters.js)
Formatação de dados para o padrão brasileiro.

```javascript
import { formatters } from '../../components/forms/formatters.js';

// Datas
formatters.date(new Date());              // "06/01/2025"
formatters.datetime(new Date());          // "06/01/2025 14:30"

// Valores
formatters.currency(1234.56);            // "R$ 1.234,56"
formatters.number(1234.5);               // "1.234,5"
formatters.percent(0.156);               // "15,6%"

// Telefone
formatters.phone('11999999999');         // "(11) 99999-9999"

// Tempo relativo
formatters.timeAgo(date);                // "há 2 dias"

// Arquivos
formatters.fileSize(1024000);            // "1 MB"

// Texto
formatters.truncate('Texto longo...', 20); // "Texto longo..."
formatters.capitalize('nome sobrenome');   // "Nome Sobrenome"
```

### 7. **Loader** (loader.js)
Indicadores de carregamento e feedback visual.

```javascript
import { Loader } from '/js/core/loader.js';

// Loading global
Loader.show();
Loader.hide();

// Loading em elemento específico
Loader.showInElement('#container');

// Erro
Loader.showError('Falha ao carregar dados');

// Progresso
Loader.showProgress(75, 'Processando imagens...');
```

### 8. **Router** (router.js)
Sistema de rotas e navegação SPA completo com todas as páginas disponíveis.

```javascript
import { Router } from '/js/core/router.js';

// Rotas principais disponíveis
Router.navigate('dashboard');           // Dashboard principal
Router.navigate('topicos');            // Central de Tópicos
Router.navigate('embasamentos');       // Embasamentos jurídicos
Router.navigate('publicacoes');        // Publicações
Router.navigate('agendamentos');       // Agendamentos
Router.navigate('relatorios');         // Relatórios

// Redação (todas redirecionam para Instagram por enquanto)
Router.navigate('redacao-instagram');  // Redação para Instagram

// Configurações (formato: configuracoes-NOME)
Router.navigate('configuracoes-banca');
Router.navigate('configuracoes-banco-imagens');
Router.navigate('configuracoes-templates');
Router.navigate('configuracoes-integracoes');
Router.navigate('configuracoes-sistema');

// Conta (formato: conta-NOME)
Router.navigate('conta-usuarios');
Router.navigate('conta-financeiro');
Router.navigate('conta-parcerias');

// Outras páginas
Router.navigate('ajuda');

// Navegar com parâmetros
Router.navigate('topicos', { filter: 'ativos' });

// Obter parâmetros da rota atual
const params = Router.getParams();

// Limpar parâmetros
Router.clearParams();
```

### 9. **State** (state.js)
Estado global reativo da aplicação.

```javascript
import { State } from '/js/core/state.js';

// Definir valor
State.set('usuario', { nome: 'João', email: 'joao@email.com' });
State.set('tema', 'escuro');

// Obter valor
const usuario = State.get('usuario');
const tema = State.get('tema', 'claro'); // com valor padrão

// Observar mudanças
State.watch('tema', (novoTema) => {
    console.log('Tema mudou para:', novoTema);
});

// Remover
State.remove('usuario');
```

### 10. **Componentes UI** (components/ui/)
Componentes especializados de interface - use diretamente.

```javascript
// IMPORTANTE: Não há mais sistema UI centralizado em core/
// Use os componentes UI diretamente:

import { EmojiPicker } from '/js/components/ui/EmojiPicker.js';
import { FileUpload } from '/js/components/ui/FileUpload.js';
import { ColorPicker } from '/js/components/ui/ColorPicker.js';
import { MarkdownEditor } from '/js/components/ui/MarkdownEditor.js';
import { FontSelector } from '/js/components/ui/FontSelector.js';
import { CharCounter } from '/js/components/ui/CharCounter.js';
import { behaviors } from '/js/components/ui/behaviors.js';

// Comportamentos visuais
behaviors.scrollTo('#section');
behaviors.copyToClipboard('Texto copiado!');
behaviors.shake(element);
behaviors.highlight(element);
behaviors.fadeToggle(element);

// Ou melhor ainda: use CardForm que integra tudo automaticamente
const form = new CardForm('#container', {
    fields: [
        { type: 'emoji-text' },      // EmojiPicker automático
        { type: 'color-picker' },    // ColorPicker automático
        { type: 'markdown' }         // MarkdownEditor automático
    ]
});
```

### 11. **Validators & Masks** (forms/validators.js & forms/masks.js)
Validação e máscaras de formulários brasileiros.

```javascript
import { validators } from '../../components/forms/validators.js';
import { masks } from '../../components/forms/masks.js';

// Validar campos
validators.required(value);         // true/false
validators.email(value);           // true/false
validators.cpf(value);            // true/false
validators.phone(value);          // true/false
validators.url(value);            // true/false
validators.minLength(value, 3);   // true/false

// Aplicar máscaras automáticas em inputs
masks.cpf(inputElement);         // Aplica máscara CPF
masks.phone(inputElement);       // Aplica máscara telefone
masks.currency(inputElement);    // Aplica máscara moeda
masks.date(inputElement);        // Aplica máscara data

// Validação integrada com CardForm
const cardForm = new CardForm(container, {
    validators: {
        email: { required: true, type: 'email' },
        phone: { required: true, type: 'phone' },
        name: { required: true, minLength: 2 }
    }
});
```

## 📐 Princípios de Design de Componentes

### REGRAS FUNDAMENTAIS PARA NOVOS COMPONENTES:

1. **Isolamento Total**
   - ❌ NUNCA use `document.addEventListener` - use eventos no próprio elemento
   - ❌ NUNCA acesse elementos fora do container passado
   - ✅ Comunicação apenas via CustomEvent no elemento

2. **DOM Mínimo**
   - ✅ PREFIRA modificar elementos existentes (Enhancers)
   - ⚠️ EVITE criar estruturas complexas (máximo 2 níveis)
   - ❌ NUNCA crie popups/dropdowns globais

3. **Estado Local**
   - ✅ Todo estado na instância: `this.state = {}`
   - ❌ SEM variáveis globais ou window
   - ✅ Persistência apenas via `Cache.js`

4. **Tipos de Componentes (ordem de preferência):**
   - **Enhancers**: Apenas melhoram input existente (ex: masks, validators)
   - **Wrappers**: Envolvem elemento com funcionalidade (ex: CharCounter)
   - **Builders**: Criam estrutura nova (último recurso)

5. **Exemplo de Componente Correto:**
```javascript
// ✅ BOM: Enhancer simples
export class CurrencyInput {
    constructor(element) {
        this.element = element;
        this.element.addEventListener('input', this.format.bind(this));
    }
    
    format(e) {
        // Formata apenas o próprio elemento
        this.element.value = formatCurrency(e.target.value);
        this.element.dispatchEvent(new CustomEvent('formatted'));
    }
    
    destroy() {
        // Limpa apenas seus próprios eventos
        this.element.removeEventListener('input', this.format);
    }
}

// ❌ RUIM: Componente invasivo
export class BadComponent {
    constructor(element) {
        // NUNCA faça isso!
        document.addEventListener('click', this.handleGlobalClick);
        document.body.appendChild(this.createPopup());
    }
}
```

## 🧩 Componentes Reutilizáveis (Nova Arquitetura)

### **CardList** (cards/CardList.js) - ⭐ O Herói dos CRUDs
Componente robusto para listas CRUD expansíveis com validação integrada.

```javascript
import { CardList } from '../../components/cards/CardList.js';

const narrativasList = new CardList('#container', {
    type: 'narrativa',
    items: dados,
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    primaryField: 'nome',
    
    fields: [
        {
            name: 'nome',
            type: 'emoji-text',    // Usa EmojiPicker automaticamente
            required: true,
            maxLength: 27
        },
        {
            name: 'descricao',
            type: 'textarea',
            required: true,
            maxLength: 500
        }
    ],
    
    validators: {
        nome: { required: true, maxLength: 27 },
        descricao: { required: true, maxLength: 500 }
    },
    
    onItemCreated: (item) => showToast('Criado!', 'success'),
    onItemUpdated: (item) => showToast('Atualizado!', 'success'),
    onItemDeleted: (id) => showToast('Removido!', 'info')
});
```

### **CardForm** (cards/CardForm.js) - 🎨 Formulário Universal
Formulário dinâmico que reutiliza TODOS os componentes UI existentes.

```javascript
import { CardForm } from '../../components/cards/CardForm.js';

const identidadeForm = new CardForm('#container', {
    type: 'identidade-visual',
    mode: 'edit', // 'create' ou 'edit'
    
    fields: [
        {
            name: 'logo',
            type: 'file-upload',        // Usa FileUpload
            accept: 'image/*'
        },
        {
            name: 'corPrimaria',
            type: 'color-picker',       // Usa ColorPicker
            required: true
        },
        {
            name: 'fonte',
            type: 'font-selector',      // Usa FontSelector
            required: true
        },
        {
            name: 'descricao',
            type: 'markdown',           // Usa MarkdownEditor
            rows: 6
        },
        {
            name: 'telefone',
            type: 'phone',              // Aplica máscara automática
            required: true
        }
    ],
    
    validators: {
        corPrimaria: { required: true, type: 'color' },
        telefone: { required: true, type: 'phone' }
    },
    
    onSubmit: async (data) => {
        await API.saveIdentidade(data);
        showToast('Salvo!', 'success');
    },
    
    onChange: (data) => {
        // Preview em tempo real
        applyColorPreview(data);
    }
});
```

### **CardGrid** (cards/CardGrid.js) - 📱 Grid Responsivo
Grid responsivo com seleção múltipla e busca integrada.

```javascript
import { CardGrid } from '../../components/cards/CardGrid.js';

const imagesGrid = new CardGrid('#container', {
    type: 'imagem',
    items: imagens,
    columns: 'auto',        // ou 2, 3, 4, 5, 6
    selectable: true,
    multiSelect: true,
    searchable: true,
    
    primaryField: 'nome',
    secondaryField: 'descricao',
    imageField: 'url',
    
    itemActions: [
        {
            action: 'edit',
            label: 'Editar',
            icon: '✏️',
            class: 'btn-primary'
        },
        {
            action: 'download',
            label: 'Download',
            icon: '⬇️',
            class: 'btn-outline'
        }
    ],
    
    onSelectionChanged: (selectedItems) => {
        console.log('Selecionados:', selectedItems);
    },
    
    onAction: (action, itemId, item) => {
        if (action === 'download') {
            downloadImage(item.url);
        }
    }
});
```

### **CardDisplay** (cards/CardDisplay.js) - 👁️ Visualização Rica
Exibição formatada de dados com actions personalizáveis.

```javascript
import { CardDisplay } from '../../components/cards/CardDisplay.js';

const topicoDisplay = new CardDisplay('#container', {
    type: 'topico',
    item: topicoData,
    layout: 'vertical',     // ou 'horizontal'
    
    primaryField: 'titulo',
    secondaryField: 'status',
    imageField: 'thumbnail',
    
    fields: [
        {
            name: 'createdAt',
            label: 'Criado em',
            type: 'date'            // Formata automaticamente
        },
        {
            name: 'valor',
            label: 'Valor',
            type: 'currency'        // R$ 1.234,56
        },
        {
            name: 'telefone',
            label: 'Contato',
            type: 'phone'           // Link tel:
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email'           // Link mailto:
        },
        {
            name: 'tags',
            label: 'Tags',
            type: 'list'            // Array como badges
        }
    ],
    
    actions: [
        {
            action: 'duplicate',
            label: 'Duplicar',
            icon: '📄',
            class: 'btn-outline'
        }
    ],
    
    onEdit: (item) => {
        // Abrir editor
        openTopicoEditor(item);
    },
    
    onAction: (action, item) => {
        if (action === 'duplicate') {
            duplicateTopic(item);
        }
    }
});
```

## 🎨 Componentes UI Reutilizáveis

### **FileUpload** (ui/FileUpload.js) - 📁
Upload de arquivos com preview e validação.
```javascript
import { FileUpload } from '../../components/ui/FileUpload.js';
// Usado automaticamente pelo CardForm com type: 'file-upload'
```

### **ColorPicker** (ui/ColorPicker.js) - 🎨
Seletor de cores com input hex.
```javascript
import { ColorPicker } from '../../components/ui/ColorPicker.js';
// Usado automaticamente pelo CardForm com type: 'color-picker'
```

### **EmojiPicker** (ui/EmojiPicker.js) - 😀
Seletor de emojis integrado.
```javascript
import { EmojiPicker } from '../../components/ui/EmojiPicker.js';
// Usado automaticamente pelo CardForm com type: 'emoji-text'
```

### **FontSelector** (ui/FontSelector.js) - 🔤
Seletor de fontes Google Fonts.
```javascript
import { FontSelector } from '../../components/ui/FontSelector.js';
// Usado automaticamente pelo CardForm com type: 'font-selector'
```

### **MarkdownEditor** (ui/MarkdownEditor.js) - ✏️
Editor Markdown com preview.
```javascript
import { MarkdownEditor } from '../../components/ui/MarkdownEditor.js';
// Usado automaticamente pelo CardForm com type: 'markdown'
```

### **CharCounter** (ui/CharCounter.js) - 📊
Contador de caracteres para textareas.
```javascript
import { CharCounter } from '../../components/ui/CharCounter.js';
// Aplicado automaticamente em campos com maxLength
```

### **Sidebar** (layout/sidebar.js)
Menu lateral com submenus expansíveis e navegação automática.

```javascript
import { Sidebar } from '../../components/layout/sidebar.js';

// Inicialização automática (já feita no app.html)
Sidebar.init();

// Controlar itens do menu
Sidebar.toggleMenuItem('.nav-item[data-feature="advanced"]', true);

// Adicionar badges de notificação
Sidebar.addBadge('.nav-link[href="#publicacoes"]', 5, 'primary');
Sidebar.addBadge('.nav-link[href="#agendamentos"]', 2, 'warning');

// Atualizar informações do usuário
Sidebar.updateUserInfo({
    name: 'Dr. João Silva',
    email: 'joao@advocacia.com'
});

// Controlar submenus programaticamente
Sidebar.expandSubmenu('.nav-item-submenu'); // Expandir
Sidebar.toggleSubmenu('.nav-item-submenu', false); // Fechar

// Atualizar status de integração
Sidebar.updateIntegrationStatus('instagram', true);
Sidebar.updateIntegrationStatus('linkedin', false);
```

**Estrutura de Links:**
- Links principais: `#dashboard`, `#topicos`, `#embasamentos`, etc.
- Configurações: `#configuracoes-banca`, `#configuracoes-banco-imagens`, etc.
- Conta: `#conta-usuarios`, `#conta-financeiro`, `#conta-parcerias`
- Redação: `#redacao-instagram` (outras redes em desenvolvimento)
- Submenus expandem automaticamente quando rota está ativa
- Estado mantido no cache entre sessões

### **Notifications** (layout/notifications.js)
Sistema de notificações e toasts.

```javascript
import { showToast, updateNotificationBadge } from '../../components/layout/notifications.js';

// Toast rápido
showToast('Salvo com sucesso!', 'success');
showToast('Erro ao processar', 'error');

// Atualizar badge
updateNotificationBadge(5);
```

## ❌ Exemplos: Errado vs Correto

```javascript
// ❌ ERRADO - Manipulação direta do DOM
document.getElementById('btn').addEventListener('click', ...);
document.querySelector('.card').classList.add('active');

// ✅ CORRETO - Use o sistema DOM
DOM.on('#btn', 'click', handler);
DOM.addClass('.card', 'active');

// ❌ ERRADO - LocalStorage direto
localStorage.setItem('dados', JSON.stringify(data));

// ✅ CORRETO - Use Cache ou State
Cache.set('dados', data, 60);
State.set('dados', data);

// ❌ ERRADO - Formatação manual
const formatted = 'R$ ' + value.toFixed(2).replace('.', ',');

// ✅ CORRETO - Use formatters
const formatted = formatters.currency(value);

// ❌ ERRADO - Alert nativo
alert('Erro!');

// ✅ CORRETO - Use toast
showToast('Erro ao processar', 'error');

// ❌ ERRADO - Fetch direto
fetch('/api/topics').then(r => r.json());

// ✅ CORRETO - Use API
await API.data.getTopics();

// ❌ ERRADO - Criar componentes do zero
function createCustomGrid() { /* código personalizado */ }

// ✅ CORRETO - Use componentes existentes
import { CardGrid } from '../../components/cards/CardGrid.js';
const grid = new CardGrid('#container', config);

// ❌ ERRADO - Formulário manual
function createForm() { /* HTML + eventos manuais */ }

// ✅ CORRETO - Use CardForm
import { CardForm } from '../../components/cards/CardForm.js';
const form = new CardForm('#container', { fields: [...] });
```

## 🧭 Sistema de Navegação

### **Convenções de Rotas**
O sistema usa rotas com hífen para organização hierárquica:

```javascript
// ✅ CORRETO - Formato atual
'configuracoes-banca'          // Configurações > Banca
'configuracoes-banco-imagens'  // Configurações > Banco de Imagens
'conta-usuarios'               // Conta > Usuários
'redacao-instagram'            // Redação > Instagram

// ❌ ERRADO - Formato antigo (não funciona)
'configuracoes/banca'          // Slash não é suportado
'conta/usuarios'               // Slash não é suportado
```

### **Mapeamento Sidebar → Rotas**
```html
<!-- No app.html, os links devem usar formato correto -->
<a href="#configuracoes-banca" class="nav-subitem">Banca</a>
<a href="#conta-usuarios" class="nav-subitem">Usuários</a>
<a href="#redacao-instagram" class="nav-subitem">Instagram</a>
```

### **Adicionando Nova Página**
1. Criar view em `/app/views/nome-pagina.html`
2. Criar controller em `/js/pages/nome-pagina/main.js`
3. Adicionar rota no `router.js`:
```javascript
'nome-pagina': {
    title: 'Título da Página',
    view: '/app/views/nome-pagina.html',
    controller: '/js/pages/nome-pagina/main.js',
    requiresAuth: true
}
```
4. Adicionar link no `app.html`:
```html
<a href="#nome-pagina" class="nav-link">
    <span class="nav-icon">🆕</span>
    <span class="nav-text">Nova Página</span>
</a>
```

## 🎨 Dependências CSS para Componentes

### **Classes CSS Essenciais (Verificar se existem)**

```css
/* === CARDS === */
.card-list { /* Container do CardList */ }
.card-list-item { /* Item individual */ }
.card-list-item.expanded { /* Item expandido */ }
.card-list-form { /* Formulário dentro do item */ }
.card-list-form-actions { /* Botões do formulário */ }

.card-grid { /* Container do CardGrid */ }
.card-grid-item { /* Item do grid */ }
.card-grid-item.selected { /* Item selecionado */ }
.card-grid-container.auto-columns { /* Grid automático */ }
.card-grid-container.columns-3 { /* Grid 3 colunas */ }

.card-display { /* Container do CardDisplay */ }
.card-display-field { /* Campo de exibição */ }
.card-display-actions { /* Ações do display */ }

.card-form { /* Container do CardForm */ }
.card-form-form { /* Formulário */ }
.card-form-actions { /* Botões do formulário */ }

/* === COMPONENTES UI === */
.form-file-upload { /* FileUpload */ }
.form-color-picker { /* ColorPicker */ }
.form-emoji-text { /* EmojiPicker */ }
.form-font-selector { /* FontSelector */ }
.form-markdown { /* MarkdownEditor */ }

/* === FORMULÁRIOS === */
.form-group { /* Grupo de campo */ }
.form-label { /* Label do campo */ }
.form-input { /* Input geral */ }
.form-error { /* Mensagem de erro */ }
.form-error.visible { /* Erro visível */ }
.form-help { /* Texto de ajuda */ }

/* === ESTADOS === */
.loading { /* Estado de carregamento */ }
.success { /* Estado de sucesso */ }
.error { /* Estado de erro */ }
.submitting { /* Enviando formulário */ }

/* === ANIMAÇÕES === */
.card-list-item-enter { /* Animação de entrada */ }
.card-list-item-exit { /* Animação de saída */ }
```

### **Classes de Utilidade Críticas**

```css
/* Botões */
.btn { }
.btn-primary { }
.btn-secondary { }
.btn-outline { }
.btn-error { }
.btn-lg { }
.btn-sm { }

/* Layout */
.flex { }
.flex-1 { }
.gap-sm { }
.gap-md { }
.p-md { }
.mb-md { }
.text-center { }

/* Estados visuais */
.hidden { }
.sr-only-ai { /* Screen reader only */ }
.has-error { }
.badge { }
.tag { }
```

### **🚨 STATUS DAS DEPENDÊNCIAS CSS**

#### ✅ **CSS Existente e Funcional**
- **CardList**: Totalmente implementado em `card-list.css`
- **Formulários Base**: Sistema completo em `06-forms.css` (78 classes)
- **Cards Base**: Sistema robusto em `cards.css` (63 classes)
- **EmojiPicker**: Funcional em `06-forms.css`

#### ❌ **CSS Faltando - PRECISA CRIAR**

**1. CardGrid** (Prioridade ALTA):
```css
/* Criar: /public/css/components/card-grid.css */
.card-grid { }
.card-grid-container { }
.card-grid-item { }
.card-grid-item.selected { }
.card-grid-container.auto-columns { }
.card-grid-container.columns-3 { }
.card-grid-empty { }
```

**2. CardForm & CardDisplay** (Prioridade ALTA):
```css
/* Criar: /public/css/components/card-form.css */
.card-form { }
.card-form-form { }
.card-form-actions { }

/* Criar: /public/css/components/card-display.css */
.card-display { }
.card-display-field { }
.card-display-actions { }
```

**3. FileUpload** (Prioridade MÉDIA):
```css
/* Criar: /public/css/components/file-upload.css */
.form-file-upload { }
.file-upload-dropzone { }
.file-upload-preview { }
```

**4. ColorPicker** (Prioridade MÉDIA):
```css
/* Criar: /public/css/components/color-picker.css */
.form-color-picker { }
.color-picker-container { }
.color-picker-dropdown { }
```

#### **📋 Lista de Tarefas CSS**
1. Criar `card-grid.css` (35+ classes)
2. Criar `card-form.css` (10+ classes)  
3. Criar `card-display.css` (8+ classes)
4. Criar `file-upload.css` (15+ classes)
5. Criar `color-picker.css` (12+ classes)

**TOTAL**: ~80 classes CSS novas seguindo padrões BEM existentes.

## 📋 Padrões de Uso

### Estrutura de Página Típica (Nova Arquitetura)

```javascript
// pages/minha-pagina/main.js
import { DOM } from '../../core/dom.js';
import { API } from '../../core/api.js';
import { Loader } from '../../core/loader.js';
import { showToast } from '../../components/layout/notifications.js';
import { formatters } from '../../components/forms/formatters.js';
import { validators } from '../../components/forms/validators.js';

let pageData = {};

export async function init() {
    console.log('[MinhaPagina] Iniciando...');
    
    bindEvents();
    await loadData();
}

function bindEvents() {
    DOM.on('#save-btn', 'click', handleSave);
    DOM.on('#cancel-btn', 'click', handleCancel);
}

async function loadData() {
    try {
        Loader.show();
        pageData = await API.data.getMyData();
        render();
    } catch (error) {
        showToast('Erro ao carregar dados', 'error');
    } finally {
        Loader.hide();
    }
}

async function handleSave(e) {
    e.preventDefault();
    
    if (!validateForm('#my-form')) {
        showToast('Verifique os campos', 'warning');
        return;
    }
    
    // ... lógica de salvamento
}

function render() {
    // ... renderizar dados
}
```

## 🎯 Benefícios da Nova Arquitetura

### **Sistemas Core (Fundação)**
1. **Consistência**: Mesma experiência em toda aplicação
2. **Performance**: Otimizações centralizadas
3. **Segurança**: Validações e sanitização padrão
4. **Manutenibilidade**: Corrige em um lugar, funciona em todos

### **Componentes Cards (Herança)**
1. **Reutilização Máxima**: 4 componentes cobrem 90% dos casos de uso
2. **Configuração Declarativa**: Define campos e comportamentos via JSON
3. **Integração Automática**: Conecta automaticamente validadores, formatters e máscaras
4. **Consistência Visual**: Mesma experiência entre formulários, listas e grids

### **Componentes UI (Especialização)**  
1. **Plug & Play**: Funcionam automaticamente via CardForm
2. **Zero Configuração**: Inicialização automática quando necessário
3. **Comportamento Padrão**: Upload, color picker, emoji picker prontos para usar
4. **Extensibilidade**: Fácil adicionar novos tipos de campo

### **Componentes Forms (Brasileirização)**
1. **Padrão Nacional**: Formatação e validação 100% brasileira
2. **Máscaras Automáticas**: CPF, telefone, CEP aplicados automaticamente  
3. **Validação Semântica**: Entende contexto brasileiro (DDD, etc.)
4. **Formatação Rica**: Datas, moeda, percentual no padrão BR

## 🚀 Como Adicionar Novo Sistema

1. Criar arquivo em `/js/core/novo-sistema.js`
2. Seguir padrão de documentação no header
3. Exportar API pública clara
4. Adicionar documentação neste arquivo
5. Testar isoladamente
6. Usar em pelo menos 2 lugares antes de confirmar

---

## 🎯 **RESUMO EXECUTIVO - NOVA ARQUITETURA**

### **Para IA: Hierarquia de Reutilização**
1. **1º** - Usar sistemas `/js/core/` (DOM, API, State, etc.)
2. **2º** - Usar componentes `/js/components/cards/` (CardList, CardForm, CardGrid, CardDisplay)
3. **3º** - Usar componentes `/js/components/ui/` (FileUpload, ColorPicker, etc.)  
4. **4º** - Usar `/js/components/forms/` (validators, formatters, masks)
5. **ÚLTIMO** - Criar algo novo (apenas se absolutamente necessário)

### **Implementação Típica**
```javascript
// 90% dos casos = CardForm ou CardList
import { CardForm } from '../../components/cards/CardForm.js';
import { CardList } from '../../components/cards/CardList.js';

// Configure via JSON, não código
const config = { 
    fields: [{ type: 'color-picker' }], // Usa ColorPicker automaticamente
    validators: { email: { type: 'email' } } // Usa validators automaticamente
};
```

### **Estado do Projeto**
- ✅ **Core Systems**: 100% funcional
- ✅ **CardList**: 100% funcional com CSS
- ✅ **CardForm, CardGrid, CardDisplay**: 100% funcional com CSS ✨
- ✅ **UI Components**: 100% funcional com CSS ✨  
- ✅ **Forms System**: 100% funcional

**STATUS**: Arquitetura 100% completa! Todos os componentes prontos para uso.

---

**LEMBRETE FINAL**: Esta nova arquitetura maximiza reutilização e elimina duplicação. Os 4 componentes de Card cobrem 90% dos casos de uso. SEMPRE consulte este documento antes de implementar funcionalidades.