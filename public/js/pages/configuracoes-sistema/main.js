/**
 * configuracoes-sistema/main.js
 * Controlador da página de configurações de sistema usando nova arquitetura
 * Localização: public/js/pages/configuracoes-sistema/main.js
 */

import { DOM } from '../../core/dom.js';
import { State } from '../../core/state.js';
import { Cache } from '../../core/cache.js';
import { Backup } from '../../core/backup.js';
import { CardForm } from '../../components/cards/CardForm.js';
import { CardDisplay } from '../../components/cards/CardDisplay.js';
import { PageBuilder } from '../../components/layout/PageBuilder.js';
import { showToast } from '../../components/layout/notifications.js';

let isInitialized = false;

export async function init() {
    console.log('⚙️ Página Configurações Sistema inicializada');
    
    DOM.ready(() => {
        if (!isInitialized) {
            buildPage();
            initThemeSelector();
            initSystemActions();
            initSystemInfo();
            isInitialized = true;
        }
    });
}

// ===== CONSTRUIR PÁGINA =====

function buildPage() {
    const page = new PageBuilder('#page-container');
    
    page.setHeader(
        'Configurações do Sistema',
        'Gerencie as configurações globais da aplicação'
    );
    
    page.addSection({
        id: 'form-aparencia',
        title: 'Aparência',
        icon: '🎨',
        description: 'Personalize a interface da aplicação'
    });
    
    page.addSection({
        id: 'form-sistema',
        title: 'Sistema',
        icon: '⚙️',
        description: 'Configurações técnicas e de performance'
    });
    
    page.addSection({
        id: 'display-informacoes',
        title: 'Informações do Sistema',
        icon: 'ℹ️',
        description: 'Detalhes sobre o sistema e versão'
    });
}

// ===== SEÇÃO APARÊNCIA =====

function initThemeSelector() {
    const aparenciaConfig = {
        type: 'aparencia',
        showHeader: false,
        fields: [
            {
                name: 'tema',
                type: 'custom',
                label: 'Tema da Interface',
                help: 'Escolha entre tema claro ou escuro',
                template: `
                    <div class="btn-theme-group">
                        <button type="button" class="btn btn-theme-selector active" data-theme-value="light">
                            <div class="btn-theme-preview btn-theme-preview-light">
                                <div class="btn-theme-preview-header"></div>
                                <div class="btn-theme-preview-content">
                                    <div class="btn-theme-preview-line"></div>
                                    <div class="btn-theme-preview-line short"></div>
                                </div>
                            </div>
                            <div class="btn-theme-title">☀️ Claro</div>
                            <div class="btn-theme-desc">Interface clara e limpa</div>
                            <input type="radio" name="tema" value="light" checked style="display: none;">
                        </button>

                        <button type="button" class="btn btn-theme-selector" data-theme-value="dark">
                            <div class="btn-theme-preview btn-theme-preview-dark">
                                <div class="btn-theme-preview-header"></div>
                                <div class="btn-theme-preview-content">
                                    <div class="btn-theme-preview-line"></div>
                                    <div class="btn-theme-preview-line short"></div>
                                </div>
                            </div>
                            <div class="btn-theme-title">🌙 Escuro</div>
                            <div class="btn-theme-desc">Interface escura para reduzir fadiga</div>
                            <input type="radio" name="tema" value="dark" style="display: none;">
                        </button>
                    </div>
                    
                    <div class="form-text">
                        <span data-theme-status>✨ Tema aplicado: <strong>Claro</strong></span>
                    </div>
                `
            }
        ],
        onSubmit: (data) => {
            applyTheme(data.tema);
            showToast(`Tema ${data.tema === 'dark' ? 'escuro' : 'claro'} aplicado`, 'success');
        }
    };

    const aparenciaForm = new CardForm('#form-aparencia', aparenciaConfig);
    
    // Configurar tema atual
    const currentTheme = State.get('theme') || 'light';
    updateThemeUI(currentTheme);
    
    // Event listeners para botões de tema
    DOM.delegate(document, '.btn-theme-selector', 'click', handleThemeChange);
}

function handleThemeChange(event, element) {
    const theme = element.dataset.themeValue;
    if (theme) {
        // Atualizar UI dos botões
        DOM.selectAll('.btn-theme-selector').forEach(btn => {
            DOM.removeClass(btn, 'active');
        });
        DOM.addClass(element, 'active');
        
        // Atualizar radio buttons
        const radio = element.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        
        // Aplicar tema
        applyTheme(theme);
        updateThemeUI(theme);
        
        showToast(`Tema ${theme === 'dark' ? 'escuro' : 'claro'} aplicado`, 'success');
    }
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    State.set('theme', theme);
    console.log(`Tema aplicado: ${theme}`);
}

function updateThemeUI(theme) {
    // Atualizar status
    const statusElement = DOM.select('[data-theme-status]');
    if (statusElement) {
        const themeName = theme === 'dark' ? 'Escuro' : 'Claro';
        const icon = theme === 'dark' ? '🌙' : '✨';
        statusElement.innerHTML = `${icon} Tema aplicado: <strong>${themeName}</strong>`;
    }
    
    // Atualizar botões ativos
    DOM.selectAll('.btn-theme-selector').forEach(btn => {
        const btnTheme = btn.dataset.themeValue;
        if (btnTheme === theme) {
            DOM.addClass(btn, 'active');
            const radio = btn.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        } else {
            DOM.removeClass(btn, 'active');
        }
    });
}

// ===== SEÇÃO SISTEMA =====

function initSystemActions() {
    const sistemaConfig = {
        type: 'sistema',
        showHeader: false,
        showActions: false,
        fields: [
            {
                name: 'cache',
                type: 'custom',
                label: 'Cache do Sistema',
                help: 'Limpar dados em cache para melhor performance',
                template: `
                    <button type="button" class="btn btn-outline btn-secondary" data-action="clear-cache">
                        🗑️ Limpar Cache
                    </button>
                    <div class="form-text">
                        Último cache limpo: <span data-cache-status>Nunca</span>
                    </div>
                `
            },
            {
                name: 'backup',
                type: 'custom',
                label: 'Backup de Dados',
                help: 'Backup automático dos rascunhos',
                template: `
                    <div class="form-row">
                        <button type="button" class="btn btn-outline btn-primary" data-action="backup-now">
                            💾 Fazer Backup
                        </button>
                        <button type="button" class="btn btn-outline btn-secondary" data-action="clear-backups">
                            🗑️ Limpar Backups Antigos
                        </button>
                    </div>
                    <div class="form-text">
                        Backups são mantidos por 7 dias automaticamente
                    </div>
                `
            }
        ]
    };

    const sistemaForm = new CardForm('#form-sistema', sistemaConfig);
    
    // Event listeners para ações do sistema
    DOM.delegate(document, '[data-action]', 'click', handleSystemAction);
    
    // Atualizar status inicial
    updateCacheStatus();
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

async function clearSystemCache(button) {
    const originalText = button.textContent;
    button.textContent = '🔄 Limpando...';
    button.disabled = true;
    
    try {
        const statsBefore = Cache.stats();
        Cache.reset();
        
        localStorage.setItem('ialum_last_cache_clear', Date.now().toString());
        
        updateCacheStatus();
        updateSystemInfo();
        
        showToast(`Cache limpo! ${statsBefore.totalItems} itens removidos`, 'success');
        
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
        await new Promise(resolve => setTimeout(resolve, 800));
        
        Backup.save('system-backup');
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
        await new Promise(resolve => setTimeout(resolve, 600));
        
        Backup.cleanOld();
        updateSystemInfo();
        
        showToast('Backups antigos removidos', 'success');
        
    } catch (error) {
        console.error('Erro ao limpar backups:', error);
        showToast('Erro ao limpar backups', 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
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

// ===== SEÇÃO INFORMAÇÕES =====

function initSystemInfo() {
    const stats = Cache.stats();
    
    const infoConfig = {
        type: 'info',
        showHeader: false,
        data: {
            'Versão': 'iAlum v1.0',
            'Última atualização': new Date().toLocaleDateString('pt-BR'),
            'Storage usado': stats.storageUsedFormatted,
            'Cache': `${stats.totalSizeFormatted} (${stats.validItems} itens)`,
            ...(stats.expiredItems > 0 && { 'Itens expirados': `${stats.expiredItems} itens` })
        }
    };

    const infoDisplay = new CardDisplay('#display-informacoes', infoConfig);
}

function updateSystemInfo() {
    // Re-inicializar display com dados atualizados
    setTimeout(() => {
        initSystemInfo();
    }, 100);
}

// ===== INICIALIZAÇÃO GLOBAL =====

function initGlobalTheme() {
    const savedTheme = State.get('theme') || 'light';
    console.log('🌍 Aplicando tema global:', savedTheme);
    applyTheme(savedTheme);
}

DOM.ready(() => {
    initGlobalTheme();
});

// Exportar para uso global
window.SystemSettings = {
    applyTheme,
    updateThemeUI,
    initGlobalTheme
};