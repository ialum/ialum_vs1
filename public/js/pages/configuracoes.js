/**
 * configuracoes.js
 * Lógica da página de configurações
 * Dependências: notifications.js
 * Usado em: configuracoes
 * Tamanho alvo: <150 linhas
 */

window.IalumModules = window.IalumModules || {};
window.IalumModules.Configuracoes = {
    
    init() {
        this.bindTabs();
        this.bindForms();
        this.bindIntegrations();
        this.bindSchedule();
        this.bindUpload();
    },
    
    // Sistema de abas
    bindTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const panes = document.querySelectorAll('.tab-pane');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remover active de todos
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                
                // Adicionar active no selecionado
                tab.classList.add('active');
                document.getElementById(`tab-${targetTab}`).classList.add('active');
            });
        });
    },
    
    // Formulários com validação
    bindForms() {
        const forms = document.querySelectorAll('.config-form');
        
        forms.forEach(form => {
            // Validação em tempo real
            const inputs = form.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });
            });
            
            // Submit
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validar todos os campos
                let isValid = true;
                inputs.forEach(input => {
                    if (!this.validateInput(input)) {
                        isValid = false;
                    }
                });
                
                if (isValid) {
                    // Simular salvamento
                    const btn = form.querySelector('button[type="submit"]');
                    const originalText = btn.textContent;
                    
                    btn.disabled = true;
                    btn.textContent = 'Salvando...';
                    
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.textContent = originalText;
                        
                        // Mostrar notificação
                        window.showToast('Configurações salvas com sucesso!', 'success');
                    }, 1000);
                }
            });
        });
    },
    
    // Validar input
    validateInput(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            return false;
        }
        
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                return false;
            }
        }
        
        input.classList.remove('error');
        return true;
    },
    
    // Integrações
    bindIntegrations() {
        const btns = document.querySelectorAll('.integration-item button');
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.integration-item');
                const isConnected = item.classList.contains('connected');
                
                if (isConnected) {
                    if (confirm('Deseja realmente desconectar esta rede social?')) {
                        item.classList.remove('connected');
                        btn.textContent = 'Conectar';
                        btn.classList.remove('btn-ghost');
                        btn.classList.add('btn-primary');
                        
                        window.showToast('Rede social desconectada', 'info');
                    }
                } else {
                    // Simular conexão
                    window.showToast('Redirecionando para autorização...', 'info');
                    
                    setTimeout(() => {
                        item.classList.add('connected');
                        btn.textContent = 'Desconectar';
                        btn.classList.remove('btn-primary');
                        btn.classList.add('btn-ghost');
                        
                        window.showToast('Rede social conectada com sucesso!', 'success');
                    }, 2000);
                }
            });
        });
    },
    
    // Horários
    bindSchedule() {
        const checkboxes = document.querySelectorAll('.schedule-day input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const timeInput = checkbox.closest('.schedule-day').querySelector('input[type="time"]');
            
            checkbox.addEventListener('change', () => {
                timeInput.disabled = !checkbox.checked;
            });
        });
    },
    
    // Upload de imagens
    bindUpload() {
        const uploadArea = document.querySelector('.upload-placeholder');
        const uploadInput = document.querySelector('.upload-input');
        
        if (uploadArea && uploadInput) {
            uploadArea.addEventListener('click', () => {
                uploadInput.click();
            });
            
            uploadInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        console.log('Upload:', file.name);
                        window.showToast(`Imagem ${file.name} adicionada`, 'success');
                    }
                });
            });
            
            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary)';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '';
                
                const files = Array.from(e.dataTransfer.files);
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        console.log('Drop:', file.name);
                        window.showToast(`Imagem ${file.name} adicionada`, 'success');
                    }
                });
            });
        }
    }
};