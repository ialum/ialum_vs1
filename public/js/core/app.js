/**
 * app.js
 * Inicialização e controle geral do app
 * Dependências: nenhuma
 * Usado em: app.html
 * Tamanho alvo: <200 linhas
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
        this.checkInitialHash();
    },
    
    // Verificar hash inicial
    checkInitialHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.loadPage(hash);
            this.updateActiveMenu(hash);
        }
    },
    
    // Atualizar menu ativo
    updateActiveMenu(page) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${page}`) {
                item.classList.add('active');
            }
        });
    },
    
    // Sidebar
    initSidebar() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Pegar página do href
                const page = item.getAttribute('href').substring(1);
                
                // Atualizar URL
                window.location.hash = page;
            });
        });
    },
    
    // Navegação
    initNavigation() {
        // Escutar mudanças no hash
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                this.loadPage(hash);
                this.updateActiveMenu(hash);
            }
        });
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
    
    // Carregar página
    async loadPage(page) {
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
        
        // Carregar conteúdo da página
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;
        
        // Limpar conteúdo anterior
        pageContent.innerHTML = '';
        
        try {
            // Tentar buscar template via fetch (quando N8N estiver pronto)
            const templatePath = `/app/templates/pages/${page}.html`;
            
            // Por enquanto, usar templates inline
            if (page === 'dashboard') {
                pageContent.innerHTML = this.getDashboardTemplate();
                // Reinicializar módulo do dashboard
                if (window.IalumModules.Dashboard) {
                    window.IalumModules.Dashboard.init();
                }
            } else if (page === 'configuracoes') {
                pageContent.innerHTML = this.getConfiguracaoesTemplate();
                // Inicializar módulo de configurações
                if (window.IalumModules.Configuracoes) {
                    window.IalumModules.Configuracoes.init();
                }
            } else if (page === 'topicos') {
                pageContent.innerHTML = this.getTopicosTemplate();
                // TODO: Inicializar módulo de tópicos quando criar
            } else {
                pageContent.innerHTML = this.getPlaceholderTemplate(titles[page] || page);
            }
            
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            pageContent.innerHTML = this.getErrorTemplate();
        }
    },
    
    // Template do Dashboard
    getDashboardTemplate() {
        return `
            <div class="dashboard-grid">
                <!-- Créditos -->
                <div class="card card-primary">
                    <div class="card-header">
                        <h3>Saldo de Créditos</h3>
                        <span class="card-icon">💰</span>
                    </div>
                    <div class="card-body">
                        <div class="credit-balance">
                            <span class="credit-number">150</span>
                            <span class="credit-label">créditos disponíveis</span>
                        </div>
                        <div class="credit-usage">
                            <div class="usage-bar">
                                <div class="usage-fill" style="width: 25%"></div>
                            </div>
                            <span class="usage-text">50 de 200 usados este mês</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="#financeiro" class="card-link">Comprar mais créditos →</a>
                    </div>
                </div>
                
                <!-- Posts do Mês -->
                <div class="card">
                    <div class="card-header">
                        <h3>Posts Criados</h3>
                        <span class="card-icon">📝</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-number">24</div>
                        <div class="stat-label">posts este mês</div>
                        <div class="stat-change positive">+20% vs mês anterior</div>
                    </div>
                </div>
                
                <!-- Engajamento -->
                <div class="card">
                    <div class="card-header">
                        <h3>Engajamento Médio</h3>
                        <span class="card-icon">❤️</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-number">4.8%</div>
                        <div class="stat-label">taxa de engajamento</div>
                        <div class="stat-change positive">+0.5% vs mês anterior</div>
                    </div>
                </div>
                
                <!-- Agendados -->
                <div class="card">
                    <div class="card-header">
                        <h3>Agendados</h3>
                        <span class="card-icon">⏰</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-number">8</div>
                        <div class="stat-label">posts agendados</div>
                        <div class="stat-subtitle">Próximos 7 dias</div>
                    </div>
                </div>
            </div>
            
            <!-- Ações Rápidas -->
            <section class="quick-actions">
                <h2>Ações Rápidas</h2>
                <div class="actions-grid">
                    <button class="action-card">
                        <span class="action-icon">💡</span>
                        <span class="action-text">Nova Ideia</span>
                    </button>
                    <button class="action-card">
                        <span class="action-icon">📸</span>
                        <span class="action-text">Upload de Imagem</span>
                    </button>
                    <button class="action-card">
                        <span class="action-icon">📅</span>
                        <span class="action-text">Ver Agenda</span>
                    </button>
                    <button class="action-card">
                        <span class="action-icon">📊</span>
                        <span class="action-text">Relatório Mensal</span>
                    </button>
                </div>
            </section>
            
            <!-- Posts Recentes -->
            <section class="recent-posts">
                <h2>Posts Recentes</h2>
                <div class="posts-list">
                    <div class="post-item">
                        <div class="post-thumb">
                            <span class="post-type">📷</span>
                        </div>
                        <div class="post-info">
                            <h4>Direitos do Consumidor em Compras Online</h4>
                            <p>Instagram Carrossel • Publicado há 2 dias</p>
                        </div>
                        <div class="post-stats">
                            <span>❤️ 145</span>
                            <span>💬 23</span>
                        </div>
                    </div>
                    
                    <div class="post-item">
                        <div class="post-thumb">
                            <span class="post-type">📝</span>
                        </div>
                        <div class="post-info">
                            <h4>Nova Lei de Proteção de Dados</h4>
                            <p>LinkedIn • Agendado para amanhã</p>
                        </div>
                        <div class="post-status">
                            <span class="status-badge scheduled">Agendado</span>
                        </div>
                    </div>
                    
                    <div class="post-item">
                        <div class="post-thumb">
                            <span class="post-type">🎥</span>
                        </div>
                        <div class="post-info">
                            <h4>5 Dicas sobre Contratos Digitais</h4>
                            <p>Instagram Reels • Em rascunho</p>
                        </div>
                        <div class="post-status">
                            <span class="status-badge draft">Rascunho</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    
    // Template de Configurações
    getConfiguracaoesTemplate() {
        // Usar o template do HTML
        const template = document.querySelector('#configuracoes-template');
        if (template) {
            return template.innerHTML;
        }
        
        // Fallback se não encontrar o template
        return `
            <div class="configuracoes-container">
                <p>Carregando configurações...</p>
            </div>
        `;
    },
    
    // Template da Central de Tópicos
    getTopicosTemplate() {
        return `
            <div class="topicos-container">
                <!-- Header com busca e ações -->
                <div class="topicos-header">
                    <div class="search-container">
                        <span class="search-icon">🔍</span>
                        <input type="text" class="search-input" placeholder="Buscar tópicos por título, tema ou assunto...">
                    </div>
                    <button class="btn btn-primary">
                        <span>➕</span> Novo Tópico
                    </button>
                </div>
                
                <!-- Abas de status -->
                <div class="status-tabs">
                    <button class="status-tab active" data-status="all">
                        Todos <span class="count">12</span>
                    </button>
                    <button class="status-tab" data-status="ideia">
                        💡 Ideias <span class="count">3</span>
                    </button>
                    <button class="status-tab" data-status="rascunho">
                        📝 Rascunhos <span class="count">5</span>
                    </button>
                    <button class="status-tab" data-status="embasado">
                        📖 Embasados <span class="count">4</span>
                    </button>
                </div>
                
                <!-- Grid de tópicos -->
                <div class="topicos-grid">
                    <!-- Cards aqui -->
                </div>
            </div>
        `;
    },
    
    // Template de placeholder
    getPlaceholderTemplate(pageName) {
        return `
            <div class="card">
                <div class="card-body" style="text-align: center; padding: 3rem;">
                    <h2>Página ${pageName}</h2>
                    <p style="color: var(--gray-600); margin-top: 1rem;">
                        Esta página ainda está em desenvolvimento.
                    </p>
                </div>
            </div>
        `;
    },
    
    // Template de erro
    getErrorTemplate() {
        return `
            <div class="card">
                <div class="card-body" style="text-align: center; padding: 3rem;">
                    <h2>Ops! Algo deu errado</h2>
                    <p style="color: var(--gray-600); margin-top: 1rem;">
                        Não foi possível carregar esta página.
                    </p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Tentar novamente
                    </button>
                </div>
            </div>
        `;
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.IalumApp.init();
});