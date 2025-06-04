/**
 * backup.js
 * Sistema de auto-save local para proteção de dados
 * Documentação: /docs/0_16-sistemas-core.md#backup
 * Localização: /js/core/backup.js
 * 
 * COMO USAR:
 * 1. Importar: import { Backup } from '/js/core/backup.js'
 * 2. Inicializar: Backup.init('nome-pagina')
 * 3. Pronto! Auto-save a cada 5 segundos
 */

// Configurações
const CONFIG = {
    interval: 5000,        // 5 segundos
    maxSize: 5 * 1024 * 1024, // 5MB max
    prefix: 'ialum_backup_',
    expirationDays: 7
};

// Estado interno
let timers = new Map();
let listeners = new Map();

/**
 * Inicializa backup automático para uma página
 * @param {string} pageId - Identificador único da página
 * @param {Object} options - Opções customizadas
 */
export function init(pageId, options = {}) {
    // Merge com config padrão
    const config = { ...CONFIG, ...options };
    
    // Para timer anterior se existir
    if (timers.has(pageId)) {
        clearInterval(timers.get(pageId));
    }
    
    // Busca container com data-backup
    const container = document.querySelector(`[data-backup="${pageId}"]`);
    if (!container) {
        console.warn(`Backup: Container não encontrado para ${pageId}`);
        return;
    }
    
    // Recupera backup se existir
    restore(pageId);
    
    // Monitora mudanças
    const fields = container.querySelectorAll('.backup-field');
    fields.forEach(field => {
        field.addEventListener('input', () => {
            scheduleBackup(pageId, config.interval);
        });
    });
    
    // Salva ao sair da página
    window.addEventListener('beforeunload', () => {
        save(pageId);
    });
    
    console.log(`Backup: Sistema iniciado para ${pageId}`);
}

/**
 * Salva dados imediatamente
 * @param {string} pageId - Identificador da página
 */
export function save(pageId) {
    const container = document.querySelector(`[data-backup="${pageId}"]`);
    if (!container) return;
    
    const data = collectData(container);
    const key = CONFIG.prefix + pageId;
    
    try {
        localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now(),
            url: window.location.href
        }));
        
        updateStatus(pageId, 'saved');
        return true;
    } catch (e) {
        console.error('Backup: Erro ao salvar', e);
        updateStatus(pageId, 'error');
        return false;
    }
}

/**
 * Restaura dados do backup
 * @param {string} pageId - Identificador da página
 */
export function restore(pageId) {
    const key = CONFIG.prefix + pageId;
    const backup = localStorage.getItem(key);
    
    if (!backup) return false;
    
    try {
        const { data, timestamp } = JSON.parse(backup);
        
        // Verifica se não expirou
        const age = Date.now() - timestamp;
        if (age > CONFIG.expirationDays * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
            return false;
        }
        
        // Oferece restaurar se recente (menos de 1 hora)
        if (age < 60 * 60 * 1000) {
            const container = document.querySelector(`[data-backup="${pageId}"]`);
            if (container && confirm('Recuperar rascunho não salvo?')) {
                restoreData(container, data);
                updateStatus(pageId, 'restored');
                return true;
            }
        }
    } catch (e) {
        console.error('Backup: Erro ao restaurar', e);
    }
    
    return false;
}

/**
 * Limpa backup após salvar com sucesso
 * @param {string} pageId - Identificador da página
 */
export function clear(pageId) {
    const key = CONFIG.prefix + pageId;
    localStorage.removeItem(key);
    updateStatus(pageId, 'cleared');
}

/**
 * Limpa todos os backups antigos
 */
export function cleanOld() {
    const now = Date.now();
    const maxAge = CONFIG.expirationDays * 24 * 60 * 60 * 1000;
    
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CONFIG.prefix)) {
            try {
                const { timestamp } = JSON.parse(localStorage.getItem(key));
                if (now - timestamp > maxAge) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Remove se não conseguir parsear
                localStorage.removeItem(key);
            }
        }
    });
}

// === FUNÇÕES INTERNAS ===

function scheduleBackup(pageId, delay) {
    // Cancela timer anterior
    if (timers.has(pageId)) {
        clearTimeout(timers.get(pageId));
    }
    
    // Agenda novo backup
    const timer = setTimeout(() => {
        save(pageId);
    }, delay);
    
    timers.set(pageId, timer);
    updateStatus(pageId, 'typing');
}

function collectData(container) {
    const data = {};
    const fields = container.querySelectorAll('.backup-field');
    
    fields.forEach(field => {
        const name = field.name || field.id;
        if (!name) return;
        
        if (field.type === 'checkbox') {
            data[name] = field.checked;
        } else if (field.type === 'radio') {
            if (field.checked) data[name] = field.value;
        } else {
            data[name] = field.value;
        }
    });
    
    return data;
}

function restoreData(container, data) {
    Object.entries(data).forEach(([name, value]) => {
        const field = container.querySelector(`[name="${name}"], #${name}`);
        if (!field) return;
        
        if (field.type === 'checkbox') {
            field.checked = value;
        } else if (field.type === 'radio') {
            const radio = container.querySelector(`[name="${name}"][value="${value}"]`);
            if (radio) radio.checked = true;
        } else {
            field.value = value;
        }
    });
}

function updateStatus(pageId, status) {
    const statusEl = document.querySelector(`[data-backup="${pageId}"] #backup-status`);
    if (!statusEl) return;
    
    const messages = {
        typing: '✏️ Digitando...',
        saved: '✅ Rascunho salvo',
        restored: '♻️ Rascunho recuperado',
        error: '❌ Erro ao salvar',
        cleared: '🗑️ Backup limpo'
    };
    
    statusEl.textContent = messages[status] || '';
    statusEl.className = `backup-status backup-status-${status}`;
}

// Limpa backups antigos ao carregar
cleanOld();

// Exporta interface pública
export const Backup = {
    init,
    save,
    restore,
    clear,
    cleanOld
};