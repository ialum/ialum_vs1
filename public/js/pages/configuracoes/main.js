/**
 * configuracoes/main.js
 * Controlador principal da página de configurações
 * Gerencia as abas e carrega módulos específicos
 * Tamanho alvo: <150 linhas
 */

export async function init() {
    console.log('Inicializando página de Configurações...');
    
    // Bind dos botões de abas
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            loadTab(btn.dataset.tab);
            
            // Atualizar estado ativo dos botões
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Parse URL to get requested tab
    const hash = window.location.hash.substring(1);
    const parts = hash.split('/');
    const requestedTab = parts[1] || 'banca'; // Default to 'banca' if no tab specified
    
    // Atualizar estado ativo do botão da aba solicitada
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === requestedTab);
    });
    
    // Carrega a aba solicitada
    await loadTab(requestedTab);
}

async function loadTab(tabName) {
    try {
        // Remove active de todas as abas
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Ativa a aba selecionada
        const targetTab = document.getElementById(`tab-${tabName}`);
        if (!targetTab) {
            console.error(`Aba não encontrada: tab-${tabName}`);
            return;
        }
        
        targetTab.classList.add('active');
        
        // Carrega módulo da aba (apenas se existir)
        try {
            const module = await import(`./${tabName}.js`);
            if (module.init) {
                module.init();
            }
        } catch (moduleError) {
            console.warn(`Módulo ${tabName}.js não encontrado ou erro ao carregar:`, moduleError);
            // Mostrar placeholder para abas não implementadas
            if (targetTab) {
                targetTab.innerHTML = `
                    <div class="tab-placeholder">
                        <div class="placeholder-icon">🚧</div>
                        <h3>Em desenvolvimento</h3>
                        <p>Esta seção está sendo desenvolvida e estará disponível em breve.</p>
                    </div>
                `;
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar aba:', error);
    }
}