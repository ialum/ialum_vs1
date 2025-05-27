/**
 * configuracoes/conta.js
 * Lógica específica da aba Conta
 * Tamanho alvo: <150 linhas
 */

export function init() {
    const container = document.getElementById('tab-conta');
    
    // Renderiza o conteúdo
    container.innerHTML = getTemplate();
    
    // Bind dos eventos
    bindEvents();
    
    // Carrega dados
    loadData();
}

function getTemplate() {
    return `
        <form id="form-conta" class="config-form">
            <div class="form-group">
                <label>Nome Completo</label>
                <input type="text" name="nome" class="form-input">
            </div>
            <!-- resto do formulário -->
        </form>
    `;
}

function bindEvents() {
    document.getElementById('form-conta').addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
    e.preventDefault();
    // Salva via API
}