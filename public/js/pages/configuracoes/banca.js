/**
 * banca.js
 * Lógica da aba Banca nas configurações
 * Dependências: api.js, notifications.js
 * Localização: public/js/pages/configuracoes/banca.js
 * Tamanho alvo: <150 linhas
 */

export async function init() {
    const container = document.getElementById('tab-banca');
    
    try {
        // Renderiza o template
        container.innerHTML = getTemplate();
        
        // Carrega dados existentes
        await loadBancaData();
        
        // Bind dos eventos
        bindEvents();
        
    } catch (error) {
        console.error('Erro ao inicializar aba banca:', error);
        container.innerHTML = '<p class="error">Erro ao carregar configurações</p>';
    }
}

// Template HTML da aba
function getTemplate() {
    return `
        <div class="config-section">
            <h3>Áreas de Atuação</h3>
            <p class="section-description">
                Selecione as áreas jurídicas em que você atua. Isso nos ajuda a personalizar o conteúdo.
            </p>
            
            <div class="areas-grid" id="areas-grid">
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="familia">
                    <div class="checkbox-card-content">
                        <span class="area-icon">👨‍👩‍👧‍👦</span>
                        <span class="area-name">Família</span>
                    </div>
                </label>
                
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="consumidor">
                    <div class="checkbox-card-content">
                        <span class="area-icon">🛒</span>
                        <span class="area-name">Consumidor</span>
                    </div>
                </label>
                
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="trabalhista">
                    <div class="checkbox-card-content">
                        <span class="area-icon">💼</span>
                        <span class="area-name">Trabalhista</span>
                    </div>
                </label>
                
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="empresarial">
                    <div class="checkbox-card-content">
                        <span class="area-icon">🏢</span>
                        <span class="area-name">Empresarial</span>
                    </div>
                </label>
                
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="criminal">
                    <div class="checkbox-card-content">
                        <span class="area-icon">⚖️</span>
                        <span class="area-name">Criminal</span>
                    </div>
                </label>
                
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="civil">
                    <div class="checkbox-card-content">
                        <span class="area-icon">📜</span>
                        <span class="area-name">Civil</span>
                    </div>
                </label>
                
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="tributario">
                    <div class="checkbox-card-content">
                        <span class="area-icon">💰</span>
                        <span class="area-name">Tributário</span>
                    </div>
                </label>
                
                <label class="checkbox-card">
                    <input type="checkbox" name="areas" value="imobiliario">
                    <div class="checkbox-card-content">
                        <span class="area-icon">🏠</span>
                        <span class="area-name">Imobiliário</span>
                    </div>
                </label>
            </div>
        </div>

        <div class="config-section">
            <h3>Estilo de Comunicação</h3>
            <form id="form-estilo" class="config-form">
                <div class="form-group">
                    <label class="form-label">Tom de Voz</label>
                    <select name="tom_voz" class="form-select" required>
                        <option value="">Selecione...</option>
                        <option value="formal">Formal e Técnico</option>
                        <option value="profissional">Profissional mas Acessível</option>
                        <option value="casual">Casual e Próximo</option>
                        <option value="educativo">Educativo e Didático</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Público-Alvo Principal</label>
                    <select name="publico_alvo" class="form-select" required>
                        <option value="">Selecione...</option>
                        <option value="empresas">Empresas e Empresários</option>
                        <option value="pessoas_fisicas">Pessoas Físicas</option>
                        <option value="ambos">Ambos</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Objetivos do Marketing</label>
                    <textarea name="objetivos" class="form-input form-textarea" rows="3" 
                        placeholder="Ex: Educar sobre direitos, atrair novos clientes, construir autoridade..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Salvar Preferências
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Carrega dados salvos
async function loadBancaData() {
    try {
        // TODO: Substituir por chamada real
        const mockData = {
            areas: ['familia', 'consumidor', 'civil'],
            tom_voz: 'profissional',
            publico_alvo: 'pessoas_fisicas',
            objetivos: 'Educar clientes sobre seus direitos e construir autoridade no mercado'
        };
        
        // Marcar áreas selecionadas
        mockData.areas.forEach(area => {
            const checkbox = document.querySelector(`input[value="${area}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        // Preencher formulário de estilo
        if (mockData.tom_voz) {
            document.querySelector(`select[name="tom_voz"]`).value = mockData.tom_voz;
        }
        if (mockData.publico_alvo) {
            document.querySelector(`select[name="publico_alvo"]`).value = mockData.publico_alvo;
        }
        if (mockData.objetivos) {
            document.querySelector(`textarea[name="objetivos"]`).value = mockData.objetivos;
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Bind dos eventos
function bindEvents() {
    // Salvar ao clicar em áreas
    const checkboxes = document.querySelectorAll('input[name="areas"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveAreas();
        });
    });
    
    // Form de estilo
    document.getElementById('form-estilo').addEventListener('submit', handleSubmitEstilo);
}

// Salvar áreas selecionadas
async function saveAreas() {
    const selectedAreas = Array.from(document.querySelectorAll('input[name="areas"]:checked'))
        .map(cb => cb.value);
    
    try {
        // TODO: Implementar chamada real
        console.log('Salvando áreas:', selectedAreas);
        window.showToast('Áreas atualizadas!', 'success');
    } catch (error) {
        window.showToast('Erro ao salvar áreas', 'error');
    }
}

// Submit do formulário de estilo
async function handleSubmitEstilo(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    
    try {
        // TODO: Implementar chamada real
        console.log('Salvando estilo:', data);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.showToast('Preferências de estilo salvas!', 'success');
        
    } catch (error) {
        window.showToast('Erro ao salvar preferências', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Salvar Preferências';
    }
}