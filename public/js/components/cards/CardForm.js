import { DOM } from '../../core/dom.js';
import { Loader } from '../../core/loader.js';
import { Cache } from '../../core/cache.js';
import { Backup } from '../../core/backup.js';
import { validators, validateObject } from '../forms/validators.js';
import { masks } from '../forms/masks.js';
import { format } from '../forms/formatters.js';
import FieldManager from './shared/FieldManager.js';
import FormTemplates from './templates/FormTemplates.js';

export class CardForm {
    constructor(container, config) {
        this.container = typeof container === 'string' ? DOM.select(container) : container;
        this.config = this.validateConfig(config);
        this.state = {
            item: config.item || {},
            mode: config.mode || 'create',
            isSubmitting: false,
            isDirty: false,
            errors: {}
        };
        
        this.callbacks = {
            onSubmit: config.onSubmit || null,
            onCancel: config.onCancel || null,
            onValid: config.onValid || null,
            onInvalid: config.onInvalid || null,
            onChange: config.onChange || null
        };
        
        this.fieldManager = new FieldManager(this.container);
        this.backupKey = `card-form-${this.config.type}`;
        
        this.init();
    }
    
    validateConfig(config) {
        if (!config.type) throw new Error('CardForm: type é obrigatório');
        if (!config.fields || !Array.isArray(config.fields)) {
            throw new Error('CardForm: fields deve ser um array');
        }
        
        return {
            type: config.type,
            title: config.title || `${config.mode === 'create' ? 'Criar' : 'Editar'} ${config.type}`,
            description: config.description || '',
            fields: config.fields,
            validators: config.validators || {},
            layout: config.layout || 'vertical',
            showHeader: config.showHeader !== false,
            showActions: config.showActions !== false,
            autoBackup: config.autoBackup !== false,
            submitLabel: config.submitLabel || (config.mode === 'create' ? 'Criar' : 'Salvar'),
            cancelLabel: config.cancelLabel || 'Cancelar',
            loadingLabel: config.loadingLabel || 'Salvando...',
            ...config
        };
    }
    
    init() {
        this.setupStructure();
        this.bindEvents();
        this.render();
        this.restoreBackup();
        
        // Aplicar layouts de seção se configurado
        if (this.config.sections) {
            this.applySectionLayouts();
        } else {
            // Só inicializar campos se não houver seções
            this.initAllFields();
        }
        
        // Callback após renderização completa
        if (this.config.onRender) {
            this.config.onRender();
        }
    }
    
    setupStructure() {
        this.container.innerHTML = FormTemplates.formWrapper(this.config);
        
        this.form = DOM.select('[data-form]', this.container);
        this.fieldsContainer = DOM.select('[data-fields]', this.container);
    }
    
    render() {
        this.fieldsContainer.innerHTML = this.createFieldsHTML();
    }
    
    createFieldsHTML() {
        return this.config.fields.map(field => {
            
            const value = this.state.item[field.name] || '';
            const error = this.state.errors[field.name];
            return FormTemplates.fieldGroup(field, value, error);
        }).join('');
    }
    
    
    bindEvents() {
        DOM.delegate(this.container, '[data-action]', 'click', (e, element) => {
            e.preventDefault();
            const action = element.dataset.action;
            this.handleAction(action);
        });
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        if (this.config.autoBackup) {
            DOM.delegate(this.container, '.form-input', 'input', () => {
                this.state.isDirty = true;
                this.saveBackup();
                this.callbacks.onChange?.(this.getFormData());
            });
        }
        
        DOM.delegate(this.container, '.form-input', 'blur', (e, element) => {
            this.validateField(element.name);
        });
    }
    
    async handleAction(action) {
        switch (action) {
            case 'submit':
                await this.handleSubmit();
                break;
            case 'cancel':
                this.handleCancel();
                break;
        }
    }
    
    async handleSubmit() {
        if (this.state.isSubmitting) return;
        
        const data = this.getFormData();
        const errors = this.validateAllFields(data);
        
        if (errors && Object.keys(errors).length > 0) {
            this.showErrors(errors);
            this.callbacks.onInvalid?.(errors, data);
            return;
        }
        
        this.state.isSubmitting = true;
        this.showSubmitting(true);
        
        try {
            await this.callbacks.onSubmit?.(data, this.state.mode);
            this.clearBackup();
            this.state.isDirty = false;
            this.callbacks.onValid?.(data);
        } catch (error) {
            console.error('Erro no submit:', error);
            this.showErrors({ _form: error.message || 'Erro ao salvar' });
        } finally {
            this.state.isSubmitting = false;
            this.showSubmitting(false);
        }
    }
    
    handleCancel() {
        if (this.state.isDirty) {
            const confirmed = confirm('Há alterações não salvas. Deseja continuar?');
            if (!confirmed) return;
        }
        
        this.clearBackup();
        this.callbacks.onCancel?.();
    }
    
    validateField(fieldName) {
        const field = this.config.fields.find(f => f.name === fieldName);
        if (!field) return null;
        
        const value = this.getFieldValue(fieldName);
        const fieldValidators = this.config.validators[fieldName];
        
        if (!fieldValidators) return null;
        
        const error = this.validateFieldValue(fieldName, value, fieldValidators);
        
        if (error) {
            this.state.errors[fieldName] = error;
            this.showFieldError(fieldName, error);
        } else {
            delete this.state.errors[fieldName];
            this.clearFieldError(fieldName);
        }
        
        return error;
    }
    
    validateAllFields(data) {
        const errors = validateObject(data, this.config.validators);
        this.state.errors = errors || {};
        return errors;
    }
    
    validateFieldValue(fieldName, value, rules) {
        // Criar objeto temporário para validar apenas um campo
        const tempData = { [fieldName]: value };
        const tempRules = { [fieldName]: rules };
        const errors = validateObject(tempData, tempRules);
        return errors ? errors[fieldName] : null;
    }
    
    showErrors(errors) {
        this.clearAllErrors();
        
        for (const [field, message] of Object.entries(errors)) {
            this.showFieldError(field, message);
        }
    }
    
    showFieldError(fieldName, message) {
        const errorElement = DOM.select(`[data-field-error="${fieldName}"]`, this.container);
        const fieldGroup = DOM.select(`[data-field-group="${fieldName}"]`, this.container);
        
        if (errorElement) {
            errorElement.textContent = message;
            DOM.addClass(errorElement, 'visible');
        }
        
        if (fieldGroup) {
            DOM.addClass(fieldGroup, 'has-error');
        }
    }
    
    clearFieldError(fieldName) {
        const errorElement = DOM.select(`[data-field-error="${fieldName}"]`, this.container);
        const fieldGroup = DOM.select(`[data-field-group="${fieldName}"]`, this.container);
        
        if (errorElement) {
            errorElement.textContent = '';
            DOM.removeClass(errorElement, 'visible');
        }
        
        if (fieldGroup) {
            DOM.removeClass(fieldGroup, 'has-error');
        }
    }
    
    clearAllErrors() {
        DOM.selectAll('.form-error.visible', this.container).forEach(el => {
            el.textContent = '';
            DOM.removeClass(el, 'visible');
        });
        
        DOM.selectAll('.form-group.has-error', this.container).forEach(el => {
            DOM.removeClass(el, 'has-error');
        });
    }
    
    showSubmitting(show) {
        const submitButton = DOM.select('[data-action="submit"]', this.container);
        
        if (show) {
            if (submitButton && Loader.showInline) {
                Loader.showInline(submitButton, this.config.loadingLabel);
            }
            DOM.addClass(this.form, 'submitting');
        } else {
            if (submitButton && Loader.hideInline) {
                Loader.hideInline(submitButton);
            }
            DOM.removeClass(this.form, 'submitting');
        }
    }
    
    async initAllFields() {
        await this.fieldManager.autoInitFields();
        this.initMasks();
    }
    
    initMasks() {
        DOM.selectAll('[data-mask]', this.container).forEach(element => {
            const maskType = element.dataset.mask;
            if (masks[maskType]) {
                masks[maskType](element);
            }
        });
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        DOM.selectAll('input[type="checkbox"]', this.form).forEach(checkbox => {
            if (!data[checkbox.name]) {
                data[checkbox.name] = false;
            }
        });
        
        return data;
    }
    
    getFieldValue(fieldName) {
        const element = DOM.select(`[name="${fieldName}"]`, this.container);
        if (!element) return null;
        
        if (element.type === 'checkbox') {
            return element.checked;
        }
        
        return element.value;
    }
    
    setFieldValue(fieldName, value) {
        const element = DOM.select(`[name="${fieldName}"]`, this.container);
        if (!element) return;
        
        if (element.type === 'checkbox') {
            element.checked = !!value;
        } else {
            element.value = value;
        }
        
        this.state.item[fieldName] = value;
    }
    
    setData(data) {
        this.state.item = { ...data };
        
        for (const [key, value] of Object.entries(data)) {
            this.setFieldValue(key, value);
        }
    }
    
    getData() {
        return { ...this.state.item, ...this.getFormData() };
    }
    
    reset() {
        this.form.reset();
        this.clearAllErrors();
        this.state.item = {};
        this.state.isDirty = false;
        this.clearBackup();
    }
    
    saveBackup() {
        if (this.config.autoBackup) {
            Backup.save(this.backupKey, this.getFormData());
        }
    }
    
    restoreBackup() {
        if (this.config.autoBackup) {
            const backup = Backup.get(this.backupKey);
            if (backup) {
                this.setData(backup);
            }
        }
    }
    
    clearBackup() {
        Backup.clear(this.backupKey);
    }
    
    applySectionLayouts() {
        if (!this.config.sections) return;
        
        // Agrupar campos por seção
        const fieldsBySection = {};
        this.config.fields.forEach(field => {
            const section = field.section || 'default';
            if (!fieldsBySection[section]) {
                fieldsBySection[section] = [];
            }
            fieldsBySection[section].push(field);
        });
        
        // Criar containers de seção
        const sectionsHTML = [];
        this.config.sections.forEach(section => {
            const fields = fieldsBySection[section.id] || [];
            if (fields.length === 0) return;
            
            const sectionClass = section.className || '';
            const layoutClass = section.layout === 'grid' ? `grid grid-cols-${section.columns || 2} gap-lg` : '';
            
            sectionsHTML.push(`
                <div class="form-section mb-xl" data-section="${section.id}">
                    ${section.title ? `<h3 class="form-section-title text-lg font-semibold mb-sm">${section.title}</h3>` : ''}
                    ${section.description ? `<p class="form-section-description text-sm text-muted mb-md">${section.description}</p>` : ''}
                    <div class="form-section-fields ${sectionClass} ${layoutClass}">
                        ${fields.map(field => {
                            const fieldGroup = DOM.select(`[data-field-group="${field.name}"]`, this.fieldsContainer);
                            return fieldGroup ? fieldGroup.outerHTML : '';
                        }).join('')}
                    </div>
                </div>
            `);
        });
        
        // Reorganizar o HTML
        if (sectionsHTML.length > 0) {
            // Limpar instâncias existentes antes de reorganizar
            this.fieldManager.destroyAll();
            this.fieldsContainer.innerHTML = sectionsHTML.join('');
            // Reinicializar campos especiais após reorganização
            this.initAllFields();
        }
    }
    
    destroy() {
        this.fieldManager.destroyAll();
        this.clearBackup();
        this.container.innerHTML = '';
    }
}