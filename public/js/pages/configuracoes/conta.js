/**
 * configuracoes/conta.js
 * Lógica específica da aba Conta
 * Dependências: api.js, notifications.js
 * Localização: public/js/pages/configuracoes/conta.js
 * Tamanho alvo: <150 linhas
 */

import { API } from '../../core/api.js';
import { showToast } from '../../components/notifications.js';

export async function init() {
    const container = document.getElementById('tab-conta');
    
    try {
        // Renderiza o template
        container.innerHTML = getTemplate();
        
        // Bind dos eventos
        bindEvents();
        
        // Carrega dados existentes
        await loadData();
        
    } catch (error) {
        console.error('Erro ao inicializar aba conta:', error);
        container.innerHTML = '<p class="error">Erro ao carregar configurações</p>';
    }
}

function getTemplate() {
    return `
        <div class="config-section">
            <h3>Informações Pessoais</h3>
            <form id="form-conta" class="config-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nome Completo</label>
                        <input type="text" name="nome" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-input" disabled>
                        <span class="form-hint">Email não pode ser alterado</span>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">CPF</label>
                        <input type="text" name="cpf" class="form-input" 
                               placeholder="000.000.000-00" maxlength="14">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="tel" name="telefone" class="form-input" 
                               placeholder="(00) 00000-0000" maxlength="15">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">OAB</label>
                    <input type="text" name="oab" class="form-input" 
                           placeholder="Ex: SP123456">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
        
        <div class="config-section">
            <h3>Segurança</h3>
            <form id="form-senha" class="config-form">
                <div class="form-group">
                    <label class="form-label">Senha Atual</label>
                    <input type="password" name="senha_atual" class="form-input" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nova Senha</label>
                        <input type="password" name="nova_senha" class="form-input" 
                               minlength="6" required>
                        <span class="form-hint">Mínimo 6 caracteres</span>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Confirmar Nova Senha</label>
                        <input type="password" name="confirmar_senha" class="form-input" 
                               minlength="6" required>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-secondary">
                        Alterar Senha
                    </button>
                </div>
            </form>
        </div>
    `;
}

function bindEvents() {
    // Form conta
    const formConta = document.getElementById('form-conta');
    if (formConta) {
        formConta.addEventListener('submit', handleSubmitConta);
        
        // Máscaras
        const cpfInput = formConta.querySelector('input[name="cpf"]');
        const telefoneInput = formConta.querySelector('input[name="telefone"]');
        
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                e.target.value = maskCPF(e.target.value);
            });
        }
        
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                e.target.value = maskPhone(e.target.value);
            });
        }
    }
    
    // Form senha
    const formSenha = document.getElementById('form-senha');
    if (formSenha) {
        formSenha.addEventListener('submit', handleSubmitSenha);
    }
}

async function loadData() {
    try {
        // TODO: Buscar dados reais da API
        // const response = await API.data.getSettings();
        
        // Por enquanto, usar dados mockados
        const mockData = {
            nome: 'Dr. João Silva',
            email: 'joao@advocacia.com.br',
            cpf: '123.456.789-00',
            telefone: '(11) 98765-4321',
            oab: 'SP123456'
        };
        
        // Preencher formulário
        const form = document.getElementById('form-conta');
        if (form) {
            form.nome.value = mockData.nome || '';
            form.email.value = mockData.email || '';
            form.cpf.value = mockData.cpf || '';
            form.telefone.value = mockData.telefone || '';
            form.oab.value = mockData.oab || '';
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro ao carregar dados da conta', 'error');
    }
}

async function handleSubmitConta(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    
    try {
        // TODO: Implementar chamada real
        // await API.actions.saveSettings(data);
        
        // Simular salvamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Dados salvos com sucesso!', 'success');
        
    } catch (error) {
        showToast('Erro ao salvar dados', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

async function handleSubmitSenha(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const senhaAtual = formData.get('senha_atual');
    const novaSenha = formData.get('nova_senha');
    const confirmarSenha = formData.get('confirmar_senha');
    
    // Validações
    if (novaSenha !== confirmarSenha) {
        showToast('As senhas não coincidem', 'error');
        return;
    }
    
    if (novaSenha.length < 6) {
        showToast('A nova senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Alterando...';
    
    try {
        // TODO: Implementar chamada real
        // await API.auth.changePassword(senhaAtual, novaSenha);
        
        // Simular alteração
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Senha alterada com sucesso!', 'success');
        
        // Limpar formulário
        e.target.reset();
        
    } catch (error) {
        showToast('Erro ao alterar senha', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// Funções auxiliares de máscara
function maskCPF(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
}

function maskPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    return value;
}