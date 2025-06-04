/**
 * config-list.js
 * Componente modular para listas de configuração (CRUD)
 * Dependências: DOM, UI, Loader, Cache, Backup, validators
 * Localização: public/js/components/config-list.js
 * Tamanho alvo: <200 linhas
 */

import { DOM } from '../core/dom.js';
import { UI } from '../core/ui.js';
import { Loader } from '../core/loader.js';
// Cache não está sendo usado neste componente por enquanto
import { Backup } from '../core/backup.js';
import { validators } from '../core/validators.js';

export class ConfigList {
    constructor(container, config) {
        this.container = typeof container === 'string' ? DOM.select(container) : container;
        this.type = config.type;
        this.fields = config.fields;
        this.fieldValidators = config.validators || {};
        this.items = config.items || [];
        this.expandedItems = new Set(); // IDs dos itens expandidos
        this.isCreating = false; // Flag para modo de criação
        this.backupKey = `config-list-${this.type}`;
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        
        // Inicializar backup automático
        Backup.init(this.backupKey);
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
                        <button class="btn btn-outline btn-primary btn-sm" data-action="edit" data-id="${item.id}">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-outline btn-error btn-sm" data-action="delete" data-id="${item.id}">
                            🗑️
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
        // Usar event delegation para melhor performance
        DOM.delegate(this.container, 'click', '[data-action]', (e) => {
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
        
        // Backup automático em campos de formulário
        DOM.delegate(this.container, 'input', 'input, textarea', () => {
            Backup.save(this.backupKey);
        });
    }

    // Editar item
    editItem(id) {
        this.expandedItems.add(id);
        this.render();
        
        // Focar no primeiro campo após renderizar
        setTimeout(() => {
            const firstInput = DOM.select(`[data-id="${id}"] input, [data-id="${id}"] textarea`);
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Cancelar edição
    cancelEdit(id) {
        this.expandedItems.delete(id);
        this.render();
    }

    // Salvar item
    async saveItem(id) {
        const form = DOM.select(`[data-id="${id}"] .config-form`, this.container);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validar dados
        const errors = this.validateData(data);
        if (errors) {
            this.showErrors(form, errors);
            UI.shake(form);
            return;
        }

        // Mostrar loading
        Loader.showInline(form, 'Salvando...');

        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Encontrar e atualizar item
            const itemIndex = this.items.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                this.items[itemIndex] = { ...this.items[itemIndex], ...data };
                this.expandedItems.delete(id);
                
                // Limpar backup
                Backup.clear(this.backupKey);
                
                this.render();
                UI.highlight(DOM.select(`[data-id="${id}"]`, this.container), 'success');
                this.onItemSaved?.(this.items[itemIndex]);
            }
        } catch (error) {
            Loader.hideInline(form);
            Loader.showError('Erro ao salvar', form);
        }
    }

    // Deletar item
    async deleteItem(id) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            const itemEl = DOM.select(`[data-id="${id}"]`, this.container);
            
            // Animar saída
            UI.fadeOut(itemEl, () => {
                this.items = this.items.filter(item => item.id !== id);
                this.expandedItems.delete(id);
                this.render();
                this.onItemDeleted?.(id);
            });
        }
    }

    // Iniciar criação
    startCreating() {
        this.isCreating = true;
        this.render();
        
        // Focar no primeiro campo
        setTimeout(() => {
            const firstInput = DOM.select('.config-new-item input, .config-new-item textarea', this.container);
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Cancelar criação
    cancelCreate() {
        this.isCreating = false;
        this.render();
    }

    // Criar novo item
    async createItem() {
        const form = DOM.select('.config-new-item .config-form', this.container);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validar dados
        const errors = this.validateData(data);
        if (errors) {
            this.showErrors(form, errors);
            UI.shake(form);
            return;
        }

        // Mostrar loading
        Loader.showInline(form, 'Criando...');

        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Criar novo item
            const newItem = {
                id: UI.generateId(),
                ...data
            };

            this.items.push(newItem);
            this.isCreating = false;
            
            // Limpar backup
            Backup.clear(this.backupKey);
            
            this.render();
            
            // Destacar novo item
            const newItemEl = DOM.select(`[data-id="${newItem.id}"]`, this.container);
            if (newItemEl) {
                UI.highlight(newItemEl, 'success');
            }
            
            this.onItemCreated?.(newItem);
        } catch (error) {
            Loader.hideInline(form);
            Loader.showError('Erro ao criar', form);
        }
    }

    // Mostrar erros de validação
    showErrors(form, errors) {
        // Limpar erros anteriores
        DOM.selectAll('.field-error', form).forEach(el => {
            el.textContent = '';
            DOM.removeClass(el.previousElementSibling, 'is-invalid');
        });

        // Mostrar novos erros
        for (const [field, error] of Object.entries(errors)) {
            const errorEl = DOM.select(`[data-field="${field}"]`, form);
            if (errorEl) {
                errorEl.textContent = error;
                const input = errorEl.previousElementSibling;
                if (input) {
                    DOM.addClass(input, 'is-invalid');
                }
            }
        }
    }
    
    // Validar dados usando validators do core
    validateData(data) {
        const errors = {};
        
        for (const [field, rules] of Object.entries(this.fieldValidators)) {
            const value = data[field];
            
            // Verificar required
            if (rules.required && !value) {
                errors[field] = 'Este campo é obrigatório';
                continue;
            }
            
            // Aplicar validators específicos
            if (value && rules.type) {
                switch (rules.type) {
                    case 'email':
                        if (!validators.email(value)) {
                            errors[field] = 'Email inválido';
                        }
                        break;
                    case 'url':
                        if (!validators.url(value)) {
                            errors[field] = 'URL inválida';
                        }
                        break;
                    case 'cpf':
                        if (!validators.cpf(value)) {
                            errors[field] = 'CPF inválido';
                        }
                        break;
                    case 'phone':
                        if (!validators.phone(value)) {
                            errors[field] = 'Telefone inválido';
                        }
                        break;
                }
            }
            
            // Verificar minLength
            if (value && rules.minLength && value.length < rules.minLength) {
                errors[field] = `Mínimo ${rules.minLength} caracteres`;
            }
            
            // Verificar maxLength
            if (value && rules.maxLength && value.length > rules.maxLength) {
                errors[field] = `Máximo ${rules.maxLength} caracteres`;
            }
        }
        
        return Object.keys(errors).length > 0 ? errors : null;
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