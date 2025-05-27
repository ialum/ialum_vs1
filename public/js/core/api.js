/**
 * api.js
 * Módulo para chamadas HTTP ao backend (N8N)
 * Dependências: utils.js
 * Localização: public/js/core/api.js
 * Tamanho alvo: <150 linhas
 */

// Importar dependências
import { Utils } from './utils.js';

// Configuração base
const config = {
    // URLs diretas dos webhooks N8N
    endpoints: {
        auth: 'https://webhook.ialum.com.br/webhook/api-auth',
        data: 'https://webhook.ialum.com.br/webhook/api-data',
        actions: 'https://webhook.ialum.com.br/webhook/api-actions'
    },
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Token de autenticação
function getToken() {
    return Utils.storage.get('auth_token');
}

// Adicionar headers de autenticação
function getHeaders() {
    const headers = { ...config.headers };
    const token = getToken();
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const tenantId = Utils.storage.get('tenant_id');
    if (tenantId) {
        headers['X-Tenant-ID'] = tenantId;
    }
    
    return headers;
}

// Requisição genérica
async function request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getHeaders(),
                ...options.headers
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        if (!isJson) {
            const text = await response.text();
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: `Erro ${response.status}: ${text}`,
                    data: text
                };
            }
            return { success: false, message: text };
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || data.error || 'Erro na requisição',
                data: data
            };
        }
        
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw { message: 'Timeout na requisição', timeout: true };
        }
        
        throw error;
    }
}

// Métodos HTTP
async function get(endpoint, path, params = {}) {
    const baseUrl = config.endpoints[endpoint];
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`;
    
    return request(fullUrl, { method: 'GET' });
}

async function post(endpoint, path, data = {}) {
    const baseUrl = config.endpoints[endpoint];
    const fullUrl = `${baseUrl}${path}`;
    
    return request(fullUrl, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function put(endpoint, path, data = {}) {
    const baseUrl = config.endpoints[endpoint];
    const fullUrl = `${baseUrl}${path}`;
    
    return request(fullUrl, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function del(endpoint, path) {
    const baseUrl = config.endpoints[endpoint];
    const fullUrl = `${baseUrl}${path}`;
    
    return request(fullUrl, { method: 'DELETE' });
}

// Métodos específicos da aplicação
export const auth = {
    async login(email, password) {
        try {
            const response = await post('auth', '/login', { email, password });
            
            if (response.token) {
                Utils.storage.set('auth_token', response.token);
                
                if (response.user) {
                    Utils.storage.set('user', response.user);
                    if (response.user.tenant_id) {
                        Utils.storage.set('tenant_id', response.user.tenant_id);
                    }
                }
            }
            
            return response;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },
    
    async logout() {
        try {
            await post('auth', '/logout');
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            Utils.storage.clear();
            window.location.href = '/login.html';
        }
    },
    
    async verify() {
        try {
            return await post('auth', '/verify');
        } catch (error) {
            return { valid: false };
        }
    }
};

// Dados
export const data = {
    async getTopics(filters = {}) {
        return get('data', '/topics', filters);
    },
    
    async getTopic(id) {
        return get('data', `/topics/${id}`);
    },
    
    async getSettings() {
        return get('data', '/settings');
    },
    
    async getDashboardStats() {
        return get('data', '/dashboard/stats');
    }
};

// Ações
export const actions = {
    async saveSettings(data) {
        return post('actions', '/save-settings', data);
    },
    
    async createTopic(data) {
        return post('actions', '/create-topic', data);
    },
    
    async updateTopic(id, data) {
        return put('actions', `/update-topic/${id}`, data);
    }
};

// Exportar objeto principal para compatibilidade
export const API = {
    getToken,
    auth,
    data,
    actions
};