/**
 * app.js
 * Inicialização e controle geral do app
 * Dependências: nenhuma
 * Usado em: app.html
 * Tamanho alvo: <100 linhas
 */

// Módulo principal do app
window.IalumApp = {
    // Estado atual
    currentPage: 'dashboard',
    
    // Inicializar
    init() {
        this.initSidebar();
        this.initNavigation();
        this.initMobileMenu();
    },
    
    // Sidebar
    initSidebar() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remover active de todos
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Adicionar active no clicado
                item.classList.add('active');
                
                // Pegar página do href
                const page = item.getAttribute('href').substring(1);
                this.loadPage(page);
            });
        });
    },
    
    // Navegação
    initNavigation() {
        // Por enquanto, apenas log
        console.log('Sistema de navegação iniciado');
    },
    
    // Menu mobile
    initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle) {
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
    
    // Carregar página (simulado por enquanto)
    loadPage(page) {
        console.log(`Carregando página: ${page}`);
        
        // Atualizar título
        const pageTitle = document.querySelector('.page-title');
        const titles = {
            'dashboard': 'Dashboard',
            'topicos': 'Central de Tópicos',
            'agendamentos': 'Agendamentos',
            'banco-imagens': 'Banco de Imagens',
            'relatorios': 'Relatórios',
            'configuracoes': 'Configurações',
            'financeiro': 'Financeiro'
        };
        
        if (pageTitle && titles[page]) {
            pageTitle.textContent = titles[page];
        }
        
        this.currentPage = page;
        
        // TODO: Carregar conteúdo real da página
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.IalumApp.init();
});