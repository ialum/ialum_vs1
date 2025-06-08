import { DOM } from '../../core/dom.js';
import { Loader } from '../../core/loader.js';
import { Cache } from '../../core/cache.js';
import { Backup } from '../../core/backup.js';
import { validators } from '../forms/validators.js';
import { masks } from '../forms/masks.js';
import { format } from '../forms/formatters.js';

// Imports diretos dos componentes UI
import { EmojiPicker } from '../ui/EmojiPicker.js';
import { FileUpload } from '../ui/FileUpload.js';
import { ColorPicker } from '../ui/ColorPicker.js';
import { MarkdownEditor } from '../ui/MarkdownEditor.js';
import { FontSelector } from '../ui/FontSelector.js';
import { CharCounter } from '../ui/CharCounter.js';

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
        
        this.fieldInstances = new Map();
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
        const layoutClass = this.config.layout !== 'vertical' ? ` layout-${this.config.layout}` : '';
        
        this.container.innerHTML = `
            <div class="card-form${layoutClass}">
                <div class="card card-form-container">
                    ${this.config.showHeader ? this.createHeaderHTML() : ''}
                    <form class="card-form-form" data-form>
                        <div class="card-form-fields" data-fields></div>
                        ${this.config.showActions ? this.createActionsHTML() : ''}
                    </form>
                </div>
            </div>
        `;
        
        this.form = DOM.select('[data-form]', this.container);
        this.fieldsContainer = DOM.select('[data-fields]', this.container);
    }
    
    createHeaderHTML() {
        return `
            <div class="card-form-header">
                ${this.config.title ? `<h2 class="card-form-title">${this.config.title}</h2>` : ''}
                ${this.config.description ? `<p class="card-form-description">${this.config.description}</p>` : ''}
            </div>
        `;
    }
    
    createActionsHTML() {
        return `
            <div class="card-form-actions">
                <button type="submit" class="btn btn-lg btn-primary" data-action="submit">
                    ${this.config.submitLabel}
                </button>
                <button type="button" class="btn btn-lg btn-secondary" data-action="cancel">
                    ${this.config.cancelLabel}
                </button>
            </div>
        `;
    }
    
    render() {
        console.log('🔄 CardForm.render() chamado');
        this.fieldsContainer.innerHTML = this.createFieldsHTML();
    }
    
    createFieldsHTML() {
        console.log('📝 CardForm.createFieldsHTML - Total de campos:', this.config.fields.length);
        const fieldCounts = {};
        
        return this.config.fields.map(field => {
            // Contar quantas vezes cada campo aparece
            fieldCounts[field.name] = (fieldCounts[field.name] || 0) + 1;
            if (fieldCounts[field.name] > 1) {
                console.warn(`⚠️ Campo duplicado detectado: ${field.name} (${fieldCounts[field.name]}x)`);
            }
            
            const value = this.state.item[field.name] || '';
            const hasError = this.state.errors[field.name];
            const fieldHTML = this.renderField(field, value);
            const fieldId = field.id || field.name;
            
            const groupClasses = [
                'form-group',
                hasError ? 'has-error' : '',
                field.size ? `size-${field.size}` : '',
                field.hidden ? 'hidden' : ''
            ].filter(Boolean).join(' ');
            
            return `
                <div class="${groupClasses}" data-field-group="${field.name}">
                    ${!field.hideLabel ? `<label class="form-label" for="${fieldId}">${field.label || field.name}</label>` : ''}
                    ${fieldHTML}
                    <div class="form-error" data-field-error="${field.name}">
                        ${this.state.errors[field.name] || ''}
                    </div>
                    ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                </div>
            `;
        }).join('');
    }
    
    renderField(field, value) {
        const baseAttrs = {
            name: field.name,
            id: field.name,
            value: value,
            placeholder: field.placeholder || '',
            required: field.required || false,
            disabled: field.disabled || false,
            readonly: field.readonly || false,
            class: `form-input ${field.class || ''}`
        };
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'url':
            case 'password':
                return this.renderInputField(field, baseAttrs);
                
            case 'textarea':
                return this.renderTextareaField(field, baseAttrs);
                
            case 'select':
                return this.renderSelectField(field, baseAttrs);
                
            case 'checkbox':
                return this.renderCheckboxField(field, baseAttrs);
                
            case 'radio':
                return this.renderRadioField(field, baseAttrs);
                
            case 'file-upload':
                return this.renderFileUploadField(field, baseAttrs);
                
            case 'color-picker':
                return this.renderColorPickerField(field, baseAttrs);
                
            case 'emoji-text':
                return this.renderEmojiTextField(field, baseAttrs);
                
            case 'markdown':
                return this.renderMarkdownField(field, baseAttrs);
                
            case 'font-selector':
                return this.renderFontSelectorField(field, baseAttrs);
                
            case 'phone':
                return this.renderPhoneField(field, baseAttrs);
                
            case 'currency':
                return this.renderCurrencyField(field, baseAttrs);
                
            case 'date':
                return this.renderDateField(field, baseAttrs);
                
            case 'datetime':
                return this.renderDatetimeField(field, baseAttrs);
                
            default:
                return this.renderInputField(field, baseAttrs);
        }
    }
    
    renderInputField(field, attrs) {
        const attrsStr = this.buildAttrsString(attrs);
        return `<input type="${field.type || 'text'}" ${attrsStr} ${field.maxLength ? `maxlength="${field.maxLength}"` : ''} />`;
    }
    
    renderTextareaField(field, attrs) {
        const attrsStr = this.buildAttrsString({...attrs, value: undefined});
        return `
            <textarea ${attrsStr} 
                      rows="${field.rows || 3}" 
                      ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}>${attrs.value}</textarea>
        `;
    }
    
    renderSelectField(field, attrs) {
        const attrsStr = this.buildAttrsString({...attrs, value: undefined});
        const optionsHTML = (field.options || []).map(opt => 
            `<option value="${opt.value}" ${opt.value === attrs.value ? 'selected' : ''}>${opt.label}</option>`
        ).join('');
        
        return `
            <select ${attrsStr}>
                <option value="">Selecione...</option>
                ${optionsHTML}
            </select>
        `;
    }
    
    renderCheckboxField(field, attrs) {
        const checked = attrs.value === true || attrs.value === 'true' || attrs.value === '1';
        return `
            <div class="form-checkbox">
                <input type="checkbox" 
                       id="${attrs.id}" 
                       name="${attrs.name}" 
                       value="1" 
                       ${checked ? 'checked' : ''} 
                       ${attrs.disabled ? 'disabled' : ''} />
                <label for="${attrs.id}" class="form-checkbox-label">${field.checkboxLabel || field.label}</label>
            </div>
        `;
    }
    
    renderRadioField(field, attrs) {
        const optionsHTML = (field.options || []).map(opt => `
            <div class="form-radio">
                <input type="radio" 
                       id="${attrs.id}_${opt.value}" 
                       name="${attrs.name}" 
                       value="${opt.value}" 
                       ${opt.value === attrs.value ? 'checked' : ''} />
                <label for="${attrs.id}_${opt.value}" class="form-radio-label">${opt.label}</label>
            </div>
        `).join('');
        
        return `<div class="form-radio-group">${optionsHTML}</div>`;
    }
    
    renderFileUploadField(field, attrs) {
        console.log(`📁 Renderizando FileUpload: ${field.name}`);
        // O FileUpload precisa de um input file simples para inicializar
        return `
            <div data-field-type="file-upload" data-field-name="${field.name}">
                <input type="file" 
                       id="${attrs.id}" 
                       name="${attrs.name}" 
                       accept="${field.accept || '*/*'}" 
                       ${field.multiple ? 'multiple' : ''} 
                       data-max-size="${field.maxSize || '5MB'}" 
                       data-variant="${field.variant || 'default'}" />
            </div>
        `;
    }
    
    renderColorPickerField(field, attrs) {
        // O ColorPicker precisa de um input text simples para inicializar
        const attrsStr = this.buildAttrsString({
            ...attrs,
            type: 'text',
            value: attrs.value || field.placeholder || '#000000'
        });
        
        return `
            <div data-field-type="color-picker" data-field-name="${field.name}">
                <input ${attrsStr} />
            </div>
        `;
    }
    
    renderEmojiTextField(field, attrs) {
        const attrsStr = this.buildAttrsString(attrs);
        return `
            <div class="form-emoji-text" data-field-type="emoji-text" data-field-name="${field.name}">
                <input type="text" ${attrsStr} />
            </div>
        `;
    }
    
    renderMarkdownField(field, attrs) {
        return `
            <div class="form-markdown" data-field-type="markdown" data-field-name="${field.name}">
                <textarea name="${attrs.name}" 
                          id="${attrs.id}" 
                          class="markdown-editor" 
                          rows="${field.rows || 6}">${attrs.value}</textarea>
            </div>
        `;
    }
    
    renderFontSelectorField(field, attrs) {
        return `
            <div class="form-font-selector" data-field-type="font-selector" data-field-name="${field.name}">
                <select name="${attrs.name}" id="${attrs.id}" class="font-selector">
                    <option value="">Selecione uma fonte...</option>
                </select>
            </div>
        `;
    }
    
    renderPhoneField(field, attrs) {
        const attrsStr = this.buildAttrsString(attrs);
        return `
            <input type="tel" 
                   ${attrsStr} 
                   data-mask="phone" 
                   placeholder="(11) 99999-9999" />
        `;
    }
    
    renderCurrencyField(field, attrs) {
        const attrsStr = this.buildAttrsString(attrs);
        return `
            <input type="text" 
                   ${attrsStr} 
                   data-mask="currency" 
                   placeholder="R$ 0,00" />
        `;
    }
    
    renderDateField(field, attrs) {
        const attrsStr = this.buildAttrsString(attrs);
        return `
            <input type="date" 
                   ${attrsStr} />
        `;
    }
    
    renderDatetimeField(field, attrs) {
        const attrsStr = this.buildAttrsString(attrs);
        return `
            <input type="datetime-local" 
                   ${attrsStr} />
        `;
    }
    
    buildAttrsString(attrs) {
        return Object.entries(attrs)
            .filter(([key, value]) => value !== undefined && value !== null && value !== false)
            .map(([key, value]) => {
                if (value === true) return key;
                return `${key}="${value}"`;
            })
            .join(' ');
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
        const errors = {};
        
        for (const [fieldName, rules] of Object.entries(this.config.validators)) {
            const value = data[fieldName];
            const error = this.validateFieldValue(fieldName, value, rules);
            
            if (error) {
                errors[fieldName] = error;
            }
        }
        
        this.state.errors = errors;
        return Object.keys(errors).length > 0 ? errors : null;
    }
    
    validateFieldValue(fieldName, value, rules) {
        if (rules.required && (!value || value.toString().trim() === '')) {
            return 'Este campo é obrigatório';
        }
        
        if (!value) return null;
        
        if (rules.type) {
            const validator = validators[rules.type];
            if (validator && !validator(value)) {
                return `${rules.type} inválido`;
            }
        }
        
        if (rules.minLength && value.length < rules.minLength) {
            return `Mínimo ${rules.minLength} caracteres`;
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            return `Máximo ${rules.maxLength} caracteres`;
        }
        
        if (rules.custom && typeof rules.custom === 'function') {
            const customError = rules.custom(value);
            if (customError) return customError;
        }
        
        return null;
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
        console.log('🔧 CardForm.initAllFields chamado');
        const specialFields = DOM.selectAll('[data-field-type]', this.container);
        console.log(`📊 Campos especiais encontrados: ${specialFields.length}`);
        
        for (const field of specialFields) {
            await this.initSpecialField(field);
        }
        
        this.initMasks();
    }
    
    async initSpecialField(element) {
        const fieldType = element.dataset.fieldType;
        const fieldName = element.dataset.fieldName;
        console.log(`🔍 Inicializando campo especial: tipo=${fieldType}, nome=${fieldName}`);
        
        try {
            let instance;
            
            switch (fieldType) {
                case 'emoji-text':
                    const input = element.querySelector('input');
                    if (input && !input.emojiPickerInstance) {
                        instance = new EmojiPicker(input);
                        input.emojiPickerInstance = instance;
                        // Aguardar DOM estar pronto para qualquer manipulação
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                    break;
                    
                case 'file-upload':
                    const fileInput = element.querySelector('input[type="file"]');
                    console.log(`📁 FileUpload: input encontrado =`, !!fileInput);
                    
                    // Verificar se já existe um container FileUpload no parent
                    const existingContainer = element.parentElement?.querySelector('.form-file-upload');
                    if (existingContainer) {
                        console.warn(`⚠️ FileUpload duplicado detectado para ${fieldName}!`);
                        console.log('Parent:', element.parentElement);
                        console.log('Existing container:', existingContainer);
                    }
                    
                    if (fileInput && !fileInput.fileUploadInstance) {
                        const field = this.config.fields.find(f => f.name === fieldName);
                        console.log(`📁 FileUpload: criando instância para ${fieldName}`);
                        instance = new FileUpload(fileInput, {
                            accept: field?.accept || 'image/*',
                            maxSize: field?.maxSize || '5MB',
                            multiple: field?.multiple || false,
                            variant: field?.variant || 'default'
                        });
                        fileInput.fileUploadInstance = instance;
                        console.log(`✅ FileUpload: instância criada`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 0));
                    break;
                    
                case 'color-picker':
                    const colorInput = element.querySelector('input[type="text"]');
                    console.log(`🎨 ColorPicker: input encontrado =`, !!colorInput);
                    if (colorInput && !colorInput.colorPickerInstance) {
                        const field = this.config.fields.find(f => f.name === fieldName);
                        console.log(`🎨 ColorPicker: criando instância para ${fieldName}`);
                        try {
                            instance = new ColorPicker(colorInput, {
                                format: field?.format || 'rgb',
                                showPreview: true
                            });
                            colorInput.colorPickerInstance = instance;
                            console.log(`✅ ColorPicker: instância criada`);
                        } catch (error) {
                            console.error(`❌ Erro ao criar ColorPicker:`, error);
                            console.error(error.stack);
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 0));
                    break;
                    
                case 'markdown':
                    const textarea = element.querySelector('textarea');
                    if (textarea) {
                        instance = new MarkdownEditor(textarea);
                        // Aguardar criação da estrutura DOM
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
            }
            
            if (instance) {
                this.fieldInstances.set(`${fieldType}_${fieldName}`, instance);
            }
        } catch (error) {
            console.error(`Erro ao inicializar campo ${fieldType}:`, error);
        }
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
            this.destroyFieldInstances();
            this.fieldsContainer.innerHTML = sectionsHTML.join('');
            // Reinicializar campos especiais após reorganização
            this.initAllFields();
        }
    }
    
    destroyFieldInstances() {
        console.log('🧹 Destruindo instâncias de campos especiais');
        
        // Destruir instâncias do Map
        this.fieldInstances.forEach((instance, key) => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
        this.fieldInstances.clear();
        
        // Limpar referências nos elementos
        DOM.selectAll('[data-field-type="file-upload"] input[type="file"]', this.container).forEach(input => {
            if (input.fileUploadInstance) {
                console.log(`🧹 Destruindo FileUpload de ${input.name}`);
                input.fileUploadInstance.destroy();
                delete input.fileUploadInstance;
            }
        });
        
        DOM.selectAll('[data-field-type="color-picker"] input[type="text"]', this.container).forEach(input => {
            if (input.colorPickerInstance) {
                console.log(`🧹 Destruindo ColorPicker de ${input.name}`);
                input.colorPickerInstance.destroy();
                delete input.colorPickerInstance;
            }
        });
        
        DOM.selectAll('[data-field-type="emoji-text"] input', this.container).forEach(input => {
            if (input.emojiPickerInstance) {
                console.log(`🧹 Destruindo EmojiPicker de ${input.name}`);
                input.emojiPickerInstance.destroy();
                delete input.emojiPickerInstance;
            }
        });
    }
    
    destroy() {
        this.destroyFieldInstances();
        this.clearBackup();
        this.container.innerHTML = '';
    }
}