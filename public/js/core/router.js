/**
 * router.js
 * Sistema de rotas e navegação SPA
 * Dependências: api.js, utils.js
 * Localização: public/js/core/router.js
 * Tamanho alvo: <200 linhas
 */

// Importar dependências
import { API } from './api.js';
import { Utils } from './utils.js';

// Configuração das rotas
const routes = {
    'dashboard': {
        title: 'Dashboard',
        view: '/app/views/dashboard.html',
        controller: '/js/pages/dashboard/main.js',
        requiresAuth: true
    },
    'topicos': {
        title: 'Central de Tópicos',
        view: '/app/views/topicos.html',
        controller: '/js/pages/topicos/main.js',
        requiresAuth: true
    },
    'configuracoes': {
        title: 'Configurações',
        view: '/app/views/configuracoes.html',
        controller: '/js/pages/configuracoes/main.js',
        requiresAuth: true
    },
    'agendamentos': {
        title: 'Agendamentos',
        view: '/app/views/agendamentos.html',
        controller: '/js/pages/agendamentos/main.js',
        requiresAuth: true
    },
    'banco-imagens': {
        title: 'Banco de Imagens',
        view: '/app/views/banco-imagens.html',
        controller: '/js/pages/banco-imagens/main.js',
        requiresAuth: true
    },
    'relatorios': {
        title: 'Relatórios',
        view: '/app/views/relatorios.html',
        controller: '/js/pages/relatorios/main.js',
        requiresAuth: true
    },
    'financeiro': {
        title: 'Financeiro',
        view: '/app/views/financeiro.html',
        controller: '/js/pages/financeiro/main.js',
        requiresAuth: true
    }
};

// Estado do router
let currentRoute = null;
const loadedControllers = {};
const viewCache = {};

// Inicializar router
export function init() {
    // Escutar mudanças de hash
    window.addEventListener('hashchange', () => handleRoute());
    
    // Escutar cliques em links
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const route = e.target.getAttribute('href').substring(1);
            navigate(route);
        }
    });
    
    // Carregar rota inicial
    handleRoute();
}

// Navegar para rota
export function navigate(route, params = {}) {
    // Guardar parâmetros se existirem
    if (Object.keys(params).length > 0) {
        Utils.storage.set(`route_params_${route}`, params);
    }
    
    window.location.hash = route;
}

// Processar rota atual
async function handleRoute() {
    const hash = window.location.hash.substring(1) || 'dashboard';
    const [route, ...args] = hash.split('/');
    
    // Verificar se rota existe
    if (!routes[route]) {
        console.error(`Rota não encontrada: ${route}`);
        navigate('dashboard');
        return;
    }
    
    const routeConfig = routes[route];
    
    // Verificar autenticação se necessário
    if (routeConfig.requiresAuth) {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
            window.location.href = '/login.html';
            return;
        }
    }
    
    // Atualizar estado
    currentRoute = route;
    
    // Atualizar UI
    updateUI(route, routeConfig);
    
    try {
        // Carregar view
        const html = await loadView(routeConfig.view);
        
        // Inserir no DOM
        const contentElement = document.getElementById('page-content');
        if (contentElement) {
            contentElement.innerHTML = html;
            
            // CORREÇÃO: Forçar o navegador a processar o DOM antes de continuar
            // Isso garante que o HTML esteja totalmente renderizado
            await new Promise(resolve => {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(() => {
                        setTimeout(resolve, 0);
                    });
                } else {
                    setTimeout(resolve, 10);
                }
            });
        }
        
        // Agora sim carregar o controller
        await loadController(route, routeConfig.controller, args);
        
    } catch (error) {
        console.error('Erro ao carregar página:', error);
        showError();
    }
}

// Verificar autenticação
async function checkAuth() {
    console.log('=== VERIFICANDO AUTH ===');
    
    const token = API.getToken();
    console.log('1. Token encontrado:', token);
    
    if (!token) {
        console.log('2. Sem token, redirecionando para login');
        return false;
    }
    
    // Verificar se token ainda é válido
    try {
        const response = await API.auth.verify();
        console.log('3. Resposta do verify:', response);
        return response.valid !== false;
    } catch (error) {
        console.log('4. Erro no verify:', error);
        return false;
    }
}

// Atualizar elementos da UI
function updateUI(route, routeConfig) {
    // Atualizar título da página
    document.title = `${routeConfig.title} - Ialum`;
    
    // Atualizar título no header
    const pageTitleElement = document.querySelector('.page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = routeConfig.title;
    }
    
    // Atualizar menu ativo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${route}`) {
            item.classList.add('active');
        }
    });
}

// Carregar view HTML
async function loadView(viewPath) {
    // Verificar cache
    if (viewCache[viewPath]) {
        return viewCache[viewPath];
    }
    
    // Mostrar loading
    showLoading();
    
    try {
        const response = await fetch(viewPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Guardar no cache
        viewCache[viewPath] = html;
        
        return html;
        
    } catch (error) {
        console.error('Erro ao carregar view:', error);
        throw error;
    }
}

// Carregar controller JavaScript
async function loadController(route, controllerPath, args = []) {
    try {
        // Importar módulo dinamicamente
        const module = await import(controllerPath);
        
        // Guardar referência
        loadedControllers[route] = module;
        
        // Chamar init se existir
        if (module.init && typeof module.init === 'function') {
            await module.init(...args);
        }
        
    } catch (error) {
        console.error('Erro ao carregar controller:', error);
        // Continuar mesmo com erro (view ainda será mostrada)
    }
}

// Mostrar loading
function showLoading() {
    const contentElement = document.getElementById('page-content');
    if (contentElement) {
        contentElement.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
    }
}

// Mostrar erro
function showError() {
    const contentElement = document.getElementById('page-content');
    if (contentElement) {
        contentElement.innerHTML = `
            <div class="error-container">
                <h2>Ops! Algo deu errado</h2>
                <p>Não foi possível carregar esta página.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    Tentar novamente
                </button>
            </div>
        `;
    }
}

// Helpers públicos
export function getParams() {
    return Utils.storage.get(`route_params_${currentRoute}`) || {};
}

export function clearParams() {
    Utils.storage.remove(`route_params_${currentRoute}`);
}

// Exportar objeto Router para compatibilidade
export const Router = {
    init,
    navigate,
    getParams,
    clearParams
};