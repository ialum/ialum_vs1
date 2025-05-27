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
        btn.addEventListener('click', () => loadTab(btn.dataset.tab));
    });
    
    // Carrega aba inicial
    await loadTab('conta');
}

async function loadTab(tabName) {
    // Remove active de todas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Ativa a selecionada
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Carrega módulo da aba
    const module = await import(`./${tabName}.js`);
    module.init();
}