/**
 * router.js
 * Sistema de rotas e navegação SPA
 * Dependências: api.js, utils.js
 * Localização: public/js/core/router.js
 * Tamanho alvo: <200 linhas
 */

window.IalumModules = window.IalumModules || {};
window.IalumModules.Router = {
    
    // Configuração das rotas
    routes: {
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
    },
    
    // Estado atual
    currentRoute: null,
    loadedControllers: {},
    viewCache: {},
    
    // Inicializar router
    init() {
        // Escutar mudanças de hash
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Escutar cliques em links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const route = e.target.getAttribute('href').substring(1);
                this.navigate(route);
            }
        });
        
        // Carregar rota inicial
        this.handleRoute();
    },
    
    // Navegar para rota
    navigate(route, params = {}) {
        // Guardar parâmetros se existirem
        if (Object.keys(params).length > 0) {
            window.IalumModules.Utils.storage.set(`route_params_${route}`, params);
        }
        
        window.location.hash = route;
    },
    
    // Processar rota atual
    async handleRoute() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        const [route, ...args] = hash.split('/');
        
        // Verificar se rota existe
        if (!this.routes[route]) {
            console.error(`Rota não encontrada: ${route}`);
            this.navigate('dashboard');
            return;
        }
        
        const routeConfig = this.routes[route];
        
        // Verificar autenticação se necessário
        if (routeConfig.requiresAuth) {
            const isAuthenticated = await this.checkAuth();
            if (!isAuthenticated) {
                window.location.href = '/login.html';
                return;
            }
        }
        
        // Atualizar estado
        this.currentRoute = route;
        
        // Atualizar UI
        this.updateUI(route, routeConfig);
        
        try {
            // Carregar view
            const html = await this.loadView(routeConfig.view);
            
            // Inserir no DOM
            const contentElement = document.getElementById('page-content');
            if (contentElement) {
                contentElement.innerHTML = html;
            }
            
            // Carregar controller
            await this.loadController(route, routeConfig.controller, args);
            
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.showError();
        }
    },
    
    // Verificar autenticação
    async checkAuth() {
        const token = window.IalumModules.API.getToken();
        if (!token) return false;
        
        // Verificar se token ainda é válido
        const response = await window.IalumModules.API.auth.verify();
        return response.valid !== false;
    },
    
    // Atualizar elementos da UI
    updateUI(route, routeConfig) {
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
    },
    
    // Carregar view HTML
    async loadView(viewPath) {
        // Verificar cache
        if (this.viewCache[viewPath]) {
            return this.viewCache[viewPath];
        }
        
        // Mostrar loading
        this.showLoading();
        
        try {
            const response = await fetch(viewPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Guardar no cache
            this.viewCache[viewPath] = html;
            
            return html;
            
        } catch (error) {
            console.error('Erro ao carregar view:', error);
            throw error;
        }
    },
    
    // Carregar controller JavaScript
    async loadController(route, controllerPath, args = []) {
        try {
            // Importar módulo dinamicamente
            const module = await import(controllerPath);
            
            // Guardar referência
            this.loadedControllers[route] = module;
            
            // Chamar init se existir
            if (module.init && typeof module.init === 'function') {
                await module.init(...args);
            }
            
        } catch (error) {
            console.error('Erro ao carregar controller:', error);
            // Continuar mesmo com erro (view ainda será mostrada)
        }
    },
    
    // Mostrar loading
    showLoading() {
        const contentElement = document.getElementById('page-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>Carregando...</p>
                </div>
            `;
        }
    },
    
    // Mostrar erro
    showError() {
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
    },
    
    // Helpers
    getParams() {
        const route = this.currentRoute;
        return window.IalumModules.Utils.storage.get(`route_params_${route}`) || {};
    },
    
    clearParams() {
        const route = this.currentRoute;
        window.IalumModules.Utils.storage.remove(`route_params_${route}`);
    }
};