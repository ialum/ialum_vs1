/**
 * notifications.js
 * Sistema de notificações global
 * Dependências: nenhuma
 * Usado em: app.html (global)
 * Tamanho alvo: <150 linhas
 */

window.IalumModules = window.IalumModules || {};
window.IalumModules.Notifications = {
    
    init() {
        this.bindDropdown();
        this.bindActions();
    },
    
    // Dropdown de notificações
    bindDropdown() {
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
    },
    
    // Ações das notificações
    bindActions() {
        // Marcar todas como lidas
        const markAllBtn = document.querySelector('.mark-all-read');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.notification-item').forEach(item => {
                    item.classList.remove('unread');
                });
                this.updateBadge(0);
            });
        }
        
        // Clique em notificação
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                this.updateBadge();
            });
        });
    },
    
    // Atualizar badge
    updateBadge(count) {
        const badge = document.getElementById('notifications-count');
        if (badge) {
            if (count === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'block';
                badge.textContent = count;
            }
        }
    },
    
    // Mostrar toast
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">×</button>
        `;
        
        container.appendChild(toast);
        
        // Remover ao clicar no X
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remover após 5 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },
    
    // Adicionar nova notificação
    addNotification(title, icon = '📢') {
        const list = document.querySelector('.notifications-list');
        
        const notification = document.createElement('div');
        notification.className = 'notification-item unread';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-time">Agora mesmo</div>
                </div>
            </div>
        `;
        
        list.insertBefore(notification, list.firstChild);
        
        // Atualizar contador
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        this.updateBadge(unreadCount);
        
        // Bind click
        notification.addEventListener('click', () => {
            notification.classList.remove('unread');
            this.updateBadge();
        });
    }
};

// Expor globalmente para uso fácil
window.showToast = (message, type) => {
    window.IalumModules.Notifications.showToast(message, type);
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.IalumModules.Notifications.init();
});