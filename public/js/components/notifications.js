/* notifications.js
 * Sistema de notificações global
 * Dependências: nenhuma
 * Localização: public/js/components/notifications.js
 * Tamanho alvo: <150 linhas
 */

// Estado do módulo
let isInitialized = false;
// Inicializar sistema de notificações
export function init() {
if (isInitialized) return;
bindDropdown();
bindActions();

// Inicializar automaticamente se DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}

isInitialized = true;
}
// Dropdown de notificações
function bindDropdown() {
const btn = document.getElementById('notifications-btn');
const dropdown = document.getElementById('notifications-dropdown');
if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });
    
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}
}
// Ações das notificações
function bindActions() {
// Marcar todas como lidas
const markAllBtn = document.querySelector('.mark-all-read');
if (markAllBtn) {
markAllBtn.addEventListener('click', () => {
document.querySelectorAll('.notification-item').forEach(item => {
item.classList.remove('unread');
});
updateBadge(0);
});
}
// Clique em notificação individual
document.addEventListener('click', (e) => {
    const item = e.target.closest('.notification-item');
    if (item) {
        item.classList.remove('unread');
        updateBadge();
    }
});
}
// Atualizar badge de contagem
export function updateBadge(count = null) {
const badge = document.getElementById('notifications-count');
if (!badge) return;
// Se count não foi fornecido, contar não lidas
if (count === null) {
    count = document.querySelectorAll('.notification-item.unread').length;
}

if (count === 0) {
    badge.style.display = 'none';
} else {
    badge.style.display = 'block';
    badge.textContent = count > 99 ? '99+' : count;
}
}
// Mostrar toast notification
export function showToast(message, type = 'info', duration = 5000) {
const container = document.getElementById('toast-container');
if (!container) return;
const toast = document.createElement('div');
toast.className = `toast ${type}`;

const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
};

toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">×</button>
`;

container.appendChild(toast);

// Animação de entrada
requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
});

// Remover ao clicar no X
const closeBtn = toast.querySelector('.toast-close');
closeBtn.addEventListener('click', () => removeToast(toast));

// Auto remover após duração
if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
}

return toast;
}
// Remover toast com animação
function removeToast(toast) {
toast.style.opacity = '0';
toast.style.transform = 'translateX(100%)';
setTimeout(() => toast.remove(), 300);
}
// Adicionar nova notificação ao dropdown
export function addNotification(title, icon = '📢', time = 'Agora mesmo') {
const list = document.querySelector('.notifications-list');
if (!list) return;
const notification = document.createElement('div');
notification.className = 'notification-item unread';
notification.innerHTML = `
    <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <div class="notification-text">
            <div class="notification-title">${title}</div>
            <div class="notification-time">${time}</div>
        </div>
    </div>
`;

// Inserir no início da lista
list.insertBefore(notification, list.firstChild);

// Atualizar contador
updateBadge();

// Mostrar toast também
showToast(title, 'info');

return notification;
}
// Limpar todas as notificações
export function clearAllNotifications() {
    const list = document.querySelector('.notifications-list');
    if (list) {
        list.innerHTML = `
            <div class="empty-notifications">
                <p>Nenhuma notificação</p>
            </div>
        `;
    }
    updateBadge(0);
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