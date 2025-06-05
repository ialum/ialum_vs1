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
    
    // Persistir no localStorage se for chave crítica
    if (PERSISTENT_KEYS.has(key)) {
        try {
            if (value === null || value === undefined) {
                localStorage.removeItem(key);
            } else {
                const serialized = typeof value === 'object' ? JSON.stringify(value) : value;
                localStorage.setItem(key, serialized);
            }
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }
    
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
    // Se já está na memória, retorna
    if (state.has(key)) {
        return state.get(key);
    }
    
    // Se é chave persistente, tenta recuperar do localStorage
    if (PERSISTENT_KEYS.has(key)) {
        try {
            const stored = localStorage.getItem(key);
            if (stored !== null) {
                // Tentar fazer parse JSON, se falhar retorna string
                let value;
                try {
                    value = JSON.parse(stored);
                } catch {
                    value = stored;
                }
                
                // Restaurar na memória
                state.set(key, value);
                return value;
            }
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
        }
    }
    
    return defaultValue;
}

/**
 * Remove valor do estado
 * @param {string} key - Chave do estado
 */
export function remove(key) {
    const value = state.get(key);
    state.delete(key);
    
    // Remover do localStorage se for chave persistente
    if (PERSISTENT_KEYS.has(key)) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
        }
    }
    
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
    // Limpar localStorage apenas das chaves persistentes
    PERSISTENT_KEYS.forEach(key => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
        }
    });
    
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

// Estados que devem ser persistidos no localStorage
const PERSISTENT_KEYS = new Set([
    'auth_token',
    'user', 
    'tenant_id',
    'theme'
]);

// Estados padrão da aplicação
export const KEYS = {
    USER: 'user',
    TENANT: 'tenant_id',
    THEME: 'theme',
    AUTH_TOKEN: 'auth_token',
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