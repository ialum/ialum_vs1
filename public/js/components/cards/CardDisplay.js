import { DOM } from '../../core/dom.js';
import { format } from '../forms/formatters.js';

export class CardDisplay {
    constructor(container, config) {
        this.container = typeof container === 'string' ? DOM.select(container) : container;
        this.config = this.validateConfig(config);
        this.state = {
            item: config.item || null,
            mode: config.mode || 'view'
        };
        
        this.callbacks = {
            onEdit: config.onEdit || null,
            onDelete: config.onDelete || null,
            onAction: config.onAction || null
        };
        
        this.init();
    }
    
    validateConfig(config) {
        return {
            type: config.type || 'item',
            mode: config.mode || 'view',
            fields: config.fields || [],
            actions: config.actions || [],
            layout: config.layout || 'vertical',
            showHeader: config.showHeader !== false,
            showActions: config.showActions !== false,
            imageField: config.imageField || null,
            primaryField: config.primaryField || null,
            secondaryField: config.secondaryField || null,
            allowEdit: config.allowEdit !== false,
            allowDelete: config.allowDelete !== false,
            template: config.template || null,
            emptyIcon: config.emptyIcon || '📄',
            emptyMessage: config.emptyMessage || `Nenhum ${config.type || 'item'} selecionado`,
            ...config
        };
    }
    
    init() {
        this.setupStructure();
        this.bindEvents();
        this.render();
    }
    
    setupStructure() {
        const layoutClass = this.config.layout !== 'vertical' ? ` layout-${this.config.layout}` : '';
        
        this.container.innerHTML = `
            <div class="card-display${layoutClass}">
                <div class="card-display-content" data-content></div>
            </div>
        `;
        
        this.contentContainer = DOM.select('[data-content]', this.container);
    }
    
    render() {
        if (!this.state.item) {
            this.renderEmpty();
            return;
        }
        
        if (this.config.template) {
            this.contentContainer.innerHTML = this.config.template(this.state.item, this.state.mode);
            return;
        }
        
        this.contentContainer.innerHTML = this.createItemHTML();
    }
    
    renderEmpty() {
        this.contentContainer.innerHTML = `
            <div class="card-display-empty">
                <div class="card-display-empty-icon">${this.config.emptyIcon}</div>
                <p class="card-display-empty-text">${this.config.emptyMessage}</p>
            </div>
        `;
    }
    
    createItemHTML() {
        const item = this.state.item;
        
        return `
            <div class="card card-display-item">
                ${this.config.showHeader ? this.createHeaderHTML() : ''}
                ${this.createImageHTML()}
                <div class="card-display-body">
                    ${this.createFieldsHTML()}
                </div>
                ${this.config.showActions ? this.createActionsHTML() : ''}
            </div>
        `;
    }
    
    createHeaderHTML() {
        const item = this.state.item;
        const primaryValue = this.config.primaryField ? item[this.config.primaryField] : '';
        const secondaryValue = this.config.secondaryField ? item[this.config.secondaryField] : '';
        
        if (!primaryValue && !secondaryValue) return '';
        
        return `
            <div class="card-display-header">
                ${primaryValue ? `<h2 class="card-display-title">${primaryValue}</h2>` : ''}
                ${secondaryValue ? `<p class="card-display-subtitle">${secondaryValue}</p>` : ''}
            </div>
        `;
    }
    
    createImageHTML() {
        if (!this.config.imageField) return '';
        
        const imageUrl = this.state.item[this.config.imageField];
        if (!imageUrl) return '';
        
        return `
            <div class="card-display-image">
                <img src="${imageUrl}" alt="${this.state.item[this.config.primaryField] || 'Imagem'}" loading="lazy">
            </div>
        `;
    }
    
    createFieldsHTML() {
        if (!this.config.fields || this.config.fields.length === 0) return '';
        
        return this.config.fields.map(field => {
            const value = this.state.item[field.name];
            if (!value && !field.showEmpty) return '';
            
            return this.createFieldHTML(field, value);
        }).filter(Boolean).join('');
    }
    
    createFieldHTML(field, value) {
        const displayValue = this.formatFieldValue(field, value);
        
        if (field.type === 'hidden' || !field.label) {
            return `<div class="card-display-field-value">${displayValue}</div>`;
        }
        
        return `
            <div class="card-display-field">
                <dt class="card-display-field-label">${field.label}</dt>
                <dd class="card-display-field-value">${displayValue}</dd>
            </div>
        `;
    }
    
    formatFieldValue(field, value) {
        if (!value) return field.emptyText || '-';
        
        switch (field.type) {
            case 'date':
                return format.date(value);
            case 'datetime':
                return format.datetime(value);
            case 'currency':
                return format.currency(value);
            case 'email':
                return `<a href="mailto:${value}">${value}</a>`;
            case 'url':
                return `<a href="${value}" target="_blank" rel="noopener">${value}</a>`;
            case 'phone':
                return `<a href="tel:${value}">${format.phone(value)}</a>`;
            case 'textarea':
                return value.replace(/\n/g, '<br>');
            case 'boolean':
                return value ? '✅ Sim' : '❌ Não';
            case 'list':
                if (Array.isArray(value)) {
                    return value.map(item => `<span class="tag">${item}</span>`).join(' ');
                }
                return value;
            case 'status':
                return `<span class="badge badge-${value}">${value}</span>`;
            default:
                return value;
        }
    }
    
    createActionsHTML() {
        const defaultActions = [];
        
        if (this.config.allowEdit) {
            defaultActions.push({
                action: 'edit',
                label: 'Editar',
                icon: '✏️',
                class: 'btn-primary'
            });
        }
        
        if (this.config.allowDelete) {
            defaultActions.push({
                action: 'delete',
                label: 'Excluir',
                icon: '🗑️',
                class: 'btn-outline btn-error'
            });
        }
        
        const actions = [...defaultActions, ...(this.config.actions || [])];
        
        if (actions.length === 0) return '';
        
        const actionsHTML = actions.map(action => `
            <button type="button" class="btn ${action.class || 'btn-outline'}" 
                    data-action="${action.action}"
                    title="${action.title || action.label}">
                ${action.icon ? `<span>${action.icon}</span>` : ''}
                ${action.label}
            </button>
        `).join('');
        
        return `
            <div class="card-display-actions">
                ${actionsHTML}
            </div>
        `;
    }
    
    bindEvents() {
        DOM.delegate(this.container, '[data-action]', 'click', (e, element) => {
            e.preventDefault();
            const action = element.dataset.action;
            this.handleAction(action);
        });
    }
    
    handleAction(action) {
        switch (action) {
            case 'edit':
                this.callbacks.onEdit?.(this.state.item);
                break;
            case 'delete':
                this.callbacks.onDelete?.(this.state.item);
                break;
            default:
                this.callbacks.onAction?.(action, this.state.item);
        }
    }
    
    setItem(item) {
        this.state.item = item;
        this.render();
    }
    
    getItem() {
        return this.state.item;
    }
    
    setMode(mode) {
        this.state.mode = mode;
        this.render();
    }
    
    getMode() {
        return this.state.mode;
    }
    
    updateField(fieldName, value) {
        if (this.state.item) {
            this.state.item[fieldName] = value;
            this.render();
        }
    }
    
    clear() {
        this.state.item = null;
        this.render();
    }
    
    destroy() {
        this.container.innerHTML = '';
    }
}