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
                
                // Simular sucesso
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = '/app';
                }, 2000);
                
                /* Código real seria algo como:
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                
                if (error) {
                    showMessage(error.message);
                } else {
                    // Salvar token se "lembrar de mim"
                    if (remember) {
                        localStorage.setItem('remember_me', 'true');
                    }
                    window.location.href = '/app';
                }
                */
                
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