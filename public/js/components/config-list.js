/**
 * config-list.js
 * Componente modular para listas de configuração (CRUD)
 * Dependências: validators.js
 * Localização: public/js/components/config-list.js
 * Tamanho alvo: <200 linhas
 */

import { validateObject } from '../utils/validators.js';

export class ConfigList {
    constructor(container, config) {
        this.container = container;
        this.type = config.type;
        this.fields = config.fields;
        this.validators = config.validators;
        this.items = config.items || [];
        this.expandedItems = new Set(); // IDs dos itens expandidos
        this.isCreating = false; // Flag para modo de criação
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    // Renderiza toda a lista
    render() {
        const html = `
            <div class="config-list" data-type="${this.type}">
                <div class="config-items">
                    ${this.items.map(item => this.createItemHTML(item)).join('')}
                </div>
                ${this.createNewButtonHTML()}
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    // Cria HTML de um item existente
    createItemHTML(item) {
        const isExpanded = this.expandedItems.has(item.id);
        
        if (isExpanded) {
            return this.createExpandedItemHTML(item);
        } else {
            return this.createContractedItemHTML(item);
        }
    }

    // Item contraído (visualização)
    createContractedItemHTML(item) {
        const primaryField = this.fields[0]; // Primeiro campo como principal
        const displayValue = item[primaryField.name] || 'Item sem nome';
        
        return `
            <div class="config-item" data-id="${item.id}">
                <div class="config-item-header">
                    <span class="config-item-title">${displayValue}</span>
                    <div class="config-item-actions">
                        <button class="btn btn-outline btn-primary btn-xs" data-action="edit" data-id="${item.id}">
                            <span class="icon">✏️</span>
                            <span class="desktop-only">Editar</span>
                        </button>
                        <button class="btn btn-outline btn-error btn-xs" data-action="delete" data-id="${item.id}">
                            <span class="icon">🗑️</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Item expandido (edição)
    createExpandedItemHTML(item) {
        const fieldsHTML = this.fields.map(field => 
            this.createFieldHTML(field, item[field.name] || '')
        ).join('');

        return `
            <div class="config-item config-item--expanded" data-id="${item.id}">
                <form class="config-form">
                    ${fieldsHTML}
                    <div class="config-form-actions">
                        <button type="button" class="btn btn-primary" data-action="save" data-id="${item.id}">
                            Salvar ${this.type.slice(0, -1)}
                        </button>
                        <button type="button" class="btn btn-secondary" data-action="cancel" data-id="${item.id}">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // Botão/formulário de criação
    createNewButtonHTML() {
        if (this.isCreating) {
            const fieldsHTML = this.fields.map(field => 
                this.createFieldHTML(field, '')
            ).join('');

            return `
                <div class="config-new-item config-new-item--expanded">
                    <form class="config-form">
                        ${fieldsHTML}
                        <div class="config-form-actions">
                            <button type="button" class="btn btn-primary" data-action="create">
                                Criar ${this.type.slice(0, -1)}
                            </button>
                            <button type="button" class="btn btn-secondary" data-action="cancel-create">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            `;
        } else {
            return `
                <div class="config-new-item">
                    <button class="btn btn-primary btn-create" data-action="new">
                        ➕ Criar novo ${this.type.slice(0, -1)}
                    </button>
                </div>
            `;
        }
    }

    // Cria HTML de um campo
    createFieldHTML(field, value = '') {
        const { name, type, placeholder, maxLength, rows } = field;
        
        let inputHTML;
        if (type === 'textarea') {
            inputHTML = `
                <textarea 
                    name="${name}" 
                    placeholder="${placeholder || ''}" 
                    rows="${rows || 3}"
                    ${maxLength ? `maxlength="${maxLength}"` : ''}
                >${value}</textarea>
            `;
        } else {
            inputHTML = `
                <input 
                    type="${type}" 
                    name="${name}" 
                    value="${value}" 
                    placeholder="${placeholder || ''}"
                    ${maxLength ? `maxlength="${maxLength}"` : ''}
                />
            `;
        }

        return `
            <div class="form-group">
                <label>${placeholder || name}</label>
                ${inputHTML}
                <div class="field-error" data-field="${name}"></div>
            </div>
        `;
    }

    // Bind de eventos
    bindEvents() {
        this.container.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const id = e.target.dataset.id;

            switch (action) {
                case 'edit':
                    this.editItem(id);
                    break;
                case 'delete':
                    this.deleteItem(id);
                    break;
                case 'save':
                    this.saveItem(id);
                    break;
                case 'cancel':
                    this.cancelEdit(id);
                    break;
                case 'new':
                    this.startCreating();
                    break;
                case 'create':
                    this.createItem();
                    break;
                case 'cancel-create':
                    this.cancelCreate();
                    break;
            }
        });
    }

    // Editar item
    editItem(id) {
        this.expandedItems.add(id);
        this.render();
    }

    // Cancelar edição
    cancelEdit(id) {
        this.expandedItems.delete(id);
        this.render();
    }

    // Salvar item
    saveItem(id) {
        const form = this.container.querySelector(`[data-id="${id}"] .config-form`);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validar dados
        const errors = validateObject(data, this.validators);
        if (errors) {
            this.showErrors(form, errors);
            return;
        }

        // Encontrar e atualizar item
        const itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            this.items[itemIndex] = { ...this.items[itemIndex], ...data };
            this.expandedItems.delete(id);
            this.render();
            this.onItemSaved?.(this.items[itemIndex]);
        }
    }

    // Deletar item
    deleteItem(id) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            this.items = this.items.filter(item => item.id !== id);
            this.expandedItems.delete(id);
            this.render();
            this.onItemDeleted?.(id);
        }
    }

    // Iniciar criação
    startCreating() {
        this.isCreating = true;
        this.render();
    }

    // Cancelar criação
    cancelCreate() {
        this.isCreating = false;
        this.render();
    }

    // Criar novo item
    createItem() {
        const form = this.container.querySelector('.config-new-item .config-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validar dados
        const errors = validateObject(data, this.validators);
        if (errors) {
            this.showErrors(form, errors);
            return;
        }

        // Criar novo item
        const newItem = {
            id: Date.now().toString(), // ID temporário
            ...data
        };

        this.items.push(newItem);
        this.isCreating = false;
        this.render();
        this.onItemCreated?.(newItem);
    }

    // Mostrar erros de validação
    showErrors(form, errors) {
        // Limpar erros anteriores
        form.querySelectorAll('.field-error').forEach(el => el.textContent = '');

        // Mostrar novos erros
        for (const [field, error] of Object.entries(errors)) {
            const errorEl = form.querySelector(`[data-field="${field}"]`);
            if (errorEl) {
                errorEl.textContent = error;
            }
        }
    }

    // Callbacks (podem ser definidos externamente)
    onItemCreated = null;
    onItemSaved = null;
    onItemDeleted = null;

    // Métodos públicos para gerenciar items
    addItem(item) {
        this.items.push(item);
        this.render();
    }

    updateItem(id, data) {
        const itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            this.items[itemIndex] = { ...this.items[itemIndex], ...data };
            this.render();
        }
    }

    getItems() {
        return [...this.items];
    }
}