/**
 * GridTemplates - Templates HTML para o componente CardGrid
 * 
 * Templates disponíveis:
 * - container(config) - Container principal do grid com colunas configuráveis
 * - searchBar(config) - Barra de busca para filtrar itens
 * - emptyState(config) - Estado vazio quando não há itens
 * - gridItem(item, config, isSelected, isLoading) - Card individual do grid
 * - itemCheckbox(isSelected) - Checkbox para seleção de item
 * - itemImage(imageUrl, alt) - Imagem do item
 * - itemContent(title, subtitle) - Conteúdo principal do item (título e subtítulo)
 * - itemActions(item, config) - Botões de ação do item
 * - actionButton(action, itemId) - Botão de ação individual
 * - selectionBar(selectedCount, config) - Barra de seleção múltipla com contador
 */
export default class GridTemplates {
    static container(config) {
        const columnsClass = config.columns === 'auto' ? 
            'auto-columns' : 
            `columns-${config.columns}`;
            
        return `
            <div class="card-grid">
                ${config.searchable ? GridTemplates.searchBar(config) : ''}
                <div class="card-grid-container ${columnsClass}">
                    <div class="card-grid-items" data-grid-items></div>
                </div>
            </div>
        `;
    }
    
    static searchBar(config) {
        return `
            <div class="card-grid-search-wrapper">
                <input type="text" 
                       class="card-grid-search form-control" 
                       placeholder="Buscar ${config.type}..."
                       data-search-input>
            </div>
        `;
    }
    
    static emptyState(config) {
        return `
            <div class="card-grid-empty">
                <div class="card-grid-empty-icon">${config.emptyIcon}</div>
                <h3 class="card-grid-empty-title">${config.emptyMessage}</h3>
            </div>
        `;
    }
    
    static gridItem(item, config, isSelected = false, isLoading = false) {
        const primaryValue = item[config.primaryField] || 'Sem título';
        const secondaryValue = config.secondaryField ? item[config.secondaryField] : '';
        const imageUrl = config.imageField ? item[config.imageField] : null;
        
        const cardClasses = [
            'card',
            'card-grid-item',
            isSelected ? 'selected' : '',
            isLoading ? 'loading' : '',
            config.selectable ? 'selectable' : ''
        ].filter(Boolean).join(' ');
        
        return `
            <div class="${cardClasses}" data-item-id="${item.id}">
                ${config.selectable ? GridTemplates.itemCheckbox(isSelected) : ''}
                ${imageUrl ? GridTemplates.itemImage(imageUrl, primaryValue) : ''}
                ${GridTemplates.itemContent(primaryValue, secondaryValue)}
                ${GridTemplates.itemActions(item, config)}
            </div>
        `;
    }
    
    static itemCheckbox(isSelected) {
        return `
            <div class="card-grid-item-checkbox">
                <input type="checkbox" ${isSelected ? 'checked' : ''} data-action="toggle-select">
            </div>
        `;
    }
    
    static itemImage(imageUrl, alt) {
        return `
            <div class="card-grid-item-image">
                <img src="${imageUrl}" alt="${alt}" loading="lazy">
            </div>
        `;
    }
    
    static itemContent(title, subtitle = '') {
        return `
            <div class="card-grid-item-content">
                <h3 class="card-grid-item-title">${title}</h3>
                ${subtitle ? `<p class="card-grid-item-subtitle">${subtitle}</p>` : ''}
            </div>
        `;
    }
    
    static itemActions(item, config) {
        if (!config.itemActions || config.itemActions.length === 0) {
            return '';
        }
        
        const actionsHTML = config.itemActions.map(action => 
            GridTemplates.actionButton(action, item.id)
        ).join('');
        
        return `
            <div class="card-grid-item-actions">
                ${actionsHTML}
            </div>
        `;
    }
    
    static actionButton(action, itemId) {
        return `
            <button type="button" 
                    class="btn btn-sm ${action.class || 'btn-outline'}" 
                    data-action="${action.action}" 
                    data-item-id="${itemId}"
                    title="${action.title || action.label}">
                ${action.icon ? `<span>${action.icon}</span>` : ''}
                ${action.label || ''}
            </button>
        `;
    }
    
    static selectionBar(selectedCount, config) {
        return `
            <div class="card-grid-selection">
                <span class="card-grid-selection-count">${selectedCount} ${config.type} selecionado(s)</span>
                <div class="card-grid-selection-actions">
                    <button type="button" class="btn btn-sm btn-secondary" data-action="clear-selection">
                        Limpar seleção
                    </button>
                    ${config.bulkActions ? config.bulkActions.map(action => 
                        GridTemplates.actionButton(action, 'bulk')
                    ).join('') : ''}
                </div>
            </div>
        `;
    }
}