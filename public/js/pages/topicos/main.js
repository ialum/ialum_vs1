/**
 * topicos/main.js
 * Controlador principal da Central de Tópicos
 * Dependências: api.js, ui.js, formatters.js, notifications.js, search-autocomplete.js
 * Localização: public/js/pages/topicos/main.js
 * Tamanho alvo: <200 linhas
 */

import { API } from '../../core/api.js';
import { behaviors } from '../../components/ui/behaviors.js';
import { format } from '../../components/forms/formatters.js';
import { showToast } from '../../components/layout/notifications.js';
// import { SearchAutocomplete } from '../../components/search-autocomplete.js'; // TODO: Implementar componente

// Estado da página
let currentFilter = 'all';
let currentTheme = '';
let currentSort = 'recent';
let currentPage = 1;
let searchQuery = '';
let allTopicos = []; // Guardar todos os tópicos
let searchComponent = null;
const itemsPerPage = 12;

// Função principal de inicialização
export async function init() {
    console.log('Inicializando Central de Tópicos...');
    
    // Inicializar componente de busca
    initSearchComponent();
    
    // Bind dos eventos
    bindEvents();
    
    // Carregar tópicos
    await loadTopicos();
}

// Inicializar componente de busca
function initSearchComponent() {
    // Verificar se o container existe
    const container = document.querySelector('#topicos-search-component');
    if (!container) {
        console.error('Container #topicos-search-component não encontrado');
        return;
    }
    
    searchComponent = new SearchAutocomplete({
        placeholder: 'Buscar tópicos por título, tema ou assunto...',
        searchType: 'topics',
        minChars: 2,
        maxResults: 8,
        allowCreate: true,
        showPreview: false,
        onSelect: (item) => {
            console.log('Tópico selecionado:', item);
            // Guardar query de busca
            searchQuery = item.title;
            // Filtrar e renderizar
            filterAndRender();
        },
        onClear: () => {
            // Limpar busca
            searchQuery = '';
            // Recarregar todos
            filterAndRender();
        },
        // NOVO: Callback para busca em tempo real
        onInputChange: (query) => {
            console.log('Buscando em tempo real:', query);
            searchQuery = query;
            // Filtrar cards enquanto digita
            filterAndRender();
        }
    });
    
    // Renderizar
    searchComponent.render('#topicos-search-component');
}

// Bind dos eventos da página
function bindEvents() {
    // Botão novo tópico
    const btnNovo = document.getElementById('btn-novo-topico');
    if (btnNovo) {
        btnNovo.addEventListener('click', handleNovoTopico);
    }
    
    // Filtros de status
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.addEventListener('click', () => handleStatusFilter(tab));
    });
    
    // Filtros adicionais
    const filterTheme = document.getElementById('filter-theme');
    if (filterTheme) {
        filterTheme.addEventListener('change', handleFilters);
    }
    
    const filterSort = document.getElementById('filter-sort');
    if (filterSort) {
        filterSort.addEventListener('change', handleFilters);
    }
    
    // Paginação
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');
    
    if (prevPage) prevPage.addEventListener('click', () => changePage(-1));
    if (nextPage) nextPage.addEventListener('click', () => changePage(1));
}

// Carregar tópicos
async function loadTopicos() {
    const grid = document.getElementById('topicos-grid');
    if (!grid) return;
    
    // Mostrar loading
    grid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Carregando tópicos...</p>
        </div>
    `;
    
    try {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Por enquanto, usar dados mockados
        allTopicos = [
            {
                id: 1,
                title: 'Direitos do Consumidor em Compras Online',
                status: 'embasado',
                theme: 'consumidor',
                theme_name: 'Consumidor',
                created_at: '2025-01-15',
                created_by_ialum: true,
                publications: [
                    { platform: 'instagram', status: 'published' },
                    { platform: 'linkedin', status: 'scheduled' }
                ],
                progress: 100
            },
            {
                id: 2,
                title: 'Guarda Compartilhada: O que você precisa saber',
                status: 'rascunho',
                theme: 'familia',
                theme_name: 'Família',
                created_at: '2025-01-20',
                created_by_ialum: false,
                publications: [
                    { platform: 'instagram', status: 'draft' }
                ],
                progress: 50
            },
            {
                id: 3,
                title: 'Direitos Trabalhistas na Era Digital',
                status: 'ideia',
                theme: 'trabalhista',
                theme_name: 'Trabalhista',
                created_at: '2025-01-25',
                created_by_ialum: false,
                publications: [],
                progress: 10
            },
            {
                id: 4,
                title: 'Contratos Digitais e Validade Jurídica',
                status: 'embasado',
                theme: 'empresarial',
                theme_name: 'Empresarial',
                created_at: '2025-01-18',
                created_by_ialum: true,
                publications: [
                    { platform: 'linkedin', status: 'published' }
                ],
                progress: 100
            }
        ];
        
        // Atualizar contadores
        updateCounts();
        
        // Filtrar e renderizar
        filterAndRender();
        
    } catch (error) {
        console.error('Erro ao carregar tópicos:', error);
        grid.innerHTML = '<p class="error">Erro ao carregar tópicos</p>';
        showToast('Erro ao carregar tópicos', 'error');
    }
}

// Filtrar e renderizar tópicos
function filterAndRender() {
    let filtered = [...allTopicos];
    
    // Aplicar filtros
    filtered = filterTopicos(filtered);
    
    // Aplicar busca
    if (searchQuery) {
        filtered = filtered.filter(topico => 
            topico.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topico.theme_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    // Ordenar
    filtered = sortTopicos(filtered);
    
    // Renderizar
    if (filtered.length === 0) {
        showEmptyState();
    } else {
        renderTopicos(filtered);
        updatePagination(filtered.length);
    }
}

// Renderizar tópicos
function renderTopicos(topicos) {
    const grid = document.getElementById('topicos-grid');
    const template = document.getElementById('topico-card-template');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid || !template) return;
    
    // Esconder estado vazio
    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';
    
    // Limpar grid
    grid.innerHTML = '';
    
    // Paginar
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = topicos.slice(start, end);
    
    // Renderizar cada tópico
    paginated.forEach(topico => {
        const card = template.content.cloneNode(true);
        
        // Preencher dados
        card.querySelector('.topico-card').dataset.id = topico.id;
        card.querySelector('.topico-title').textContent = topico.title;
        
        // Status
        const statusEl = card.querySelector('.topico-status');
        statusEl.textContent = getStatusText(topico.status);
        statusEl.className = `topico-status ${topico.status}`;
        
        // Badge Ialum
        const badge = card.querySelector('.topico-badge');
        if (topico.created_by_ialum) {
            badge.textContent = 'Ialum';
            badge.className = 'topico-badge ialum';
        } else {
            badge.remove();
        }
        
        // Meta
        card.querySelector('.meta-text.theme').textContent = topico.theme_name;
        card.querySelector('.meta-text.date').textContent = 
            format.date(topico.created_at, 'DD/MM/YYYY');
        
        // Publicações
        renderPublications(card, topico.publications);
        
        // Progresso
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        progressFill.style.width = `${topico.progress}%`;
        progressText.textContent = `${topico.progress}% completo`;
        
        // Bind ações
        card.querySelector('.action-view').addEventListener('click', 
            () => viewTopico(topico.id));
        card.querySelector('.action-manage').addEventListener('click', 
            () => manageTopico(topico.id));
        card.querySelector('.topico-menu').addEventListener('click', 
            (e) => showMenu(e, topico.id));
        
        grid.appendChild(card);
    });
}

// Renderizar publicações mini
function renderPublications(card, publications) {
    const container = card.querySelector('.topico-publications');
    
    if (publications.length === 0) {
        container.innerHTML = '<span class="topico-empty">Nenhuma publicação</span>';
        return;
    }
    
    publications.forEach(pub => {
        const el = document.createElement('div');
        el.className = 'publication-mini';
        el.innerHTML = `
            <span class="pub-platform">${getPlatformIcon(pub.platform)}</span>
            <span class="pub-status ${pub.status}">${getStatusIcon(pub.status)}</span>
        `;
        container.appendChild(el);
    });
}

// Handlers
function handleNovoTopico() {
    showToast('Abrindo formulário de novo tópico...', 'info');
    // TODO: Abrir modal ou navegar para criação
}

function handleStatusFilter(tab) {
    // Remover active de todos
    document.querySelectorAll('.status-tab').forEach(t => 
        t.classList.remove('active'));
    
    // Adicionar active no clicado
    tab.classList.add('active');
    
    // Atualizar filtro
    currentFilter = tab.dataset.status;
    currentPage = 1;
    
    // Recarregar
    filterAndRender();
}

function handleFilters() {
    currentTheme = document.getElementById('filter-theme').value;
    currentSort = document.getElementById('filter-sort').value;
    currentPage = 1;
    filterAndRender();
}

// Filtrar tópicos
function filterTopicos(topicos) {
    return topicos.filter(topico => {
        // Filtro de status
        if (currentFilter !== 'all' && topico.status !== currentFilter) {
            return false;
        }
        
        // Filtro de tema
        if (currentTheme && topico.theme !== currentTheme) {
            return false;
        }
        
        return true;
    });
}

// Ordenar tópicos
function sortTopicos(topicos) {
    const sorted = [...topicos];
    
    switch (currentSort) {
        case 'recent':
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
        case 'name':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'status':
            const statusOrder = { ideia: 0, rascunho: 1, embasado: 2 };
            sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            break;
    }
    
    return sorted;
}

// Paginação
function changePage(direction) {
    currentPage += direction;
    filterAndRender();
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    
    // Mostrar/esconder paginação
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    }
}

// Atualizar contadores
function updateCounts() {
    const counts = {
        all: allTopicos.length,
        ideia: allTopicos.filter(t => t.status === 'ideia').length,
        rascunho: allTopicos.filter(t => t.status === 'rascunho').length,
        embasado: allTopicos.filter(t => t.status === 'embasado').length
    };
    
    Object.keys(counts).forEach(status => {
        const el = document.getElementById(`count-${status}`);
        if (el) el.textContent = counts[status];
    });
}

// Estado vazio
function showEmptyState() {
    const grid = document.getElementById('topicos-grid');
    const empty = document.getElementById('empty-state');
    
    if (grid) grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
}

// Ações dos tópicos
function viewTopico(id) {
    console.log('Visualizar tópico:', id);
    showToast(`Abrindo tópico ${id}...`, 'info');
    // TODO: Navegar para página de visualização
}

function manageTopico(id) {
    console.log('Gerenciar tópico:', id);
    showToast(`Gerenciando tópico ${id}...`, 'info');
    // TODO: Navegar para página de edição
}

function showMenu(e, id) {
    e.stopPropagation();
    console.log('Menu do tópico:', id);
    // TODO: Mostrar menu dropdown
}

// Helpers
function getStatusText(status) {
    const texts = {
        ideia: '💡 Ideia',
        rascunho: '📝 Rascunho',
        embasado: '📖 Embasado'
    };
    return texts[status] || status;
}

function getPlatformIcon(platform) {
    const icons = {
        instagram: '📷',
        linkedin: '💼',
        facebook: '📘',
        tiktok: '🎵'
    };
    return icons[platform] || '📱';
}

function getStatusIcon(status) {
    const icons = {
        published: '✅',
        scheduled: '⏰',
        draft: '📝'
    };
    return icons[status] || '•';
}