/**
 * card-list.js
 * Componente modular para listas expansíveis de cards (CRUD)
 * Dependências: DOM, UI, Loader, Cache, Backup, validators
 * Localização: public/js/components/card-list.js
 * Versão: 2.0 - Arquitetura limpa com responsabilidades separadas
 */

import { DOM } from '../../core/dom.js';
import { Loader } from '../../core/loader.js';
import { Cache } from '../../core/cache.js';
import { Backup } from '../../core/backup.js';
import { validators } from '../forms/validators.js';

// Imports diretos dos componentes UI
import { EmojiPicker } from '../ui/EmojiPicker.js';
import { FileUpload } from '../ui/FileUpload.js';
import { ColorPicker } from '../ui/ColorPicker.js';
import { MarkdownEditor } from '../ui/MarkdownEditor.js';
import { FontSelector } from '../ui/FontSelector.js';
import { CharCounter } from '../ui/CharCounter.js';

export class CardList {
    constructor(container, config) {
        this.container = typeof container === 'string' ? DOM.select(container) : container;
        this.config = this.validateConfig(config);
        this.state = {
            items: [...(config.items || [])],
            expandedItems: new Set(),
            isCreating: false,
            loading: new Set()
        };
        
        this.callbacks = {
            onItemCreated: config.onItemCreated || null,
            onItemUpdated: config.onItemUpdated || null,
            onItemDeleted: config.onItemDeleted || null,
            onError: config.onError || null
        };
        
        this.fieldTypes = new Map();
        this.fieldInstances = new Map();
        this.registerDefaultFields();
        
        this.backupKey = `card-list-${this.config.type}`;
        this.init();
    }
    
    registerDefaultFields() {
        this.registerFieldType('text', this.renderTextField.bind(this));
        this.registerFieldType('textarea', this.renderTextareaField.bind(this));
        this.registerFieldType('select', this.renderSelectField.bind(this));
        this.registerFieldType('emoji-text', this.renderEmojiTextField.bind(this));
    }
    
    registerFieldType(type, renderer) {
        this.fieldTypes.set(type, renderer);
    }

    // Validar configuração
    validateConfig(config) {
        if (!config.type) throw new Error('CardList: type é obrigatório');
        if (!config.fields || !Array.isArray(config.fields)) {
            throw new Error('CardList: fields deve ser um array');
        }
        
        return {
            type: config.type,
            title: config.title || `Lista de ${config.type}`,
            description: config.description || '',
            fields: config.fields,
            validators: config.validators || {},
            allowCreate: config.allowCreate !== false,
            allowEdit: config.allowEdit !== false,
            allowDelete: config.allowDelete !== false,
            confirmDelete: config.confirmDelete !== false,
            layout: config.layout || 'list', // 'list', 'grid', 'compact'
            primaryField: config.primaryField || config.fields[0]?.name
        };
    }

    // Inicializar componente
    init() {
        this.setupStructure();
        this.bindEvents();
        this.renderItems();
        this.initAllSpecialFields();
    }

    // Criar estrutura base do componente
    setupStructure() {
        const layoutClass = this.config.layout !== 'list' ? ` ${this.config.layout}` : '';
        
        this.container.innerHTML = `
            <div class="card-list${layoutClass}">
                ${this.createHeaderHTML()}
                <div class="card-list-container">
                    <div class="card-list-items" data-items-container></div>
                    ${this.config.allowCreate ? this.createNewItemHTML() : ''}
                </div>
            </div>
        `;
        
        this.itemsContainer = DOM.select('[data-items-container]', this.container);
        this.newItemContainer = DOM.select('.card-list-new', this.container);
    }

    // Criar HTML do header
    createHeaderHTML() {
        if (!this.config.title && !this.config.description) return '';
        
        return `
            <div class="card-list-header">
                ${this.config.title ? `<h2 class="card-list-title">${this.config.title}</h2>` : ''}
                ${this.config.description ? `<p class="card-list-description">${this.config.description}</p>` : ''}
            </div>
        `;
    }

    // Criar HTML do botão/form de novo item
    createNewItemHTML() {
        return `
            <div class="card-list-new card" data-new-item>
                <div class="card-list-new-content" data-new-content>
                    <span class="card-list-new-icon">➕</span>
                    <p class="card-list-new-text">Criar novo ${this.config.type}</p>
                </div>
                <div class="card-list-new-form" data-new-form style="display: none;">
                    <p class="card-list-new-text">Novo ${this.config.type}</p>
                    <form class="card-list-form">
                        ${this.createFieldsHTML()}
                        <div class="card-list-form-actions">
                            <button type="button" class="btn btn-lg btn-primary" data-action="create">
                                Criar ${this.config.type}
                            </button>
                            <button type="button" class="btn btn-lg btn-secondary" data-action="cancel-create">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Renderizar todos os itens
    renderItems() {
        if (this.state.items.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        const itemsHTML = this.state.items.map(item => this.createItemHTML(item)).join('');
        this.itemsContainer.innerHTML = itemsHTML;
        this.initAllSpecialFields();
    }

    // Renderizar estado vazio
    renderEmptyState() {
        this.itemsContainer.innerHTML = `
            <div class="card card-empty">
                <div class="card-empty-icon">📝</div>
                <h3 class="card-empty-title">Nenhum ${this.config.type} encontrado</h3>
                <p class="card-empty-text">
                    ${this.config.allowCreate ? 
                        `Clique no botão acima para criar seu primeiro ${this.config.type}.` :
                        `Não há ${this.config.type} para exibir.`
                    }
                </p>
            </div>
        `;
    }

    // Criar HTML de um item
    createItemHTML(item) {
        const itemIdStr = String(item.id);
        const isExpanded = this.state.expandedItems.has(itemIdStr) || this.state.expandedItems.has(item.id);
        const isLoading = this.state.loading.has(itemIdStr) || this.state.loading.has(item.id);
        const displayValue = item[this.config.primaryField] || 'Item sem nome';
        
        const cardClasses = [
            'card',
            'card-list-item',
            isExpanded ? 'expanded card-elevated' : '',
            isLoading ? 'loading' : ''
        ].filter(Boolean).join(' ');

        if (isExpanded) {
            return `
                <div class="${cardClasses}" data-item-id="${item.id}">
                    <form class="card-list-form" data-item-form="${item.id}">
                        ${this.createFieldsHTML(item)}
                        <div class="card-list-form-actions">
                            ${this.config.allowEdit ? `
                                <button type="button" class="btn btn-lg btn-primary" data-action="save" data-item-id="${item.id}">
                                    Salvar
                                </button>
                            ` : ''}
                            <button type="button" class="btn btn-lg btn-secondary" data-action="cancel" data-item-id="${item.id}">
                                Cancelar
                            </button>
                            ${this.config.allowDelete ? `
                                <button type="button" class="btn btn-lg btn-outline btn-error" data-action="delete" data-item-id="${item.id}">
                                    <span>🗑️</span> Excluir
                                </button>
                            ` : ''}
                        </div>
                    </form>
                </div>
            `;
        } else {
            return `
                <div class="${cardClasses}" data-item-id="${item.id}">
                    <div class="card-list-item-header">
                        <div class="card-list-item-content">
                            <h3 class="card-list-item-title">${displayValue}</h3>
                            ${this.createSubtitleHTML(item)}
                        </div>
                        <div class="card-list-item-actions">
                            ${this.config.allowEdit ? `
                                <button class="btn btn-lg btn-outline btn-primary" data-action="edit" data-item-id="${item.id}">
                                    <span>✏️</span> Editar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Criar subtitle do item
    createSubtitleHTML(item) {
        // Usar segundo campo como subtitle se existir
        const subtitleField = this.config.fields[1];
        if (!subtitleField || !item[subtitleField.name]) return '';
        
        return `<p class="card-list-item-subtitle">${item[subtitleField.name]}</p>`;
    }

    createFieldsHTML(item = {}) {
        return this.config.fields.map(field => {
            const value = item[field.name] || '';
            const inputHTML = this.renderField(field, value);
            
            const labelClass = field.hideLabel ? 'form-label sr-only-ai' : 'form-label';
            
            return `
                <div class="form-group">
                    <label class="${labelClass}">${field.label || field.placeholder || field.name}</label>
                    ${inputHTML}
                    <div class="form-error" data-field="${field.name}"></div>
                </div>
            `;
        }).join('');
    }
    
    renderField(field, value = '') {
        const renderer = this.fieldTypes.get(field.type);
        if (renderer) {
            return renderer(field, value);
        }
        return this.renderTextField(field, value);
    }
    
    renderTextField(field, value) {
        return `
            <input 
                type="${field.type || 'text'}" 
                name="${field.name}" 
                value="${value}" 
                placeholder="${field.placeholder || ''}"
                ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                class="form-input"
            />
        `;
    }
    
    renderTextareaField(field, value) {
        return `
            <textarea 
                name="${field.name}" 
                placeholder="${field.placeholder || ''}" 
                rows="${field.rows || 3}"
                ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                class="form-input"
            >${value}</textarea>
        `;
    }
    
    renderSelectField(field, value) {
        const optionsHTML = field.options?.map(opt => 
            `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`
        ).join('') || '';
        
        return `
            <select name="${field.name}" class="form-input">
                <option value="">Selecione...</option>
                ${optionsHTML}
            </select>
        `;
    }
    
    renderEmojiTextField(field, value) {
        return `
            <input 
                type="text" 
                name="${field.name}" 
                value="${value}" 
                placeholder="${field.placeholder || ''}"
                ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                class="form-input"
                data-field-type="emoji-text"
            />
        `;
    }

    // Bind de eventos
    bindEvents() {
        // Event delegation para todos os cliques
        DOM.delegate(this.container, '[data-action]', 'click', (e, element) => {
            e.preventDefault();
            const action = element.dataset.action;
            const itemId = element.dataset.itemId;

            this.handleAction(action, itemId, element);
        });

        // Click no novo item
        DOM.delegate(this.container, '[data-new-item]', 'click', (e) => {
            if (!this.state.isCreating && e.target.closest('[data-new-content]')) {
                this.startCreating();
            }
        });

        // Backup automático
        if (this.config.allowCreate || this.config.allowEdit) {
            DOM.delegate(this.container, '.form-input', 'input', () => {
                Backup.save(this.backupKey, this.getFormData());
            });
        }
    }

    // Gerenciar ações
    async handleAction(action, itemId) {
        switch (action) {
            case 'edit':
                this.editItem(itemId);
                break;
            case 'save':
                await this.saveItem(itemId);
                break;
            case 'cancel':
                this.cancelEdit(itemId);
                break;
            case 'delete':
                await this.deleteItem(itemId);
                break;
            case 'create':
                await this.createItem();
                break;
            case 'cancel-create':
                this.cancelCreate();
                break;
        }
    }

    // Iniciar edição de item
    editItem(itemId) {
        const itemIdStr = String(itemId);
        this.state.expandedItems.add(itemIdStr);
        this.renderItem(itemIdStr);
        this.focusFirstField(itemIdStr);
    }

    // Cancelar edição
    cancelEdit(itemId) {
        const itemIdStr = String(itemId);
        this.state.expandedItems.delete(itemIdStr);
        this.renderItem(itemId);
    }

    // Salvar item
    async saveItem(itemId) {
        const form = DOM.select(`[data-item-form="${itemId}"]`, this.container);
        const data = this.getFormData(form);
        
        // Validar
        const errors = this.validateData(data);
        if (errors) {
            this.showErrors(form, errors);
            return;
        }

        // Loading state
        this.setItemLoading(itemId, true);

        try {
            // Encontrar e atualizar item
            const itemIdStr = String(itemId);
            const itemIndex = this.state.items.findIndex(item => String(item.id) === itemIdStr);
            if (itemIndex === -1) throw new Error('Item não encontrado');

            const updatedItem = { ...this.state.items[itemIndex], ...data };
            this.state.items[itemIndex] = updatedItem;
            this.state.expandedItems.delete(itemIdStr);

            // Render com success animation
            this.renderItem(itemId);
            this.showItemSuccess(itemId);
            
            // Backup cleanup
            Backup.clear(this.backupKey);
            
            // Callback
            this.callbacks.onItemUpdated?.(updatedItem);
            
        } catch (error) {
            this.handleError(error, `Erro ao salvar ${this.config.type}`);
        } finally {
            this.setItemLoading(itemId, false);
        }
    }

    // Deletar item
    async deleteItem(itemId) {
        if (this.config.confirmDelete) {
            const confirmed = confirm(`Tem certeza que deseja excluir este ${this.config.type}?`);
            if (!confirmed) return;
        }

        const itemElement = DOM.select(`[data-item-id="${itemId}"]`, this.container);
        
        try {
            // Animação de saída
            DOM.addClass(itemElement, 'card-list-item-exit');
            
            // Remover após animação
            setTimeout(() => {
                const itemIdStr = String(itemId);
                this.state.items = this.state.items.filter(item => String(item.id) !== itemIdStr);
                this.state.expandedItems.delete(itemIdStr);
                this.state.loading.delete(itemIdStr);
                
                this.renderItems();
                this.callbacks.onItemDeleted?.(itemId);
            }, 300);
            
        } catch (error) {
            DOM.removeClass(itemElement, 'card-list-item-exit');
            this.handleError(error, `Erro ao excluir ${this.config.type}`);
        }
    }

    // Iniciar criação
    startCreating() {
        this.state.isCreating = true;
        this.toggleNewItemForm(true);
        this.focusFirstField('new');
    }

    // Cancelar criação
    cancelCreate() {
        this.state.isCreating = false;
        this.toggleNewItemForm(false);
        this.clearNewItemForm();
    }

    // Criar novo item
    async createItem() {
        const form = DOM.select('[data-new-form] form', this.container);
        const data = this.getFormData(form);
        
        // Validar
        const errors = this.validateData(data);
        if (errors) {
            this.showErrors(form, errors);
            return;
        }

        // Loading
        const createButton = DOM.select('[data-action="create"]', form);
        
        try {
            if (createButton && Loader.showInline) {
                Loader.showInline(createButton, 'Criando...');
            }
            const newItem = {
                id: crypto.randomUUID() || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                ...data
            };

            this.state.items.push(newItem);
            this.state.isCreating = false;
            
            // Reset form
            this.toggleNewItemForm(false);
            this.clearNewItemForm();
            
            // Render e highlight
            this.renderItems();
            
            setTimeout(() => {
                const newItemElement = DOM.select(`[data-item-id="${newItem.id}"]`, this.container);
                if (newItemElement) {
                    DOM.addClass(newItemElement, 'card-list-item-enter');
                    this.showItemSuccess(newItem.id);
                }
            }, 100);
            
            // Backup cleanup
            Backup.clear(this.backupKey);
            
            // Callback
            this.callbacks.onItemCreated?.(newItem);
            
        } catch (error) {
            this.handleError(error, `Erro ao criar ${this.config.type}`);
        } finally {
            if (createButton && Loader.hideInline) {
                Loader.hideInline(createButton);
            }
        }
    }

    // Alternar formulário de novo item
    toggleNewItemForm(show) {
        const content = DOM.select('[data-new-content]', this.newItemContainer);
        const form = DOM.select('[data-new-form]', this.newItemContainer);
        
        if (show) {
            DOM.addClass(this.newItemContainer, 'expanded');
            content.style.display = 'none';
            form.style.display = 'block';
        } else {
            DOM.removeClass(this.newItemContainer, 'expanded');
            content.style.display = 'block';
            form.style.display = 'none';
        }
    }

    // Renderizar item específico
    renderItem(itemId) {
        // Converter para string para garantir comparação correta
        const itemIdStr = String(itemId);
        const item = this.state.items.find(item => String(item.id) === itemIdStr);
        
        if (!item) {
            console.error('Item não encontrado:', itemId);
            return;
        }

        const itemElement = DOM.select(`[data-item-id="${itemIdStr}"]`, this.container);
        if (itemElement) {
            itemElement.outerHTML = this.createItemHTML(item);
            // Inicializar campos especiais após renderização
            this.initSpecialFields(itemIdStr);
        }
    }

    // Gerenciar loading de item
    setItemLoading(itemId, loading) {
        if (loading) {
            this.state.loading.add(itemId);
        } else {
            this.state.loading.delete(itemId);
        }
        this.renderItem(itemId);
    }

    // Mostrar sucesso em item
    showItemSuccess(itemId) {
        const itemElement = DOM.select(`[data-item-id="${itemId}"]`, this.container);
        if (itemElement) {
            DOM.addClass(itemElement, 'success');
            setTimeout(() => DOM.removeClass(itemElement, 'success'), 600);
        }
    }

    // Focar primeiro campo
    focusFirstField(itemId) {
        setTimeout(() => {
            const selector = itemId === 'new' ? 
                '[data-new-form] .form-input' : 
                `[data-item-form="${itemId}"] .form-input`;
            
            const firstInput = DOM.select(selector, this.container);
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Obter dados do formulário
    getFormData(form = null) {
        const formElement = form || DOM.select('form', this.container);
        if (!formElement) return {};
        
        const formData = new FormData(formElement);
        return Object.fromEntries(formData);
    }

    // Limpar formulário de novo item
    clearNewItemForm() {
        const form = DOM.select('[data-new-form] form', this.container);
        if (form) form.reset();
        this.clearErrors(form);
    }

    // Validar dados
    validateData(data) {
        const errors = {};
        
        // Se não há validadores, retorna null (sem erros)
        if (!this.config.validators || Object.keys(this.config.validators).length === 0) {
            return null;
        }
        
        for (const [fieldName, rules] of Object.entries(this.config.validators)) {
            const value = data[fieldName];
            
            // Required
            if (rules.required && !value?.trim()) {
                errors[fieldName] = 'Este campo é obrigatório';
                continue;
            }
            
            if (value && rules.type) {
                // Validações por tipo
                switch (rules.type) {
                    case 'email':
                        if (!validators.email(value)) {
                            errors[fieldName] = 'Email inválido';
                        }
                        break;
                    case 'url':
                        if (!validators.url(value)) {
                            errors[fieldName] = 'URL inválida';
                        }
                        break;
                    case 'phone':
                        if (!validators.phone(value)) {
                            errors[fieldName] = 'Telefone inválido';
                        }
                        break;
                }
            }
            
            // Comprimento
            if (value) {
                if (rules.minLength && value.length < rules.minLength) {
                    errors[fieldName] = `Mínimo ${rules.minLength} caracteres`;
                }
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors[fieldName] = `Máximo ${rules.maxLength} caracteres`;
                }
            }
        }
        
        return Object.keys(errors).length > 0 ? errors : null;
    }

    // Mostrar erros
    showErrors(form, errors) {
        this.clearErrors(form);
        
        for (const [field, message] of Object.entries(errors)) {
            const errorElement = DOM.select(`[data-field="${field}"]`, form);
            const inputElement = DOM.select(`[name="${field}"]`, form);
            
            if (errorElement) {
                errorElement.textContent = message;
                DOM.addClass(errorElement, 'visible');
            }
            
            if (inputElement) {
                DOM.addClass(inputElement, 'error');
            }
        }
        
        // Shake animation
        DOM.addClass(form.closest('.card'), 'error');
        setTimeout(() => {
            DOM.removeClass(form.closest('.card'), 'error');
        }, 500);
    }

    // Limpar erros
    clearErrors(form) {
        DOM.selectAll('.form-error', form).forEach(el => {
            el.textContent = '';
            DOM.removeClass(el, 'visible');
        });
        
        DOM.selectAll('.form-input.error', form).forEach(el => {
            DOM.removeClass(el, 'error');
        });
    }

    // Gerenciar erros
    handleError(error, message) {
        console.error('CardList Error:', error);
        this.callbacks.onError?.(error, message);
        
        // Por enquanto, apenas log no console
        // O callback onError deve cuidar das notificações
    }

    // API Pública
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
            this.renderItem(id);
            return this.state.items[index];
        }
        return null;
    }

    removeItem(id) {
        this.state.items = this.state.items.filter(item => item.id !== id);
        this.state.expandedItems.delete(id);
        this.renderItems();
    }

    getItems() {
        return [...this.state.items];
    }

    getItem(id) {
        return this.state.items.find(item => item.id === id);
    }

    clear() {
        this.state.items = [];
        this.state.expandedItems.clear();
        this.state.isCreating = false;
        this.renderItems();
    }

    async initAllSpecialFields() {
        await this.initFieldsByType('emoji-text');
        await this.initCharCounters();
    }

    async initSpecialFields(itemId) {
        const itemElement = DOM.select(`[data-item-id="${itemId}"]`, this.container);
        if (!itemElement) return;
        
        await this.initFieldsByType('emoji-text', itemElement);
        await this.initCharCounters(itemElement);
    }
    
    async initFieldsByType(fieldType, container = this.container) {
        const fields = DOM.selectAll(`[data-field-type="${fieldType}"]`, container);
        
        for (const field of fields) {
            await this.initSpecialField(fieldType, field);
        }
    }
    
    async initCharCounters(container = this.container) {
        const textareas = DOM.selectAll('textarea[maxlength]', container);
        for (const textarea of textareas) {
            if (!textarea.charCounterInstance) {
                textarea.charCounterInstance = new CharCounter(textarea);
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
    }
    
    async initSpecialField(fieldType, element) {
        const fieldId = `${fieldType}_${element.name || 'unnamed'}_${Date.now()}`;
        
        if (this.fieldInstances.has(fieldId)) {
            return this.fieldInstances.get(fieldId);
        }
        
        try {
            let instance;
            
            switch (fieldType) {
                case 'emoji-text':
                    instance = await this.initEmojiField(element);
                    break;
                case 'file-upload':
                    instance = new FileUpload(element);
                    await new Promise(resolve => setTimeout(resolve, 0));
                    break;
                case 'color-picker':
                    instance = new ColorPicker(element);
                    await new Promise(resolve => setTimeout(resolve, 0));
                    break;
                case 'markdown':
                    const textarea = element.querySelector('textarea');
                    if (textarea) {
                        instance = new MarkdownEditor(textarea);
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                    break;
                case 'font-selector':
                    const select = element.querySelector('select');
                    if (select) {
                        instance = new FontSelector(select);
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                    break;
                default:
                    console.warn(`Tipo de campo especial não reconhecido: ${fieldType}`);
                    return null;
            }
            
            if (instance) {
                this.fieldInstances.set(fieldId, instance);
            }
            
            return instance;
        } catch (error) {
            console.error(`Erro ao inicializar campo ${fieldType}:`, error);
            return null;
        }
    }

    async initEmojiField(field) {
        if (field.emojiPickerInstance || field.parentNode.querySelector('.emoji-picker-button')) {
            return field.emojiPickerInstance;
        }
        
        const picker = new EmojiPicker(field, {
            onChange: (emoji) => {
                if (this.config.allowCreate || this.config.allowEdit) {
                    Backup.save(this.backupKey, this.getFormData());
                }
            }
        });
        
        field.emojiPickerInstance = picker;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        field.emojiPickerInstance = picker;
        return picker;
    }

    destroy() {
        this.fieldInstances.forEach(instance => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
        this.fieldInstances.clear();
        
        Backup.clear(this.backupKey);
        this.container.innerHTML = '';
    }
}