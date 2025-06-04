# Sistemas Core do Ialum

## ⚠️ IMPORTANTE PARA IA

**SEMPRE** verifique se existe um sistema core antes de implementar funcionalidade nova. Use os sistemas existentes em `/js/core/` para manter consistência.

## Lista de Sistemas Disponíveis

### 1. backup.js
- **Uso**: Auto-save local de formulários
- **Quando usar**: Qualquer página com entrada de dados
- **Import**: `import { Backup } from '/js/core/backup.js'`
- **Exemplo**: `Backup.init('nome-pagina')`

### 2. cache.js  
- **Uso**: Cache de dados para performance
- **Quando usar**: Dados que não mudam frequentemente
- **Import**: `import { Cache } from '/js/core/cache.js'`
- **Exemplo**: `Cache.get('topicos')` ou `Cache.set('topicos', dados, 5)`

### 3. dom.js
- **Uso**: Gerenciamento seguro de elementos DOM
- **Quando usar**: SEMPRE ao manipular elementos
- **Import**: `import { DOM } from '/js/core/dom.js'`
- **Exemplo**: `DOM.ready(() => { ... })` ou `DOM.select('#id')`

### 4. state.js
- **Uso**: Estado global da aplicação
- **Quando usar**: Dados compartilhados entre páginas
- **Import**: `import { State } from '/js/core/state.js'`
- **Exemplo**: `State.get('usuario')` ou `State.set('tema', 'escuro')`

### 5. queue.js
- **Uso**: Fila de processamentos assíncronos
- **Quando usar**: Operações demoradas (geração IA, uploads)
- **Import**: `import { Queue } from '/js/core/queue.js'`
- **Exemplo**: `Queue.add('gerar-imagem', dados, callback)`

### 6. upload.js
- **Uso**: Upload de arquivos com progresso
- **Quando usar**: Upload de imagens/documentos
- **Import**: `import { Upload } from '/js/core/upload.js'`
- **Exemplo**: `Upload.image(file, onProgress, onComplete)`

### 7. notify.js
- **Uso**: Sistema unificado de notificações
- **Quando usar**: Feedback ao usuário
- **Import**: `import { Notify } from '/js/core/notify.js'`
- **Exemplo**: `Notify.success('Salvo!')` ou `Notify.error('Erro')`

### 8. loader.js
- **Uso**: Indicadores de carregamento e erro
- **Quando usar**: Loading, erro, progresso
- **Import**: `import { Loader } from '/js/core/loader.js'`
- **Exemplos**: 
  - Loading: `Loader.show()` e `Loader.hide()`
  - Erro: `Loader.showError('Mensagem')`
  - Progresso: `Loader.showProgress(75, 'Processando...')`

### 9. error.js
- **Uso**: Tratamento padronizado de erros
- **Quando usar**: Try/catch e erros de API
- **Import**: `import { ErrorHandler } from '/js/core/error.js'`
- **Exemplo**: `ErrorHandler.handle(erro, 'Falha ao salvar')`

### 10. validators.js
- **Uso**: Validações e máscaras de formulário
- **Quando usar**: Validar dados e aplicar máscaras
- **Import**: `import { validators, masks } from '/js/core/validators.js'`
- **Exemplos**: 
  - Validar: `validators.email(value)` ou `validators.cpf(value)`
  - Mascarar: `masks.phone('11999999999')` → `(11) 99999-9999`

### 11. formatters.js
- **Uso**: Formatação de dados para exibição
- **Quando usar**: Formatar datas, moeda, números, etc
- **Import**: `import { format } from '/js/core/formatters.js'`
- **Exemplos**:
  - Data: `format.date(new Date())` → `06/01/2025`
  - Moeda: `format.currency(1234.56)` → `R$ 1.234,56`
  - Tempo: `format.timeAgo(date)` → `há 2 dias`

### 12. ui.js
- **Uso**: Comportamentos e interações visuais
- **Quando usar**: Animações, scroll, feedback visual
- **Import**: `import { UI } from '/js/core/ui.js'`
- **Exemplos**:
  - Scroll: `UI.scrollTo('#section')`
  - Copiar: `UI.copyToClipboard(texto)`
  - Efeitos: `UI.shake(element)` ou `UI.highlight(element)`
  - Utils: `UI.debounce(fn, 300)` ou `UI.generateId()`

## Regras de Uso

### Para Desenvolvedores/IA:

1. **SEMPRE** verificar se funcionalidade existe em `/js/core/`
2. **NUNCA** reimplementar o que já existe
3. **SEMPRE** importar e usar os sistemas
4. **NUNCA** criar código similar sem consultar

### Exemplos de Uso Incorreto vs Correto:

```javascript
// ❌ ERRADO - Não reinvente
localStorage.setItem('dados', JSON.stringify(dados));

// ✅ CORRETO - Use o sistema
Cache.set('dados', dados);

// ❌ ERRADO - Manipulação direta
document.getElementById('btn').onclick = ...

// ✅ CORRETO - Use DOM helper
DOM.on('#btn', 'click', handler);

// ❌ ERRADO - Notificação customizada
alert('Erro!');

// ✅ CORRETO - Sistema unificado
Notify.error('Erro ao processar');
```

## Benefícios

1. **Consistência**: Mesma experiência em todo app
2. **Manutenção**: Corrige em um lugar, funciona em todos
3. **Performance**: Otimizações centralizadas
4. **Segurança**: Validações e tratamentos padrão
5. **Produtividade**: Não reinventa a roda

## Como Adicionar Novo Sistema

1. Criar arquivo em `/js/core/nome.js`
2. Adicionar documentação neste arquivo
3. Seguir padrão dos existentes
4. Testar isoladamente
5. Documentar uso

## Prioridade de Implementação

1. **Implementados**: api, backup, cache, dom, state, validators, formatters, ui, loader (✅)
2. **Próximos**: queue, upload, notify (features)
3. **Futuros**: error (tratamento global)

## Arquivos Organizados

### Em /js/core/ (Sistemas principais):
- **api.js** - Chamadas HTTP e configurações (Config integrado) ✅
- **app.js** - Inicialização geral da aplicação ✅
- **backup.js** - Auto-save local de formulários ✅
- **cache.js** - Cache com expiração ✅
- **dom.js** - Manipulação segura do DOM ✅
- **formatters.js** - Formatação de dados para exibição ✅
- **loader.js** - Indicadores de loading e erro ✅
- **router.js** - Navegação SPA ✅
- **state.js** - Estado global da aplicação ✅
- **ui.js** - Comportamentos e interações visuais ✅
- **validators.js** - Validações e máscaras de formulário ✅

### Removidos (integrados em outros):
- ~~config.js~~ - Integrado em api.js
- ~~utils.js~~ - Funções distribuídas em formatters.js e ui.js

---

**LEMBRETE**: Este documento deve ser consultado SEMPRE antes de implementar qualquer funcionalidade. Os sistemas em `/js/core/` são a base do Ialum.