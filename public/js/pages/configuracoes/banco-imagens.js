/**
 * configuracoes/banco-imagens.js
 * Lógica da aba Banco de Imagens - Templates Preset
 * Dependências: api.js, notifications.js
 * Localização: public/js/pages/configuracoes/banco-imagens.js
 * Tamanho alvo: <150 linhas
 */

export async function init() {
    const container = document.getElementById('tab-banco-imagens');
    
    try {
        container.innerHTML = getTemplate();
        await loadPresetImages();
        bindEvents();
    } catch (error) {
        console.error('Erro ao inicializar banco de imagens:', error);
        container.innerHTML = '<p class="error">Erro ao carregar configurações</p>';
    }
}

function getTemplate() {
    return `
        <div class="config-section">
            <h3>Templates Preset por Tema</h3>
            <p class="section-description">
                Upload de imagens padrão que serão usadas automaticamente para cada tema jurídico
            </p>
            
            <!-- Área de Upload -->
            <div class="upload-area">
                <div class="upload-placeholder" id="upload-drop-zone">
                    <span class="upload-icon">📁</span>
                    <h4>Arraste imagens aqui</h4>
                    <p>ou clique para selecionar</p>
                    <p class="upload-hint">PNG, JPG até 5MB</p>
                </div>
                <input type="file" id="file-input" class="upload-input" 
                       multiple accept="image/*" style="display: none;">
            </div>
            
            <!-- Seletor de Tema -->
            <div class="form-group">
                <label class="form-label">Tema para as imagens</label>
                <select id="theme-selector" class="form-select">
                    <option value="">Selecione um tema...</option>
                    <option value="familia">Família</option>
                    <option value="consumidor">Consumidor</option>
                    <option value="trabalhista">Trabalhista</option>
                    <option value="empresarial">Empresarial</option>
                    <option value="criminal">Criminal</option>
                    <option value="civil">Civil</option>
                    <option value="tributario">Tributário</option>
                    <option value="imobiliario">Imobiliário</option>
                </select>
            </div>
        </div>
        
        <!-- Galeria de Imagens -->
        <div class="config-section">
            <h3>Imagens Cadastradas</h3>
            
            <!-- Filtro por tema -->
            <div class="form-group">
                <select id="filter-theme" class="form-select">
                    <option value="">Todos os temas</option>
                    <option value="familia">Família</option>
                    <option value="consumidor">Consumidor</option>
                    <option value="trabalhista">Trabalhista</option>
                    <option value="empresarial">Empresarial</option>
                </select>
            </div>
            
            <div class="images-grid" id="preset-images-grid">
                <!-- Imagens serão carregadas aqui -->
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Carregando imagens...</p>
                </div>
            </div>
            
            <div class="empty-state" id="empty-images" style="display: none;">
                <p>Nenhuma imagem preset cadastrada ainda.</p>
            </div>
        </div>
    `;
}

async function loadPresetImages() {
    try {
        // TODO: Buscar imagens reais da API
        const mockImages = [
            {
                id: 1,
                url: '/assets/images/preset/familia-1.jpg',
                theme: 'familia',
                theme_name: 'Família',
                usage_count: 12
            },
            {
                id: 2,
                url: '/assets/images/preset/consumidor-1.jpg',
                theme: 'consumidor',
                theme_name: 'Consumidor',
                usage_count: 8
            },
            {
                id: 3,
                url: '/assets/images/preset/trabalhista-1.jpg',
                theme: 'trabalhista',
                theme_name: 'Trabalhista',
                usage_count: 5
            }
        ];
        
        const grid = document.getElementById('preset-images-grid');
        
        if (mockImages.length === 0) {
            grid.style.display = 'none';
            document.getElementById('empty-images').style.display = 'block';
        } else {
            grid.innerHTML = mockImages.map(img => createImageCard(img)).join('');
        }
        
    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        document.getElementById('preset-images-grid').innerHTML = 
            '<p class="error">Erro ao carregar imagens</p>';
    }
}

function createImageCard(image) {
    return `
        <div class="image-item" data-id="${image.id}" data-theme="${image.theme}">
            <div class="image-wrapper">
                <img src="${image.url}" alt="Preset ${image.theme_name}" 
                     onerror="this.src='/assets/images/placeholder.jpg'">
                <div class="image-overlay">
                    <button class="image-remove" title="Remover">×</button>
                </div>
            </div>
            <div class="image-info">
                <span class="image-theme">${image.theme_name}</span>
                <span class="image-usage">${image.usage_count} usos</span>
            </div>
        </div>
    `;
}

function bindEvents() {
    // Upload area
    const uploadZone = document.getElementById('upload-drop-zone');
    const fileInput = document.getElementById('file-input');
    
    uploadZone.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Filtro de tema
    document.getElementById('filter-theme').addEventListener('change', filterImages);
    
    // Delegação para remover imagem
    document.getElementById('preset-images-grid').addEventListener('click', (e) => {
        if (e.target.classList.contains('image-remove')) {
            removeImage(e.target.closest('.image-item'));
        }
    });
}

async function handleFiles(files) {
    const themeSelector = document.getElementById('theme-selector');
    const selectedTheme = themeSelector.value;
    
    if (!selectedTheme) {
        window.showToast('Por favor, selecione um tema primeiro', 'warning');
        return;
    }
    
    const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
            window.showToast(`${file.name} não é uma imagem válida`, 'error');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            window.showToast(`${file.name} é muito grande (máx 5MB)`, 'error');
            return false;
        }
        return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Upload das imagens
    for (const file of validFiles) {
        try {
            // TODO: Implementar upload real
            console.log(`Uploading ${file.name} para tema ${selectedTheme}`);
            
            // Simular upload
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            window.showToast(`${file.name} enviada com sucesso!`, 'success');
            
            // Recarregar galeria
            await loadPresetImages();
            
        } catch (error) {
            window.showToast(`Erro ao enviar ${file.name}`, 'error');
        }
    }
    
    // Limpar seleção
    document.getElementById('file-input').value = '';
}

function filterImages(e) {
    const theme = e.target.value;
    const images = document.querySelectorAll('.image-item');
    
    images.forEach(img => {
        if (!theme || img.dataset.theme === theme) {
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }
    });
}

async function removeImage(imageElement) {
    if (!confirm('Remover esta imagem preset?')) return;
    
    const imageId = imageElement.dataset.id;
    
    try {
        // TODO: Chamar API para remover
        console.log('Removendo imagem:', imageId);
        
        // Animar remoção
        imageElement.style.opacity = '0';
        setTimeout(() => {
            imageElement.remove();
            
            // Verificar se ficou vazio
            const grid = document.getElementById('preset-images-grid');
            if (grid.children.length === 0) {
                grid.style.display = 'none';
                document.getElementById('empty-images').style.display = 'block';
            }
        }, 300);
        
        window.showToast('Imagem removida', 'info');
        
    } catch (error) {
        window.showToast('Erro ao remover imagem', 'error');
    }
}