/**
 * api.js
 * Módulo para chamadas HTTP ao backend (N8N)
 * Dependências: utils.js
 * Localização: public/js/core/api.js
 * Tamanho alvo: <150 linhas
 */

window.IalumModules = window.IalumModules || {};
window.IalumModules.API = {
    
    // Configuração base
    config: {
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
    },
    
    // Token de autenticação
    getToken() {
        if (window.IalumModules && window.IalumModules.Utils) {
            return window.IalumModules.Utils.storage.get('auth_token');
        }
        return null;
    },
    
    // Adicionar headers de autenticação
    getHeaders() {
        const headers = { ...this.config.headers };
        const token = this.getToken();
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (window.IalumModules && window.IalumModules.Utils) {
            const tenantId = window.IalumModules.Utils.storage.get('tenant_id');
            if (tenantId) {
                headers['X-Tenant-ID'] = tenantId;
            }
        }
        
        return headers;
    },
    
    // Requisição genérica
    async request(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.getHeaders(),
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
    },
    
    // Métodos HTTP com URLs completas
    async get(endpoint, path, params = {}) {
        const baseUrl = this.config.endpoints[endpoint];
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${baseUrl}${path}${queryString ? '?' + queryString : ''}`;
        
        return this.request(fullUrl, {
            method: 'GET'
        });
    },
    
    async post(endpoint, path, data = {}) {
        const baseUrl = this.config.endpoints[endpoint];
        const fullUrl = `${baseUrl}${path}`;
        
        return this.request(fullUrl, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async put(endpoint, path, data = {}) {
        const baseUrl = this.config.endpoints[endpoint];
        const fullUrl = `${baseUrl}${path}`;
        
        return this.request(fullUrl, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    async delete(endpoint, path) {
        const baseUrl = this.config.endpoints[endpoint];
        const fullUrl = `${baseUrl}${path}`;
        
        return this.request(fullUrl, {
            method: 'DELETE'
        });
    },
    
    // Métodos específicos da aplicação
    auth: {
        async login(email, password) {
            try {
                const response = await window.IalumModules.API.post('auth', '/login', {
                    email,
                    password
                });
                
                if (response.token && window.IalumModules && window.IalumModules.Utils) {
                    window.IalumModules.Utils.storage.set('auth_token', response.token);
                    
                    if (response.user) {
                        window.IalumModules.Utils.storage.set('user', response.user);
                        if (response.user.tenant_id) {
                            window.IalumModules.Utils.storage.set('tenant_id', response.user.tenant_id);
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
                await window.IalumModules.API.post('auth', '/logout');
            } catch (error) {
                console.error('Erro no logout:', error);
            } finally {
                if (window.IalumModules && window.IalumModules.Utils) {
                    window.IalumModules.Utils.storage.clear();
                }
                window.location.href = '/login.html';
            }
        },
        
        async verify() {
            try {
                return await window.IalumModules.API.post('auth', '/verify');
            } catch (error) {
                return { valid: false };
            }
        }
    },
    
    // Dados
    data: {
        async getTopics(filters = {}) {
            return window.IalumModules.API.get('data', '/topics', filters);
        },
        
        async getTopic(id) {
            return window.IalumModules.API.get('data', `/topics/${id}`);
        },
        
        async getSettings() {
            return window.IalumModules.API.get('data', '/settings');
        }
    },
    
    // Ações
    actions: {
        async saveSettings(data) {
            return window.IalumModules.API.post('actions', '/save-settings', data);
        },
        
        async createTopic(data) {
            return window.IalumModules.API.post('actions', '/create-topic', data);
        },
        
        async updateTopic(id, data) {
            return window.IalumModules.API.put('actions', `/update-topic/${id}`, data);
        }
    }
};