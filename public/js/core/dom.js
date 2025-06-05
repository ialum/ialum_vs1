/**
 * dom.js
 * Sistema de gerenciamento seguro do DOM
 * Documentação: /docs/0_16-sistemas-core.md#dom
 * Localização: /js/core/dom.js
 * 
 * COMO USAR:
 * 1. Importar: import { DOM } from '/js/core/dom.js'
 * 2. Usar helpers: DOM.ready(() => { ... })
 * 3. Selecionar: DOM.select('#id') ou DOM.selectAll('.class')
 * 4. Eventos: DOM.on('#btn', 'click', handler)
 */

// Registro de event listeners para limpeza
const eventRegistry = new Map();
const cleanupCallbacks = new Set();

/**
 * Aguarda DOM carregar completamente
 * @param {Function} callback - Função a executar quando DOM estiver pronto
 */
export function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        // DOM já carregado, executa imediatamente
        callback();
    }
}

/**
 * Seleciona um elemento com verificação
 * @param {string} selector - Seletor CSS
 * @param {Element} parent - Elemento pai (opcional)
 * @returns {Element|null} Elemento encontrado ou null
 */
export function select(selector, parent = document) {
    try {
        const element = parent.querySelector(selector);
        if (!element) {
            console.warn(`DOM: Elemento não encontrado: ${selector}`);
        }
        return element;
    } catch (e) {
        console.error(`DOM: Seletor inválido: ${selector}`, e);
        return null;
    }
}

/**
 * Seleciona múltiplos elementos
 * @param {string} selector - Seletor CSS
 * @param {Element} parent - Elemento pai (opcional)
 * @returns {Element[]} Array de elementos (nunca null)
 */
export function selectAll(selector, parent = document) {
    try {
        return Array.from(parent.querySelectorAll(selector));
    } catch (e) {
        console.error(`DOM: Seletor inválido: ${selector}`, e);
        return [];
    }
}

/**
 * Adiciona event listener com registro para limpeza
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} event - Nome do evento
 * @param {Function} handler - Função handler
 * @param {Object} options - Opções do addEventListener
 */
export function on(target, event, handler, options = {}) {
    const element = typeof target === 'string' ? select(target) : target;
    
    if (!element) {
        console.warn(`DOM: Não foi possível adicionar evento, elemento não encontrado`);
        return;
    }
    
    // Adiciona evento
    element.addEventListener(event, handler, options);
    
    // Registra para limpeza posterior
    const key = `${element.tagName}#${element.id || ''}.${element.className || ''}`;
    if (!eventRegistry.has(key)) {
        eventRegistry.set(key, []);
    }
    
    eventRegistry.get(key).push({
        element,
        event,
        handler,
        options
    });
}

/**
 * Remove event listener
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} event - Nome do evento
 * @param {Function} handler - Função handler
 */
export function off(target, event, handler) {
    const element = typeof target === 'string' ? select(target) : target;
    
    if (!element) return;
    
    element.removeEventListener(event, handler);
}

/**
 * Delegação de eventos (para elementos dinâmicos)
 * @param {string|Element} container - Container pai
 * @param {string} selector - Seletor dos filhos
 * @param {string} event - Nome do evento
 * @param {Function} handler - Função handler
 */
export function delegate(container, selector, event, handler) {
    const parent = typeof container === 'string' ? select(container) : container;
    
    if (!parent) return;
    
    on(parent, event, (e) => {
        const target = e.target.closest(selector);
        if (target && parent.contains(target)) {
            handler.call(target, e, target);
        }
    });
}

/**
 * Cria elemento com propriedades
 * @param {string} tag - Nome da tag
 * @param {Object} props - Propriedades e atributos
 * @param {string|Element[]} children - Conteúdo ou filhos
 * @returns {Element} Elemento criado
 */
export function create(tag, props = {}, children = null) {
    const element = document.createElement(tag);
    
    // Define propriedades
    Object.entries(props).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on')) {
            // Eventos (onClick, onInput, etc)
            const event = key.substring(2).toLowerCase();
            on(element, event, value);
        } else if (key === 'data' && typeof value === 'object') {
            // Data attributes
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element[key] = value;
        }
    });
    
    // Adiciona filhos
    if (children) {
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (child) element.appendChild(child);
            });
        } else {
            element.appendChild(children);
        }
    }
    
    return element;
}

/**
 * Remove elemento com limpeza de eventos
 * @param {string|Element} target - Seletor ou elemento
 */
export function remove(target) {
    const element = typeof target === 'string' ? select(target) : target;
    
    if (!element) return;
    
    // Remove eventos registrados
    cleanupElement(element);
    
    // Remove do DOM
    element.remove();
}

/**
 * Mostra elemento
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} display - Tipo de display (default: block)
 */
export function show(target, display = 'block') {
    const element = typeof target === 'string' ? select(target) : target;
    if (element) element.style.display = display;
}

/**
 * Esconde elemento
 * @param {string|Element} target - Seletor ou elemento
 */
export function hide(target) {
    const element = typeof target === 'string' ? select(target) : target;
    if (element) element.style.display = 'none';
}

/**
 * Alterna visibilidade
 * @param {string|Element} target - Seletor ou elemento
 * @param {boolean} condition - Condição (opcional)
 */
export function toggle(target, condition) {
    const element = typeof target === 'string' ? select(target) : target;
    if (!element) return;
    
    if (condition !== undefined) {
        element.style.display = condition ? '' : 'none';
    } else {
        element.style.display = element.style.display === 'none' ? '' : 'none';
    }
}

/**
 * Adiciona classe com verificação
 * @param {string|Element} target - Seletor ou elemento
 * @param {...string} classes - Classes a adicionar
 */
export function addClass(target, ...classes) {
    const element = typeof target === 'string' ? select(target) : target;
    if (element) element.classList.add(...classes);
}

/**
 * Remove classe
 * @param {string|Element} target - Seletor ou elemento
 * @param {...string} classes - Classes a remover
 */
export function removeClass(target, ...classes) {
    const element = typeof target === 'string' ? select(target) : target;
    if (element) element.classList.remove(...classes);
}

/**
 * Alterna classe
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} className - Classe a alternar
 * @param {boolean} condition - Condição (opcional)
 */
export function toggleClass(target, className, condition) {
    const element = typeof target === 'string' ? select(target) : target;
    if (element) element.classList.toggle(className, condition);
}

/**
 * Verifica se elemento tem classe
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} className - Classe a verificar
 * @returns {boolean}
 */
export function hasClass(target, className) {
    const element = typeof target === 'string' ? select(target) : target;
    return element ? element.classList.contains(className) : false;
}

/**
 * Define atributo data-*
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} key - Nome do data (sem data-)
 * @param {*} value - Valor
 */
export function setData(target, key, value) {
    const element = typeof target === 'string' ? select(target) : target;
    if (element) element.dataset[key] = value;
}

/**
 * Obtém atributo data-*
 * @param {string|Element} target - Seletor ou elemento
 * @param {string} key - Nome do data (sem data-)
 * @returns {string|undefined}
 */
export function getData(target, key) {
    const element = typeof target === 'string' ? select(target) : target;
    return element ? element.dataset[key] : undefined;
}

/**
 * Registra callback para limpeza ao trocar página
 * @param {Function} callback - Função de limpeza
 */
export function onCleanup(callback) {
    cleanupCallbacks.add(callback);
}

/**
 * Limpa todos os eventos e callbacks registrados
 * Chamado automaticamente pelo router ao trocar página
 */
export function cleanup() {
    // Remove todos eventos registrados
    eventRegistry.forEach(events => {
        events.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
    });
    
    eventRegistry.clear();
    
    // Executa callbacks de limpeza
    cleanupCallbacks.forEach(callback => {
        try {
            callback();
        } catch (e) {
            console.error('DOM: Erro em callback de limpeza', e);
        }
    });
    
    cleanupCallbacks.clear();
}

/**
 * Limpa eventos de um elemento específico
 * @param {Element} element - Elemento para limpar
 */
function cleanupElement(element) {
    // Remove eventos do elemento e filhos
    const key = `${element.tagName}#${element.id || ''}.${element.className || ''}`;
    const events = eventRegistry.get(key);
    
    if (events) {
        events.forEach(({ element: el, event, handler, options }) => {
            el.removeEventListener(event, handler, options);
        });
        eventRegistry.delete(key);
    }
}

/**
 * Aguarda elemento aparecer no DOM
 * @param {string} selector - Seletor CSS
 * @param {number} timeout - Timeout em ms (default: 5000)
 * @returns {Promise<Element>} Promise com elemento
 */
export function waitFor(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = select(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver((mutations, obs) => {
            const element = select(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Timeout
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout aguardando elemento: ${selector}`));
        }, timeout);
    });
}

// Exporta interface pública
export const DOM = {
    ready,
    select,
    selectAll,
    on,
    off,
    delegate,
    create,
    remove,
    show,
    hide,
    toggle,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    setData,
    getData,
    waitFor,
    cleanup,
    onCleanup
};