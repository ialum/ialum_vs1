/**
 * sidebar.js
 * Controle do menu lateral
 * Dependências: router.js
 * Localização: public/js/components/sidebar.js
 * Tamanho alvo: <150 linhas
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
const navItems = document.querySelectorAll('.nav-item');
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
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    const href = item.getAttribute('href');
    
    if (href === currentHash) {
        item.classList.add('active');
    } else {
        item.classList.remove('active');
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
// Exportar objeto Sidebar
export const Sidebar = {
init,
toggleMenuItem,
addBadge,
updateUserInfo,
toggleMobileMenu,
closeMobileMenu
};
