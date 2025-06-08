/**
 * FormTemplates - Templates HTML para o componente CardForm
 * 
 * Templates disponíveis:
 * - formWrapper(config) - Container principal do formulário
 * - formHeader(config) - Cabeçalho do formulário com título e descrição
 * - formSection(section, fields) - Seção do formulário com campos agrupados
 * - sectionHeader(section) - Cabeçalho de uma seção
 * - fieldGroup(field, value, error) - Grupo de campo com label e input
 * - fieldInput(field, value) - Renderiza input baseado no tipo do campo
 * - fieldError(error) - Mensagem de erro do campo
 * - fieldHelp(helpText) - Texto de ajuda do campo
 * - formActions(config) - Botões de ação do formulário (salvar, cancelar, etc)
 * - selectOptions(options, value) - Opções para campos select
 * - checkboxGroup(options, values) - Grupo de checkboxes
 * - radioGroup(name, options, value) - Grupo de radio buttons
 */
export default class FormTemplates {
    static formWrapper(config) {
        const layoutClass = config.layout !== 'vertical' ? ` layout-${config.layout}` : '';
        
        return `
            <div class="card-form${layoutClass}">
                ${config.showHeader ? FormTemplates.formHeader(config) : ''}
                <form class="card-form-form" data-form>
                    <div class="card-form-fields" data-fields></div>
                    ${config.showActions ? FormTemplates.formActions(config) : ''}
                </form>
            </div>
        `;
    }

    static formHeader(config) {
        return `
            <div class="card-form-header">
                ${config.title ? `<h2 class="card-form-title">${config.title}</h2>` : ''}
                ${config.description ? `<p class="card-form-description">${config.description}</p>` : ''}
            </div>
        `;
    }

    static formActions(config) {
        return `
            <div class="card-form-actions">
                <button type="submit" class="btn btn-lg btn-primary" data-action="submit">
                    ${config.submitLabel}
                </button>
                <button type="button" class="btn btn-lg btn-secondary" data-action="cancel">
                    ${config.cancelLabel}
                </button>
            </div>
        `;
    }

    static sectionHeader(section) {
        return `
            <div class="form-section-header">
                ${section.title ? `<h3 class="form-section-title text-lg font-semibold mb-sm">${section.title}</h3>` : ''}
                ${section.description ? `<p class="form-section-description text-sm text-muted mb-md">${section.description}</p>` : ''}
            </div>
        `;
    }

    static sectionWrapper(section, fieldsHTML) {
        const sectionClass = section.className || '';
        const layoutClass = section.layout === 'grid' ? `grid grid-cols-${section.columns || 2} gap-lg` : '';
        
        return `
            <div class="form-section mb-xl" data-section="${section.id}">
                ${FormTemplates.sectionHeader(section)}
                <div class="form-section-fields ${sectionClass} ${layoutClass}">
                    ${fieldsHTML}
                </div>
            </div>
        `;
    }

    static fieldGroup(field, value, error) {
        // Para campos custom, retornar apenas o template
        if (field.type === 'custom') {
            return `
                <div class="form-group" data-field-group="${field.name}">
                    ${!field.hideLabel && field.label ? `<label class="form-label">${field.label}</label>` : ''}
                    ${field.template || ''}
                    ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                </div>
            `;
        }
        
        const hasError = !!error;
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
                ${FormTemplates.renderFieldByType(field, value)}
                <div class="form-error" data-field-error="${field.name}">
                    ${error || ''}
                </div>
                ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
            </div>
        `;
    }

    static renderFieldByType(field, value) {
        const baseAttrs = {
            name: field.name,
            id: field.id || field.name,
            value: value || '',
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
                return FormTemplates.inputField(field.type, baseAttrs, field.maxLength);
                
            case 'textarea':
                return FormTemplates.textareaField(baseAttrs, field.rows || 3, field.maxLength);
                
            case 'select':
                return FormTemplates.selectField(baseAttrs, field.options || []);
                
            case 'checkbox':
                return FormTemplates.checkboxField(baseAttrs, field.checkboxLabel || field.label);
                
            case 'radio':
                return FormTemplates.radioField(baseAttrs, field.options || []);
                
            case 'file-upload':
                return FormTemplates.fileUploadField(baseAttrs, field);
                
            case 'color-picker':
                return FormTemplates.colorPickerField(baseAttrs, field);
                
            case 'emoji-text':
                return FormTemplates.emojiTextField(baseAttrs);
                
            case 'markdown':
                return FormTemplates.markdownField(baseAttrs, field.rows || 6);
                
            case 'font-selector':
                return FormTemplates.fontSelectorField(baseAttrs);
                
            case 'phone':
                return FormTemplates.phoneField(baseAttrs);
                
            case 'currency':
                return FormTemplates.currencyField(baseAttrs);
                
            case 'date':
                return FormTemplates.dateField(baseAttrs);
                
            case 'datetime':
                return FormTemplates.datetimeField(baseAttrs);
                
            case 'custom':
                return field.template || '';
                
            default:
                return FormTemplates.inputField('text', baseAttrs, field.maxLength);
        }
    }

    static inputField(type, attrs, maxLength) {
        const attrsStr = FormTemplates.buildAttrsString(attrs);
        return `<input type="${type}" ${attrsStr} ${maxLength ? `maxlength="${maxLength}"` : ''} />`;
    }

    static textareaField(attrs, rows, maxLength) {
        const attrsStr = FormTemplates.buildAttrsString({...attrs, value: undefined});
        return `
            <textarea ${attrsStr} 
                      rows="${rows}" 
                      ${maxLength ? `maxlength="${maxLength}"` : ''}>${attrs.value}</textarea>
        `;
    }

    static selectField(attrs, options) {
        const attrsStr = FormTemplates.buildAttrsString({...attrs, value: undefined});
        const optionsHTML = options.map(opt => 
            `<option value="${opt.value}" ${opt.value === attrs.value ? 'selected' : ''}>${opt.label}</option>`
        ).join('');
        
        return `
            <select ${attrsStr}>
                <option value="">Selecione...</option>
                ${optionsHTML}
            </select>
        `;
    }

    static checkboxField(attrs, checkboxLabel) {
        const checked = attrs.value === true || attrs.value === 'true' || attrs.value === '1';
        return `
            <div class="form-checkbox">
                <input type="checkbox" 
                       id="${attrs.id}" 
                       name="${attrs.name}" 
                       value="1" 
                       ${checked ? 'checked' : ''} 
                       ${attrs.disabled ? 'disabled' : ''} />
                <label for="${attrs.id}" class="form-checkbox-label">${checkboxLabel}</label>
            </div>
        `;
    }

    static radioField(attrs, options) {
        const optionsHTML = options.map(opt => `
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

    static fileUploadField(attrs, field) {
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

    static colorPickerField(attrs, field) {
        const attrsStr = FormTemplates.buildAttrsString({
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

    static emojiTextField(attrs) {
        const attrsStr = FormTemplates.buildAttrsString(attrs);
        return `
            <div class="form-emoji-text" data-field-type="emoji-text" data-field-name="${attrs.name}">
                <input type="text" ${attrsStr} />
            </div>
        `;
    }

    static markdownField(attrs, rows) {
        return `
            <div class="form-markdown" data-field-type="markdown" data-field-name="${attrs.name}">
                <textarea name="${attrs.name}" 
                          id="${attrs.id}" 
                          class="markdown-editor" 
                          rows="${rows}">${attrs.value}</textarea>
            </div>
        `;
    }

    static fontSelectorField(attrs) {
        return `
            <div class="form-font-selector" data-field-type="font-selector" data-field-name="${attrs.name}">
                <select name="${attrs.name}" id="${attrs.id}" class="font-selector">
                    <option value="">Selecione uma fonte...</option>
                </select>
            </div>
        `;
    }

    static phoneField(attrs) {
        const attrsStr = FormTemplates.buildAttrsString(attrs);
        return `
            <input type="tel" 
                   ${attrsStr} 
                   data-mask="phone" 
                   placeholder="(11) 99999-9999" />
        `;
    }

    static currencyField(attrs) {
        const attrsStr = FormTemplates.buildAttrsString(attrs);
        return `
            <input type="text" 
                   ${attrsStr} 
                   data-mask="currency" 
                   placeholder="R$ 0,00" />
        `;
    }

    static dateField(attrs) {
        const attrsStr = FormTemplates.buildAttrsString(attrs);
        return `<input type="date" ${attrsStr} />`;
    }

    static datetimeField(attrs) {
        const attrsStr = FormTemplates.buildAttrsString(attrs);
        return `<input type="datetime-local" ${attrsStr} />`;
    }

    static fieldError(fieldName, message) {
        return message ? `
            <div class="form-error visible" data-field-error="${fieldName}">
                ${message}
            </div>
        ` : '';
    }

    static fieldHelp(helpText) {
        return helpText ? `<div class="form-help">${helpText}</div>` : '';
    }

    static buildAttrsString(attrs) {
        return Object.entries(attrs)
            .filter(([key, value]) => value !== undefined && value !== null && value !== false)
            .map(([key, value]) => {
                if (value === true) return key;
                return `${key}="${value}"`;
            })
            .join(' ');
    }
}