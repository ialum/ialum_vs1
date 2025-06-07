/**
 * cache.js
 * Sistema de cache local com expiração
 * Documentação: /docs/0_16-sistemas-core.md#cache
 * Localização: /js/core/cache.js
 * 
 * COMO USAR:
 * 1. Importar: import { Cache } from '/js/core/cache.js'
 * 2. Salvar: Cache.set('topicos', dados, 5) // expira em 5 minutos
 * 3. Ler: Cache.get('topicos')
 * 4. Limpar: Cache.remove('topicos') ou Cache.clear()
 */

// Prefixo para localStorage
const PREFIX = 'ialum_cache_';

/**
 * Salva dados no cache com expiração
 * @param {string} key - Chave do cache
 * @param {*} value - Valor a armazenar
 * @param {number} expirationMinutes - Minutos até expirar (default: 30)
 * @returns {boolean} Sucesso da operação
 */
export function set(key, value, expirationMinutes = 30) {
    try {
        const item = {
            data: value,
            timestamp: Date.now(),
            expiration: Date.now() + (expirationMinutes * 60 * 1000)
        };
        
        localStorage.setItem(PREFIX + key, JSON.stringify(item));
        return true;
    } catch (e) {
        console.error('Cache: Erro ao salvar', e);
        return false;
    }
}

/**
 * Obtém dados do cache se ainda válidos
 * @param {string} key - Chave do cache
 * @returns {*} Dados ou null se expirado/inexistente
 */
export function get(key) {
    try {
        const item = localStorage.getItem(PREFIX + key);
        if (!item) return null;
        
        const cached = JSON.parse(item);
        
        // Verifica expiração
        if (Date.now() > cached.expiration) {
            localStorage.removeItem(PREFIX + key);
            return null;
        }
        
        return cached.data;
    } catch (e) {
        console.error('Cache: Erro ao ler', e);
        return null;
    }
}

/**
 * Remove item do cache
 * @param {string} key - Chave do cache
 */
export function remove(key) {
    localStorage.removeItem(PREFIX + key);
}

/**
 * Limpa todo o cache
 * @param {boolean} onlyExpired - Se true, remove apenas expirados
 */
export function clear(onlyExpired = false) {
    if (!onlyExpired) {
        // Remove tudo
        Object.keys(localStorage)
            .filter(k => k.startsWith(PREFIX))
            .forEach(k => localStorage.removeItem(k));
    } else {
        // Remove apenas expirados
        Object.keys(localStorage)
            .filter(k => k.startsWith(PREFIX))
            .forEach(k => {
                try {
                    const item = JSON.parse(localStorage.getItem(k));
                    if (Date.now() > item.expiration) {
                        localStorage.removeItem(k);
                    }
                } catch (e) {
                    // Remove se não conseguir parsear
                    localStorage.removeItem(k);
                }
            });
    }
}

/**
 * Verifica se cache existe e é válido
 * @param {string} key - Chave do cache
 * @returns {boolean} Se existe e é válido
 */
export function has(key) {
    const item = get(key);
    return item !== null;
}

/**
 * Obtém informações sobre o cache
 * @param {string} key - Chave do cache
 * @returns {Object|null} Informações ou null
 */
export function info(key) {
    try {
        const item = localStorage.getItem(PREFIX + key);
        if (!item) return null;
        
        const cached = JSON.parse(item);
        const now = Date.now();
        
        return {
            exists: true,
            expired: now > cached.expiration,
            age: Math.floor((now - cached.timestamp) / 1000), // segundos
            remainingTime: Math.max(0, cached.expiration - now), // ms
            size: new Blob([item]).size, // bytes
            createdAt: new Date(cached.timestamp).toLocaleString('pt-BR'),
            expiresAt: new Date(cached.expiration).toLocaleString('pt-BR')
        };
    } catch (e) {
        return null;
    }
}

/**
 * Função helper para cache com fallback
 * @param {string} key - Chave do cache
 * @param {Function} fetchFn - Função para buscar dados se não em cache
 * @param {number} expirationMinutes - Minutos até expirar
 * @returns {Promise<*>} Dados do cache ou resultado da função
 */
export async function getOrFetch(key, fetchFn, expirationMinutes = 30) {
    // Tenta pegar do cache
    const cached = get(key);
    if (cached !== null) {
        return cached;
    }
    
    // Busca novos dados
    try {
        const data = await fetchFn();
        set(key, data, expirationMinutes);
        return data;
    } catch (error) {
        console.error(`Cache: Erro ao buscar dados para ${key}`, error);
        throw error;
    }
}

/**
 * Lista todas as chaves de cache
 * @returns {Array} Array de chaves
 */
export function keys() {
    return Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .map(k => k.replace(PREFIX, ''));
}

/**
 * Obtém estatísticas do cache
 * @returns {Object} Estatísticas
 */
export function stats() {
    const allKeys = keys();
    const totalItems = allKeys.length;
    const validItems = allKeys.filter(key => has(key)).length;
    const expiredItems = totalItems - validItems;
    
    const totalSize = allKeys.reduce((size, key) => {
        const item = localStorage.getItem(PREFIX + key);
        return size + (item ? new Blob([item]).size : 0);
    }, 0);
    
    return {
        totalItems,
        validItems,
        expiredItems,
        totalSize,
        totalSizeFormatted: formatBytes(totalSize),
        storageUsed: JSON.stringify(localStorage).length,
        storageUsedFormatted: formatBytes(JSON.stringify(localStorage).length)
    };
}

/**
 * Debug - lista todo o conteúdo do cache
 * @param {boolean} includeExpired - Incluir itens expirados
 * @returns {Object} Mapa de chave -> info
 */
export function debug(includeExpired = false) {
    const result = {};
    
    keys().forEach(key => {
        const keyInfo = info(key);
        if (keyInfo && (includeExpired || !keyInfo.expired)) {
            result[key] = keyInfo;
        }
    });
    
    return result;
}

/**
 * Força expiração de um item (para testes)
 * @param {string} key - Chave do cache
 */
export function expire(key) {
    try {
        const item = localStorage.getItem(PREFIX + key);
        if (!item) return false;
        
        const cached = JSON.parse(item);
        cached.expiration = Date.now() - 1; // Expira imediatamente
        
        localStorage.setItem(PREFIX + key, JSON.stringify(cached));
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Reset completo do cache (para desenvolvimento)
 * Remove tudo e reinicia contadores
 */
export function reset() {
    clear(); // Remove todos os itens
    console.log('🧹 Cache resetado completamente');
    return true;
}

// Função utilitária para formatar bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Limpa cache expirado ao iniciar
clear(true);

// Funções globais para desenvolvimento (só em desenvolvimento)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.cacheDebug = {
        stats,
        debug,
        reset,
        clear: () => clear(),
        expire,
        keys,
        info: (key) => info(key)
    };
    console.log('🔧 Cache debug disponível em window.cacheDebug');
}

// Exporta interface pública
export const Cache = {
    set,
    get,
    remove,
    clear,
    has,
    info,
    getOrFetch,
    keys,
    stats,
    debug,
    expire,
    reset
};