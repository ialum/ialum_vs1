export class FileUpload {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element || this.element.tagName !== 'INPUT' || this.element.type !== 'file') {
            throw new Error('FileUpload: elemento deve ser input[type="file"]');
        }
        
        if (this.element.fileUploadInstance) {
            return this.element.fileUploadInstance;
        }
        
        this.id = this.element.id || `file-upload-${Date.now()}`;
        
        this.options = {
            variant: options.variant || 'default',
            showPreview: options.showPreview !== false,
            onChange: options.onChange || null,
            onError: options.onError || null
        };
        
        this.maxSize = this.parseMaxSize(
            options.maxSize || 
            this.element.dataset.maxSize || 
            '5MB'
        );
        
        this.enhance();
        this.element.fileUploadInstance = this;
    }
    
    parseMaxSize(size) {
        if (typeof size === 'number') return size;
        
        const match = size.match(/^(\d+(?:\.\d+)?)\s*(KB|MB|GB)?$/i);
        if (!match) return 5 * 1024 * 1024; // default 5MB
        
        const value = parseFloat(match[1]);
        const unit = match[2] || 'MB';
        const multipliers = { KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
        
        return value * (multipliers[unit.toUpperCase()] || 1024 * 1024);
    }
    
    enhance() {
        // Esconder input original
        this.element.style.display = 'none';
        
        // Criar wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = `file-upload-wrapper file-upload-${this.options.variant}`;
        
        // Criar label que ativa o input
        this.label = document.createElement('label');
        this.label.htmlFor = this.id;
        this.label.className = 'file-upload-label';
        
        // Conteúdo padrão do dropzone
        this.dropzone = document.createElement('div');
        this.dropzone.className = 'file-upload-dropzone';
        this.dropzone.innerHTML = `
            <div class="file-upload-icon">📁</div>
            <p class="file-upload-text">
                ${this.options.variant === 'square' ? 'Clique ou arraste' : 'Clique para selecionar arquivo'}
            </p>
            <small class="file-upload-hint">${this.getAcceptHint()}</small>
        `;
        
        // Área de preview
        this.preview = document.createElement('div');
        this.preview.className = 'file-upload-preview';
        this.preview.style.display = 'none';
        
        // Montar estrutura
        this.label.appendChild(this.dropzone);
        this.label.appendChild(this.preview);
        this.wrapper.appendChild(this.label);
        
        // Inserir após o input original
        this.element.parentNode.insertBefore(this.wrapper, this.element.nextSibling);
        
        // Eventos
        this.attachEvents();
    }
    
    attachEvents() {
        // Evento change do input
        this.element.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFile(file);
            } else {
                this.clear();
            }
        });
        
        // Drag & drop
        this.label.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.label.classList.add('dragover');
        });
        
        this.label.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!this.label.contains(e.relatedTarget)) {
                this.label.classList.remove('dragover');
            }
        });
        
        this.label.addEventListener('drop', (e) => {
            e.preventDefault();
            this.label.classList.remove('dragover');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                // Simular seleção no input
                const dt = new DataTransfer();
                dt.items.add(file);
                this.element.files = dt.files;
                
                this.handleFile(file);
            }
        });
    }
    
    handleFile(file) {
        // Validar tamanho
        if (file.size > this.maxSize) {
            const error = `Arquivo muito grande. Máximo: ${this.formatFileSize(this.maxSize)}`;
            if (this.options.onError) {
                this.options.onError(error);
            }
            this.element.value = '';
            return;
        }
        
        // Mostrar preview se habilitado
        if (this.options.showPreview) {
            this.showPreview(file);
        }
        
        // Callback
        if (this.options.onChange) {
            this.options.onChange([file]);
        }
    }
    
    showPreview(file) {
        const isImage = file.type.startsWith('image/');
        
        this.preview.innerHTML = `
            <div class="file-preview-content">
                ${isImage ? 
                    `<img src="${URL.createObjectURL(file)}" alt="${file.name}" class="file-preview-image">` :
                    `<div class="file-preview-icon">📄</div>`
                }
                <div class="file-preview-info">
                    <span class="file-preview-name">${file.name}</span>
                    <span class="file-preview-size">${this.formatFileSize(file.size)}</span>
                </div>
            </div>
            <button type="button" class="file-preview-remove" aria-label="Remover arquivo">✕</button>
        `;
        
        // Botão remover
        const removeBtn = this.preview.querySelector('.file-preview-remove');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.clear();
        });
        
        // Alternar visibilidade
        this.dropzone.style.display = 'none';
        this.preview.style.display = 'flex';
    }
    
    clear() {
        this.element.value = '';
        this.dropzone.style.display = 'block';
        this.preview.style.display = 'none';
        this.preview.innerHTML = '';
        
        if (this.options.onChange) {
            this.options.onChange([]);
        }
    }
    
    getAcceptHint() {
        const accept = this.element.accept;
        if (!accept || accept === '*/*') {
            return `Máximo ${this.formatFileSize(this.maxSize)}`;
        }
        
        const types = accept.split(',').map(type => {
            const clean = type.trim();
            if (clean === 'image/*') return 'Imagens';
            if (clean === 'video/*') return 'Vídeos';
            if (clean === 'audio/*') return 'Áudios';
            if (clean.includes('pdf')) return 'PDF';
            return clean;
        });
        
        return `${types.join(', ')} - Máximo ${this.formatFileSize(this.maxSize)}`;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    getFile() {
        return this.element.files[0] || null;
    }
    
    destroy() {
        this.wrapper?.remove();
        this.element.style.display = '';
        delete this.element.fileUploadInstance;
    }
}