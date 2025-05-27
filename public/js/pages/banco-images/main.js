/**
 * banco-imagens/main.js
 * Controlador principal do Banco de Imagens
 * Dependências: api.js, utils.js, notifications.js
 * Localização: public/js/pages/banco-imagens/main.js
 * Tamanho alvo: <200 linhas
 */

import { API } from '../../core/api.js';
import { Utils } from '../../core/utils.js';
import { showToast } from '../../components/notifications.js';

// Estado da página
let currentCategory = '';
let currentTheme = '';
let currentType = '';
let searchQuery = '';
let images = [];
let selectedFiles = [];

// Função principal de inicialização
export async function init() {
    console.log('Inicializando Banco de Imagens...');
    
    // Bind dos eventos
    bindEvents();
    
    // Carregar imagens
    await loadImages();
}

// Bind dos eventos
function bindEvents() {
    // Botões principais
    const btnUpload = document.getElementById('btn-upload');
    const btnGerarIA = document.getElementById('btn-gerar-ia');
    
    if (btnUpload) btnUpload.addEventListener('click', showUploadModal);
    if (btnGerarIA) btnGerarIA.addEventListener('click', showIAGenerator);
    
    // Busca
    const searchInput = document.getElementById('images-search');
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(handleSearch, 300));
    }
    
    // Filtros
    document.getElementById('filter-category')?.addEventListener('change', applyFilters);
    document.getElementById('filter-theme')?.addEventListener('change', applyFilters);
    document.getElementById('filter-type')?.addEventListener('change', applyFilters);
    
    // Upload modal
    bindUploadEvents();
}

// Bind eventos do upload
function bindUploadEvents() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const closeUpload = document.getElementById('close-upload');
    const cancelUpload = document.getElementById('cancel-upload');
    const confirmUpload = document.getElementById('confirm-upload');
    
    if (uploadArea) {
        // Clique para selecionar
        uploadArea.addEventListener('click', () => fileInput?.click());
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    }
    
    if (closeUpload) closeUpload.addEventListener('click', hideUploadModal);
    if (cancelUpload) cancelUpload.addEventListener('click', hideUploadModal);
    if (confirmUpload) confirmUpload.addEventListener('click', uploadImages);
}

// Carregar imagens
async function loadImages() {
    const grid = document.getElementById('images-grid');
    if (!grid) return;
    
    // Mostrar loading
    grid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Carregando imagens...</p>
        </div>
    `;
    
    try {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados mockados
        images = [
            {
                id: 1,
                title: 'Direitos do Consumidor',
                url: '/assets/images/sample-1.jpg',
                category: 'preset',
                theme: 'consumidor',
                type: 'post',
                created_at: '2025-01-15'
            },
            {
                id: 2,
                title: 'Família - Template',
                url: '/assets/images/sample-2.jpg',
                category: 'preset',
                theme: 'familia',
                type: 'story',
                created_at: '2025-01-20'
            },
            {
                id: 3,
                title: 'Post Trabalhista',
                url: '/assets/images/sample-3.jpg',
                category: 'generated',
                theme: 'trabalhista',
                type: 'carousel',
                created_at: '2025-01-22'
            }
        ];
        
        // Atualizar estatísticas
        updateStats();
        
        // Filtrar e renderizar
        const filtered = filterImages();
        renderImages(filtered);
        
    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        grid.innerHTML = '<p class="error">Erro ao carregar imagens</p>';
        showToast('Erro ao carregar imagens', 'error');
    }
}

// Renderizar imagens
function renderImages(imagesToRender) {
    const grid = document.getElementById('images-grid');
    const template = document.getElementById('image-card-template');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid || !template) return;
    
    // Verificar se está vazio
    if (imagesToRender.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    
    // Esconder estado vazio
    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';
    
    // Limpar e renderizar
    grid.innerHTML = '';
    
    imagesToRender.forEach(image => {
        const card = template.content.cloneNode(true);
        
        // Preencher dados
        const imageCard = card.querySelector('.image-card');
        imageCard.dataset.id = image.id;
        
        const img = card.querySelector('img');
        img.src = image.url;
        img.alt = image.title;
        
        card.querySelector('.image-title').textContent = image.title;
        
        // Meta informações
        const metaItems = card.querySelectorAll('.meta-item');
        if (metaItems[0]) metaItems[0].textContent = getCategoryName(image.category);
        if (metaItems[1]) metaItems[1].textContent = getThemeName(image.theme);
        
        // Badge
        const badge = card.querySelector('.image-badge');
        if (image.category === 'preset') {
            badge.textContent = 'Preset';
        } else if (image.category === 'generated') {
            badge.textContent = 'IA';
        } else {
            badge.remove();
        }
        
        // Bind ações
        bindImageActions(card, image);
        
        grid.appendChild(card);
    });
}

// Bind ações da imagem
function bindImageActions(card, image) {
    const actions = {
        'Ver detalhes': () => viewImage(image),
        'Usar em post': () => useInPost(image),
        'Baixar': () => downloadImage(image),
        'Excluir': () => deleteImage(image)
    };
    
    card.querySelectorAll('.action-btn').forEach((btn, index) => {
        const action = Object.keys(actions)[index];
        if (action) {
            btn.addEventListener('click', actions[action]);
        }
    });
}

// Filtrar imagens
function filterImages() {
    return images.filter(image => {
        // Busca
        if (searchQuery && !image.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        // Categoria
        if (currentCategory && image.category !== currentCategory) {
            return false;
        }
        
        // Tema
        if (currentTheme && image.theme !== currentTheme) {
            return false;
        }
        
        // Tipo
        if (currentType && image.type !== currentType) {
            return false;
        }
        
        return true;
    });
}

// Handlers
function handleSearch(e) {
    searchQuery = e.target.value;
    const filtered = filterImages();
    renderImages(filtered);
}

function applyFilters() {
    currentCategory = document.getElementById('filter-category')?.value || '';
    currentTheme = document.getElementById('filter-theme')?.value || '';
    currentType = document.getElementById('filter-type')?.value || '';
    
    const filtered = filterImages();
    renderImages(filtered);
}

// Upload
function showUploadModal() {
    const modal = document.getElementById('upload-overlay');
    if (modal) {
        modal.style.display = 'flex';
        selectedFiles = [];
        updateUploadPreview();
    }
}

function hideUploadModal() {
    const modal = document.getElementById('upload-overlay');
    if (modal) {
        modal.style.display = 'none';
        selectedFiles = [];
        document.getElementById('file-input').value = '';
    }
}

function handleFiles(files) {
    const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
            showToast(`${file.name} não é uma imagem válida`, 'error');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast(`${file.name} é muito grande (máx 10MB)`, 'error');
            return false;
        }
        return true;
    });
    
    selectedFiles = [...selectedFiles, ...validFiles];
    updateUploadPreview();
}

function updateUploadPreview() {
    const preview = document.getElementById('upload-preview');
    const confirmBtn = document.getElementById('confirm-upload');
    
    if (!preview) return;
    
    preview.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button class="remove-preview" data-index="${index}">×</button>
            `;
            preview.appendChild(div);
            
            // Bind remover
            div.querySelector('.remove-preview').addEventListener('click', (e) => {
                selectedFiles.splice(e.target.dataset.index, 1);
                updateUploadPreview();
            });
        };
        reader.readAsDataURL(file);
    });
    
    // Habilitar/desabilitar botão
    if (confirmBtn) {
        confirmBtn.disabled = selectedFiles.length === 0;
    }
}

async function uploadImages() {
    if (selectedFiles.length === 0) return;
    
    const btn = document.getElementById('confirm-upload');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
    }
    
    try {
        // Simular upload
        for (const file of selectedFiles) {
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Uploading:', file.name);
        }
        
        showToast(`${selectedFiles.length} imagens enviadas com sucesso!`, 'success');
        hideUploadModal();
        await loadImages();
        
    } catch (error) {
        showToast('Erro ao enviar imagens', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Fazer Upload';
        }
    }
}

// Ações das imagens
function viewImage(image) {
    console.log('Visualizar imagem:', image);
    showToast('Abrindo detalhes da imagem...', 'info');
    // TODO: Abrir modal de detalhes
}

function useInPost(image) {
    console.log('Usar em post:', image);
    showToast('Adicionando imagem ao post...', 'success');
    // TODO: Navegar para criação de post com imagem
}

function downloadImage(image) {
    console.log('Baixar imagem:', image);
    // Criar link temporário para download
    const a = document.createElement('a');
    a.href = image.url;
    a.download = image.title;
    a.click();
    showToast('Download iniciado', 'success');
}

function deleteImage(image) {
    if (confirm(`Deseja excluir "${image.title}"?`)) {
        console.log('Excluir imagem:', image);
        showToast('Imagem excluída', 'success');
        // TODO: Chamar API e recarregar
        loadImages();
    }
}

function showIAGenerator() {
    showToast('Abrindo gerador de imagens com IA...', 'info');
    // TODO: Abrir modal ou página de geração
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('total-images').textContent = images.length;
    document.getElementById('used-space').textContent = 
        `${(images.length * 2.5).toFixed(1)} MB`; // Mock
    document.getElementById('ai-credits').textContent = '50'; // Mock
}

// Helpers
function getCategoryName(category) {
    const names = {
        preset: 'Template Preset',
        generated: 'Gerada por IA',
        uploaded: 'Upload'
    };
    return names[category] || category;
}

function getThemeName(theme) {
    const names = {
        familia: 'Família',
        consumidor: 'Consumidor',
        trabalhista: 'Trabalhista',
        empresarial: 'Empresarial'
    };
    return names[theme] || theme;
}