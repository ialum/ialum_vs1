import { format } from '../../forms/formatters.js';

/**
 * DisplayTemplates - Templates HTML para o componente CardDisplay
 * 
 * Templates disponíveis:
 * - container(config) - Container principal com suporte a diferentes layouts
 * - emptyState(config) - Estado vazio quando não há item para exibir
 * - displayItem(item, config) - Item completo com header, imagem, campos e ações
 * - header(item, config) - Cabeçalho com título e subtítulo
 * - image(item, config) - Imagem principal do item
 * - fields(item, config) - Renderiza todos os campos configurados
 * - field(field, value) - Campo individual com label e valor formatado
 * - formatValue(field, value) - Formata valor baseado no tipo do campo
 * - colorField(value) - Campo especial para cores com preview
 * - actions(item, config) - Botões de ação (editar, excluir, customizados)
 * - actionButton(action) - Botão de ação individual
 * - sectionHeader(title, description) - Cabeçalho de seção
 * - fieldGroup(title, fields) - Agrupa campos em uma seção
 */
export default class DisplayTemplates {
    static container(config) {
        const layoutClass = config.layout !== 'vertical' ? ` layout-${config.layout}` : '';
        
        return `
            <div class="card-display${layoutClass}">
                <div class="card-display-content" data-content></div>
            </div>
        `;
    }
    
    static emptyState(config) {
        return `
            <div class="card-display-empty">
                <div class="card-display-empty-icon">${config.emptyIcon}</div>
                <p class="card-display-empty-text">${config.emptyMessage}</p>
            </div>
        `;
    }
    
    static displayItem(item, config) {
        return `
            <div class="card card-display-item">
                ${config.showHeader ? DisplayTemplates.header(item, config) : ''}
                ${DisplayTemplates.image(item, config)}
                <div class="card-display-body">
                    ${DisplayTemplates.fields(item, config)}
                </div>
                ${config.showActions ? DisplayTemplates.actions(item, config) : ''}
            </div>
        `;
    }
    
    static header(item, config) {
        const primaryValue = config.primaryField ? item[config.primaryField] : '';
        const secondaryValue = config.secondaryField ? item[config.secondaryField] : '';
        
        if (!primaryValue && !secondaryValue) return '';
        
        return `
            <div class="card-display-header">
                ${primaryValue ? `<h2 class="card-display-title">${primaryValue}</h2>` : ''}
                ${secondaryValue ? `<p class="card-display-subtitle">${secondaryValue}</p>` : ''}
            </div>
        `;
    }
    
    static image(item, config) {
        if (!config.imageField) return '';
        
        const imageUrl = item[config.imageField];
        if (!imageUrl) return '';
        
        return `
            <div class="card-display-image">
                <img src="${imageUrl}" alt="${item[config.primaryField] || 'Imagem'}" loading="lazy">
            </div>
        `;
    }
    
    static fields(item, config) {
        if (!config.fields || config.fields.length === 0) return '';
        
        return config.fields.map(field => {
            const value = item[field.name];
            if (!value && !field.showEmpty) return '';
            
            return DisplayTemplates.field(field, value);
        }).filter(Boolean).join('');
    }
    
    static field(field, value) {
        const displayValue = DisplayTemplates.formatValue(field, value);
        
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
    
    static formatValue(field, value) {
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
            case 'color':
                return DisplayTemplates.colorField(value);
            case 'image':
                return `<img src="${value}" class="field-image" loading="lazy">`;
            case 'json':
                return `<pre class="json-field">${JSON.stringify(value, null, 2)}</pre>`;
            default:
                return value;
        }
    }
    
    static colorField(value) {
        return `
            <div class="color-field">
                <span class="color-swatch" style="background-color: ${value}"></span>
                <span class="color-value">${value}</span>
            </div>
        `;
    }
    
    static actions(item, config) {
        const defaultActions = [];
        
        if (config.allowEdit) {
            defaultActions.push({
                action: 'edit',
                label: 'Editar',
                icon: '✏️',
                class: 'btn-primary'
            });
        }
        
        if (config.allowDelete) {
            defaultActions.push({
                action: 'delete',
                label: 'Excluir',
                icon: '🗑️',
                class: 'btn-danger'
            });
        }
        
        const allActions = [...defaultActions, ...(config.actions || [])];
        
        if (allActions.length === 0) return '';
        
        const actionsHTML = allActions.map(action => DisplayTemplates.actionButton(action)).join('');
        
        return `
            <div class="card-display-actions">
                ${actionsHTML}
            </div>
        `;
    }
    
    static actionButton(action) {
        return `
            <button type="button" 
                    class="btn ${action.class || 'btn-outline'}" 
                    data-action="${action.action}"
                    title="${action.title || action.label}">
                ${action.icon ? `<span>${action.icon}</span>` : ''}
                ${action.label || ''}
            </button>
        `;
    }
    
    static sectionHeader(title, description = '') {
        return `
            <div class="card-display-section-header">
                <h3 class="section-title">${title}</h3>
                ${description ? `<p class="section-description">${description}</p>` : ''}
            </div>
        `;
    }
    
    static fieldGroup(title, fields) {
        return `
            <div class="card-display-field-group">
                ${DisplayTemplates.sectionHeader(title)}
                <div class="field-group-content">
                    ${fields}
                </div>
            </div>
        `;
    }
}