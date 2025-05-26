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
        this.checkInitialHash();
    },
    
    // Verificar hash inicial
    checkInitialHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.loadPage(hash);
            // Marcar item do menu como ativo
            const navItem = document.querySelector(`a[href="#${hash}"]`);
            if (navItem) {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                navItem.classList.add('active');
            }
        }
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
        // Escutar mudanças no hash
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                this.loadPage(hash);
            }
        });
        
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
        
        // Por enquanto, vamos simular o conteúdo inline
        // TODO: Quando N8N estiver pronto, buscar de /api/templates/${page}
        
        if (page === 'configuracoes') {
            pageContent.innerHTML = this.getConfiguracaoesTemplate();
            
            // Carregar JS da página se existir
            if (window.IalumModules.Configuracoes) {
                window.IalumModules.Configuracoes.init();
            }
        } else if (page === 'topicos') {
            pageContent.innerHTML = this.getTopicosTemplate();
            
            // TODO: Carregar JS dos tópicos quando criar
        } else {
            pageContent.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h2>Página ${titles[page] || page}</h2>
                        <p>Esta página ainda está em desenvolvimento.</p>
                    </div>
                </div>
            `;
        }
    },
    
    // Template temporário das configurações (até N8N estar pronto)
    getConfiguracaoesTemplate() {
        return `
            <div class="configuracoes-container">
                <!-- Abas de navegação -->
                <div class="tabs-nav">
                    <button class="tab-btn active" data-tab="conta">
                        <span class="tab-icon">👤</span>
                        <span class="tab-text">Conta</span>
                    </button>
                    <button class="tab-btn" data-tab="banca">
                        <span class="tab-icon">⚖️</span>
                        <span class="tab-text">Banca</span>
                    </button>
                    <button class="tab-btn" data-tab="integracoes">
                        <span class="tab-icon">🔗</span>
                        <span class="tab-text">Integrações</span>
                    </button>
                    <button class="tab-btn" data-tab="publicador">
                        <span class="tab-icon">📅</span>
                        <span class="tab-text">Publicador</span>
                    </button>
                    <button class="tab-btn" data-tab="banco-imagens">
                        <span class="tab-icon">🖼️</span>
                        <span class="tab-text">Banco de Imagens</span>
                    </button>
                </div>

                <!-- Conteúdo das abas -->
                <div class="tabs-content">
                    <!-- Aba Conta -->
                    <div class="tab-pane active" id="tab-conta">
                        <div class="config-section">
                            <h3>Informações Pessoais</h3>
                            <form class="config-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Nome Completo</label>
                                        <input type="text" class="form-input" value="Dr. João Silva" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">OAB</label>
                                        <input type="text" class="form-input" value="123456/SP" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-input" value="joao@advocacia.com" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Telefone</label>
                                        <input type="tel" class="form-input" value="(11) 98765-4321">
                                    </div>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Outras abas... -->
                    <div class="tab-pane" id="tab-banca">
                        <div class="config-section">
                            <h3>Áreas de Atuação</h3>
                            <p>Configurações da banca em desenvolvimento...</p>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="tab-integracoes">
                        <div class="config-section">
                            <h3>Redes Sociais Conectadas</h3>
                            
                            <div class="integrations-list">
                                <div class="integration-item connected">
                                    <div class="integration-info">
                                        <span class="integration-icon">📷</span>
                                        <div class="integration-details">
                                            <h4>Instagram</h4>
                                            <p>@silva.advocacia - Conectado</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-ghost btn-sm">Desconectar</button>
                                </div>
                                
                                <div class="integration-item">
                                    <div class="integration-info">
                                        <span class="integration-icon">💼</span>
                                        <div class="integration-details">
                                            <h4>LinkedIn</h4>
                                            <p>Não conectado</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary btn-sm">Conectar</button>
                                </div>
                                
                                <div class="integration-item">
                                    <div class="integration-info">
                                        <span class="integration-icon">📘</span>
                                        <div class="integration-details">
                                            <h4>Facebook</h4>
                                            <p>Não conectado</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary btn-sm">Conectar</button>
                                </div>
                                
                                <div class="integration-item">
                                    <div class="integration-info">
                                        <span class="integration-icon">🎵</span>
                                        <div class="integration-details">
                                            <h4>TikTok</h4>
                                            <p>Não conectado</p>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary btn-sm">Conectar</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="config-section">
                            <h3>Configurações de Publicação</h3>
                            <form class="config-form">
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked>
                                        <span>Publicar automaticamente após aprovação</span>
                                    </label>
                                </div>
                                
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked>
                                        <span>Notificar quando post for publicado</span>
                                    </label>
                                </div>
                                
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox">
                                        <span>Permitir comentários automaticamente</span>
                                    </label>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">Salvar Configurações</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="tab-publicador">
                        <div class="config-section">
                            <h3>Horários de Publicação</h3>
                            <p>Configurações do publicador em desenvolvimento...</p>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="tab-banco-imagens">
                        <div class="config-section">
                            <h3>Banco de Imagens</h3>
                            <p>Upload de imagens em desenvolvimento...</p>
                        </div>
                    </div>
                </div>
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
                    <!-- Card de tópico embasado -->
                    <div class="topico-card">
                        <div class="topico-header">
                            <span class="topico-status embasado">📖 Embasado</span>
                            <button class="topico-menu">⋮</button>
                        </div>
                        
                        <h3 class="topico-title">Direitos do Consumidor em Compras Online</h3>
                        
                        <div class="topico-meta">
                            <span class="topico-theme">🛒 Direito do Consumidor</span>
                            <span class="topico-date">Há 2 dias</span>
                        </div>
                        
                        <div class="topico-publications">
                            <div class="publication-mini">
                                <span class="pub-icon">📷</span>
                                <span class="pub-status published">Publicado</span>
                            </div>
                            <div class="publication-mini">
                                <span class="pub-icon">💼</span>
                                <span class="pub-status scheduled">Agendado</span>
                            </div>
                        </div>
                        
                        <div class="topico-actions">
                            <button class="btn btn-ghost btn-sm">Gerenciar</button>
                            <button class="btn btn-ghost btn-sm">Duplicar</button>
                        </div>
                    </div>
                    
                    <!-- Card ideia -->
                    <div class="topico-card">
                        <div class="topico-header">
                            <span class="topico-status ideia">💡 Ideia</span>
                            <button class="topico-menu">⋮</button>
                        </div>
                        
                        <h3 class="topico-title">Nova Lei de Proteção de Dados</h3>
                        
                        <div class="topico-meta">
                            <span class="topico-theme">🔒 Direito Digital</span>
                            <span class="topico-date">Hoje</span>
                        </div>
                        
                        <div class="topico-empty">
                            <p>Adicione pesquisas para desenvolver esta ideia</p>
                        </div>
                        
                        <div class="topico-actions">
                            <button class="btn btn-primary btn-sm">Desenvolver</button>
                        </div>
                    </div>
                    
                    <!-- Card rascunho com badge Ialum -->
                    <div class="topico-card">
                        <div class="topico-header">
                            <span class="topico-status rascunho">📝 Rascunho</span>
                            <span class="topico-badge ialum">✨ Criado por Ialum</span>
                            <button class="topico-menu">⋮</button>
                        </div>
                        
                        <h3 class="topico-title">Direitos Trabalhistas: Home Office</h3>
                        
                        <div class="topico-meta">
                            <span class="topico-theme">💼 Direito Trabalhista</span>
                            <span class="topico-date">Há 3 dias</span>
                        </div>
                        
                        <div class="topico-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 60%"></div>
                            </div>
                            <span class="progress-text">Falta embasamento jurídico</span>
                        </div>
                        
                        <div class="topico-actions">
                            <button class="btn btn-primary btn-sm">Continuar</button>
                            <button class="btn btn-ghost btn-sm">Duplicar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.IalumApp.init();
});