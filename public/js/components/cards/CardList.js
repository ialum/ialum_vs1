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
import { validators, validateObject } from '../forms/validators.js';
import FieldManager from './shared/FieldManager.js';
import ListTemplates from './templates/ListTemplates.js';

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
        
        this.fieldManager = new FieldManager(this.container);
        this.fieldInstances = new Map(); // Para guardar FieldManagers locais por item
        this.backupKey = `card-list-${this.config.type}`;
        this.init();
    }

    // Validar configuração
    validateConfig(config) {
        if (!config.type) throw new Error('CardList: type é obrigatório');
        if (!config.fields || !Array.isArray(config.fields)) {
            throw new Error('CardList: fields deve ser um array');
        }
        
        const validatedConfig = {
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
            primaryField: config.primaryField || config.fields[0]?.name,
            showSubtitle: config.showSubtitle !== false,
            saveLabel: config.saveLabel || 'Salvar',
            cancelLabel: config.cancelLabel || 'Cancelar',
            deleteLabel: config.deleteLabel || 'Excluir',
            createLabel: config.createLabel || 'Adicionar',
            createSubmitLabel: config.createSubmitLabel || 'Criar',
            newItemTitle: config.newItemTitle || `Novo ${config.type}`,
            emptyMessage: config.emptyMessage || `Nenhum ${config.type} encontrado`,
            emptyIcon: config.emptyIcon || 'inbox',
            emptyAction: config.allowCreate ? { action: 'create', label: `Criar primeiro ${config.type}` } : null,
            ...config // Manter outras config customizadas
        };
        
        // Adicionar métodos após criar config
        validatedConfig.getItemTitle = config.getItemTitle || ((item) => item[validatedConfig.primaryField] || 'Item sem nome');
        validatedConfig.getItemSubtitle = config.getItemSubtitle || ((item) => {
            const subtitleField = validatedConfig.fields[1];
            return subtitleField && item[subtitleField.name] ? item[subtitleField.name] : '';
        });
        
        return validatedConfig;
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
        return ListTemplates.newItemButton(this.config);
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
        this.itemsContainer.innerHTML = ListTemplates.emptyState(this.config);
    }

    // Criar HTML de um item
    createItemHTML(item) {
        const itemIdStr = String(item.id);
        const isExpanded = this.state.expandedItems.has(itemIdStr) || this.state.expandedItems.has(item.id);
        const isLoading = this.state.loading.has(itemIdStr) || this.state.loading.has(item.id);
        
        const cardClasses = [
            'card',
            'card-list-item',
            isExpanded ? 'expanded card-elevated' : '',
            isLoading ? 'loading' : ''
        ].filter(Boolean).join(' ');

        const content = isExpanded ? 
            ListTemplates.itemExpanded(item, this.config) : 
            ListTemplates.itemCollapsed(item, this.config);

        return `<div class="${cardClasses}" data-item-id="${item.id}">${content}</div>`;
    }


    createFieldsHTML(item = {}) {
        return this.config.fields.map(field => {
            const value = item[field.name] || '';
            const error = null; // Será preenchido durante validação
            return ListTemplates.fieldGroup(field, value, error);
        }).join('');
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
        
        // Preencher campos após renderização
        setTimeout(() => {
            this.populateItemFields(itemIdStr);
            this.focusFirstField(itemIdStr);
        }, 50);
    }

    // Cancelar edição
    cancelEdit(itemId) {
        const itemIdStr = String(itemId);
        this.state.expandedItems.delete(itemIdStr);
        this.renderItem(itemId);
    }

    // Salvar item
    async saveItem(itemId) {
        const form = DOM.select(`[data-form="${itemId}"]`, this.container);
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


    // Cancelar criação
    cancelCreate() {
        this.state.isCreating = false;
        this.toggleNewItemForm(false);
        
        // Limpar FieldManager do novo item
        if (this.fieldInstances.has('new')) {
            this.fieldInstances.get('new').destroyAll();
            this.fieldInstances.delete('new');
        }
    }

    // Criar novo item
    async createItem() {
        const form = DOM.select('[data-form="new"]', this.container);
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
                id: crypto.randomUUID() || `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                createdAt: new Date().toISOString(),
                ...data
            };

            this.state.items.push(newItem);
            this.state.isCreating = false;
            
            // Reset form
            this.cancelCreate();
            
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
            setTimeout(() => {
                this.initSpecialFields(itemIdStr);
            }, 50);
        }
    }

    // Preencher campos do item com dados
    populateItemFields(itemId) {
        const itemIdStr = String(itemId);
        const item = this.state.items.find(item => String(item.id) === itemIdStr);
        
        if (!item) {
            console.error('Item não encontrado para popular campos:', itemId);
            return;
        }

        // Encontrar container dos campos
        const fieldsContainer = DOM.select(`[data-fields-container="${itemIdStr}"]`, this.container);
        if (!fieldsContainer) {
            console.error('Container de campos não encontrado:', `[data-fields-container="${itemIdStr}"]`);
            return;
        }

        // Preencher com HTML dos campos
        fieldsContainer.innerHTML = this.createFieldsHTML(item);
        
        // Inicializar campos especiais
        this.initSpecialFields(itemIdStr);
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
            const selector = `[data-form="${itemId}"] .form-input`;
            const firstInput = DOM.select(selector, this.container);
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Obter dados do formulário
    getFormData(form = null) {
        const formElement = form || DOM.select('form', this.container);
        if (!formElement) return {};
        
        // Verificar se é realmente um elemento form
        if (formElement.tagName !== 'FORM') {
            console.error('getFormData: elemento não é um <form>', formElement);
            return {};
        }
        
        const formData = new FormData(formElement);
        return Object.fromEntries(formData);
    }

    // Limpar formulário de novo item
    clearNewItemForm() {
        const form = DOM.select('[data-form="new"]', this.container);
        if (form) form.reset();
        this.clearErrors(form);
    }

    // Validar dados
    validateData(data) {
        // Se não há validadores, retorna null (sem erros)
        if (!this.config.validators || Object.keys(this.config.validators).length === 0) {
            return null;
        }
        
        // Usar validateObject do validators.js
        return validateObject(data, this.config.validators);
    }

    // Mostrar erros
    showErrors(form, errors) {
        if (!form) {
            console.error('showErrors: formulário não encontrado');
            return;
        }
        
        this.clearErrors(form);
        
        for (const [field, message] of Object.entries(errors)) {
            const errorElement = DOM.select(`[data-field-error="${field}"]`, form);
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
        const cardElement = form.closest('.card') || form.closest('[data-new-form]');
        if (cardElement) {
            DOM.addClass(cardElement, 'error');
            setTimeout(() => {
                DOM.removeClass(cardElement, 'error');
            }, 500);
        }
    }

    // Limpar erros
    clearErrors(form) {
        if (!form) return;
        
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
        if (!item.id) item.id = crypto.randomUUID() || `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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
        await this.fieldManager.autoInitFields();
    }

    async initSpecialFields(itemId) {
        let containerElement;
        
        if (itemId === 'new') {
            // Para formulário de criação, usar o container específico
            containerElement = DOM.select('[data-new-form]', this.container);
        } else {
            // Para edição de itens existentes
            containerElement = DOM.select(`[data-item-id="${itemId}"]`, this.container);
        }
        
        if (!containerElement) {
            console.error(`Container não encontrado para itemId: ${itemId}`);
            return;
        }
        
        // Limpar FieldManager anterior se existir
        if (this.fieldInstances.has(itemId)) {
            this.fieldInstances.get(itemId).destroyAll();
        }
        
        // Criar novo FieldManager local para este item
        const localFieldManager = new FieldManager(containerElement);
        await localFieldManager.autoInitFields();
        
        // Guardar referência para limpeza posterior
        this.fieldInstances.set(itemId, localFieldManager);
    }

    // Iniciar criação
    startCreating() {
        this.state.isCreating = true;
        this.toggleNewItemForm(true);
        this.focusFirstField('new');
    }

    // Alternar formulário de novo item
    toggleNewItemForm(show) {
        const newItemContainer = DOM.select('[data-new-item]', this.container);
        if (!newItemContainer) return;

        const content = DOM.select('[data-new-content]', newItemContainer);
        let form = DOM.select('[data-new-form]', newItemContainer);
        
        if (show) {
            if (!form) {
                // Criar formulário se não existir
                const formHTML = ListTemplates.newItemForm(this.config);
                newItemContainer.insertAdjacentHTML('beforeend', formHTML);
                form = DOM.select('[data-new-form]', newItemContainer);
                
                // Preencher campos
                const fieldsContainer = DOM.select('[data-fields-container="new"]', newItemContainer);
                if (fieldsContainer) {
                    fieldsContainer.innerHTML = this.createFieldsHTML();
                }
                
                // Inicializar campos especiais após DOM estar pronto
                setTimeout(async () => {
                    await this.initSpecialFields('new');
                }, 50);
            }
            
            DOM.addClass(newItemContainer, 'expanded');
            if (content) content.style.display = 'none';
            if (form) form.style.display = 'block';
        } else {
            DOM.removeClass(newItemContainer, 'expanded');
            if (content) content.style.display = 'block';
            if (form) form.style.display = 'none';
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

    destroy() {
        // Destruir FieldManager global
        this.fieldManager.destroyAll();
        
        // Destruir FieldManagers locais
        this.fieldInstances.forEach(fieldManager => {
            fieldManager.destroyAll();
        });
        this.fieldInstances.clear();
        
        Backup.clear(this.backupKey);
        this.container.innerHTML = '';
    }
}