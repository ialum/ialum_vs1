/**
 * login.js
 * Lógica da página de login
 * Dependências: Nenhuma (por enquanto)
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
                // TODO: Integrar com Supabase Auth
                // Por enquanto, simular login
                console.log('Login:', { email, password, remember });
                
                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                
              // Chamar API real
                const response = await window.IalumModules.API.auth.login(email, password);

                if (response.success) {
                    showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                    setTimeout(() => {
                        window.location.href = '/app.html';
                    }, 1000);
                } else {
                    showMessage(response.message || 'Email ou senha inválidos', 'error');
                }
                
            } catch (error) {
                showMessage('Erro ao fazer login. Tente novamente.');
                console.error('Erro:', error);
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