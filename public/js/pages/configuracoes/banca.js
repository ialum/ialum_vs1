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
let linhasNarrativasList = null;
let identidadeVisualForm = null;

export async function init() {
    const container = document.getElementById('tab-banca');
    
    try {
        // Renderiza o template da página
        container.innerHTML = getTemplate();
        
        // Inicializa todas as seções
        await initTemasJuridicos();
        await initLinhasNarrativas();
        await initIdentidadeVisual();
        
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

        <!-- Seção de Linhas Narrativas -->
        <div class="page-section">
            <div class="section-header">
                <h3 class="section-title">Linhas Narrativas</h3>
                <p class="section-description">
                    Defina as linhas narrativas que orientam a comunicação da sua banca. 
                    Estas diretrizes ajudam a IA a manter consistência no tom e abordagem.
                </p>
            </div>
            
            <div class="section-content">
                <div id="linhas-narrativas-container">
                    <!-- ConfigList será renderizado aqui -->
                </div>
            </div>
        </div>

        <!-- Seção de Identidade Visual -->
        <div class="page-section">
            <div class="section-header">
                <h3 class="section-title">Identidade Visual</h3>
                <p class="section-description">
                    Configure as cores, fontes e elementos visuais que representam sua banca.
                    Essas configurações serão usadas nos materiais gerados pela IA.
                </p>
            </div>
            
            <div class="section-content">
                <div id="identidade-visual-container">
                    <!-- Formulário de identidade visual será renderizado aqui -->
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

// Inicializa a seção de Linhas Narrativas
async function initLinhasNarrativas() {
    const container = document.getElementById('linhas-narrativas-container');
    
    // Configuração específica para Linhas Narrativas
    const linhasConfig = {
        type: 'linhas_narrativas',
        fields: [
            {
                name: 'titulo',
                type: 'text',
                placeholder: 'Título da linha narrativa (ex: Tom Profissional)',
                maxLength: 50
            },
            {
                name: 'descricao',
                type: 'textarea',
                placeholder: 'Descreva como a IA deve aplicar esta linha narrativa na comunicação...',
                rows: 4
            },
            {
                name: 'exemplo',
                type: 'textarea',
                placeholder: 'Exemplo prático de aplicação desta linha narrativa...',
                rows: 3
            }
        ],
        validators: {
            titulo: combineValidators(
                validators.required,
                validators.maxLength(50)
            ),
            descricao: validators.required,
            exemplo: validators.required
        },
        items: await loadLinhasExistentes()
    };

    // Criar instância do ConfigList
    linhasNarrativasList = new ConfigList(container, linhasConfig);

    // Configurar callbacks
    linhasNarrativasList.onItemCreated = async (item) => {
        console.log('Nova linha narrativa criada:', item);
        await saveLinhaNarrativa(item);
        showToast('Linha narrativa criada com sucesso!', 'success');
    };

    linhasNarrativasList.onItemSaved = async (item) => {
        console.log('Linha narrativa atualizada:', item);
        await saveLinhaNarrativa(item);
        showToast('Linha narrativa atualizada!', 'success');
    };

    linhasNarrativasList.onItemDeleted = async (id) => {
        console.log('Linha narrativa deletada:', id);
        await deleteLinhanarativa(id);
        showToast('Linha narrativa removida!', 'warning');
    };
}

// Inicializa a seção de Identidade Visual
async function initIdentidadeVisual() {
    const container = document.getElementById('identidade-visual-container');
    
    // Carrega dados existentes
    const identidadeData = await loadIdentidadeVisual();
    
    // Renderiza formulário usando classes base
    container.innerHTML = createIdentidadeVisualForm(identidadeData);
    
    // Bind eventos
    bindIdentidadeVisualEvents();
}

function createIdentidadeVisualForm(data = {}) {
    return `
        <form id="identidade-visual-form" class="grid grid-cols-2 gap-lg mobile-grid-cols-1">
            <!-- Cores -->
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">🎨 Cores da Marca</h4>
                </div>
                <div class="card-body stack-md">
                    <div class="form-group">
                        <label class="form-label">Cor Primária</label>
                        <div class="flex gap-sm items-center">
                            <input type="color" 
                                   class="form-control" 
                                   name="cor_primaria" 
                                   value="${data.cor_primaria || '#2563eb'}"
                                   style="width: 60px; height: 40px;">
                            <input type="text" 
                                   class="form-control flex-1" 
                                   name="cor_primaria_hex" 
                                   value="${data.cor_primaria || '#2563eb'}"
                                   placeholder="#2563eb">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cor Secundária</label>
                        <div class="flex gap-sm items-center">
                            <input type="color" 
                                   class="form-control" 
                                   name="cor_secundaria" 
                                   value="${data.cor_secundaria || '#64748b'}"
                                   style="width: 60px; height: 40px;">
                            <input type="text" 
                                   class="form-control flex-1" 
                                   name="cor_secundaria_hex" 
                                   value="${data.cor_secundaria || '#64748b'}"
                                   placeholder="#64748b">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cor de Destaque</label>
                        <div class="flex gap-sm items-center">
                            <input type="color" 
                                   class="form-control" 
                                   name="cor_destaque" 
                                   value="${data.cor_destaque || '#10b981'}"
                                   style="width: 60px; height: 40px;">
                            <input type="text" 
                                   class="form-control flex-1" 
                                   name="cor_destaque_hex" 
                                   value="${data.cor_destaque || '#10b981'}"
                                   placeholder="#10b981">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tipografia -->
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">📝 Tipografia</h4>
                </div>
                <div class="card-body stack-md">
                    <div class="form-group">
                        <label class="form-label">Fonte Principal</label>
                        <select class="form-select" name="fonte_principal">
                            <option value="Inter" ${data.fonte_principal === 'Inter' ? 'selected' : ''}>Inter (Padrão)</option>
                            <option value="Roboto" ${data.fonte_principal === 'Roboto' ? 'selected' : ''}>Roboto</option>
                            <option value="Open Sans" ${data.fonte_principal === 'Open Sans' ? 'selected' : ''}>Open Sans</option>
                            <option value="Lato" ${data.fonte_principal === 'Lato' ? 'selected' : ''}>Lato</option>
                            <option value="Poppins" ${data.fonte_principal === 'Poppins' ? 'selected' : ''}>Poppins</option>
                            <option value="Montserrat" ${data.fonte_principal === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Estilo de Texto</label>
                        <select class="form-select" name="estilo_texto">
                            <option value="moderno" ${data.estilo_texto === 'moderno' ? 'selected' : ''}>Moderno e Clean</option>
                            <option value="classico" ${data.estilo_texto === 'classico' ? 'selected' : ''}>Clássico e Formal</option>
                            <option value="humanizado" ${data.estilo_texto === 'humanizado' ? 'selected' : ''}>Humanizado</option>
                            <option value="tecnico" ${data.estilo_texto === 'tecnico' ? 'selected' : ''}>Técnico</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tamanho Base (px)</label>
                        <input type="number" 
                               class="form-control" 
                               name="tamanho_base" 
                               value="${data.tamanho_base || 16}"
                               min="12" 
                               max="24">
                    </div>
                </div>
            </div>
            
            <!-- Logo -->
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">🖼️ Logo</h4>
                </div>
                <div class="card-body stack-md">
                    <div class="form-group">
                        <label class="form-label">Upload do Logo</label>
                        <div class="form-dropzone" id="logo-dropzone">
                            <div class="text-center">
                                <span style="font-size: 2rem;">📁</span>
                                <p class="mt-sm mb-sm">Arraste seu logo aqui ou clique para selecionar</p>
                                <p class="text-muted text-sm">PNG, JPG ou SVG até 5MB</p>
                            </div>
                            <input type="file" id="logo-input" accept="image/*" style="display: none;">
                        </div>
                        ${data.logo_url ? `
                            <div class="mt-md">
                                <img src="${data.logo_url}" alt="Logo atual" class="border rounded" style="max-width: 200px; max-height: 100px;">
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Posição do Logo</label>
                        <select class="form-select" name="logo_posicao">
                            <option value="esquerda" ${data.logo_posicao === 'esquerda' ? 'selected' : ''}>Esquerda</option>
                            <option value="centro" ${data.logo_posicao === 'centro' ? 'selected' : ''}>Centro</option>
                            <option value="direita" ${data.logo_posicao === 'direita' ? 'selected' : ''}>Direita</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Estilo Geral -->
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">🎭 Estilo Geral</h4>
                </div>
                <div class="card-body stack-md">
                    <div class="form-group">
                        <label class="form-label">Tom Visual</label>
                        <select class="form-select" name="tom_visual">
                            <option value="profissional" ${data.tom_visual === 'profissional' ? 'selected' : ''}>Profissional</option>
                            <option value="moderno" ${data.tom_visual === 'moderno' ? 'selected' : ''}>Moderno</option>
                            <option value="conservador" ${data.tom_visual === 'conservador' ? 'selected' : ''}>Conservador</option>
                            <option value="inovador" ${data.tom_visual === 'inovador' ? 'selected' : ''}>Inovador</option>
                            <option value="acessivel" ${data.tom_visual === 'acessivel' ? 'selected' : ''}>Acessível</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Elementos Visuais Preferidos</label>
                        <div class="stack-xs">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="elementos[]" value="icones" id="elem-icones" ${data.elementos?.includes('icones') ? 'checked' : ''}>
                                <label class="form-check-label" for="elem-icones">Ícones</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="elementos[]" value="graficos" id="elem-graficos" ${data.elementos?.includes('graficos') ? 'checked' : ''}>
                                <label class="form-check-label" for="elem-graficos">Gráficos</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="elementos[]" value="ilustracoes" id="elem-ilustracoes" ${data.elementos?.includes('ilustracoes') ? 'checked' : ''}>
                                <label class="form-check-label" for="elem-ilustracoes">Ilustrações</label>
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="elementos[]" value="fotos" id="elem-fotos" ${data.elementos?.includes('fotos') ? 'checked' : ''}>
                                <label class="form-check-label" for="elem-fotos">Fotografias</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        
        <!-- Botões de ação -->
        <div class="flex justify-end gap-md mt-lg">
            <button type="button" class="btn btn-secondary" id="reset-identidade">
                Restaurar Padrões
            </button>
            <button type="button" class="btn btn-primary" id="save-identidade">
                Salvar Identidade Visual
            </button>
        </div>
    `;
}

// Bind eventos da identidade visual
function bindIdentidadeVisualEvents() {
    const form = document.getElementById('identidade-visual-form');
    const saveBtn = document.getElementById('save-identidade');
    const resetBtn = document.getElementById('reset-identidade');
    const logoDropzone = document.getElementById('logo-dropzone');
    const logoInput = document.getElementById('logo-input');
    
    // Sync color pickers com text inputs
    form.querySelectorAll('input[type="color"]').forEach(colorInput => {
        const textInput = form.querySelector(`input[name="${colorInput.name}_hex"]`);
        
        colorInput.addEventListener('change', () => {
            textInput.value = colorInput.value;
        });
        
        textInput.addEventListener('change', () => {
            colorInput.value = textInput.value;
        });
    });
    
    // Logo upload
    logoDropzone.addEventListener('click', () => logoInput.click());
    logoDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        logoDropzone.classList.add('dragover');
    });
    logoDropzone.addEventListener('dragleave', () => {
        logoDropzone.classList.remove('dragover');
    });
    logoDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        logoDropzone.classList.remove('dragover');
        handleLogoUpload(e.dataTransfer.files[0]);
    });
    
    logoInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            handleLogoUpload(e.target.files[0]);
        }
    });
    
    // Salvar
    saveBtn.addEventListener('click', async () => {
        await saveIdentidadeVisual();
    });
    
    // Reset
    resetBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
            resetIdentidadeVisual();
        }
    });
}

// Carregar dados mock
async function loadLinhasExistentes() {
    try {
        const mockLinhas = [
            {
                id: '1',
                titulo: 'Tom Profissional',
                descricao: 'Manter sempre linguagem formal e técnica, adequada ao público jurídico',
                exemplo: 'Utilize termos precisos e evite linguagem coloquial. Ex: "conforme disposto no artigo..." em vez de "como está escrito..."'
            }
        ];
        return mockLinhas;
    } catch (error) {
        console.error('Erro ao carregar linhas narrativas:', error);
        return [];
    }
}

async function loadIdentidadeVisual() {
    try {
        // Mock data
        return {
            cor_primaria: '#2563eb',
            cor_secundaria: '#64748b',
            cor_destaque: '#10b981',
            fonte_principal: 'Inter',
            estilo_texto: 'profissional',
            tamanho_base: 16,
            tom_visual: 'profissional',
            logo_posicao: 'esquerda',
            elementos: ['icones', 'graficos']
        };
    } catch (error) {
        console.error('Erro ao carregar identidade visual:', error);
        return {};
    }
}

// Funções de save/delete das novas seções
async function saveLinhaNarrativa(linha) {
    console.log('Salvando linha narrativa:', linha);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

async function deleteLinhanarativa(id) {
    console.log('Deletando linha narrativa:', id);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
}

async function saveIdentidadeVisual() {
    const form = document.getElementById('identidade-visual-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Processar elementos múltiplos
    data.elementos = formData.getAll('elementos[]');
    
    console.log('Salvando identidade visual:', data);
    
    try {
        // TODO: Implementar API
        await new Promise(resolve => setTimeout(resolve, 500));
        showToast('Identidade visual salva com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar identidade visual:', error);
        showToast('Erro ao salvar identidade visual', 'error');
    }
}

function resetIdentidadeVisual() {
    // Recarregar formulário com dados padrão
    initIdentidadeVisual();
}

function handleLogoUpload(file) {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Arquivo muito grande. Máximo 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // TODO: Upload para servidor
        console.log('Logo carregado:', file.name);
        showToast('Logo carregado com sucesso!', 'success');
    };
    reader.readAsDataURL(file);
}

// Exportar métodos públicos se necessário
export { temasJuridicosList, linhasNarrativasList, identidadeVisualForm };