/**
 * configuracoes/integracoes.js
 * Lógica da aba Integrações - Redes Sociais
 * Dependências: api.js, notifications.js
 * Localização: public/js/pages/configuracoes/integracoes.js
 * Tamanho alvo: <150 linhas
 */

export async function init() {
    const container = document.getElementById('tab-integracoes');
    
    try {
        container.innerHTML = getTemplate();
        await loadIntegrations();
        bindEvents();
    } catch (error) {
        console.error('Erro ao inicializar integrações:', error);
        container.innerHTML = '<p class="error">Erro ao carregar integrações</p>';
    }
}

function getTemplate() {
    return `
        <div class="config-section">
            <h3>Redes Sociais Conectadas</h3>
            <p class="section-description">
                Conecte suas redes sociais para publicação automática
            </p>
            
            <div class="integrations-list">
                <!-- Instagram -->
                <div class="integration-item" data-platform="instagram">
                    <div class="integration-info">
                        <div class="integration-icon">📷</div>
                        <div class="integration-details">
                            <h4>Instagram</h4>
                            <p class="integration-status">Não conectado</p>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm connect-btn">
                        Conectar
                    </button>
                </div>
                
                <!-- LinkedIn -->
                <div class="integration-item" data-platform="linkedin">
                    <div class="integration-info">
                        <div class="integration-icon">💼</div>
                        <div class="integration-details">
                            <h4>LinkedIn</h4>
                            <p class="integration-status">Não conectado</p>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm connect-btn">
                        Conectar
                    </button>
                </div>
                
                <!-- Facebook -->
                <div class="integration-item" data-platform="facebook">
                    <div class="integration-info">
                        <div class="integration-icon">📘</div>
                        <div class="integration-details">
                            <h4>Facebook</h4>
                            <p class="integration-status">Não conectado</p>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm connect-btn">
                        Conectar
                    </button>
                </div>
                
                <!-- TikTok -->
                <div class="integration-item" data-platform="tiktok">
                    <div class="integration-info">
                        <div class="integration-icon">🎵</div>
                        <div class="integration-details">
                            <h4>TikTok</h4>
                            <p class="integration-status">Em breve</p>
                        </div>
                    </div>
                    <button class="btn btn-ghost btn-sm" disabled>
                        Em breve
                    </button>
                </div>
            </div>
        </div>
        
        <div class="config-section">
            <h3>Configurações de Publicação</h3>
            <form id="form-publicacao-config" class="config-form">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="auto_hashtags" checked>
                        <span>Adicionar hashtags automaticamente</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="watermark" checked>
                        <span>Adicionar marca d'água nas imagens</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="notify_publish">
                        <span>Notificar quando publicar</span>
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Salvar Configurações
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function loadIntegrations() {
    try {
        // TODO: Buscar integrações reais da API
        const mockData = {
            instagram: { connected: true, username: '@dr.joaosilva' },
            linkedin: { connected: true, name: 'Dr. João Silva' },
            facebook: { connected: false },
            tiktok: { available: false }
        };
        
        // Atualizar UI com status
        Object.keys(mockData).forEach(platform => {
            const item = document.querySelector(`[data-platform="${platform}"]`);
            if (!item) return;
            
            const data = mockData[platform];
            const statusEl = item.querySelector('.integration-status');
            const btn = item.querySelector('button');
            
            if (data.connected) {
                item.classList.add('connected');
                statusEl.textContent = `Conectado como ${data.username || data.name}`;
                btn.textContent = 'Desconectar';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-ghost');
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar integrações:', error);
    }
}

function bindEvents() {
    // Botões de conectar/desconectar
    document.querySelectorAll('.connect-btn').forEach(btn => {
        btn.addEventListener('click', handleConnection);
    });
    
    // Form de configurações
    const form = document.getElementById('form-publicacao-config');
    if (form) {
        form.addEventListener('submit', handleConfigSubmit);
    }
}

async function handleConnection(e) {
    const btn = e.target;
    const item = btn.closest('.integration-item');
    const platform = item.dataset.platform;
    const isConnected = item.classList.contains('connected');
    
    if (isConnected) {
        // Desconectar
        if (confirm(`Deseja desconectar do ${platform}?`)) {
            btn.disabled = true;
            btn.textContent = 'Desconectando...';
            
            try {
                // TODO: Chamar API para desconectar
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                item.classList.remove('connected');
                item.querySelector('.integration-status').textContent = 'Não conectado';
                btn.textContent = 'Conectar';
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-ghost');
                
                window.showToast(`${platform} desconectado`, 'info');
            } catch (error) {
                window.showToast('Erro ao desconectar', 'error');
            } finally {
                btn.disabled = false;
            }
        }
    } else {
        // Conectar - simular redirecionamento OAuth
        window.showToast(`Redirecionando para autorização do ${platform}...`, 'info');
        
        // TODO: Implementar OAuth real
        setTimeout(() => {
            item.classList.add('connected');
            item.querySelector('.integration-status').textContent = `Conectado como @usuario`;
            btn.textContent = 'Desconectar';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-ghost');
            
            window.showToast(`${platform} conectado com sucesso!`, 'success');
        }, 2000);
    }
}

async function handleConfigSubmit(e) {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    
    try {
        const formData = new FormData(e.target);
        const config = {
            auto_hashtags: formData.get('auto_hashtags') === 'on',
            watermark: formData.get('watermark') === 'on',
            notify_publish: formData.get('notify_publish') === 'on'
        };
        
        // TODO: Salvar via API
        console.log('Salvando configurações:', config);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        window.showToast('Configurações salvas!', 'success');
    } catch (error) {
        window.showToast('Erro ao salvar configurações', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}