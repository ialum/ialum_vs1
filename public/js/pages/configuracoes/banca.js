/**
 * banca.js
 * Lógica da aba Banca nas configurações
 * Dependências: config-list.js, validators.js
 * Localização: public/js/pages/configuracoes/banca.js
 * Tamanho alvo: <150 linhas
 */

import { ConfigList } from '../../components/config-list.js';
import { validators, combineValidators } from '../../utils/validators.js';

let temasJuridicosList = null;

export async function init() {
    const container = document.getElementById('tab-banca');
    
    try {
        // Renderiza o template da página
        container.innerHTML = getTemplate();
        
        // Inicializa seção de Temas Jurídicos
        await initTemasJuridicos();
        
        console.log('Aba Banca inicializada com sucesso');
        
    } catch (error) {
        console.error('Erro ao inicializar aba banca:', error);
        container.innerHTML = '<p class="error">Erro ao carregar configurações da banca</p>';
    }
}

// Template HTML da aba Banca usando componentes modulares
function getTemplate() {
    return `
        <!-- Seção de Temas Jurídicos -->
        <div class="page-section">
            <div class="section-header">
                <h3 class="section-title">Temas Jurídicos</h3>
                <p class="section-description">
                    Configure os temas jurídicos que sua banca atua. Cada tema deve começar com um emoji 
                    e ter uma descrição que ajudará a IA a contextualizar melhor o conteúdo.
                </p>
            </div>
            
            <div class="section-content">
                <div id="temas-juridicos-container">
                    <!-- ConfigList será renderizado aqui -->
                </div>
            </div>
        </div>

        <!-- Placeholder para futuras seções -->
        <div class="page-section">
            <div class="section-header">
                <h3 class="section-title">Outras Configurações</h3>
                <p class="section-description">
                    Mais seções serão adicionadas aqui (Identidade Visual, Linhas Narrativas, etc.)
                </p>
            </div>
            
            <div class="section-content">
                <div class="tab-placeholder">
                    <div class="placeholder-icon">🔧</div>
                    <h3>Em breve</h3>
                    <p>Identidade Visual, Linhas Narrativas e outras configurações serão implementadas em breve.</p>
                </div>
            </div>
        </div>
    `;
}

// Inicializa a seção de Temas Jurídicos
async function initTemasJuridicos() {
    const container = document.getElementById('temas-juridicos-container');
    
    // Configuração específica para Temas Jurídicos
    const temasConfig = {
        type: 'temas',
        fields: [
            {
                name: 'nome',
                type: 'text',
                placeholder: '🏛️ Nome do Tema (máx. 20 caracteres)',
                maxLength: 20
            },
            {
                name: 'descricao',
                type: 'textarea',
                placeholder: 'Descreva como a IA deve contextualizar este tema jurídico...',
                rows: 4
            }
        ],
        validators: {
            nome: combineValidators(
                validators.required,
                validators.maxLength(20),
                validators.startsWithEmoji
            ),
            descricao: validators.required
        },
        items: await loadTemasExistentes()
    };

    // Criar instância do ConfigList
    temasJuridicosList = new ConfigList(container, temasConfig);

    // Configurar callbacks
    temasJuridicosList.onItemCreated = async (item) => {
        console.log('Novo tema criado:', item);
        await saveTema(item);
        showToast('Tema jurídico criado com sucesso!', 'success');
    };

    temasJuridicosList.onItemSaved = async (item) => {
        console.log('Tema atualizado:', item);
        await saveTema(item);
        showToast('Tema jurídico atualizado!', 'success');
    };

    temasJuridicosList.onItemDeleted = async (id) => {
        console.log('Tema deletado:', id);
        await deleteTema(id);
        showToast('Tema jurídico removido!', 'warning');
    };
}

// Carregar temas existentes (mock)
async function loadTemasExistentes() {
    try {
        // TODO: Substituir por chamada real à API
        const mockTemas = [
            {
                id: '1',
                nome: '⚡ Energia Solar',
                descricao: 'Revisão de contratos de aquisição de usinas de energia solar, promessas e garantias feitas no momento da venda'
            },
            {
                id: '2', 
                nome: '🧩 Autismo ABA',
                descricao: 'Questões legais acerca de diagnósticos do autismo e processos administrativos judiciais para garantir os direitos do autista'
            }
        ];
        
        console.log('Temas carregados:', mockTemas);
        return mockTemas;
        
    } catch (error) {
        console.error('Erro ao carregar temas:', error);
        return [];
    }
}

// Salvar tema (criar ou atualizar)
async function saveTema(tema) {
    try {
        // TODO: Implementar chamada real à API
        console.log('Salvando tema:', tema);
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { success: true, tema };
        
    } catch (error) {
        console.error('Erro ao salvar tema:', error);
        throw error;
    }
}

// Deletar tema
async function deleteTema(id) {
    try {
        // TODO: Implementar chamada real à API
        console.log('Deletando tema:', id);
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return { success: true };
        
    } catch (error) {
        console.error('Erro ao deletar tema:', error);
        throw error;
    }
}

// Função helper para mostrar toast
function showToast(message, type = 'info') {
    // Usar sistema de notificações existente ou console
    if (window.showToast) {
        window.showToast(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Exportar métodos públicos se necessário
export { temasJuridicosList };