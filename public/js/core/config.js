/**
 * config.js
 * Configurações centralizadas do sistema
 * Localização: public/js/core/config.js
 * Tamanho alvo: <50 linhas
 */

// Configuração do ambiente
const environment = window.location.hostname === 'localhost' ? 'development' : 'production';

// URLs dos webhooks
const api = {
    auth: 'https://webhook.ialum.com.br/webhook/api-auth',
    data: 'https://webhook.ialum.com.br/webhook/api-data',
    actions: 'https://webhook.ialum.com.br/webhook/api-actions'
};

// Configurações gerais da aplicação
const app = {
    name: 'Ialum',
    version: '1.0.0',
    defaultTimeout: 30000
};

// Exportar configuração
export const Config = {
    environment,
    api,
    app
};

// Exportar também individualmente para conveniência
export { environment, api, app };