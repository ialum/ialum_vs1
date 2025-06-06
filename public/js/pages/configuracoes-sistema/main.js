/**
 * configuracoes-sistema/main.js
 * Controlador da página de configurações de sistema
 * Localização: public/js/pages/configuracoes-sistema/main.js
 */

import { DOM } from '../../core/dom.js';
import { State } from '../../core/state.js';
import { Cache } from '../../core/cache.js';
import { Backup } from '../../core/backup.js';
import { showToast } from '../../components/notifications.js';

let isInitialized = false;

export async function init() {
    if (isInitialized) return;
    
    console.log('Página Configurações Sistema inicializada');
    
    DOM.ready(() => {
        initThemeControls();
        initSystemControls();
        updateSystemInfo();
        bindEvents();
    });
    
    isInitialized = true;
}

// ===== CONTROLES DE TEMA =====

function initThemeControls() {
    // Recuperar tema atual do State
    const currentTheme = State.get('theme') || 'light';
    
    // Aplicar tema atual na interface
    applyTheme(currentTheme);
    
    // Atualizar UI para refletir tema atual
    updateThemeUI(currentTheme);
}

function applyTheme(theme) {
    // Aplicar atributo data-theme no documento
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Salvar no State (persiste automaticamente)
    State.set('theme', theme);
    
    console.log(`Tema aplicado: ${theme}`);
}

function updateThemeUI(theme) {
    // Atualizar radio buttons
    const themeRadios = DOM.selectAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.checked = radio.value === theme;
    });
    
    // Atualizar classes ativas nos theme-options
    const themeOptions = DOM.selectAll('.theme-option');
    themeOptions.forEach(option => {
        const optionTheme = option.dataset.theme;
        DOM.toggleClass(option, 'active', optionTheme === theme);
    });
    
    // Atualizar status
    const statusElement = DOM.select('[data-theme-status]');
    if (statusElement) {
        const themeName = theme === 'dark' ? 'Escuro' : 'Claro';
        const icon = theme === 'dark' ? '🌙' : '✨';
        statusElement.innerHTML = `${icon} Tema aplicado: <strong>${themeName}</strong>`;
    }
}

// ===== CONTROLES DE SISTEMA =====

function initSystemControls() {
    // Atualizar status do cache
    updateCacheStatus();
}

function updateCacheStatus() {
    const cacheStatusEl = DOM.select('[data-cache-status]');
    if (cacheStatusEl) {
        const lastClear = localStorage.getItem('ialum_last_cache_clear');
        if (lastClear) {
            const date = new Date(parseInt(lastClear));
            cacheStatusEl.textContent = date.toLocaleString('pt-BR');
        } else {
            cacheStatusEl.textContent = 'Nunca';
        }
    }
}

function updateSystemInfo() {
    // Última atualização (simulada)
    const lastUpdateEl = DOM.select('[data-last-update]');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = new Date().toLocaleDateString('pt-BR');
    }
    
    // Storage usado
    updateStorageUsage();
}

function updateStorageUsage() {
    const storageEl = DOM.select('[data-storage-usage]');
    if (!storageEl) return;
    
    try {
        let totalSize = 0;
        
        // Calcular tamanho do localStorage
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }
        
        // Converter para KB/MB
        const sizeKB = totalSize / 1024;
        const sizeMB = sizeKB / 1024;
        
        let displaySize;
        if (sizeMB > 1) {
            displaySize = `${sizeMB.toFixed(2)} MB`;
        } else {
            displaySize = `${sizeKB.toFixed(2)} KB`;
        }
        
        storageEl.textContent = displaySize;
        
    } catch (error) {
        storageEl.textContent = 'Erro ao calcular';
        console.error('Erro ao calcular storage:', error);
    }
}

// ===== EVENTOS =====

function bindEvents() {
    // Eventos de mudança de tema
    DOM.delegate(document, '.theme-option', 'click', handleThemeChange);
    DOM.delegate(document, 'input[name="theme"]', 'change', handleThemeRadioChange);
    
    // Eventos de ações do sistema
    DOM.delegate(document, '[data-action]', 'click', handleSystemAction);
}

function handleThemeChange(event, element) {
    const theme = element.dataset.theme;
    if (theme) {
        applyTheme(theme);
        updateThemeUI(theme);
        
        // Feedback visual
        showToast(`Tema ${theme === 'dark' ? 'escuro' : 'claro'} aplicado`, 'success');
    }
}

function handleThemeRadioChange(event, element) {
    const theme = element.value;
    if (theme) {
        applyTheme(theme);
        updateThemeUI(theme);
    }
}

async function handleSystemAction(event, element) {
    const action = element.dataset.action;
    
    switch (action) {
        case 'clear-cache':
            await clearSystemCache(element);
            break;
            
        case 'backup-now':
            await createBackup(element);
            break;
            
        case 'clear-backups':
            await clearOldBackups(element);
            break;
    }
}

// ===== AÇÕES DO SISTEMA =====

async function clearSystemCache(button) {
    const originalText = button.textContent;
    button.textContent = '🔄 Limpando...';
    button.disabled = true;
    
    try {
        // Simular limpeza de cache
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Limpar cache real se disponível
        if (Cache && Cache.clear) {
            Cache.clear();
        }
        
        // Marcar timestamp da limpeza
        localStorage.setItem('ialum_last_cache_clear', Date.now().toString());
        
        // Atualizar UI
        updateCacheStatus();
        updateStorageUsage();
        
        showToast('Cache do sistema limpo com sucesso', 'success');
        
    } catch (error) {
        console.error('Erro ao limpar cache:', error);
        showToast('Erro ao limpar cache', 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

async function createBackup(button) {
    const originalText = button.textContent;
    button.textContent = '💾 Criando...';
    button.disabled = true;
    
    try {
        // Simular criação de backup
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Criar backup se disponível
        if (Backup && Backup.save) {
            Backup.save('system-backup');
        }
        
        showToast('Backup criado com sucesso', 'success');
        
    } catch (error) {
        console.error('Erro ao criar backup:', error);
        showToast('Erro ao criar backup', 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

async function clearOldBackups(button) {
    const originalText = button.textContent;
    button.textContent = '🗑️ Limpando...';
    button.disabled = true;
    
    try {
        // Simular limpeza
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Limpar backups antigos se disponível
        if (Backup && Backup.cleanOld) {
            Backup.cleanOld();
        }
        
        // Atualizar storage
        updateStorageUsage();
        
        showToast('Backups antigos removidos', 'success');
        
    } catch (error) {
        console.error('Erro ao limpar backups:', error);
        showToast('Erro ao limpar backups', 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ===== INICIALIZAÇÃO AUTOMÁTICA =====

// Aplicar tema salvo ao carregar a aplicação
function initGlobalTheme() {
    const savedTheme = State.get('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}

// Aplicar tema quando a página carrega
DOM.ready(() => {
    initGlobalTheme();
});

// Exportar para uso global
window.SystemSettings = {
    applyTheme,
    updateThemeUI,
    initGlobalTheme
};