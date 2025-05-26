/**
 * conta.js
 * Lógica da aba Conta nas configurações
 * Dependências: api.js, notifications.js
 * Localização: public/js/pages/configuracoes/conta.js
 * Tamanho alvo: <150 linhas
 */

export async function init() {
    const container = document.getElementById('tab-conta');
    
    try {
        // Renderiza o template
        container.innerHTML = getTemplate();
        
        // Carrega dados existentes
        await loadUserData();
        
        // Bind dos eventos
        bindEvents();
        
    } catch (error) {
        console.error('Erro ao inicializar aba conta:', error);
        container.innerHTML = '<p class="error">Erro ao carregar configurações</p>';
    }
}

// Template HTML da aba
function getTemplate() {
    return `
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
                        <span class="btn-text">Salvar Alterações</span>
                    </button>
                </div>
            </form>
        </div>

        <div class="config-section">
            <h3>Dados do Escritório</h3>
            <form id="form-escritorio" class="config-form">
                <div class="form-group">
                    <label class="form-label">Nome do Escritório</label>
                    <input type="text" id="nome-escritorio" name="nome_escritorio" 
                           class="form-input">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">CNPJ</label>
                        <input type="text" id="cnpj" name="cnpj" class="form-input" 
                               placeholder="00.000.000/0000-00">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Inscrição Estadual</label>
                        <input type="text" id="inscricao-estadual" name="inscricao_estadual" 
                               class="form-input">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Endereço Completo</label>
                    <textarea id="endereco" name="endereco" class="form-input form-textarea" 
                              rows="3" placeholder="Rua, número, complemento, bairro, cidade/UF"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <span class="btn-text">Salvar Dados do Escritório</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Carrega dados do usuário via API
async function loadUserData() {
    try {
        // Simula busca de dados (substituir por chamada real)
        const response = await window.IalumModules.API.get('/data/user-settings');
        
        if (response.success) {
            fillForm(response.data);
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Continua sem preencher (formulário vazio)
    }
}

// Preenche o formulário com os dados
function fillForm(data) {
    // Dados pessoais
    if (data.nome) document.getElementById('nome').value = data.nome;
    if (data.oab) document.getElementById('oab').value = data.oab;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.telefone) document.getElementById('telefone').value = data.telefone;
    
    // Dados do escritório
    if (data.nome_escritorio) document.getElementById('nome-escritorio').value = data.nome_escritorio;
    if (data.cnpj) document.getElementById('cnpj').value = data.cnpj;
    if (data.inscricao_estadual) document.getElementById('inscricao-estadual').value = data.inscricao_estadual;
    if (data.endereco) document.getElementById('endereco').value = data.endereco;
}

// Bind dos eventos
function bindEvents() {
    // Form dados pessoais
    document.getElementById('form-dados-pessoais').addEventListener('submit', handleSubmitPessoal);
    
    // Form escritório
    document.getElementById('form-escritorio').addEventListener('submit', handleSubmitEscritorio);
    
    // Máscaras (se tiver biblioteca de máscaras)
    // applyMasks();
}

// Submit dados pessoais
async function handleSubmitPessoal(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Desabilita botão
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-small"></span> Salvando...';
    
    try {
        const response = await window.IalumModules.API.post('/actions/save-personal-data', data);
        
        if (response.success) {
            window.showToast('Dados pessoais salvos com sucesso!', 'success');
        } else {
            throw new Error(response.message || 'Erro ao salvar');
        }
    } catch (error) {
        window.showToast('Erro ao salvar dados pessoais', 'error');
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Salvar Alterações</span>';
    }
}

// Submit dados escritório
async function handleSubmitEscritorio(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-small"></span> Salvando...';
    
    try {
        const response = await window.IalumModules.API.post('/actions/save-office-data', data);
        
        if (response.success) {
            window.showToast('Dados do escritório salvos com sucesso!', 'success');
        } else {
            throw new Error(response.message || 'Erro ao salvar');
        }
    } catch (error) {
        window.showToast('Erro ao salvar dados do escritório', 'error');
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Salvar Dados do Escritório</span>';
    }
}