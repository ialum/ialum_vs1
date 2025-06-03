/**
 * app.js
 * Inicialização e controle geral do app
 * Dependências: router.js, notifications.js
 * Usado em: app.html
 * Tamanho alvo: <150 linhas
 */

// Importar dependências
import { Router } from './router.js';
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

// Sidebar
function initSidebar() {
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
        updateActiveMenu();
    });
}

// Atualizar menu ativo baseado na rota atual
function updateActiveMenu() {
    const currentHash = window.location.hash;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentHash) {
            item.classList.add('active');
        }
    });
}

// Menu mobile
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// Header components
function initHeader() {
    // AI Agent button
    const aiAgentBtn = document.getElementById('ai-agent-btn');
    if (aiAgentBtn) {
        aiAgentBtn.addEventListener('click', () => {
            showToast('🤖 Agente IA em breve!', 'info');
        });
    }
}

// Ações rápidas globais
function initQuickActions() {
    // Botão de novo tópico no header
    const btnNovoTopico = document.querySelector('.top-actions .btn-primary');
    if (btnNovoTopico) {
        btnNovoTopico.addEventListener('click', () => {
            // Navegar para tópicos com parâmetro para abrir modal de criação
            Router.navigate('topicos', { action: 'new' });
        });
    }
}

// Helpers públicos
export function showLoading(show = true) {
    const pageContent = document.getElementById('page-content');
    if (pageContent && show) {
        pageContent.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
    }
}

export function showError(message = 'Algo deu errado') {
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

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o Router primeiro
    Router.init();
    
    // Depois inicializar o App
    init();
})
;