## Componente buscador de tópicos ( em desenvolvimento )

IMPORTANTE: 
 - filtrar por advogado ( ainda não especificado )
 - exibir assunto no card da página de central de tópicos

 
### **1. Estratégia de Cache:**
- ✅ Atualizar cache quando usuário clica no campo de busca
- ✅ Intervalo mínimo de 5 minutos entre atualizações
- ✅ Indicador visual sutil durante atualização

### **2. Configurações (Nova aba "Tópicos > Busca e Dados"):**
```
┌─────────────────────────────────────────┐
│ Busca e Dados                           │
├─────────────────────────────────────────┤
│ Janela de tempo para pré-carregamento:  │
│ ○ Últimos 3 meses                       │
│ ● Últimos 6 meses                       │
│ ○ Último ano                            │
│ ○ Últimos 2 anos                        │
│                                         │
│ Número máximo de tópicos:               │
│ ○ 100 tópicos                           │
│ ● 200 tópicos                           │
│ ○ 500 tópicos                           │
│ ○ Todos (não recomendado)               │
└─────────────────────────────────────────┘
```

### **3. Placeholder Informativo:**
```
"Nome ou ID do tópico (200 tópicos em 6 meses)"
                       ↑ Atualiza conforme config
```

## 🎯 Diferenças entre os Componentes:

### **A. Central de Tópicos (Modo Exploração)**

```javascript
new SearchAutocomplete({
    // Visual
    placeholder: 'Nome ou ID do tópico (200 tópicos em 6 meses)',
    mode: 'explore',
    
    // Comportamento
    showResultsOnFocus: true,      // Mostra sugestões ao clicar
    keepResultsOpen: true,          // Não fecha ao selecionar
    maxResults: 30,                 // Muitos resultados
    allowMultiSelect: true,         // Selecionar vários
    
    // Dados
    preloadCount: 200,              // Da configuração
    preloadMonths: 6,               // Da configuração
    searchFields: ['title', 'id', 'theme', 'content_preview'],
    
    // Filtros inline
    showInlineFilters: true,        // Status, tema, data
    
    // Callbacks
    onFocus: () => atualizarCacheSePreciso(),
    onSelect: (items) => filtrarCards(items),
    onClear: () => mostrarTodos()
})
```

**Características:**
- Lista persistente de resultados
- Filtros visuais integrados
- Permite análise comparativa
- Mostra preview dos tópicos
- Indicador de total: "Mostrando 15 de 47 resultados"

### **B. Criar/Editar Publicação (Modo Seleção)**

```javascript
new SearchAutocomplete({
    // Visual
    placeholder: 'Buscar tópico embasado...',
    mode: 'select',
    
    // Comportamento
    showResultsOnFocus: false,      // Só ao digitar
    keepResultsOpen: false,         // Fecha ao selecionar
    maxResults: 8,                  // Poucos, relevantes
    allowMultiSelect: false,        // Só um
    
    // Dados
    preloadCount: 100,              // Menos dados
    filters: { status: 'embasado' }, // Só embasados
    searchFields: ['title', 'id'],  // Busca simples
    
    // Preview ao selecionar
    showPreview: true,
    
    // Callbacks
    onSelect: (topic) => {
        preencherFormulario(topic);
        habilitarProximoPasso();
    }
})
```

**Características:**
- Dropdown tradicional
- Foco em encontrar rápido
- Mostra só o essencial
- Preview do selecionado
- Fecha após selecionar

### **C. Embasar Tópico (Modo Filtrado)**

```javascript
new SearchAutocomplete({
    placeholder: 'Buscar tópico para embasar...',
    mode: 'select',
    
    // Só tópicos não embasados
    filters: { 
        status: ['ideia', 'rascunho'] 
    },
    
    // Ação direta
    onSelect: (topic) => {
        window.location.href = `/embasar/${topic.id}`;
    }
})
```

## 🎨 Resumo Visual:

```
CENTRAL DE TÓPICOS:
┌─────────────────────────────────────┐
│ 🔍 Nome ou ID (200 em 6 meses)  🔄 │
├─────────────────────────────────────┤
│ Sugestões recentes:                 │
│ • Direitos Digitais                 │
│ • Guarda Compartilhada             │
├─────────────────────────────────────┤
│ [Ideia] [Rascunho] [📅 Período]    │
├─────────────────────────────────────┤
│ ▼ 15 resultados encontrados         │
│ ┌─────────────────────────────┐     │
│ │ 📖 Direitos do Consumidor   │     │
│ │ Status: Embasado • ID: 1234 │     │
│ └─────────────────────────────┘     │
│ [Ver mais resultados...]            │
└─────────────────────────────────────┘

CRIAR PUBLICAÇÃO:
┌─────────────────────────────────────┐
│ 🔍 Buscar tópico embasado...        │
└─────────────────────────────────────┘
        ↓ (ao digitar)
┌─────────────────────────────────────┐
│ 📖 Direitos do Consumidor           │
│ 📖 Contratos Digitais               │
│ 📖 Guarda Compartilhada            │
└─────────────────────────────────────┘
        ↓ (ao selecionar)
┌─────────────────────────────────────┐
│ Tópico selecionado:                 │
│ 📖 Direitos do Consumidor           │
│ ID: 1234 • 100% completo           │
│ [Trocar]                            │
└─────────────────────────────────────┘
```

Está tudo alinhado? Quer ajustar algo antes de implementarmos?