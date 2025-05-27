/**
 * search-autocomplete.js
 * Componente de busca com autocomplete reutilizável
 * Dependências: utils.js, api.js
 * Localização: public/js/components/search-autocomplete.js
 * Tamanho alvo: <200 linhas
 */

import { Utils } from '../core/utils.js';
import { API } from '../core/api.js';

export class SearchAutocomplete {
    constructor(options = {}) {
        // Configurações padrão
        this.config = {
            placeholder: 'Buscar...',
            minChars: 2,
            maxResults: 5,
            debounceTime: 300,
            searchType: 'topics', // topics, users, etc
            onSelect: null,
            onClear: null,
            showPreview: false,
            allowCreate: false,
            filters: {},
            ...options
        };
        
        this.container = null;
        this.input = null;
        this.resultsContainer = null;
        this.previewContainer = null;
        this.selectedItem = null;
        this.isOpen = false;
        this.currentIndex = -1;
        this.results = [];
        
        // Debounced search
        this.debouncedSearch = Utils.debounce(
            this.performSearch.bind(this), 
            this.config.debounceTime
        );
    }
    
    // Renderizar o componente
    render(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.error('Target not found:', targetSelector);
            return;
        }
        
        // Limpar target antes de renderizar
        target.innerHTML = '';
        
        // Criar estrutura HTML
        this.container = document.createElement('div');
        this.container.className = 'search-autocomplete';
        this.container.innerHTML = this.getTemplate();
        
        // Inserir no DOM
        target.appendChild(this.container);
        
        // Cachear elementos
        this.input = this.container.querySelector('.search-input');
        this.resultsContainer = this.container.querySelector('.search-results');
        this.previewContainer = this.container.querySelector('.search-preview');
        
        // Bind eventos
        this.bindEvents();
        
        return this;
    }
    
    // Template HTML
    getTemplate() {
        return `
            <div class="search-autocomplete-wrapper">
                <div class="search-input-wrapper">
                    <span class="search-icon">🔍</span>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="${this.config.placeholder}"
                        autocomplete="off"
                    >
                    <button class="search-clear" style="display: none;">×</button>
                </div>
                <div class="search-results" style="display: none;"></div>
                ${this.config.showPreview ? '<div class="search-preview"></div>' : ''}
            </div>
        `;
    }
    
    // Bind eventos
    bindEvents() {
        // Input
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('focus', this.handleFocus.bind(this));
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Clear button
        const clearBtn = this.container.querySelector('.search-clear');
        clearBtn.addEventListener('click', this.clear.bind(this));
        
        // Clique fora fecha
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });
    }
    
    // Handlers
    handleInput(e) {
        const query = e.target.value.trim();
        console.log('Input digitado:', query, 'Tamanho:', query.length);
        
        // Mostrar/esconder botão clear
        const clearBtn = this.container.querySelector('.search-clear');
        clearBtn.style.display = query ? 'block' : 'none';
        
        // Buscar se tiver caracteres mínimos
        if (query.length >= this.config.minChars) {
            console.log('Iniciando busca para:', query);
            this.debouncedSearch(query);
        } else {
            this.close();
        }
    }
    
    handleFocus() {
        if (this.results.length > 0) {
            this.open();
        }
    }
    
    handleKeydown(e) {
        if (!this.isOpen) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigate(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigate(-1);
                break;
            case 'Enter':
                e.preventDefault();
                if (this.currentIndex >= 0) {
                    this.selectItem(this.results[this.currentIndex]);
                }
                break;
            case 'Escape':
                this.close();
                break;
        }
    }
    
    // Navegar pelos resultados
    navigate(direction) {
        const items = this.resultsContainer.querySelectorAll('.search-result-item');
        
        // Remover highlight atual
        if (this.currentIndex >= 0) {
            items[this.currentIndex]?.classList.remove('highlighted');
        }
        
        // Calcular novo índice
        this.currentIndex += direction;
        if (this.currentIndex >= items.length) this.currentIndex = 0;
        if (this.currentIndex < 0) this.currentIndex = items.length - 1;
        
        // Adicionar highlight
        items[this.currentIndex]?.classList.add('highlighted');
        items[this.currentIndex]?.scrollIntoView({ block: 'nearest' });
    }
    
    // Realizar busca
    async performSearch(query) {
        console.log('performSearch chamado com:', query);
        try {
            // Mostrar loading
            this.showLoading();
            
            // Buscar dados (mockado por enquanto)
            // TODO: Integrar com API real
            const mockResults = this.getMockResults(query);
            console.log('Resultados encontrados:', mockResults.length, mockResults);
            
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Processar resultados
            this.results = mockResults.slice(0, this.config.maxResults);
            this.renderResults();
            
        } catch (error) {
            console.error('Erro na busca:', error);
            this.showError();
        }
    }
    
    // Mock de resultados (substituir por API real)
    getMockResults(query) {
        const allItems = [
            { id: 1, title: 'Direitos do Consumidor em Compras Online', status: 'embasado', theme: 'Consumidor' },
            { id: 2, title: 'Guarda Compartilhada: O que você precisa saber', status: 'rascunho', theme: 'Família' },
            { id: 3, title: 'Direitos Trabalhistas na Era Digital', status: 'ideia', theme: 'Trabalhista' },
            { id: 4, title: 'Contratos Digitais e Validade Jurídica', status: 'embasado', theme: 'Empresarial' },
            { id: 5, title: 'Direito à Privacidade na Internet', status: 'rascunho', theme: 'Civil' },
            { id: 6, title: 'Teste de Paternidade: Aspectos Jurídicos', status: 'embasado', theme: 'Família' },
            { id: 7, title: 'Testamento Digital: Como Fazer', status: 'ideia', theme: 'Civil' }
        ];
        
        return allItems.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.theme.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    // Renderizar resultados
    renderResults() {
        if (this.results.length === 0) {
            this.renderNoResults();
            return;
        }
        
        const html = this.results.map((item, index) => `
            <div class="search-result-item" data-index="${index}">
                <div class="result-content">
                    <div class="result-title">${this.highlightMatch(item.title)}</div>
                    <div class="result-meta">
                        <span class="meta-status ${item.status}">${this.getStatusText(item.status)}</span>
                        <span class="meta-theme">${item.theme}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.resultsContainer.innerHTML = html;
        this.bindResultEvents();
        this.open();
    }
    
    // Sem resultados
    renderNoResults() {
        let html = '<div class="search-no-results">Nenhum resultado encontrado</div>';
        
        if (this.config.allowCreate) {
            html += `
                <div class="search-create-new">
                    <button class="btn-create-new">
                        ➕ Criar novo tópico
                    </button>
                </div>
            `;
        }
        
        this.resultsContainer.innerHTML = html;
        
        // Bind do botão criar
        const createBtn = this.resultsContainer.querySelector('.btn-create-new');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.handleCreate());
        }
        
        this.open();
    }
    
    // Bind eventos dos resultados
    bindResultEvents() {
        const items = this.resultsContainer.querySelectorAll('.search-result-item');
        
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectItem(this.results[index]);
            });
            
            item.addEventListener('mouseenter', () => {
                // Remover highlight anterior
                items.forEach(i => i.classList.remove('highlighted'));
                item.classList.add('highlighted');
                this.currentIndex = index;
            });
        });
    }
    
    // Selecionar item
    selectItem(item) {
        this.selectedItem = item;
        this.input.value = item.title;
        this.close();
        
        // Mostrar preview se configurado
        if (this.config.showPreview) {
            this.showPreview(item);
        }
        
        // Callback
        if (this.config.onSelect) {
            this.config.onSelect(item);
        }
        
        // Esconder botão clear por enquanto
        const clearBtn = this.container.querySelector('.search-clear');
        clearBtn.style.display = 'none';
    }
    
    // Mostrar preview
    showPreview(item) {
        if (!this.previewContainer) return;
        
        this.previewContainer.innerHTML = `
            <div class="preview-card">
                <div class="preview-header">
                    <span class="preview-status ${item.status}">${this.getStatusText(item.status)}</span>
                    <button class="preview-change">Trocar</button>
                </div>
                <h4 class="preview-title">${item.title}</h4>
                <div class="preview-meta">
                    <span>Tema: ${item.theme}</span>
                    <span>ID: ${item.id}</span>
                </div>
                <div class="preview-actions">
                    <button class="btn-ghost btn-sm">Ver Detalhes</button>
                </div>
            </div>
        `;
        
        // Bind do botão trocar
        const changeBtn = this.previewContainer.querySelector('.preview-change');
        changeBtn.addEventListener('click', () => {
            this.clear();
            this.input.focus();
        });
    }
    
    // Limpar
    clear() {
        this.input.value = '';
        this.selectedItem = null;
        this.close();
        
        if (this.previewContainer) {
            this.previewContainer.innerHTML = '';
        }
        
        const clearBtn = this.container.querySelector('.search-clear');
        clearBtn.style.display = 'none';
        
        if (this.config.onClear) {
            this.config.onClear();
        }
    }
    
    // Abrir/fechar dropdown
    open() {
        this.resultsContainer.style.display = 'block';
        this.isOpen = true;
        this.currentIndex = -1;
    }
    
    close() {
        this.resultsContainer.style.display = 'none';
        this.isOpen = false;
        this.currentIndex = -1;
    }
    
    // Loading
    showLoading() {
        this.resultsContainer.innerHTML = `
            <div class="search-loading">
                <div class="spinner-small"></div>
                <span>Buscando...</span>
            </div>
        `;
        this.open();
    }
    
    // Erro
    showError() {
        this.resultsContainer.innerHTML = `
            <div class="search-error">
                Erro ao buscar. Tente novamente.
            </div>
        `;
    }
    
    // Highlight do match
    highlightMatch(text) {
        const query = this.input.value;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Helpers
    getStatusText(status) {
        const texts = {
            ideia: '💡 Ideia',
            rascunho: '📝 Rascunho',
            embasado: '📖 Embasado'
        };
        return texts[status] || status;
    }
    
    handleCreate() {
        console.log('Criar novo tópico com:', this.input.value);
        // TODO: Implementar criação
    }
    
    // Métodos públicos
    setValue(value) {
        this.input.value = value;
    }
    
    getValue() {
        return this.selectedItem;
    }
    
    focus() {
        this.input.focus();
    }
    
    disable() {
        this.input.disabled = true;
    }
    
    enable() {
        this.input.disabled = false;
    }
}