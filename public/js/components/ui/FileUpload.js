export class FileUpload {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element) {
            throw new Error('FileUpload: elemento não encontrado');
        }
        
        if (this.element.fileUploadInstance) {
            return this.element.fileUploadInstance;
        }
        
        this.options = {
            accept: options.accept || 'image/*',
            multiple: options.multiple || false,
            maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB
            maxFiles: options.maxFiles || (options.multiple ? 5 : 1),
            showPreview: options.showPreview !== false,
            allowDrop: options.allowDrop !== false,
            ...options
        };
        
        this.files = [];
        this.init();
        this.element.fileUploadInstance = this;
    }
    
    init() {
        this.createStructure();
        this.attachEvents();
    }
    
    createStructure() {
        const wrapper = this.element.parentNode;
        
        this.dropZone = document.createElement('div');
        this.dropZone.className = 'file-upload-dropzone';
        this.dropZone.innerHTML = `
            <div class="file-upload-content">
                <div class="file-upload-icon">📁</div>
                <p class="file-upload-text">
                    Clique para selecionar ${this.options.multiple ? 'arquivos' : 'arquivo'} ou arraste aqui
                </p>
                <small class="file-upload-hint">
                    ${this.getAcceptHint()}
                </small>
            </div>
            <div class="file-upload-preview" style="display: none;"></div>
        `;
        
        this.element.style.display = 'none';
        wrapper.appendChild(this.dropZone);
        
        this.preview = this.dropZone.querySelector('.file-upload-preview');
        this.content = this.dropZone.querySelector('.file-upload-content');
    }
    
    attachEvents() {
        this.element.addEventListener('change', this.handleFileSelect.bind(this));
        
        if (this.options.allowDrop) {
            this.dropZone.addEventListener('click', () => this.element.click());
            this.dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
            this.dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            this.dropZone.addEventListener('drop', this.handleDrop.bind(this));
        } else {
            this.dropZone.addEventListener('click', () => this.element.click());
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        if (!this.dropZone.contains(e.relatedTarget)) {
            this.dropZone.classList.remove('dragover');
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }
    
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }
    
    processFiles(files) {
        if (!this.options.multiple) {
            this.files = [];
        }
        
        for (const file of files) {
            if (this.validateFile(file)) {
                if (this.files.length < this.options.maxFiles) {
                    this.files.push(file);
                } else {
                    this.showError(`Máximo ${this.options.maxFiles} arquivo(s) permitido(s)`);
                    break;
                }
            }
        }
        
        this.updatePreview();
        this.triggerChange();
    }
    
    validateFile(file) {
        if (file.size > this.options.maxSize) {
            this.showError(`Arquivo muito grande. Máximo: ${this.formatFileSize(this.options.maxSize)}`);
            return false;
        }
        
        if (this.options.accept && this.options.accept !== '*/*') {
            const acceptedTypes = this.options.accept.split(',').map(type => type.trim());
            const isAccepted = acceptedTypes.some(type => {
                if (type.endsWith('/*')) {
                    return file.type.startsWith(type.slice(0, -1));
                }
                return file.type === type || file.name.toLowerCase().endsWith(type);
            });
            
            if (!isAccepted) {
                this.showError(`Tipo de arquivo não aceito: ${file.type}`);
                return false;
            }
        }
        
        return true;
    }
    
    updatePreview() {
        if (!this.options.showPreview || this.files.length === 0) {
            this.preview.style.display = 'none';
            this.content.style.display = 'block';
            return;
        }
        
        this.content.style.display = 'none';
        this.preview.style.display = 'block';
        
        this.preview.innerHTML = this.files.map((file, index) => {
            const isImage = file.type.startsWith('image/');
            const fileUrl = URL.createObjectURL(file);
            
            return `
                <div class="file-upload-item" data-index="${index}">
                    ${isImage ? 
                        `<img src="${fileUrl}" alt="${file.name}" class="file-preview-image">` :
                        `<div class="file-preview-icon">📄</div>`
                    }
                    <div class="file-preview-info">
                        <span class="file-preview-name">${file.name}</span>
                        <span class="file-preview-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <button type="button" class="file-preview-remove" data-index="${index}" aria-label="Remover arquivo">
                        ✕
                    </button>
                </div>
            `;
        }).join('');
        
        this.preview.querySelectorAll('.file-preview-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFile(parseInt(btn.dataset.index));
            });
        });
    }
    
    removeFile(index) {
        if (index >= 0 && index < this.files.length) {
            this.files.splice(index, 1);
            this.updatePreview();
            this.triggerChange();
        }
    }
    
    triggerChange() {
        const event = new CustomEvent('fileupload:change', {
            detail: { files: this.files }
        });
        this.element.dispatchEvent(event);
        
        if (this.options.onChange) {
            this.options.onChange(this.files);
        }
    }
    
    showError(message) {
        console.error('FileUpload:', message);
        if (this.options.onError) {
            this.options.onError(message);
        }
    }
    
    getAcceptHint() {
        if (!this.options.accept || this.options.accept === '*/*') {
            return `Máximo ${this.formatFileSize(this.options.maxSize)}`;
        }
        
        const types = this.options.accept.split(',').map(type => {
            const clean = type.trim();
            if (clean.startsWith('image/')) return 'Imagens';
            if (clean.startsWith('video/')) return 'Vídeos';
            if (clean.startsWith('audio/')) return 'Áudios';
            if (clean.includes('pdf')) return 'PDF';
            return clean;
        });
        
        return `${types.join(', ')} - Máximo ${this.formatFileSize(this.options.maxSize)}`;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    getFiles() {
        return [...this.files];
    }
    
    setFiles(files) {
        this.files = Array.isArray(files) ? files : [];
        this.updatePreview();
    }
    
    clear() {
        this.files = [];
        this.element.value = '';
        this.updatePreview();
        this.triggerChange();
    }
    
    destroy() {
        this.dropZone?.remove();
        this.element.style.display = '';
        delete this.element.fileUploadInstance;
    }
}