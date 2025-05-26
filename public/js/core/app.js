/**
 * app.js
 * Inicialização e controle geral do app
 * Dependências: router.js, notifications.js, sidebar.js
 * Usado em: app.html
 * Tamanho alvo: <150 linhas
 */

// Módulo principal do app
window.IalumApp = {
    // Estado atual
    isInitialized: false,
    
    // Inicializar
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializando Ialum App...');
        
        // Inicializar componentes
        this.initSidebar();
        this.initMobileMenu();
        this.initNotifications();
        this.initQuickActions();
        
        // Marcar como inicializado
        this.isInitialized = true;
        
        console.log('App inicializado com sucesso!');
    },
    
    // Sidebar
    initSidebar() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Não fazer nada se for link externo
                if (item.getAttribute('href').startsWith('http')) return;
                
                // Para links internos, prevenir default (router cuidará disso)
                if (item.getAttribute('href').startsWith('#')) {
                    // Router já está escutando cliques em links com #
                    // Apenas atualizar visual se necessário
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
        
        // Escutar mudanças de rota para atualizar menu ativo
        window.addEventListener('hashchange', () => {
            this.updateActiveMenu();
        });
    },
    
    // Atualizar menu ativo baseado na rota atual
    updateActiveMenu() {
        const currentHash = window.location.hash;
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentHash) {
                item.classList.add('active');
            }
        });
    },
    
    // Menu mobile
    initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
            
            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    },
    
    // Sistema de notificações
    initNotifications() {
        // Delegado para o módulo de notificações
        if (window.IalumModules.Notifications) {
            window.IalumModules.Notifications.init();
        }
    },
    
    // Ações rápidas globais
    initQuickActions() {
        // Botão de novo tópico no header
        const btnNovoTopico = document.querySelector('.top-actions .btn-primary');
        if (btnNovoTopico) {
            btnNovoTopico.addEventListener('click', () => {
                // Navegar para tópicos com parâmetro para abrir modal de criação
                if (window.IalumModules.Router) {
                    window.IalumModules.Router.navigate('topicos', { action: 'new' });
                }
            });
        }
    },
    
    // Helpers públicos
    showLoading(show = true) {
        const pageContent = document.getElementById('page-content');
        if (pageContent && show) {
            pageContent.innerHTML = `
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>Carregando...</p>
                </div>
            `;
        }
    },
    
    showError(message = 'Algo deu errado') {
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="error-container">
                    <h2>Ops!</h2>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Tentar novamente
                    </button>
                </div>
            `;
        }
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o Router primeiro
    if (window.IalumModules.Router) {
        window.IalumModules.Router.init();
    }
    
    // Depois inicializar o App
    window.IalumApp.init();
});