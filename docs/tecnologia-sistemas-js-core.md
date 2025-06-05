# Sistemas Core JavaScript do Ialum

## 🤖 IMPORTANTE PARA IA

**ANTES DE IMPLEMENTAR QUALQUER FUNCIONALIDADE**:
1. **SEMPRE verifique** se já existe em `/js/core/` - não reinvente a roda!
2. **USE os sistemas existentes** - foram otimizados para performance e segurança
3. **IMPORTE corretamente** - use ES6 modules com caminhos absolutos
4. **SIGA os padrões** - mantenha consistência com o código existente
5. **NUNCA crie alternativas** - se existe `DOM.select()`, não use `querySelector()`

Este documento é sua referência completa dos sistemas disponíveis.

## 📁 Estrutura de Arquivos

```
public/js/
├── core/              # Sistemas fundamentais (SEMPRE USE!)
│   ├── api.js         # Chamadas HTTP e autenticação
│   ├── app.js         # Inicialização da aplicação
│   ├── backup.js      # Auto-save local de formulários
│   ├── cache.js       # Cache com expiração
│   ├── dom.js         # Manipulação segura do DOM
│   ├── formatters.js  # Formatação de dados BR
│   ├── loader.js      # Indicadores de carregamento
│   ├── router.js      # Sistema de rotas SPA
│   ├── state.js       # Estado global reativo
│   ├── ui.js          # Comportamentos visuais
│   └── validators.js  # Validação e máscaras
├── components/        # Componentes reutilizáveis
│   ├── card-list.js   # Listas CRUD completas
│   ├── notifications.js # Sistema de notificações
│   └── sidebar.js     # Menu lateral
└── pages/            # Controladores de páginas
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

### 6. **Formatters** (formatters.js)
Formatação de dados para o padrão brasileiro.

```javascript
import { format } from '/js/core/formatters.js';

// Datas
format.date(new Date());              // "06/01/2025"
format.dateTime(new Date());          // "06/01/2025 14:30"

// Valores
format.currency(1234.56);             // "R$ 1.234,56"
format.number(1234.5);                // "1.234,5"
format.percent(0.156);                // "15,6%"

// Tempo relativo
format.timeAgo(date);                 // "há 2 dias"

// Arquivos
format.fileSize(1024000);             // "1 MB"

// Texto
format.truncate('Texto longo...', 20); // "Texto longo..."
format.capitalize('nome sobrenome');   // "Nome Sobrenome"
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

### 10. **UI** (ui.js)
Comportamentos e animações visuais.

```javascript
import { UI } from '/js/core/ui.js';

// Scroll suave
UI.scrollTo('#section');
UI.scrollTo(element, { offset: -80 });

// Copiar para clipboard
await UI.copyToClipboard('Texto copiado!');

// Animações
UI.shake(element);        // Balançar (erro)
UI.highlight(element);    // Destacar (sucesso)
UI.fadeToggle(element);   // Fade in/out

// Utilidades
const debounced = UI.debounce(fn, 300);
const throttled = UI.throttle(fn, 100);
const id = UI.generateId(); // "ui_abc123"
```

### 11. **Validators** (validators.js)
Validação e máscaras de formulários.

```javascript
import { validators, masks, validateForm } from '/js/core/validators.js';

// Validar campos
validators.required(value);         // true/false
validators.email(value);           // true/false
validators.cpf(value);            // true/false
validators.phone(value);          // true/false
validators.minLength(value, 3);   // true/false

// Aplicar máscaras
masks.cpf('12345678900');        // "123.456.789-00"
masks.phone('11999999999');      // "(11) 99999-9999"
masks.currency(1234.56);         // "R$ 1.234,56"
masks.date('01012025');          // "01/01/2025"

// Validar formulário completo
const isValid = validateForm('#meu-form');
```

## 🧩 Componentes Reutilizáveis

### **CardList** (card-list.js)
Componente completo para listas CRUD expansíveis.

```javascript
import { CardList } from '/js/components/card-list.js';

const list = new CardList({
    container: '#lista-container',
    template: 'topico',
    onSave: async (data) => await API.actions.saveTopic(data),
    onDelete: async (id) => await API.actions.deleteTopic(id)
});

await list.load();
```

### **Sidebar** (sidebar.js)
Menu lateral com submenus expansíveis e navegação automática.

```javascript
import { Sidebar } from '/js/components/sidebar.js';

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

### **Notifications** (notifications.js)
Sistema de notificações e toasts.

```javascript
import { showToast, updateNotificationBadge } from '/js/components/notifications.js';

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
const formatted = format.currency(value);

// ❌ ERRADO - Alert nativo
alert('Erro!');

// ✅ CORRETO - Use toast
showToast('Erro ao processar', 'error');

// ❌ ERRADO - Fetch direto
fetch('/api/topics').then(r => r.json());

// ✅ CORRETO - Use API
await API.data.getTopics();
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

## 📋 Padrões de Uso

### Estrutura de Página Típica

```javascript
// pages/minha-pagina/main.js
import { DOM } from '/js/core/dom.js';
import { API } from '/js/core/api.js';
import { Loader } from '/js/core/loader.js';
import { showToast } from '/js/components/notifications.js';
import { format } from '/js/core/formatters.js';
import { validateForm } from '/js/core/validators.js';

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

## 🎯 Benefícios dos Sistemas Core

1. **Consistência**: Mesma experiência em toda aplicação
2. **Performance**: Otimizações centralizadas
3. **Segurança**: Validações e sanitização padrão
4. **Manutenibilidade**: Corrige em um lugar, funciona em todos
5. **Produtividade**: Não reinventa funcionalidades
6. **Qualidade**: Código testado e otimizado

## 🚀 Como Adicionar Novo Sistema

1. Criar arquivo em `/js/core/novo-sistema.js`
2. Seguir padrão de documentação no header
3. Exportar API pública clara
4. Adicionar documentação neste arquivo
5. Testar isoladamente
6. Usar em pelo menos 2 lugares antes de confirmar

---

**LEMBRETE FINAL**: Este documento deve ser consultado SEMPRE antes de implementar qualquer funcionalidade. Os sistemas em `/js/core/` são a fundação do Ialum e garantem qualidade, performance e manutenibilidade do código.