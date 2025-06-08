/**
 * ListTemplates - Templates HTML para o componente CardList
 * 
 * Templates disponíveis:
 * - itemCollapsed(item, config) - Renderiza item contraído na lista
 * - itemExpanded(item, config) - Renderiza item expandido com formulário de edição
 * - itemSubtitle(item, config) - Renderiza subtítulo do item
 * - itemActions(config, isExpanded) - Renderiza botões de ação do item
 * - emptyState(config) - Renderiza estado vazio quando não há itens
 * - newItemButton(config) - Renderiza botão para criar novo item
 * - newItemForm(config) - Renderiza formulário inline para novo item
 * - fieldGroup(field, value, error) - Renderiza grupo de campo do formulário
 * - fieldError(error) - Renderiza mensagem de erro do campo
 */
export default class ListTemplates {
    static itemCollapsed(item, config) {
        const titleHtml = config.getItemTitle(item);
        const subtitleHtml = config.showSubtitle && config.getItemSubtitle ? 
            ListTemplates.itemSubtitle(item, config) : '';
        
        return `
            <div class="card-list-item-header" data-action="toggle" data-item-id="${item.id}">
                <div class="card-list-item-content">
                    <div class="card-list-item-title">${titleHtml}</div>
                    ${subtitleHtml}
                </div>
                <div class="card-list-item-actions">
                    ${ListTemplates.itemActions(config, false, item)}
                </div>
            </div>
        `;
    }

    static itemExpanded(item, config) {
        const titleHtml = config.getItemTitle(item);
        const subtitleHtml = config.showSubtitle && config.getItemSubtitle ? 
            ListTemplates.itemSubtitle(item, config) : '';
        
        return `
            <div class="card-list-item-header" data-action="toggle" data-item-id="${item.id}">
                <div class="card-list-item-content">
                    <div class="card-list-item-title">${titleHtml}</div>
                    ${subtitleHtml}
                </div>
                <div class="card-list-item-actions">
                    ${ListTemplates.itemActions(config, true, item)}
                </div>
            </div>
            <div class="card-list-item-form" data-item-form="${item.id}">
                <form class="card-list-form" data-form="${item.id}">
                    <div class="card-list-form-fields" data-fields-container="${item.id}"></div>
                    <div class="card-list-form-actions">
                        <button type="button" class="btn btn-lg btn-primary" data-action="save" data-item-id="${item.id}">
                            Salvar
                        </button>
                        <button type="button" class="btn btn-lg btn-secondary" data-action="cancel" data-item-id="${item.id}">
                            Cancelar
                        </button>
                        ${config.allowDelete ? `
                            <button type="button" class="btn btn-lg btn-outline btn-error" data-action="delete" data-item-id="${item.id}">
                                <span>🗑️</span> Excluir
                            </button>
                        ` : ''}
                    </div>
                </form>
            </div>
        `;
    }

    static itemSubtitle(item, config) {
        const subtitleHtml = config.getItemSubtitle(item);
        return `<div class="card-list-item-subtitle">${subtitleHtml}</div>`;
    }

    static itemActions(config, isExpanded, item) {
        if (isExpanded) {
            // Item expandido - mostrar apenas chevron
            return `<i class="icon icon-chevron-up"></i>`;
        } else {
            // Item contraído - mostrar botão de editar
            return config.allowEdit ? `
                <button class="btn btn-lg btn-outline btn-primary" data-action="edit" data-item-id="${item.id}">
                    <span>✏️</span> Editar
                </button>
            ` : `<i class="icon icon-chevron-down"></i>`;
        }
    }

    static emptyState(config) {
        return `
            <div class="card-list-empty">
                ${config.emptyIcon ? `<i class="icon icon-${config.emptyIcon} text-4xl text-muted mb-sm"></i>` : ''}
                <p class="text-lg text-muted mb-md">${config.emptyMessage || 'Nenhum item encontrado'}</p>
                ${config.emptyAction ? `
                    <button class="btn btn-primary" data-action="${config.emptyAction.action}">
                        ${config.emptyAction.label}
                    </button>
                ` : ''}
            </div>
        `;
    }

    static newItemButton(config) {
        if (!config.allowCreate) return '';
        
        return `
            <div class="card-list-new card" data-new-item>
                <div class="card-list-new-content" data-new-content>
                    <span class="card-list-new-icon">➕</span>
                    <p class="card-list-new-text">Criar novo ${config.type}</p>
                </div>
            </div>
        `;
    }

    static newItemForm(config) {
        return `
            <div class="card-list-new-form" data-new-form>
                <p class="card-list-new-text">Novo ${config.type}</p>
                <form class="card-list-form" data-form="new">
                    <div class="card-list-form-fields" data-fields-container="new"></div>
                    <div class="card-list-form-actions">
                        <button type="button" class="btn btn-lg btn-primary" data-action="create">
                            Criar ${config.type}
                        </button>
                        <button type="button" class="btn btn-lg btn-secondary" data-action="cancel-create">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    static fieldGroup(field, value, error) {
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
                ${ListTemplates.renderFieldByType(field, value)}
                <div class="form-error" data-field-error="${field.name}"${hasError ? ' style="display: block;"' : ''}>
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
                return ListTemplates.inputField(field.type, baseAttrs, field.maxLength);
                
            case 'textarea':
                return ListTemplates.textareaField(baseAttrs, field.rows || 3, field.maxLength);
                
            case 'select':
                return ListTemplates.selectField(baseAttrs, field.options || []);
                
            case 'checkbox':
                return ListTemplates.checkboxField(baseAttrs, field.checkboxLabel || field.label);
                
            case 'file-upload':
                return ListTemplates.fileUploadField(baseAttrs, field);
                
            case 'color-picker':
                return ListTemplates.colorPickerField(baseAttrs, field);
                
            case 'emoji-text':
                return ListTemplates.emojiTextField(baseAttrs);
                
            case 'markdown':
                return ListTemplates.markdownField(baseAttrs, field.rows || 6);
                
            case 'font-selector':
                return ListTemplates.fontSelectorField(baseAttrs);
                
            default:
                return ListTemplates.inputField('text', baseAttrs, field.maxLength);
        }
    }

    static inputField(type, attrs, maxLength) {
        const attrsStr = ListTemplates.buildAttrsString(attrs);
        return `<input type="${type}" ${attrsStr} ${maxLength ? `maxlength="${maxLength}"` : ''} />`;
    }

    static textareaField(attrs, rows, maxLength) {
        const attrsStr = ListTemplates.buildAttrsString({...attrs, value: undefined});
        return `<textarea ${attrsStr} rows="${rows}" ${maxLength ? `maxlength="${maxLength}"` : ''}>${attrs.value}</textarea>`;
    }

    static selectField(attrs, options) {
        const attrsStr = ListTemplates.buildAttrsString({...attrs, value: undefined});
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
        const attrsStr = ListTemplates.buildAttrsString({
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
        const attrsStr = ListTemplates.buildAttrsString(attrs);
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