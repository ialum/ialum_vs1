/* notifications.js
 * Sistema de notificações global
 * Dependências: DOM, UI, State, formatters
 * Localização: public/js/components/notifications.js
 * Tamanho alvo: <150 linhas
 */

import { DOM } from '../core/dom.js';
import { UI } from '../core/ui.js';
import { State } from '../core/state.js';
import { format } from '../core/formatters.js';

// Estado do módulo
let isInitialized = false;
// Inicializar sistema de notificações
export function init() {
    if (isInitialized) return;
    
    DOM.ready(() => {
        bindDropdown();
        bindActions();
        
        // Sincronizar com estado global
        State.subscribe('notifications.count', updateBadge);
        State.subscribe('notifications.list', renderNotificationsList);
    });
    
    isInitialized = true;
}
// Dropdown de notificações
function bindDropdown() {
    const btn = DOM.select('#notifications-btn');
    const dropdown = DOM.select('#notifications-dropdown');
    
    if (btn && dropdown) {
        DOM.on(btn, 'click', (e) => {
            e.stopPropagation();
            DOM.toggleClass(dropdown, 'active');
        });
        
        // Fechar ao clicar fora
        DOM.on(document, 'click', () => {
            DOM.removeClass(dropdown, 'active');
        });
        
        DOM.on(dropdown, 'click', (e) => {
            e.stopPropagation();
        });
    }
}
// Ações das notificações
function bindActions() {
    // Marcar todas como lidas
    DOM.delegate(document, 'click', '.mark-all-read', () => {
        DOM.selectAll('.notification-item').forEach(item => {
            DOM.removeClass(item, 'unread');
        });
        updateBadge(0);
    });
    
    // Clique em notificação individual
    DOM.delegate(document, 'click', '.notification-item', (_, item) => {
        DOM.removeClass(item, 'unread');
        updateBadge();
    });
}
// Atualizar badge de contagem
export function updateBadge(count = null) {
    const badge = DOM.select('#notifications-count');
    if (!badge) return;
    
    // Se count não foi fornecido, contar não lidas
    if (count === null) {
        count = DOM.selectAll('.notification-item.unread').length;
    }
    
    // Atualizar estado global
    State.set('notifications.count', count);
    
    if (count === 0) {
        DOM.hide(badge);
    } else {
        DOM.show(badge);
        badge.textContent = count > 99 ? '99+' : count;
    }
}
// Mostrar toast notification
export function showToast(message, type = 'info', duration = 5000) {
    const container = DOM.select('#toast-container');
    if (!container) return;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const toast = DOM.create('div', {
        className: `toast ${type}`,
        innerHTML: `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">×</button>
        `
    });
    
    container.appendChild(toast);
    
    // Usar animação do UI
    UI.fadeIn(toast);
    
    // Remover ao clicar no X
    DOM.on(toast, 'click', '.toast-close', () => {
        UI.fadeOut(toast, () => toast.remove());
    });
    
    // Auto remover após duração
    if (duration > 0) {
        setTimeout(() => {
            UI.fadeOut(toast, () => toast.remove());
        }, duration);
    }
    
    return toast;
}
// Função removeToast não é mais necessária - UI.fadeOut já faz isso
// Adicionar nova notificação ao dropdown
export function addNotification(title, icon = '📢', timestamp = new Date()) {
    const list = DOM.select('.notifications-list');
    if (!list) return;
    
    // Criar objeto de notificação
    const notificationData = {
        id: UI.generateId(),
        title,
        icon,
        timestamp,
        read: false
    };
    
    // Adicionar ao estado global
    const notifications = State.get('notifications.list') || [];
    notifications.unshift(notificationData);
    State.set('notifications.list', notifications);
    
    // Criar elemento
    const notification = DOM.create('div', {
        className: 'notification-item unread',
        innerHTML: `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-time">${format.timeAgo(timestamp)}</div>
                </div>
            </div>
        `
    });
    
    // Inserir no início da lista com animação
    list.insertBefore(notification, list.firstChild);
    UI.highlight(notification);
    
    // Atualizar contador
    updateBadge();
    
    // Mostrar toast também
    showToast(title, 'info');
    
    return notification;
}
// Limpar todas as notificações
export function clearAllNotifications() {
    const list = DOM.select('.notifications-list');
    if (list) {
        list.innerHTML = `
            <div class="empty-notifications">
                <p>Nenhuma notificação</p>
            </div>
        `;
    }
    
    // Limpar estado global
    State.set('notifications.list', []);
    updateBadge(0);
}

// Renderizar lista de notificações do estado global
function renderNotificationsList(notifications = []) {
    const list = DOM.select('.notifications-list');
    if (!list) return;
    
    if (notifications.length === 0) {
        list.innerHTML = `
            <div class="empty-notifications">
                <p>Nenhuma notificação</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
            <div class="notification-content">
                <span class="notification-icon">${n.icon}</span>
                <div class="notification-text">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-time">${format.timeAgo(n.timestamp)}</div>
                </div>
            </div>
        </div>
    `).join('');
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