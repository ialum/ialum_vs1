/**
 * sidebar.js
 * Controle do menu lateral da aplicação Ialum
 * Estrutura baseada na documentação 0_1-paginas.md
 * Dependências: router.js
 * Localização: public/js/components/sidebar.js
 * Tamanho alvo: <200 linhas
 */
import { Router } from '../core/router.js';
// Estado do sidebar
let isInitialized = false;
let isMobileMenuOpen = false;
// Inicializar sidebar
export function init() {
if (isInitialized) return;

// Inicializar estado dos submenus (todos fechados)
initializeSubmenus();

bindNavigation();
bindMobileToggle();
updateActiveState();

// Escutar mudanças de rota
window.addEventListener('hashchange', updateActiveState);

isInitialized = true;
}

// Inicializar submenus no estado fechado
function initializeSubmenus() {
const submenus = document.querySelectorAll('.nav-submenu');
submenus.forEach(submenu => {
    submenu.style.maxHeight = '0';
    submenu.style.overflow = 'hidden';
});

const arrows = document.querySelectorAll('.nav-arrow');
arrows.forEach(arrow => {
    arrow.style.transform = 'rotate(0deg)';
});
}
// Bind da navegação
function bindNavigation() {
const navLinks = document.querySelectorAll('.nav-link, .nav-subitem');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Ignorar links externos e javascript:void(0)
        if (!href || href.startsWith('http') || href === 'javascript:void(0)') return;
        
        // Para links internos com #
        if (href.startsWith('#')) {
            e.preventDefault();
            
            // Fechar menu mobile se estiver aberto
            if (isMobileMenuOpen) {
                closeMobileMenu();
            }
            
            // Navegar usando o router
            const route = href.substring(1);
            Router.navigate(route);
        }
    });
});

// Bind dos toggles de submenu
const submenuToggles = document.querySelectorAll('.nav-item-submenu > .nav-link');
submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const parent = toggle.closest('.nav-item-submenu');
        const submenu = parent.querySelector('.nav-submenu');
        const arrow = toggle.querySelector('.nav-arrow');
        
        // Verificar se está expandido
        const isExpanded = parent.classList.contains('expanded');
        
        // Fechar todos os outros submenus primeiro
        closeAllSubmenus(parent);
        
        // Toggle do submenu atual
        parent.classList.toggle('expanded');
        
        if (submenu) {
            if (isExpanded) {
                submenu.style.maxHeight = '0';
                arrow.style.transform = 'rotate(0deg)';
            } else {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
                arrow.style.transform = 'rotate(90deg)';
            }
        }
    });
});
}
// Controle do menu mobile
function bindMobileToggle() {
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobile-overlay');
if (!menuToggle || !sidebar) return;

// Toggle do menu
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
});

// Fechar ao clicar no overlay
overlay?.addEventListener('click', () => {
    closeMobileMenu();
});

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
    if (isMobileMenuOpen && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        closeMobileMenu();
    }
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
    }
});
}
// Toggle menu mobile
function toggleMobileMenu() {
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('mobile-overlay');
if (!sidebar) return;

isMobileMenuOpen = !isMobileMenuOpen;

if (isMobileMenuOpen) {
    sidebar.classList.add('active');
    menuToggle?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
} else {
    sidebar.classList.remove('active');
    menuToggle?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
}
}
// Fechar menu mobile
function closeMobileMenu() {
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('mobile-overlay');
sidebar?.classList.remove('active');
menuToggle?.classList.remove('active');
overlay?.classList.remove('active');
document.body.style.overflow = '';
isMobileMenuOpen = false;
}
// Atualizar estado ativo do menu
function updateActiveState() {
const currentHash = window.location.hash || '#dashboard';
const navLinks = document.querySelectorAll('.nav-link, .nav-subitem');

// Remover estado ativo de todos
navLinks.forEach(link => {
    link.classList.remove('active');
});

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Marcar item ativo exato
    if (href === currentHash) {
        link.classList.add('active');
        
        // Se for um subitem, expandir o menu pai
        const parentSubmenu = link.closest('.nav-item-submenu');
        if (parentSubmenu && link.classList.contains('nav-subitem')) {
            expandSubmenuByParent(parentSubmenu);
        }
    }
    
    // Para itens com submenu, marcar como ativo se a rota começar com o prefixo
    if (link.classList.contains('nav-link') && link.closest('.nav-item-submenu')) {
        const submenuParent = link.closest('.nav-item-submenu');
        const hasActiveChild = submenuParent.querySelector('.nav-subitem.active');
        
        if (hasActiveChild || 
            (currentHash.startsWith('#redacao') && link.textContent.includes('Redação')) ||
            (currentHash.startsWith('#configuracoes') && link.textContent.includes('Configurações')) ||
            (currentHash.startsWith('#conta') && link.textContent.includes('Conta'))) {
            link.classList.add('active');
            expandSubmenuByParent(submenuParent);
        }
    }
});
}

// Expandir submenu por elemento pai
function expandSubmenuByParent(parent) {
if (!parent) return;

const submenu = parent.querySelector('.nav-submenu');
const arrow = parent.querySelector('.nav-arrow');

if (submenu && !parent.classList.contains('expanded')) {
    // Fechar todos os outros submenus primeiro
    closeAllSubmenus(parent);
    
    parent.classList.add('expanded');
    submenu.style.maxHeight = submenu.scrollHeight + 'px';
    if (arrow) arrow.style.transform = 'rotate(90deg)';
}
}

// Fechar todos os submenus exceto o atual
function closeAllSubmenus(exceptParent = null) {
const allSubmenus = document.querySelectorAll('.nav-item-submenu');
allSubmenus.forEach(submenuParent => {
    if (submenuParent !== exceptParent && submenuParent.classList.contains('expanded')) {
        const submenu = submenuParent.querySelector('.nav-submenu');
        const arrow = submenuParent.querySelector('.nav-arrow');
        
        submenuParent.classList.remove('expanded');
        if (submenu) submenu.style.maxHeight = '0';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
});
}
// Mostrar/esconder item do menu
export function toggleMenuItem(selector, show = true) {
const item = document.querySelector(selector);
if (item) {
item.style.display = show ? '' : 'none';
}
}
// Adicionar badge a um item do menu
export function addBadge(selector, count, type = 'primary') {
const item = document.querySelector(selector);
if (!item) return;
// Remover badge existente
const existingBadge = item.querySelector('.nav-badge');
if (existingBadge) {
    existingBadge.remove();
}

// Adicionar novo badge se count > 0
if (count > 0) {
    const badge = document.createElement('span');
    badge.className = `nav-badge nav-badge--${type}`;
    badge.textContent = count > 99 ? '99+' : count;
    item.appendChild(badge);
}
}
// Atualizar informações do usuário
export function updateUserInfo(user) {
const userName = document.querySelector('.user-name');
const userEmail = document.querySelector('.user-email');
if (userName && user.name) {
    userName.textContent = user.name;
}

if (userEmail && user.email) {
    userEmail.textContent = user.email;
}
}
// Controlar visibilidade de submenus
export function toggleSubmenu(parentSelector, show = true) {
const parent = document.querySelector(parentSelector);
if (!parent) return;

const submenu = parent.querySelector('.nav-submenu');
if (submenu) {
    submenu.style.display = show ? 'block' : 'none';
    parent.classList.toggle('has-submenu-open', show);
}
}

// Expandir/contrair submenu
export function expandSubmenu(parentSelector) {
const parent = document.querySelector(parentSelector);
if (!parent) return;

const submenu = parent.querySelector('.nav-submenu');
const isExpanded = parent.classList.contains('expanded');

if (submenu) {
    parent.classList.toggle('expanded', !isExpanded);
    submenu.style.maxHeight = isExpanded ? '0' : submenu.scrollHeight + 'px';
}
}

// Controlar estado de integração
export function updateIntegrationStatus(network, isActive) {
const item = document.querySelector(`[data-network="${network}"]`);
if (item) {
    item.classList.toggle('integration-active', isActive);
    item.classList.toggle('integration-inactive', !isActive);
}
}

// Exportar objeto Sidebar
export const Sidebar = {
init,
toggleMenuItem,
addBadge,
updateUserInfo,
toggleMobileMenu,
closeMobileMenu,
toggleSubmenu,
expandSubmenu,
updateIntegrationStatus
};
