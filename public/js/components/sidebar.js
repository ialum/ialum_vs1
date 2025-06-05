/**
 * sidebar.js
 * Controle do menu lateral da aplicação Ialum
 * Estrutura baseada na documentação 0_1-paginas.md
 * Dependências: router.js, DOM, State, UI, Cache
 * Localização: public/js/components/sidebar.js
 * Tamanho alvo: <200 linhas
 */
import { Router } from '../core/router.js';
import { DOM } from '../core/dom.js';
import { State } from '../core/state.js';
import { UI } from '../core/ui.js';
import { Cache } from '../core/cache.js';
// Estado do sidebar
let isInitialized = false;
// Inicializar sidebar
export function init() {
    if (isInitialized) return;
    
    DOM.ready(() => {
        // Inicializar estado dos submenus (todos fechados)
        initializeSubmenus();
        
        bindNavigation();
        bindMobileToggle();
        updateActiveState();
        
        // Escutar mudanças de rota
        DOM.on(window, 'hashchange', updateActiveState);
        
        // Restaurar estado dos submenus do cache
        const expandedMenus = Cache.get('sidebar.expanded') || [];
        expandedMenus.forEach(selector => expandSubmenu(selector));
    });
    
    isInitialized = true;
}

// Inicializar submenus no estado fechado
function initializeSubmenus() {
    const submenus = DOM.selectAll('.nav-submenu');
    submenus.forEach(submenu => {
        submenu.style.maxHeight = '0';
        submenu.style.overflow = 'hidden';
    });
    
    const arrows = DOM.selectAll('.nav-arrow');
    arrows.forEach(arrow => {
        arrow.style.transform = 'rotate(0deg)';
    });
}
// Bind da navegação
function bindNavigation() {
    // Event delegation unificado para todos os cliques em links do sidebar
    DOM.delegate(document, 'click', '.nav-link, .nav-subitem', (e, element) => {
        const href = element.getAttribute('href');
        
        // Ignorar links externos ou sem href
        if (!href || href.startsWith('http')) return;
        
        if (href === 'javascript:void(0)') {
            // É um toggle de submenu
            console.log('🔧 Submenu toggle clicked:', element);
            e.preventDefault();
            e.stopPropagation();
            handleSubmenuToggle(element);
        } else if (href.startsWith('#')) {
            // É navegação normal
            e.preventDefault();
            
            // Fechar menu mobile se estiver aberto
            if (State.get('sidebar.mobileOpen')) {
                closeMobileMenu();
            }
            
            // Navegar usando o router
            const route = href.substring(1);
            Router.navigate(route);
        }
    });
}

// Função para gerenciar toggle de submenu
function handleSubmenuToggle(toggle) {
    const parent = toggle.closest('.nav-item-submenu');
    const submenu = DOM.select('.nav-submenu', parent);
    const arrow = DOM.select('.nav-arrow', toggle);
    
    console.log('📦 Elements found:', { parent, submenu, arrow });
    
    if (!parent || !submenu) {
        console.error('❌ Elementos de submenu não encontrados');
        return;
    }
    
    // Verificar se está expandido
    const isExpanded = DOM.hasClass(parent, 'expanded');
    console.log('📊 Is expanded:', isExpanded);
    
    // Fechar todos os outros submenus primeiro
    closeAllSubmenus(parent);
    
    // Toggle do submenu atual
    if (isExpanded) {
        DOM.removeClass(parent, 'expanded');
        submenu.style.maxHeight = '0';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        console.log('📂 Submenu fechado');
    } else {
        DOM.addClass(parent, 'expanded');
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        if (arrow) arrow.style.transform = 'rotate(90deg)';
        console.log('📂 Submenu aberto');
    }
    
    // Salvar estado no cache
    saveExpandedState();
}
// Controle do menu mobile
function bindMobileToggle() {
    const menuToggle = DOM.select('#menu-toggle');
    const sidebar = DOM.select('#sidebar');
    const overlay = DOM.select('#mobile-overlay');
    
    if (!menuToggle || !sidebar) return;
    
    // Toggle do menu
    DOM.on(menuToggle, 'click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Fechar ao clicar no overlay
    if (overlay) {
        DOM.on(overlay, 'click', () => {
            closeMobileMenu();
        });
    }
    
    // Fechar ao clicar fora
    DOM.on(document, 'click', (e) => {
        if (State.get('sidebar.mobileOpen') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Fechar com ESC
    DOM.on(document, 'keydown', (e) => {
        if (e.key === 'Escape' && State.get('sidebar.mobileOpen')) {
            closeMobileMenu();
        }
    });
}
// Toggle menu mobile
function toggleMobileMenu() {
    const sidebar = DOM.select('#sidebar');
    const menuToggle = DOM.select('#menu-toggle');
    const overlay = DOM.select('#mobile-overlay');
    
    if (!sidebar) return;
    
    const isOpen = !State.get('sidebar.mobileOpen');
    State.set('sidebar.mobileOpen', isOpen);
    
    if (isOpen) {
        DOM.addClass(sidebar, 'active');
        if (menuToggle) DOM.addClass(menuToggle, 'active');
        if (overlay) DOM.addClass(overlay, 'active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    } else {
        DOM.removeClass(sidebar, 'active');
        if (menuToggle) DOM.removeClass(menuToggle, 'active');
        if (overlay) DOM.removeClass(overlay, 'active');
        document.body.style.overflow = '';
    }
}
// Fechar menu mobile
function closeMobileMenu() {
    const sidebar = DOM.select('#sidebar');
    const menuToggle = DOM.select('#menu-toggle');
    const overlay = DOM.select('#mobile-overlay');
    
    if (sidebar) DOM.removeClass(sidebar, 'active');
    if (menuToggle) DOM.removeClass(menuToggle, 'active');
    if (overlay) DOM.removeClass(overlay, 'active');
    
    document.body.style.overflow = '';
    State.set('sidebar.mobileOpen', false);
}
// Atualizar estado ativo do menu
function updateActiveState() {
    const currentHash = window.location.hash || '#dashboard';
    const navLinks = DOM.selectAll('.nav-link, .nav-subitem');
    
    // Remover estado ativo de todos
    navLinks.forEach(link => {
        DOM.removeClass(link, 'active');
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Marcar item ativo exato
        if (href === currentHash) {
            DOM.addClass(link, 'active');
            
            // Se for um subitem, expandir o menu pai
            const parentSubmenu = link.closest('.nav-item-submenu');
            if (parentSubmenu && DOM.hasClass(link, 'nav-subitem')) {
                expandSubmenuByParent(parentSubmenu);
            }
        }
        
        // Para itens com submenu, marcar como ativo se a rota começar com o prefixo
        if (DOM.hasClass(link, 'nav-link') && link.closest('.nav-item-submenu')) {
            const submenuParent = link.closest('.nav-item-submenu');
            const hasActiveChild = DOM.select('.nav-subitem.active', submenuParent);
            
            if (hasActiveChild || 
                (currentHash.startsWith('#redacao-') && link.textContent.includes('Redação')) ||
                (currentHash.startsWith('#configuracoes-') && link.textContent.includes('Configurações')) ||
                (currentHash.startsWith('#conta-') && link.textContent.includes('Conta'))) {
                DOM.addClass(link, 'active');
                expandSubmenuByParent(submenuParent);
            }
        }
    });
}

// Expandir submenu por elemento pai
function expandSubmenuByParent(parent) {
    if (!parent) return;
    
    const submenu = DOM.select('.nav-submenu', parent);
    const arrow = DOM.select('.nav-arrow', parent);
    
    if (submenu && !DOM.hasClass(parent, 'expanded')) {
        // Fechar todos os outros submenus primeiro
        closeAllSubmenus(parent);
        
        DOM.addClass(parent, 'expanded');
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        if (arrow) arrow.style.transform = 'rotate(90deg)';
        
        // Salvar estado
        saveExpandedState();
    }
}

// Fechar todos os submenus exceto o atual
function closeAllSubmenus(exceptParent = null) {
    const allSubmenus = DOM.selectAll('.nav-item-submenu');
    allSubmenus.forEach(submenuParent => {
        if (submenuParent !== exceptParent && DOM.hasClass(submenuParent, 'expanded')) {
            const submenu = DOM.select('.nav-submenu', submenuParent);
            const arrow = DOM.select('.nav-arrow', submenuParent);
            
            DOM.removeClass(submenuParent, 'expanded');
            if (submenu) submenu.style.maxHeight = '0';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    });
    
    // Salvar estado
    saveExpandedState();
}

// Salvar estado dos menus expandidos
function saveExpandedState() {
    const expanded = DOM.selectAll('.nav-item-submenu.expanded');
    const selectors = Array.from(expanded).map(el => {
        const text = DOM.select('.nav-link', el)?.textContent.trim();
        return text ? `[data-menu="${text}"]` : null;
    }).filter(Boolean);
    
    Cache.set('sidebar.expanded', selectors, 60); // Cache por 60 minutos
}
// Mostrar/esconder item do menu
export function toggleMenuItem(selector, show = true) {
    const item = DOM.select(selector);
    if (item) {
        if (show) {
            DOM.show(item);
        } else {
            DOM.hide(item);
        }
    }
}
// Adicionar badge a um item do menu
export function addBadge(selector, count, type = 'primary') {
    const item = DOM.select(selector);
    if (!item) return;
    
    // Remover badge existente
    const existingBadge = DOM.select('.nav-badge', item);
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Adicionar novo badge se count > 0
    if (count > 0) {
        const badge = DOM.create('span', {
            className: `nav-badge nav-badge--${type}`,
            textContent: count > 99 ? '99+' : count
        });
        item.appendChild(badge);
    }
}
// Atualizar informações do usuário
export function updateUserInfo(user) {
    const userName = DOM.select('.user-name');
    const userEmail = DOM.select('.user-email');
    
    if (userName && user.name) {
        userName.textContent = user.name;
    }
    
    if (userEmail && user.email) {
        userEmail.textContent = user.email;
    }
    
    // Salvar no estado global
    State.set('user', user);
}
// Controlar visibilidade de submenus
export function toggleSubmenu(parentSelector, show = true) {
    const parent = DOM.select(parentSelector);
    if (!parent) return;
    
    const submenu = DOM.select('.nav-submenu', parent);
    if (submenu) {
        submenu.style.display = show ? 'block' : 'none';
        DOM.toggleClass(parent, 'has-submenu-open', show);
    }
}

// Expandir/contrair submenu
export function expandSubmenu(parentSelector) {
    const parent = DOM.select(parentSelector);
    if (!parent) return;
    
    const submenu = DOM.select('.nav-submenu', parent);
    const arrow = DOM.select('.nav-arrow', parent);
    const isExpanded = DOM.hasClass(parent, 'expanded');
    
    if (submenu) {
        DOM.toggleClass(parent, 'expanded', !isExpanded);
        submenu.style.maxHeight = isExpanded ? '0' : submenu.scrollHeight + 'px';
        
        if (arrow) {
            arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
        }
        
        // Animar com UI
        if (!isExpanded) {
            UI.slideDown(submenu);
        } else {
            UI.slideUp(submenu);
        }
    }
}

// Controlar estado de integração
export function updateIntegrationStatus(network, isActive) {
    const item = DOM.select(`[data-network="${network}"]`);
    if (item) {
        DOM.toggleClass(item, 'integration-active', isActive);
        DOM.toggleClass(item, 'integration-inactive', !isActive);
        
        // Adicionar efeito visual
        if (isActive) {
            UI.highlight(item, 'success');
        }
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
