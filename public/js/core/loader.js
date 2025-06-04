/**
 * loader.js
 * Sistema de indicadores de carregamento
 * Documentação: /docs/0_16-sistemas-core.md#loader
 * Localização: /js/core/loader.js
 * 
 * COMO USAR:
 * 1. Importar: import { Loader } from '/js/core/loader.js'
 * 2. Mostrar: Loader.show() ou Loader.showInElement('#container')
 * 3. Esconder: Loader.hide()
 */

import { DOM } from './dom.js';

// Estado do loader
let activeLoaders = new Set();

/**
 * Mostra loading na página inteira
 * @param {string} message - Mensagem opcional
 */
export function show(message = 'Carregando...') {
    const container = DOM.select('#page-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    activeLoaders.add('page');
}

/**
 * Mostra loading em elemento específico
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} message - Mensagem opcional
 */
export function showInElement(target, message = 'Carregando...') {
    const element = DOM.select(target);
    if (!element) return;
    
    // Salva conteúdo original
    element.dataset.originalContent = element.innerHTML;
    
    element.innerHTML = `
        <div class="loading-inline">
            <div class="spinner-small"></div>
            <span>${message}</span>
        </div>
    `;
    
    activeLoaders.add(element);
}

/**
 * Esconde loading
 * @param {string|Element} target - Específico ou todos
 */
export function hide(target) {
    if (!target) {
        // Esconde todos
        activeLoaders.forEach(loader => {
            if (typeof loader === 'string') {
                // Loader de página
                const container = DOM.select('#page-content');
                if (container) container.innerHTML = '';
            } else {
                // Loader de elemento
                if (loader.dataset.originalContent) {
                    loader.innerHTML = loader.dataset.originalContent;
                    delete loader.dataset.originalContent;
                }
            }
        });
        activeLoaders.clear();
    } else {
        // Esconde específico
        const element = DOM.select(target);
        if (element && element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
            activeLoaders.delete(element);
        }
    }
}

/**
 * Mostra erro na página
 * @param {string} message - Mensagem de erro
 * @param {Function} onRetry - Callback para tentar novamente
 */
export function showError(message = 'Algo deu errado', onRetry) {
    const container = DOM.select('#page-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-container">
            <h2>Ops!</h2>
            <p>${message}</p>
            <button class="btn btn-primary" id="btn-retry">
                Tentar novamente
            </button>
        </div>
    `;
    
    if (onRetry) {
        DOM.on('#btn-retry', 'click', onRetry);
    } else {
        DOM.on('#btn-retry', 'click', () => location.reload());
    }
}

/**
 * Loading com progresso
 * @param {number} percent - Porcentagem (0-100)
 * @param {string} message - Mensagem opcional
 */
export function showProgress(percent, message = 'Processando...') {
    const container = DOM.select('#page-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
            <p>${message} (${percent}%)</p>
        </div>
    `;
}

// Exporta interface pública
export const Loader = {
    show,
    showInElement,
    hide,
    showError,
    showProgress
};