/**
 * configuracoes/main.js
 * Controlador principal da página de configurações
 * Localização: public/js/pages/configuracoes/main.js
 */

export async function init() {
    console.log('Inicializando Configurações...');
    
    // Setup das abas
    setupTabs();
    
    // Carregar aba inicial
    await loadTab('conta');
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const tabName = btn.dataset.tab;
            
            // Atualizar visual das abas
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Atualizar painéis
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(`tab-${tabName}`).classList.add('active');
            
            // Carregar conteúdo da aba
            await loadTab(tabName);
        });
    });
}

async function loadTab(tabName) {
    const container = document.getElementById(`tab-${tabName}`);
    
    try {
        // Limpar loading
        container.innerHTML = '';
        
        // Carregar módulo específico da aba
        switch(tabName) {
            case 'conta':
                await loadContaTab(container);
                break;
            case 'banca':
                await loadBancaTab(container);
                break;
            case 'integracoes':
                await loadIntegracoesTab(container);
                break;
            case 'publicador':
                await loadPublicadorTab(container);
                break;
            case 'banco-imagens':
                await loadBancoImagensTab(container);
                break;
        }
    } catch (error) {
        console.error(`Erro ao carregar aba ${tabName}:`, error);
        container.innerHTML = '<p class="error">Erro ao carregar configurações</p>';
    }
}

// Função para carregar aba Conta
async function loadContaTab(container) {
    // Template inline (sem módulo separado por enquanto)
    container.innerHTML = `
        <div class="config-section">
            <h3>Informações Pessoais</h3>
            <form id="form-dados-pessoais" class="config-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nome Completo</label>
                        <input type="text" id="nome" name="nome" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">OAB</label>
                        <input type="text" id="oab" name="oab" class="form-input" 
                               placeholder="123456/UF" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="email" name="email" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="tel" id="telefone" name="telefone" class="form-input" 
                               placeholder="(11) 98765-4321">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Bind eventos
    const form = container.querySelector('#form-dados-pessoais');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Salvando...';
        
        try {
            // TODO: Implementar salvamento real
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (window.showToast) {
                window.showToast('Dados salvos com sucesso!', 'success');
            }
        } catch (error) {
            if (window.showToast) {
                window.showToast('Erro ao salvar dados', 'error');
            }
        } finally {
            btn.disabled = false;
            btn.textContent = 'Salvar Alterações';
        }
    });
}

// Stubs para outras abas
async function loadBancaTab(container) {
    container.innerHTML = '<p>Configurações da Banca em desenvolvimento...</p>';
}

async function loadIntegracoesTab(container) {
    container.innerHTML = '<p>Integrações em desenvolvimento...</p>';
}

async function loadPublicadorTab(container) {
    container.innerHTML = '<p>Configurações do Publicador em desenvolvimento...</p>';
}

async function loadBancoImagensTab(container) {
    container.innerHTML = '<p>Banco de Imagens em desenvolvimento...</p>';
}