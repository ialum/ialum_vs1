/**
 * login.js
 * Lógica da página de login
 * Dependências: api.js, validators.js, cache.js
 * Localização: public/js/pages/login.js
 * Tamanho alvo: <150 linhas
 */

import { auth } from '../core/api.js';
import { validators } from '../core/validators.js';
import { Cache } from '../core/cache.js';
// Verificar se o usuário já está logado

// Remover auto-inicialização (será chamado do HTML)

function init() {
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Verificar se tem mensagem de sucesso de registro
    checkRegistrationSuccess();
    
    // Auto-focus no email
    focusEmailField();
}

// Mostrar mensagem
function showMessage(text, type = 'error') {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) return;
    
    messageContainer.innerHTML = `
        <div class="message message-${type}">
            ${text}
        </div>
    `;
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 5000);
}

// Handle do login
async function handleLogin(e) {
    e.preventDefault();
    
    // Pegar valores
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[name="remember"]').checked;
    
    // Validações básicas
    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos.');
        return;
    }
    
    if (validators.email(email)) {
        showMessage('Por favor, insira um email válido.');
        return;
    }
    
    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    // Desabilitar botão
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';
    
    try {
        // Chamar API de login
        const response = await auth.login(email, password);
        
        if (response.success || response.token) {
            showMessage('Login realizado com sucesso! Redirecionando...', 'success');
            
            // Salvar "lembrar de mim" se marcado
            if (remember) {
                Cache.set('remember_email', email, 30 * 24 * 60); // 30 dias
            } else {
                Cache.remove('remember_email');
            }
            
            // Aguardar um pouco para mostrar a mensagem
            setTimeout(() => {
                window.location.href = '/app.html';
            }, 1000);
        } else {
            showMessage(response.message || 'Email ou senha inválidos', 'error');
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        
        // Mensagem de erro mais específica
        if (error.timeout) {
            showMessage('Tempo esgotado. Verifique sua conexão.');
        } else if (error.status === 401) {
            showMessage('Email ou senha incorretos.');
        } else {
            showMessage('Erro ao fazer login. Tente novamente.');
        }
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.textContent = btnText;
    }
}

// Verificar mensagem de registro
function checkRegistrationSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showMessage('Conta criada com sucesso! Faça login para continuar.', 'success');
    }
}

// Focus no campo de email
function focusEmailField() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        // Verificar se tem email salvo
        const savedEmail = Cache.get('remember_email');
        if (savedEmail) {
            emailInput.value = savedEmail;
            // Focus na senha se email já preenchido
            document.getElementById('password')?.focus();
        } else {
            emailInput.focus();
        }
    }
}

// Exportar init se necessário
export { init };