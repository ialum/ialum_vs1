/**
 * sidebar.js
 * Controle do menu lateral da aplicação Ialum
 * Estrutura baseada na documentação 0_1-paginas.md
 * Dependências: router.js, DOM, State, UI, Cache
 * Localização: public/js/components/sidebar.js
 * Tamanho alvo: <200 linhas
 */
import { Router } from '../../core/router.js';
import { DOM } from '../../core/dom.js';
import { State } from '../../core/state.js';
import { Cache } from '../../core/cache.js';
import { behaviors } from '../ui/behaviors.js';
// Estado do sidebar
let isInitialized = false;
// Inicializar sidebar
export function init() {
    console.log('🎯 Sidebar.init() chamado');
    if (isInitialized) return;
    
    DOM.ready(() => {
        console.log('📋 DOM ready - inicializando sidebar...');
        // Inicializar estado dos submenus (todos fechados)
        initializeSubmenus();
        
        bindNavigation();
        bindMobileToggle();
        updateActiveState();
        
        // CORREÇÃO: Fallback de segurança para submenu toggles
        console.log('🛡️ Adicionando fallback de segurança para submenus...');
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink && navLink.closest('#sidebar')) {
                const href = navLink.getAttribute('href');
                if (href === 'javascript:void(0)' || href.includes('void(0)')) {
                    console.log('🚨 FALLBACK: Processando submenu toggle via fallback');
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmenuToggle(navLink);
                }
            }
        }, true); // Use capture phase para garantir execução primeiro
        
        // Escutar mudanças de rota
        DOM.on(window, 'hashchange', updateActiveState);
        
        // Limpar cache antigo com seletores inválidos
        cleanInvalidCache();
        
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
    console.log('🔗 bindNavigation() chamado - configurando event delegation');
    
    // CORREÇÃO: Event delegation mais específico para o sidebar
    DOM.delegate('#sidebar', 'click', '.nav-link', (e, element) => {
        console.log('👆 Clique detectado em nav-link:', element);
        
        const href = element.getAttribute('href');
        console.log('🔍 href:', href);
        
        // Verificação segura: se não tem href, ignore
        if (!href) return;
        
        // Ignorar links externos
        if (href.startsWith('http')) return;
        
        if (href === 'javascript:void(0)' || href.includes('void(0)')) {
            // É um toggle de submenu - PRIORIDADE ALTA
            console.log('🔧 Submenu toggle clicked:', element);
            console.log('🔍 Element text:', element.textContent.trim());
            
            e.preventDefault();
            e.stopPropagation();
            handleSubmenuToggle(element);
            return;
        } 
        
        if (href.startsWith('#')) {
            // É navegação normal - deixa router processar naturalmente
            console.log('🧭 Navegação normal - deixando router processar:', href);
            
            // Fechar menu mobile se estiver aberto
            if (State.get('sidebar.mobileOpen')) {
                closeMobileMenu();
            }
            
            // NÃO preventDefault aqui - deixa o router processar
        }
    });
    
    // Event delegation separado para subitens
    DOM.delegate('#sidebar', 'click', '.nav-subitem', (e, element) => {
        console.log('👆 Clique detectado em nav-subitem:', element);
        
        const href = element.getAttribute('href');
        if (href && href.startsWith('#')) {
            // Fechar menu mobile se estiver aberto
            if (State.get('sidebar.mobileOpen')) {
                closeMobileMenu();
            }
            
            // Deixa o router processar naturalmente
            console.log('🧭 Subitem navegação - deixando router processar:', href);
        }
    });
}

// Função para gerenciar toggle de submenu
function handleSubmenuToggle(toggle) {
    console.log('🚀 handleSubmenuToggle called with:', toggle);
    
    const parent = toggle.closest('.nav-item-submenu');
    const submenu = DOM.select('.nav-submenu', parent);
    const arrow = DOM.select('.nav-arrow', toggle);
    
    console.log('📦 Elements found:');
    console.log('  - parent:', parent);
    console.log('  - submenu:', submenu);
    console.log('  - arrow:', arrow);
    
    if (!parent || !submenu) {
        console.error('❌ Elementos de submenu não encontrados');
        console.error('  - parent existe:', !!parent);
        console.error('  - submenu existe:', !!submenu);
        return;
    }
    
    // Verificar se está expandido
    const isExpanded = DOM.hasClass(parent, 'expanded');
    console.log('📊 Is expanded:', isExpanded);
    
    // Fechar todos os outros submenus primeiro (só se não estiver expandindo)
    if (!isExpanded) {
        closeAllSubmenus(parent);
    }
    
    // Toggle do submenu atual
    if (isExpanded) {
        DOM.removeClass(parent, 'expanded');
        submenu.style.maxHeight = '0';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        console.log('📂 Submenu fechado');
    } else {
        DOM.addClass(parent, 'expanded');
        // CORREÇÃO: Usar scrollHeight + margem para garantir expansão completa
        const fullHeight = submenu.scrollHeight + 20; // +20px de margem
        submenu.style.maxHeight = fullHeight + 'px';
        if (arrow) arrow.style.transform = 'rotate(90deg)';
        console.log('📂 Submenu aberto com altura:', fullHeight);
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
            const hasActiveChild = submenuParent.querySelector('.nav-subitem.active');
            
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

// Limpar cache com seletores inválidos
function cleanInvalidCache() {
    const expandedMenus = Cache.get('sidebar.expanded') || [];
    const validSelectors = expandedMenus.filter(selector => {
        try {
            // Testar se o seletor é válido tentando usá-lo
            document.querySelector(selector);
            return true;
        } catch {
            return false;
        }
    });
    
    // Só atualizar se houve mudança
    if (validSelectors.length !== expandedMenus.length) {
        Cache.set('sidebar.expanded', validSelectors, 60);
    }
}

// Salvar estado dos menus expandidos
function saveExpandedState() {
    const expanded = DOM.selectAll('.nav-item-submenu.expanded');
    const selectors = Array.from(expanded).map(el => {
        // Usar o href do link ou criar um ID baseado na posição
        const link = DOM.select('.nav-link', el);
        const href = link?.getAttribute('href');
        if (href) {
            return `[href="${href}"]`;
        }
        
        // Fallback: usar posição do elemento
        const parent = el.parentNode;
        const index = Array.from(parent.children).indexOf(el);
        return `.nav-item-submenu:nth-child(${index + 1})`;
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
    try {
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
        
        // Animar com behaviors
        if (!isExpanded) {
            behaviors.slideDown(submenu);
        } else {
            behaviors.slideUp(submenu);
        }
    }
    } catch (error) {
        console.warn('⚠️ Seletor inválido ignorado:', parentSelector, error.message);
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
            behaviors.highlight(item, 'success');
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
