/**
 * PageBuilder.js
 * Construtor inteligente de páginas com estrutura padronizada
 * 
 * COMO USAR:
 * 1. import { PageBuilder } from '/js/components/layout/PageBuilder.js'
 * 2. const page = new PageBuilder('#container')
 * 3. page.setHeader('Título', 'Descrição')
 * 4. page.addSection({ title: 'Seção', content: '<div id="form"></div>' })
 */

import { DOM } from '../../core/dom.js';

export class PageBuilder {
    constructor(container) {
        this.container = typeof container === 'string' ? DOM.select(container) : container;
        if (!this.container) throw new Error('PageBuilder: container não encontrado');
        
        this.sections = [];
        this.innerContainer = null;
        this.init();
    }
    
    init() {
        // Limpa container e cria estrutura base
        this.container.innerHTML = `
            <div class="container page-container">
                <!-- Header será inserido aqui -->
                <!-- Sections serão inseridas aqui -->
            </div>
        `;
        
        this.innerContainer = DOM.select('.container', this.container);
    }
    
    setHeader(title, description) {
        const headerHTML = `
            <div class="page-header">
                <h1 class="page-title">${title}</h1>
                ${description ? `<p class="page-description">${description}</p>` : ''}
            </div>
        `;
        
        // Insere header no início do container interno
        this.innerContainer.insertAdjacentHTML('afterbegin', headerHTML);
        
        return this;
    }
    
    addSection(config) {
        const {
            id,
            title,
            icon = '',
            description,
            content,
            cardClass = '',
            bodyClass = ''
        } = config;
        
        const sectionHTML = `
            <div class="page-section">
                <div class="card ${cardClass}">
                    ${title ? `
                        <div class="card-header">
                            <div>
                                <h2 class="card-title">${icon} ${title}</h2>
                                ${description ? `<p style="color: var(--theme-text-secondary);">${description}</p>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    <div class="card-body ${bodyClass}">
                        ${typeof content === 'string' ? content : `<div id="${id}"></div>`}
                    </div>
                </div>
            </div>
        `;
        
        this.innerContainer.insertAdjacentHTML('beforeend', sectionHTML);
        this.sections.push({ id, title, config });
        
        return this;
    }
    
    getSection(id) {
        return DOM.select(`#${id}`, this.container);
    }
    
    render() {
        // Método para re-renderizar se necessário
        return this.container;
    }
}

// Helper function para uso rápido
export function createPage(container, config) {
    const page = new PageBuilder(container);
    
    if (config.header) {
        page.setHeader(config.header.title, config.header.description);
    }
    
    if (config.sections) {
        config.sections.forEach(section => page.addSection(section));
    }
    
    return page;
}