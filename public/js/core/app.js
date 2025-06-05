/**
 * app.js
 * Inicialização e controle geral da aplicação
 * Documentação: /docs/0_16-sistemas-core.md#app
 * Localização: /js/core/app.js
 * 
 * NOTA: Apenas inicialização. Para DOM use dom.js, para rotas use router.js
 */

// Importar dependências
import { Router } from './router.js';
import { DOM } from './dom.js';
import { showToast } from '../components/notifications.js';

// Estado do app
let isInitialized = false;

// Inicializar aplicação
export function init() {
    if (isInitialized) return;
    
    console.log('Inicializando Ialum App...');
    
    // Inicializar componentes
    initSidebar();
    initMobileMenu();
    initHeader();
    initQuickActions();
    
    // Marcar como inicializado
    isInitialized = true;
    
    console.log('App inicializado com sucesso!');
}

// Sidebar - Gerenciado pelo sidebar.js component
function initSidebar() {
    // Apenas escutar mudanças de rota para atualizar menu ativo
    DOM.on(window, 'hashchange', () => {
        updateActiveMenu();
    });
}

// Atualizar menu ativo baseado na rota atual
function updateActiveMenu() {
    const currentHash = window.location.hash;
    const navItems = DOM.selectAll('.nav-item');
    
    navItems.forEach(item => {
        DOM.removeClass(item, 'active');
        if (item.getAttribute('href') === currentHash) {
            DOM.addClass(item, 'active');
        }
    });
}

// Menu mobile
function initMobileMenu() {
    const menuToggle = DOM.select('#menu-toggle');
    const sidebar = DOM.select('#sidebar');
    
    if (menuToggle && sidebar) {
        DOM.on(menuToggle, 'click', () => {
            DOM.toggleClass(sidebar, 'active');
            DOM.toggleClass(menuToggle, 'active');
        });
        
        // Fechar ao clicar fora
        DOM.on(document, 'click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                DOM.removeClass(sidebar, 'active');
                DOM.removeClass(menuToggle, 'active');
            }
        });
    }
}

// Header components
function initHeader() {
    // AI Agent button
    const aiAgentBtn = DOM.select('#ai-agent-btn');
    if (aiAgentBtn) {
        DOM.on(aiAgentBtn, 'click', () => {
            showToast('🤖 Agente IA em breve!', 'info');
        });
    }
}

// Ações rápidas globais
function initQuickActions() {
    // Funcionalidades globais podem ser adicionadas aqui
}

// Inicializar quando DOM estiver pronto
DOM.ready(() => {
    // Inicializar o Router primeiro
    Router.init();
    
    // Depois inicializar o App
    init();
});