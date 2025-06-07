/* notifications.js
 * Sistema de notificações global - Otimizado
 * Dependências: DOM, UI, State, formatters
 * Localização: public/js/components/notifications.js
 * Tamanho: ~180 linhas (20% redução)
 */

import { DOM } from '../../core/dom.js';
import { State } from '../../core/state.js';
import { format } from '../forms/formatters.js';
import { behaviors } from '../ui/behaviors.js';

// Estado do módulo e cache de elementos
let isInitialized = false;
let elements = {};

// Inicializar sistema de notificações
export function init() {
    if (isInitialized) return;
    
    DOM.ready(() => {
        cacheElements();
        bindDropdown();
        bindActions();
        
        // Sincronizar com estado global
        State.watch('notifications.count', updateBadge);
        State.watch('notifications.list', renderNotificationsList);
    });
    
    isInitialized = true;
}

// Cache de elementos para performance
function cacheElements() {
    elements = {
        btn: DOM.select('#notifications-btn'),
        dropdown: DOM.select('#notifications-dropdown'),
        badge: DOM.select('#notifications-count'),
        list: DOM.select('.notifications-list'),
        container: DOM.select('#toast-container')
    };
}
// Dropdown de notificações
function bindDropdown() {
    if (!elements.btn || !elements.dropdown) return;
    
    DOM.on(elements.btn, 'click', (e) => {
        e.stopPropagation();
        DOM.toggleClass(elements.dropdown, 'active');
    });
    
    // Fechar ao clicar fora
    DOM.on(document, 'click', () => {
        DOM.removeClass(elements.dropdown, 'active');
    });
    
    DOM.on(elements.dropdown, 'click', (e) => {
        e.stopPropagation();
    });
}
// Ações das notificações
function bindActions() {
    // Marcar todas como lidas
    DOM.delegate(document, 'click', '.mark-all-read', markAllAsRead);
    
    // Clique em notificação individual
    DOM.delegate(document, 'click', '.notification-item', (_, item) => {
        DOM.removeClass(item, 'unread');
        updateBadge();
    });
}

// Marcar todas como lidas
function markAllAsRead() {
    DOM.selectAll('.notification-item').forEach(item => {
        DOM.removeClass(item, 'unread');
    });
    updateBadge(0);
}

// Atualizar badge de contagem
export function updateBadge(count = null) {
    if (!elements.badge) return;
    
    // Se count não foi fornecido, contar não lidas
    if (count === null) {
        count = DOM.selectAll('.notification-item.unread').length;
    }
    
    // Atualizar estado global
    State.set('notifications.count', count);
    
    if (count === 0) {
        DOM.hide(elements.badge);
    } else {
        DOM.show(elements.badge);
        elements.badge.textContent = count > 99 ? '99+' : count;
    }
}
// Configuração de ícones dos toasts
const TOAST_ICONS = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
};

// Mostrar toast notification
export function showToast(message, type = 'info', duration = 5000) {
    if (!elements.container) return;
    
    const toast = createToast(message, type);
    elements.container.appendChild(toast);
    
    // Usar animação direta
    behaviors.fadeIn(toast);
    
    // Remover ao clicar no X
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeToast(toast);
        });
    }
    
    // Auto remover após duração
    if (duration > 0) {
        setTimeout(() => removeToast(toast), duration);
    }
    
    return toast;
}

// Criar elemento do toast
function createToast(message, type) {
    return DOM.create('div', {
        className: `toast ${type} flex items-center gap-sm p-md mb-md bg-white text-dark`,
        innerHTML: `
            <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
            <span class="toast-message flex-1 text-sm">${message}</span>
            <button class="toast-close p-xs">×</button>
        `
    });
}

// Remover toast com animação
function removeToast(toast) {
    behaviors.fadeOut(toast, () => toast.remove());
}
// Adicionar nova notificação ao dropdown
export function addNotification(title, icon = '📢', timestamp = new Date()) {
    if (!elements.list) return;
    
    // Criar objeto de notificação
    const notificationData = {
        id: crypto.randomUUID() || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        icon,
        timestamp,
        read: false
    };
    
    // Adicionar ao estado global
    const notifications = State.get('notifications.list') || [];
    notifications.unshift(notificationData);
    State.set('notifications.list', notifications);
    
    // Criar elemento com utilities
    const notification = createNotificationElement(notificationData);
    
    // Inserir no início da lista com animação
    elements.list.insertBefore(notification, elements.list.firstChild);
    behaviors.highlight(notification);
    
    // Atualizar contador e mostrar toast
    updateBadge();
    showToast(title, 'info');
    
    return notification;
}

// Criar elemento de notificação
function createNotificationElement(data) {
    return DOM.create('div', {
        className: 'notification-item unread p-md flex gap-sm text-dark mb-xs',
        innerHTML: `
            <div class="notification-content flex gap-sm">
                <span class="notification-icon">${data.icon}</span>
                <div class="notification-text flex-1">
                    <div class="notification-title font-medium mb-xs">${data.title}</div>
                    <div class="notification-time text-xs text-gray-500">${format.timeAgo(data.timestamp)}</div>
                </div>
            </div>
        `
    });
}
// Limpar todas as notificações
export function clearAllNotifications() {
    if (!elements.list) return;
    
    elements.list.innerHTML = `
        <div class="empty-notifications p-md text-center text-gray-500">
            <p>Nenhuma notificação</p>
        </div>
    `;
    
    // Limpar estado global
    State.set('notifications.list', []);
    updateBadge(0);
}

// Renderizar lista de notificações do estado global
function renderNotificationsList(notifications = []) {
    if (!elements.list) return;
    
    if (notifications.length === 0) {
        clearAllNotifications();
        return;
    }
    
    elements.list.innerHTML = notifications.map(n => 
        createNotificationHTML(n)
    ).join('');
}

// Criar HTML da notificação
function createNotificationHTML(notification) {
    const readClass = notification.read ? '' : 'unread';
    return `
        <div class="notification-item ${readClass} p-md flex gap-sm text-dark mb-xs" data-id="${notification.id}">
            <div class="notification-content flex gap-sm">
                <span class="notification-icon">${notification.icon}</span>
                <div class="notification-text flex-1">
                    <div class="notification-title font-medium mb-xs">${notification.title}</div>
                    <div class="notification-time text-xs text-gray-500">${format.timeAgo(notification.timestamp)}</div>
                </div>
            </div>
        </div>
    `;
}
// Exportar objeto com todas as funções
export const Notifications = {
    init,
    showToast,
    addNotification,
    updateBadge,
    clearAllNotifications
};

// Manter compatibilidade global para showToast
window.showToast = showToast;