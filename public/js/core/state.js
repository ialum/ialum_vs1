/**
 * state.js
 * Gerenciamento de estado global da aplicação
 * Documentação: /docs/0_16-sistemas-core.md#state
 * Localização: /js/core/state.js
 * 
 * COMO USAR:
 * 1. Importar: import { State } from '/js/core/state.js'
 * 2. Salvar: State.set('usuario', dados)
 * 3. Ler: State.get('usuario')
 * 4. Observar mudanças: State.watch('usuario', callback)
 */

// Estado interno da aplicação
const state = new Map();
const listeners = new Map();

/**
 * Define valor no estado global
 * @param {string} key - Chave do estado
 * @param {*} value - Valor a armazenar
 */
export function set(key, value) {
    const oldValue = state.get(key);
    state.set(key, value);
    
    // Notificar listeners
    if (listeners.has(key)) {
        listeners.get(key).forEach(callback => {
            callback(value, oldValue);
        });
    }
}

/**
 * Obtém valor do estado global
 * @param {string} key - Chave do estado
 * @param {*} defaultValue - Valor padrão se não existir
 * @returns {*} Valor armazenado
 */
export function get(key, defaultValue = null) {
    return state.has(key) ? state.get(key) : defaultValue;
}

/**
 * Remove valor do estado
 * @param {string} key - Chave do estado
 */
export function remove(key) {
    const value = state.get(key);
    state.delete(key);
    
    // Notificar listeners
    if (listeners.has(key)) {
        listeners.get(key).forEach(callback => {
            callback(null, value);
        });
    }
}

/**
 * Observa mudanças em uma chave
 * @param {string} key - Chave para observar
 * @param {Function} callback - Função chamada quando mudar
 * @returns {Function} Função para parar de observar
 */
export function watch(key, callback) {
    if (!listeners.has(key)) {
        listeners.set(key, new Set());
    }
    
    listeners.get(key).add(callback);
    
    // Retorna função para remover listener
    return () => {
        const keyListeners = listeners.get(key);
        if (keyListeners) {
            keyListeners.delete(callback);
            if (keyListeners.size === 0) {
                listeners.delete(key);
            }
        }
    };
}

/**
 * Limpa todo o estado
 */
export function clear() {
    state.clear();
    listeners.clear();
}

/**
 * Obtém todo o estado (para debug)
 * @returns {Object} Estado completo
 */
export function getAll() {
    return Object.fromEntries(state);
}

// Estados padrão da aplicação
export const KEYS = {
    USER: 'usuario',
    TENANT: 'tenant',
    THEME: 'tema',
    SETTINGS: 'configuracoes',
    TOPICS_CACHE: 'topicos_cache',
    CURRENT_PAGE: 'pagina_atual'
};

// Exporta interface pública
export const State = {
    set,
    get,
    remove,
    watch,
    clear,
    getAll,
    KEYS
};