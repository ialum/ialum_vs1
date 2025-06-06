/**
 * configuracoes-banca/main.js
 * Controlador da página de configurações da banca
 * Dependências: CardList, DOM, showToast
 * Localização: public/js/pages/configuracoes-banca/main.js
 */

import { DOM } from '../../core/dom.js';
import { CardList } from '../../components/card-list.js';
import { showToast } from '../../components/notifications.js';

// Estado da página
let narrativasList = null;

export async function init() {
    console.log('🏢 Inicializando Configurações da Banca...');
    
    // Aguardar DOM estar pronto
    DOM.ready(() => {
        initNarrativasSection();
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
            nome: 'Jornada do Herói',
            descricao: 'jornada do herói, onde o advogado é o herói que irá salvar o cliente das garras do problema abordado no tópico'
        },
        {
            id: 2,
            nome: 'Crítica ao Sistema',
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
                type: 'text',
                placeholder: 'Nome da Narrativa - Ex: Jornada do Herói',
                required: true,
                maxLength: 50,
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
            nome: {
                required: true,
                minLength: 3
            },
            descricao: {
                required: true,
                minLength: 10
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

// Função para obter todas as narrativas
export function obterNarrativas() {
    return narrativasList ? narrativasList.getItems() : [];
}