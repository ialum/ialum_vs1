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
        baseURL: '', // Vazio porque usamos proxy do EasyPanel
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        }
    },
    
    // Token de autenticação
    getToken() {
        return window.IalumModules.Utils.storage.get('auth_token');
    },
    
    // Adicionar headers de autenticação
    getHeaders() {
        const headers = { ...this.config.headers };
        const token = this.getToken();
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Tenant ID se existir
        const tenantId = window.IalumModules.Utils.storage.get('tenant_id');
        if (tenantId) {
            headers['X-Tenant-ID'] = tenantId;
        }
        
        return headers;
    },
    
    // Requisição genérica
    async request(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        try {
            const response = await fetch(`${this.config.baseURL}${url}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Verificar se é JSON
            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');
            
            const data = isJson ? await response.json() : await response.text();
            
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
    
    // GET
    async get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        
        return this.request(fullUrl, {
            method: 'GET'
        });
    },
    
    // POST
    async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT
    async put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE
    async delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    },
    
    // Upload de arquivo
    async upload(url, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Adicionar dados extras
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });
        
        return this.request(url, {
            method: 'POST',
            body: formData,
            headers: {
                // Não setar Content-Type, deixar o browser definir
                ...this.getHeaders(),
                'Content-Type': undefined
            }
        });
    },
    
    // Métodos específicos da aplicação
    auth: {
        async login(email, password) {
            const response = await window.IalumModules.API.post('/api/auth/login', {
                email,
                password
            });
            
            if (response.token) {
                window.IalumModules.Utils.storage.set('auth_token', response.token);
                window.IalumModules.Utils.storage.set('user', response.user);
                window.IalumModules.Utils.storage.set('tenant_id', response.user.tenant_id);
            }
            
            return response;
        },
        
        async logout() {
            await window.IalumModules.API.post('/api/auth/logout');
            window.IalumModules.Utils.storage.clear();
            window.location.href = '/login.html';
        },
        
        async verify() {
            try {
                return await window.IalumModules.API.post('/api/auth/verify');
            } catch (error) {
                return { valid: false };
            }
        }
    },
    
    // Dados
    data: {
        async getTopics(filters = {}) {
            return window.IalumModules.API.get('/api/data/topics', filters);
        },
        
        async getTopic(id) {
            return window.IalumModules.API.get(`/api/data/topics/${id}`);
        },
        
        async getSettings() {
            return window.IalumModules.API.get('/api/data/settings');
        }
    },
    
    // Ações
    actions: {
        async saveSettings(data) {
            return window.IalumModules.API.post('/api/actions/save-settings', data);
        },
        
        async createTopic(data) {
            return window.IalumModules.API.post('/api/actions/create-topic', data);
        },
        
        async updateTopic(id, data) {
            return window.IalumModules.API.put(`/api/actions/update-topic/${id}`, data);
        }
    }
};