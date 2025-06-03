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
bindNavigation();
bindMobileToggle();
updateActiveState();

// Escutar mudanças de rota
window.addEventListener('hashchange', updateActiveState);

isInitialized = true;
}
// Bind da navegação
function bindNavigation() {
const navItems = document.querySelectorAll('.nav-item a, .nav-subitem');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        
        // Ignorar links externos
        if (!href || href.startsWith('http')) return;
        
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
        const href = toggle.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const parent = toggle.closest('.nav-item-submenu');
            const submenu = parent.querySelector('.nav-submenu');
            const arrow = toggle.querySelector('.nav-arrow');
            
            // Toggle submenu
            const isExpanded = parent.classList.contains('expanded');
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
        }
    });
});
}
// Controle do menu mobile
function bindMobileToggle() {
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
if (!menuToggle || !sidebar) return;

// Toggle do menu
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
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
if (!sidebar) return;

isMobileMenuOpen = !isMobileMenuOpen;

if (isMobileMenuOpen) {
    sidebar.classList.add('active');
    menuToggle?.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
} else {
    sidebar.classList.remove('active');
    menuToggle?.classList.remove('active');
    document.body.style.overflow = '';
}
}
// Fechar menu mobile
function closeMobileMenu() {
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
sidebar?.classList.remove('active');
menuToggle?.classList.remove('active');
document.body.style.overflow = '';
isMobileMenuOpen = false;
}
// Atualizar estado ativo do menu
function updateActiveState() {
const currentHash = window.location.hash || '#dashboard';
const navItems = document.querySelectorAll('.nav-item a, .nav-subitem');

// Remover estado ativo de todos
navItems.forEach(item => {
    item.classList.remove('active');
    const parent = item.closest('.nav-item, .nav-item-submenu');
    if (parent) parent.classList.remove('active');
});

navItems.forEach(item => {
    const href = item.getAttribute('href');
    
    // Marcar item ativo exato
    if (href === currentHash) {
        item.classList.add('active');
        
        // Se for um subitem, marcar o pai também
        const parent = item.closest('.nav-item-submenu');
        if (parent) {
            parent.classList.add('active');
            const parentLink = parent.querySelector('.nav-link');
            if (parentLink) parentLink.classList.add('active');
            
            // Expandir submenu automaticamente
            expandSubmenuByParent(parent);
        }
    }
    
    // Casos especiais para subrotas
    if (currentHash.startsWith('#redacao') && href === '#redacao') {
        item.classList.add('active');
        const parent = item.closest('.nav-item-submenu');
        if (parent) expandSubmenuByParent(parent);
    }
    
    if (currentHash.startsWith('#configuracoes') && href === '#configuracoes') {
        item.classList.add('active');
        const parent = item.closest('.nav-item-submenu');
        if (parent) expandSubmenuByParent(parent);
    }
    
    if (currentHash.startsWith('#conta') && href === '#conta') {
        item.classList.add('active');
        const parent = item.closest('.nav-item-submenu');
        if (parent) expandSubmenuByParent(parent);
    }
});
}

// Expandir submenu por elemento pai
function expandSubmenuByParent(parent) {
if (!parent) return;

const submenu = parent.querySelector('.nav-submenu');
const arrow = parent.querySelector('.nav-arrow');

if (submenu && !parent.classList.contains('expanded')) {
    parent.classList.add('expanded');
    submenu.style.maxHeight = submenu.scrollHeight + 'px';
    if (arrow) arrow.style.transform = 'rotate(90deg)';
}
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
