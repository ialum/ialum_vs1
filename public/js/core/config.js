/**
 * config.js
 * Configurações centralizadas do sistema
 * Localização: public/js/core/config.js
 * Tamanho alvo: <50 linhas
 */

window.IalumConfig = {
    // Ambiente atual
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    
    // URLs dos webhooks
    api: {
        auth: 'https://webhook.ialum.com.br/webhook/api-auth',
        data: 'https://webhook.ialum.com.br/webhook/api-data',
        actions: 'https://webhook.ialum.com.br/webhook/api-actions'
    },
    
    // Configurações gerais
    app: {
        name: 'Ialum',
        version: '1.0.0',
        defaultTimeout: 30000
    }
};