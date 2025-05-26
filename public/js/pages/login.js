/**
 * login.js
 * Lógica da página de login
 * Dependências: api.js, utils.js
 * Usado em: login.html
 * Tamanho alvo: <200 linhas
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');
    
    // Validação de email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Mostrar mensagem
    function showMessage(text, type = 'error') {
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
    
    // Submit do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
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
            
            if (!isValidEmail(email)) {
                showMessage('Por favor, insira um email válido.');
                return;
            }
            
            if (password.length < 6) {
                showMessage('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            // Desabilitar botão
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Entrando...';
            
            try {
                // Verificar se API está disponível
                if (!window.IalumModules || !window.IalumModules.API) {
                    throw new Error('Módulo API não carregado');
                }
                
                // Chamar API de login
                const response = await window.IalumModules.API.auth.login(email, password);
                
                if (response.success || response.token) {
                    showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                    
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
                if (error.message === 'Módulo API não carregado') {
                    showMessage('Erro de configuração. Por favor, recarregue a página.');
                } else if (error.timeout) {
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
        });
    }
    
    // Verificar se tem mensagem de sucesso de registro
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showMessage('Conta criada com sucesso! Faça login para continuar.', 'success');
    }
    
    // Auto-focus no email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.focus();
    }
});