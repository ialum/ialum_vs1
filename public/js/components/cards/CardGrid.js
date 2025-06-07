import { DOM } from '../../core/dom.js';

export class CardGrid {
    constructor(container, config) {
        this.container = typeof container === 'string' ? DOM.select(container) : container;
        this.config = this.validateConfig(config);
        this.state = {
            items: [...(config.items || [])],
            selectedItems: new Set(),
            loading: new Set()
        };
        
        this.callbacks = {
            onItemSelected: config.onItemSelected || null,
            onItemClicked: config.onItemClicked || null,
            onSelectionChanged: config.onSelectionChanged || null
        };
        
        this.init();
    }
    
    validateConfig(config) {
        if (!config.type) throw new Error('CardGrid: type é obrigatório');
        
        return {
            type: config.type,
            title: config.title || `Grid de ${config.type}`,
            description: config.description || '',
            primaryField: config.primaryField || 'name',
            secondaryField: config.secondaryField || null,
            imageField: config.imageField || null,
            columns: config.columns || 'auto', // 'auto', 2, 3, 4, 5, 6
            selectable: config.selectable || false,
            multiSelect: config.multiSelect || false,
            searchable: config.searchable || false,
            sortable: config.sortable || false,
            emptyMessage: config.emptyMessage || `Nenhum ${config.type} encontrado`,
            emptyIcon: config.emptyIcon || '📝',
            cardTemplate: config.cardTemplate || null,
            ...config
        };
    }
    
    init() {
        this.setupStructure();
        this.bindEvents();
        this.renderItems();
    }
    
    setupStructure() {
        const columnsClass = this.config.columns === 'auto' ? 'auto-columns' : `columns-${this.config.columns}`;
        
        this.container.innerHTML = `
            <div class="card-grid">
                ${this.createHeaderHTML()}
                ${this.config.searchable ? this.createSearchHTML() : ''}
                <div class="card-grid-container ${columnsClass}">
                    <div class="card-grid-items" data-items-container></div>
                </div>
                ${this.config.selectable ? this.createSelectionSummaryHTML() : ''}
            </div>
        `;
        
        this.itemsContainer = DOM.select('[data-items-container]', this.container);
        this.searchInput = DOM.select('.card-grid-search', this.container);
        this.selectionSummary = DOM.select('.card-grid-selection', this.container);
    }
    
    createHeaderHTML() {
        if (!this.config.title && !this.config.description) return '';
        
        return `
            <div class="card-grid-header">
                ${this.config.title ? `<h2 class="card-grid-title">${this.config.title}</h2>` : ''}
                ${this.config.description ? `<p class="card-grid-description">${this.config.description}</p>` : ''}
            </div>
        `;
    }
    
    createSearchHTML() {
        return `
            <div class="card-grid-search-wrapper">
                <input type="text" class="card-grid-search form-input" placeholder="Buscar ${this.config.type}...">
            </div>
        `;
    }
    
    createSelectionSummaryHTML() {
        return `
            <div class="card-grid-selection" style="display: none;">
                <span class="card-grid-selection-count">0 selecionados</span>
                <div class="card-grid-selection-actions">
                    <button type="button" class="btn btn-sm btn-secondary" data-action="clear-selection">
                        Limpar seleção
                    </button>
                </div>
            </div>
        `;
    }
    
    renderItems() {
        if (this.state.items.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        const itemsHTML = this.state.items.map(item => this.createItemHTML(item)).join('');
        this.itemsContainer.innerHTML = itemsHTML;
    }
    
    renderEmptyState() {
        this.itemsContainer.innerHTML = `
            <div class="card-grid-empty">
                <div class="card-grid-empty-icon">${this.config.emptyIcon}</div>
                <h3 class="card-grid-empty-title">${this.config.emptyMessage}</h3>
            </div>
        `;
    }
    
    createItemHTML(item) {
        if (this.config.cardTemplate) {
            return this.config.cardTemplate(item, this.isSelected(item.id));
        }
        
        const isSelected = this.isSelected(item.id);
        const isLoading = this.state.loading.has(item.id);
        
        const primaryValue = item[this.config.primaryField] || 'Sem título';
        const secondaryValue = this.config.secondaryField ? item[this.config.secondaryField] : '';
        const imageUrl = this.config.imageField ? item[this.config.imageField] : null;
        
        const cardClasses = [
            'card',
            'card-grid-item',
            isSelected ? 'selected' : '',
            isLoading ? 'loading' : '',
            this.config.selectable ? 'selectable' : ''
        ].filter(Boolean).join(' ');
        
        return `
            <div class="${cardClasses}" data-item-id="${item.id}">
                ${this.config.selectable ? `
                    <div class="card-grid-item-checkbox">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} data-action="toggle-select">
                    </div>
                ` : ''}
                ${imageUrl ? `
                    <div class="card-grid-item-image">
                        <img src="${imageUrl}" alt="${primaryValue}" loading="lazy">
                    </div>
                ` : ''}
                <div class="card-grid-item-content">
                    <h3 class="card-grid-item-title">${primaryValue}</h3>
                    ${secondaryValue ? `<p class="card-grid-item-subtitle">${secondaryValue}</p>` : ''}
                </div>
                ${this.createItemActionsHTML(item)}
            </div>
        `;
    }
    
    createItemActionsHTML(item) {
        if (!this.config.itemActions || this.config.itemActions.length === 0) {
            return '';
        }
        
        const actionsHTML = this.config.itemActions.map(action => `
            <button type="button" class="btn btn-sm ${action.class || 'btn-outline'}" 
                    data-action="${action.action}" 
                    data-item-id="${item.id}"
                    title="${action.title || action.label}">
                ${action.icon ? `<span>${action.icon}</span>` : ''}
                ${action.label || ''}
            </button>
        `).join('');
        
        return `
            <div class="card-grid-item-actions">
                ${actionsHTML}
            </div>
        `;
    }
    
    bindEvents() {
        DOM.delegate(this.container, '[data-action]', 'click', (e, element) => {
            e.preventDefault();
            e.stopPropagation();
            
            const action = element.dataset.action;
            const itemId = element.dataset.itemId;
            
            this.handleAction(action, itemId, element);
        });
        
        DOM.delegate(this.container, '.card-grid-item', 'click', (e, element) => {
            if (e.target.closest('[data-action]')) return;
            
            const itemId = element.dataset.itemId;
            
            if (this.config.selectable && !e.target.closest('.card-grid-item-checkbox')) {
                this.toggleSelection(itemId);
            }
            
            this.callbacks.onItemClicked?.(itemId, this.getItem(itemId));
        });
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterItems(e.target.value);
            });
        }
    }
    
    handleAction(action, itemId, element) {
        switch (action) {
            case 'toggle-select':
                this.toggleSelection(itemId);
                break;
            case 'clear-selection':
                this.clearSelection();
                break;
            default:
                if (this.config.onAction) {
                    this.config.onAction(action, itemId, this.getItem(itemId));
                }
        }
    }
    
    toggleSelection(itemId) {
        if (!this.config.selectable) return;
        
        if (this.state.selectedItems.has(itemId)) {
            this.state.selectedItems.delete(itemId);
        } else {
            if (!this.config.multiSelect) {
                this.state.selectedItems.clear();
            }
            this.state.selectedItems.add(itemId);
        }
        
        this.updateSelectionDisplay();
        this.callbacks.onSelectionChanged?.(this.getSelectedItems());
    }
    
    clearSelection() {
        this.state.selectedItems.clear();
        this.updateSelectionDisplay();
        this.callbacks.onSelectionChanged?.(this.getSelectedItems());
    }
    
    updateSelectionDisplay() {
        if (!this.config.selectable) return;
        
        const selectedCount = this.state.selectedItems.size;
        
        DOM.selectAll('.card-grid-item', this.container).forEach(item => {
            const itemId = item.dataset.itemId;
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (this.state.selectedItems.has(itemId)) {
                item.classList.add('selected');
                if (checkbox) checkbox.checked = true;
            } else {
                item.classList.remove('selected');
                if (checkbox) checkbox.checked = false;
            }
        });
        
        if (this.selectionSummary) {
            if (selectedCount > 0) {
                this.selectionSummary.style.display = 'flex';
                const countElement = this.selectionSummary.querySelector('.card-grid-selection-count');
                if (countElement) {
                    countElement.textContent = `${selectedCount} selecionado${selectedCount > 1 ? 's' : ''}`;
                }
            } else {
                this.selectionSummary.style.display = 'none';
            }
        }
    }
    
    filterItems(searchTerm) {
        const term = searchTerm.toLowerCase();
        const items = DOM.selectAll('.card-grid-item', this.container);
        
        items.forEach(item => {
            const title = item.querySelector('.card-grid-item-title')?.textContent.toLowerCase() || '';
            const subtitle = item.querySelector('.card-grid-item-subtitle')?.textContent.toLowerCase() || '';
            
            if (title.includes(term) || subtitle.includes(term)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    isSelected(itemId) {
        return this.state.selectedItems.has(itemId);
    }
    
    getSelectedItems() {
        return Array.from(this.state.selectedItems).map(id => this.getItem(id)).filter(Boolean);
    }
    
    getItem(id) {
        return this.state.items.find(item => item.id === id);
    }
    
    addItem(item) {
        if (!item.id) item.id = crypto.randomUUID() || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.state.items.push(item);
        this.renderItems();
        return item;
    }
    
    updateItem(id, data) {
        const index = this.state.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.state.items[index] = { ...this.state.items[index], ...data };
            this.renderItems();
            return this.state.items[index];
        }
        return null;
    }
    
    removeItem(id) {
        this.state.items = this.state.items.filter(item => item.id !== id);
        this.state.selectedItems.delete(id);
        this.state.loading.delete(id);
        this.renderItems();
        this.updateSelectionDisplay();
    }
    
    setItems(items) {
        this.state.items = [...items];
        this.state.selectedItems.clear();
        this.renderItems();
        this.updateSelectionDisplay();
    }
    
    getItems() {
        return [...this.state.items];
    }
    
    clear() {
        this.state.items = [];
        this.state.selectedItems.clear();
        this.renderItems();
    }
    
    setLoading(itemId, loading) {
        if (loading) {
            this.state.loading.add(itemId);
        } else {
            this.state.loading.delete(itemId);
        }
        this.renderItems();
    }
    
    destroy() {
        this.container.innerHTML = '';
    }
}