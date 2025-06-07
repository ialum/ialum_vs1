/**
 * configuracoes-banca/main.js
 * Controlador da página de configurações da banca
 * Dependências: CardList, DOM, showToast
 * Localização: public/js/pages/configuracoes-banca/main.js
 */

import { DOM } from '../../core/dom.js';
import { CardList } from '../../components/cards/CardList.js';
import { CardForm } from '../../components/cards/CardForm.js';
import { showToast } from '../../components/layout/notifications.js';
import { validators } from '../../components/forms/validators.js';

// Estado da página
let narrativasList = null;
let temasList = null;
let identidadeVisualForm = null;

export async function init() {
    console.log('🏢 Inicializando Configurações da Banca...');
    
    // Aguardar DOM estar pronto
    DOM.ready(() => {
        initNarrativasSection();
        initTemasSection();
        initIdentidadeVisualSection();
    });
}

// Inicializar seção de Linhas Narrativas
function initNarrativasSection() {
    console.log('📝 Inicializando seção de Narrativas...');
    
    const container = DOM.select('#narrativas-container');
    if (!container) {
        console.error('Container de narrativas não encontrado');
        return;
    }

    // Dados mock das narrativas (baseado no mockup)
    const narrativasData = [
        {
            id: 1,
            nome: '🦸‍♂️ Jornada do Herói',
            descricao: 'jornada do herói, onde o advogado é o herói que irá salvar o cliente das garras do problema abordado no tópico'
        },
        {
            id: 2,
            nome: '⚖️ Crítica ao Sistema',
            descricao: 'crítica dura ao sistema e questões abordadas no tópico, com justificativas embasadas, ponderando o certo e o errado do ponto de vista da população em geral'
        }
    ];

    // Configuração do CardList para narrativas
    const narrativasConfig = {
        type: 'narrativa',
        items: narrativasData,
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        layout: 'list',
        primaryField: 'nome',
        title: '', // Ocultar título do CardList
        description: '', // Ocultar descrição do CardList
        
        // Definir campos do formulário
        fields: [
            {
                name: 'nome',
                label: 'Nome da Narrativa',
                type: 'emoji-text',
                placeholder: 'Ex: 🎯 Jornada do Herói',
                required: true,
                maxLength: 27, // emoji (1) + espaço (1) + texto (25)
                hideLabel: true  // Label importante para IA mas desnecessário visualmente
            },
            {
                name: 'descricao',
                label: 'Descrição da Narrativa',
                type: 'textarea',
                placeholder: 'Descreva como essa narrativa deve ser aplicada pela IA...',
                required: true,
                maxLength: 500,
                rows: 4,
                hideLabel: true  // Label importante para IA mas desnecessário visualmente
            }
        ],

        // Validadores customizados
        validators: {
            nome: [
                validators.required,
                validators.startsWithEmoji
            ],
            descricao: {
                required: true,
                minLength: 10,
                maxLength: 500
            }
        },

        // Callbacks de ações
        onItemCreated: (item) => {
            console.log('✅ Narrativa criada:', item);
            showToast(`Narrativa "${item.nome}" criada com sucesso!`, 'success');
            // TODO: Salvar no backend
        },

        onItemUpdated: (item) => {
            console.log('✏️ Narrativa atualizada:', item);
            showToast(`Narrativa "${item.nome}" atualizada!`, 'success');
            // TODO: Atualizar no backend
        },

        onItemDeleted: (itemId) => {
            console.log('🗑️ Narrativa removida:', itemId);
            showToast(`Narrativa removida`, 'info');
            // TODO: Remover do backend
        },

        onError: (error) => {
            console.error('❌ Erro nas narrativas:', error);
            showToast('Erro ao processar narrativa', 'error');
        }
    };

    // Inicializar CardList
    try {
        narrativasList = new CardList(container, narrativasConfig);
        console.log('✅ CardList de narrativas inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar CardList:', error);
        showToast('Erro ao carregar narrativas', 'error');
    }
}

// Inicializar seção de Temas Jurídicos
function initTemasSection() {
    console.log('⚖️ Inicializando seção de Temas Jurídicos...');
    
    const container = DOM.select('#temas-container');
    if (!container) {
        console.error('Container de temas não encontrado');
        return;
    }

    // Dados mock dos temas (baseado na documentação)
    const temasData = [
        {
            id: 1,
            nome: '🏠 Compra e Venda',
            descricao: 'problemas que pessoas fisicas enfrentam ao assinar contratos de compra e venda de bens de alto valor como veiculos, casas, terrenos, maquinas etc, que acabam criando inumetos problemas no menor deslize de uma das partes'
        },
        {
            id: 2,
            nome: '👔 Empres. Trabalhista',
            descricao: 'Protocolos mais importantes que as empresas devem adotar e prever ao contratar, manter e demitir funcionarios ou serviços pj em suas empresas.'
        }
    ];

    // Configuração do CardList para temas
    const temasConfig = {
        type: 'tema',
        items: temasData,
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        layout: 'list',
        primaryField: 'nome',
        title: '', // Ocultar título do CardList
        description: '', // Ocultar descrição do CardList
        
        // Definir campos do formulário
        fields: [
            {
                name: 'nome',
                label: 'Nome do Tema Jurídico',
                type: 'emoji-text',
                placeholder: 'Ex: ⚖️ Direito Trabalhista',
                required: true,
                maxLength: 27, // emoji (1) + espaço (1) + texto (25)
                hideLabel: true  // Label importante para IA mas desnecessário visualmente
            },
            {
                name: 'descricao',
                label: 'Descrição do Tema Jurídico',
                type: 'textarea',
                placeholder: 'Descreva as principais questões e problemas que esse tema jurídico aborda...',
                required: true,
                maxLength: 1000, // Conforme documentação: máximo 1000 caracteres
                rows: 5,
                hideLabel: true  // Label importante para IA mas desnecessário visualmente
            }
        ],

        // Validadores customizados
        validators: {
            nome: [
                validators.required,
                validators.startsWithEmoji
            ],
            descricao: {
                required: true,
                minLength: 20,
                maxLength: 1000
            }
        },

        // Callbacks de ações
        onItemCreated: (item) => {
            console.log('✅ Tema criado:', item);
            showToast(`Tema "${item.nome}" criado com sucesso!`, 'success');
            // TODO: Salvar no backend
        },

        onItemUpdated: (item) => {
            console.log('✏️ Tema atualizado:', item);
            showToast(`Tema "${item.nome}" atualizado!`, 'success');
            // TODO: Atualizar no backend
        },

        onItemDeleted: (itemId) => {
            console.log('🗑️ Tema removido:', itemId);
            showToast(`Tema removido`, 'info');
            // TODO: Remover do backend
        },

        onError: (error) => {
            console.error('❌ Erro nos temas:', error);
            showToast('Erro ao processar tema', 'error');
        }
    };

    // Inicializar CardList
    try {
        temasList = new CardList(container, temasConfig);
        console.log('✅ CardList de temas inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar CardList de temas:', error);
        showToast('Erro ao carregar temas', 'error');
    }
}

// Função para adicionar narrativa (pode ser chamada externamente)
export function adicionarNarrativa(nome, descricao) {
    if (!narrativasList) {
        console.error('CardList não inicializado');
        return;
    }

    const novaNarrativa = {
        id: Date.now(), // ID temporário
        nome,
        descricao
    };

    narrativasList.addItem(novaNarrativa);
}

// Função para adicionar tema (pode ser chamada externamente)
export function adicionarTema(nome, descricao) {
    if (!temasList) {
        console.error('CardList de temas não inicializado');
        return;
    }

    const novoTema = {
        id: Date.now(), // ID temporário
        nome,
        descricao
    };

    temasList.addItem(novoTema);
}

// Função para obter todas as narrativas
export function obterNarrativas() {
    return narrativasList ? narrativasList.getItems() : [];
}

// Função para obter todos os temas
export function obterTemas() {
    return temasList ? temasList.getItems() : [];
}

// Inicializar seção de Identidade Visual
function initIdentidadeVisualSection() {
    console.log('🎨 Inicializando seção de Identidade Visual...');
    
    const container = DOM.select('#identidade-visual-container');
    if (!container) {
        console.error('Container de identidade visual não encontrado');
        return;
    }

    // Dados mock da identidade visual (podem vir do backend)
    const identidadeData = {
        // Logotipos
        logoPrincipal: '',
        logoPrincipalHorizontal: '',
        logoClara: '',
        logoClaraHorizontal: '',
        logoEscura: '',
        logoEscuraHorizontal: '',
        
        // Cores da marca
        corPrincipal: '#1f2937',
        corSecundaria: '#3b82f6', 
        corClara: '#f8fafc',
        corEscura: '#0f172a',
        
        // Nome e descrição
        nomeBanca: 'Massaia Advogados',
        descricaoPositionamento: 'Escritório especializado em direito empresarial e trabalhista, com foco em soluções jurídicas inovadoras para pequenas e médias empresas.',
        
        // Fontes
        fonteTitulos: 'Inter',
        fonteTextos: 'Open Sans'
    };

    // Configuração do CardForm para identidade visual
    const identidadeConfig = {
        type: 'identidade-visual',
        title: '', // Sem título pois já está no card header
        description: '',
        mode: 'edit',
        item: identidadeData,
        layout: 'vertical',
        autoBackup: true,
        showHeader: false,
        
        // Layouts especiais por seção
        sectionLayouts: {
            logotipos: {
                type: 'grid',
                columns: 2,
                className: 'file-upload-logo-grid'
            }
        },
        
        // Definir campos do formulário seguindo a estrutura especificada
        fields: [
            // === SEÇÃO LOGOTIPOS ===
            {
                name: 'logoPrincipal',
                label: 'Logo Principal',
                type: 'file-upload',
                placeholder: 'Selecione o logo principal',
                accept: 'image/png',
                maxSize: '1MB',
                help: 'PNG com fundo transparente - 1024x1024px máximo - 1MB',
                required: true,
                section: 'logotipos',
                variant: 'square',
                gridColumn: 1
            },
            {
                name: 'logoPrincipalHorizontal',
                label: 'Logo Principal Horizontal',
                type: 'file-upload',
                placeholder: 'Selecione a variação horizontal',
                accept: 'image/png',
                maxSize: '1MB',
                help: 'Variação horizontal do logo principal',
                section: 'logotipos',
                variant: 'square',
                gridColumn: 2
            },
            {
                name: 'logoClara',
                label: 'Logo Clara',
                type: 'file-upload',
                placeholder: 'Selecione o logo claro',
                accept: 'image/png',
                maxSize: '1MB',
                help: 'Versão clara para fundos escuros',
                section: 'logotipos',
                variant: 'square',
                gridColumn: 1
            },
            {
                name: 'logoClaraHorizontal',
                label: 'Logo Clara Horizontal',
                type: 'file-upload',
                placeholder: 'Selecione a variação horizontal clara',
                accept: 'image/png',
                maxSize: '1MB',
                help: 'Variação horizontal da versão clara',
                section: 'logotipos',
                variant: 'square',
                gridColumn: 2
            },
            {
                name: 'logoEscura',
                label: 'Logo Escura',
                type: 'file-upload',
                placeholder: 'Selecione o logo escuro',
                accept: 'image/png',
                maxSize: '1MB',
                help: 'Versão escura para fundos claros',
                section: 'logotipos',
                variant: 'square',
                gridColumn: 1
            },
            {
                name: 'logoEscuraHorizontal',
                label: 'Logo Escura Horizontal',
                type: 'file-upload',
                placeholder: 'Selecione a variação horizontal escura',
                accept: 'image/png',
                maxSize: '1MB',
                help: 'Variação horizontal da versão escura',
                section: 'logotipos',
                variant: 'square',
                gridColumn: 2
            },
            
            // === SEÇÃO CORES DA MARCA ===
            {
                name: 'corPrincipal',
                label: 'Cor Principal',
                type: 'color-picker',
                placeholder: '#1f2937',
                required: true,
                help: 'RGB - será usado como fundo para a logo secundária',
                section: 'cores'
            },
            {
                name: 'corSecundaria',
                label: 'Cor Secundária',
                type: 'color-picker',
                placeholder: '#3b82f6',
                required: true,
                help: 'RGB - será usado como fundo para a logo primária',
                section: 'cores'
            },
            {
                name: 'corClara',
                label: 'Cor Clara',
                type: 'color-picker',
                placeholder: '#f8fafc',
                required: true,
                help: 'RGB - fundos que contrastam com logo escura',
                section: 'cores'
            },
            {
                name: 'corEscura',
                label: 'Cor Escura',
                type: 'color-picker',
                placeholder: '#0f172a',
                required: true,
                help: 'RGB - fundos que contrastam com logo clara',
                section: 'cores'
            },
            
            // === SEÇÃO NOME E DESCRIÇÃO ===
            {
                name: 'nomeBanca',
                label: 'Nome da Banca',
                type: 'text',
                placeholder: 'Ex: Silva & Associados',
                required: true,
                maxLength: 100,
                help: 'Como aparecerá nas publicações',
                section: 'identidade'
            },
            {
                name: 'descricaoPositionamento',
                label: 'Descrição do Posicionamento',
                type: 'markdown',
                placeholder: 'Descreva o posicionamento da banca...',
                required: true,
                maxLength: 1000,
                rows: 6,
                help: 'Descrição detalhada (máximo 1000 caracteres)',
                section: 'identidade'
            },
            
            // === SEÇÃO FONTES ===
            {
                name: 'fonteTitulos',
                label: 'Fonte Principal - Títulos',
                type: 'font-selector',
                placeholder: 'Selecione a fonte para títulos',
                required: true,
                help: 'Fonte para títulos e elementos principais',
                section: 'fontes'
            },
            {
                name: 'fonteTextos',
                label: 'Fonte para Textos - Fácil Leitura',
                type: 'font-selector',
                placeholder: 'Selecione a fonte para textos',
                required: true,
                help: 'Fonte otimizada para leitura de textos longos',
                section: 'fontes'
            }
        ],

        // Validadores usando o sistema existente
        validators: {
            logoPrincipal: {
                required: true,
                type: 'file',
                accept: 'image/png',
                maxSize: '1MB'
            },
            corPrincipal: {
                required: true,
                type: 'color'
            },
            corSecundaria: {
                required: true,
                type: 'color'
            },
            corClara: {
                required: true,
                type: 'color'
            },
            corEscura: {
                required: true,
                type: 'color'
            },
            nomeBanca: {
                required: true,
                minLength: 2,
                maxLength: 100
            },
            descricaoPositionamento: {
                required: true,
                minLength: 20,
                maxLength: 1000
            },
            fonteTitulos: {
                required: true
            },
            fonteTextos: {
                required: true
            }
        },

        // Callbacks
        onSubmit: async (data, mode) => {
            console.log('💾 Salvando identidade visual:', data);
            
            try {
                // TODO: Integração com backend para salvar
                // await API.post('/identidade-visual', data);
                
                showToast('Identidade Visual salva com sucesso!', 'success');
                
                // Aplicar preview das cores no sistema
                applyColorPreview(data);
                
                return data;
            } catch (error) {
                console.error('Erro ao salvar:', error);
                throw new Error('Não foi possível salvar a identidade visual');
            }
        },

        onChange: (data) => {
            // Preview em tempo real das cores
            applyColorPreview(data);
            
            // Preview visual das cores aplicadas aos fundos das logos
            updateLogoPreview(data);
        },
        
        onRender: () => {
            // Criar container para preview das cores após renderizar o form
            const formContainer = DOM.select('#identidade-visual-container');
            if (formContainer && !DOM.select('#color-preview-container')) {
                const previewDiv = DOM.create('div', {
                    id: 'color-preview-container',
                    className: 'mt-lg'
                });
                formContainer.appendChild(previewDiv);
            }
        },

        onCancel: () => {
            showToast('Alterações canceladas', 'info');
            // Restaurar cores originais se necessário
        },
        
        // Botão customizado para salvar identidade visual
        submitButton: {
            text: 'Salvar Identidade Visual',
            class: 'btn-primary btn-lg',
            icon: '💾'
        }
    };

    // Inicializar CardForm
    try {
        identidadeVisualForm = new CardForm(container, identidadeConfig);
        console.log('✅ CardForm de identidade visual inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar identidade visual:', error);
        showToast('Erro ao carregar identidade visual', 'error');
    }
}

// Aplicar preview das cores no sistema
function applyColorPreview(data) {
    if (!data.corPrincipal && !data.corSecundaria && !data.corClara && !data.corEscura) return;
    
    const root = document.documentElement;
    
    if (data.corPrincipal) {
        root.style.setProperty('--theme-primary', data.corPrincipal);
    }
    
    if (data.corSecundaria) {
        root.style.setProperty('--theme-secondary', data.corSecundaria);
    }
    
    if (data.corClara) {
        root.style.setProperty('--theme-light', data.corClara);
    }
    
    if (data.corEscura) {
        root.style.setProperty('--theme-dark', data.corEscura);
    }
    
    console.log('🎨 Preview de cores aplicado');
}

// Atualizar preview visual das cores aplicadas aos fundos das logos
function updateLogoPreview(data) {
    const previewContainer = DOM.select('#color-preview-container');
    if (!previewContainer || (!data.corPrincipal && !data.corSecundaria && !data.corClara && !data.corEscura)) {
        return;
    }
    
    // Criar preview visual das combinações de cores e logos
    const previews = [
        { 
            name: 'Logo Principal em Fundo Secundário', 
            bgColor: data.corSecundaria, 
            textColor: data.corPrincipal,
            logo: 'LOGO' 
        },
        { 
            name: 'Logo Secundária em Fundo Principal', 
            bgColor: data.corPrincipal, 
            textColor: data.corSecundaria,
            logo: 'LOGO' 
        },
        { 
            name: 'Logo Escura em Fundo Claro', 
            bgColor: data.corClara, 
            textColor: data.corEscura,
            logo: 'LOGO' 
        },
        { 
            name: 'Logo Clara em Fundo Escuro', 
            bgColor: data.corEscura, 
            textColor: data.corClara,
            logo: 'LOGO' 
        }
    ];
    
    let previewHTML = `
        <div class="mb-lg">
            <h4 class="text-base font-medium mb-md">Preview das Cores</h4>
            <div class="grid grid-cols-2 gap-md">
    `;
    
    previews.forEach(preview => {
        if (preview.bgColor && preview.textColor) {
            previewHTML += `
                <div class="card p-md hover-elevate-sm transition-all">
                    <div class="flex flex-col gap-sm">
                        <div class="p-lg text-center rounded-lg transition-all" 
                             style="background-color: ${preview.bgColor}; color: ${preview.textColor}; min-height: 80px; display: flex; align-items: center; justify-content: center;">
                            <span class="text-lg font-bold">${preview.logo}</span>
                        </div>
                        <small class="text-xs text-muted text-center">${preview.name}</small>
                    </div>
                </div>
            `;
        }
    });
    
    previewHTML += '</div></div>';
    previewContainer.innerHTML = previewHTML;
    
    console.log('🖼️ Preview de logos atualizado');
}

// Função para obter configuração de identidade visual
export function obterIdentidadeVisual() {
    return identidadeVisualForm ? identidadeVisualForm.getData() : null;
}

// Função para aplicar identidade visual salva
export function aplicarIdentidadeVisual(dados) {
    if (identidadeVisualForm) {
        identidadeVisualForm.setData(dados);
        applyColorPreview(dados);
    }
}