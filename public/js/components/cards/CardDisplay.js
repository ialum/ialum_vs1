import { DOM } from '../../core/dom.js';
import { format } from '../forms/formatters.js';
import FieldManager from './shared/FieldManager.js';
import DisplayTemplates from './templates/DisplayTemplates.js';

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
        
        this.fieldManager = new FieldManager(this.container);
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
        this.container.innerHTML = DisplayTemplates.container(this.config);
        this.contentContainer = DOM.select('[data-content]', this.container);
    }
    
    async render() {
        if (!this.state.item) {
            this.renderEmpty();
            return;
        }
        
        if (this.config.template) {
            this.contentContainer.innerHTML = this.config.template(this.state.item, this.state.mode);
            await this.fieldManager.autoInitFields();
            return;
        }
        
        this.contentContainer.innerHTML = this.createItemHTML();
        await this.fieldManager.autoInitFields();
    }
    
    renderEmpty() {
        this.contentContainer.innerHTML = DisplayTemplates.emptyState(this.config);
    }
    
    createItemHTML() {
        return DisplayTemplates.displayItem(this.state.item, this.config);
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
        this.fieldManager.destroyAll();
        this.container.innerHTML = '';
    }
}