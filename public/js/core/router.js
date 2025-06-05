/**
 * router.js
 * Sistema de rotas e navegação SPA
 * Documentação: /docs/0_16-sistemas-core.md#router
 * Localização: /js/core/router.js
 * 
 * NOTA: Focado apenas em navegação. Para DOM use dom.js
 */

// Importar dependências
import { API } from './api.js';
import { Cache } from './cache.js';
import { DOM } from './dom.js';
import { Loader } from './loader.js';

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
    'embasamentos': {
        title: 'Embasamentos',
        view: '/app/views/embasamentos.html',
        controller: '/js/pages/embasamentos/main.js',
        requiresAuth: true
    },
    'publicacoes': {
        title: 'Publicações',
        view: '/app/views/publicacoes.html',
        controller: '/js/pages/publicacoes/main.js',
        requiresAuth: true
    },
    'redacao-instagram': {
        title: 'Redação Instagram',
        view: '/app/views/redacao-instagram.html',
        controller: '/js/pages/redacao-instagram/main.js',
        requiresAuth: true
    },
    'agendamentos': {
        title: 'Agendamentos',
        view: '/app/views/agendamentos.html',
        controller: '/js/pages/agendamentos/main.js',
        requiresAuth: true
    },
    'relatorios': {
        title: 'Relatórios',
        view: '/app/views/relatorios.html',
        controller: '/js/pages/relatorios/main.js',
        requiresAuth: true
    },
    'configuracoes-banca': {
        title: 'Configurações - Banca',
        view: '/app/views/configuracoes-banca.html',
        controller: '/js/pages/configuracoes-banca/main.js',
        requiresAuth: true
    },
    'configuracoes-banco-imagens': {
        title: 'Configurações - Banco de Imagens',
        view: '/app/views/configuracoes-banco-imagens.html',
        controller: '/js/pages/configuracoes-banco-imagens/main.js',
        requiresAuth: true
    },
    'configuracoes-templates': {
        title: 'Configurações - Templates',
        view: '/app/views/configuracoes-templates.html',
        controller: '/js/pages/configuracoes-templates/main.js',
        requiresAuth: true
    },
    'configuracoes-integracoes': {
        title: 'Configurações - Integrações',
        view: '/app/views/configuracoes-integracoes.html',
        controller: '/js/pages/configuracoes-integracoes/main.js',
        requiresAuth: true
    },
    'configuracoes-sistema': {
        title: 'Configurações - Sistema',
        view: '/app/views/configuracoes-sistema.html',
        controller: '/js/pages/configuracoes-sistema/main.js',
        requiresAuth: true
    },
    'ajuda': {
        title: 'Ajuda',
        view: '/app/views/ajuda.html',
        controller: '/js/pages/ajuda/main.js',
        requiresAuth: true
    },
    'conta-usuarios': {
        title: 'Conta - Usuários',
        view: '/app/views/conta-usuarios.html',
        controller: '/js/pages/conta-usuarios/main.js',
        requiresAuth: true
    },
    'conta-financeiro': {
        title: 'Conta - Financeiro',
        view: '/app/views/conta-financeiro.html',
        controller: '/js/pages/conta-financeiro/main.js',
        requiresAuth: true
    },
    'conta-parcerias': {
        title: 'Conta - Parcerias',
        view: '/app/views/conta-parcerias.html',
        controller: '/js/pages/conta-parcerias/main.js',
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
        Cache.set(`route_params_${route}`, params, 5); // 5 minutos
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
        const contentElement = DOM.select('#page-content');
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
        Loader.showError('Não foi possível carregar esta página');
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
    
    // Atualizar menu ativo
    DOM.selectAll('.nav-item').forEach(item => {
        DOM.removeClass(item, 'active');
        if (item.getAttribute('href') === `#${route}`) {
            DOM.addClass(item, 'active');
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
    Loader.show();
    
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

// Helpers públicos
export function getParams() {
    return Cache.get(`route_params_${currentRoute}`) || {};
}

export function clearParams() {
    Cache.remove(`route_params_${currentRoute}`);
}

// Exportar objeto Router para compatibilidade
export const Router = {
    init,
    navigate,
    getParams,
    clearParams
};