export class FontSelector {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element || this.element.tagName !== 'SELECT') {
            throw new Error('FontSelector: elemento deve ser select');
        }
        
        if (this.element.fontSelectorInstance) {
            return this.element.fontSelectorInstance;
        }
        
        this.options = {
            fonts: options.fonts || this.getDefaultFonts(),
            showPreview: options.showPreview !== false,
            previewText: options.previewText || 'Amostra de texto ABC 123',
            loadGoogleFonts: options.loadGoogleFonts || false,
            onChange: options.onChange || null
        };
        
        this.enhance();
        this.element.fontSelectorInstance = this;
    }
    
    getDefaultFonts() {
        return [
            { family: 'Arial', category: 'sans-serif' },
            { family: 'Helvetica', category: 'sans-serif' },
            { family: 'Verdana', category: 'sans-serif' },
            { family: 'Tahoma', category: 'sans-serif' },
            { family: 'Trebuchet MS', category: 'sans-serif' },
            { family: 'Georgia', category: 'serif' },
            { family: 'Times New Roman', category: 'serif' },
            { family: 'Courier New', category: 'monospace' },
            { family: 'Monaco', category: 'monospace' },
            { family: 'Impact', category: 'display' },
            { family: 'Comic Sans MS', category: 'handwriting' }
        ];
    }
    
    enhance() {
        // Adicionar classe ao select
        this.element.classList.add('font-selector');
        
        // Salvar valor atual
        const currentValue = this.element.value;
        
        // Popular select com fontes organizadas
        this.populateSelect();
        
        // Restaurar valor se existia
        if (currentValue && this.options.fonts.find(f => f.family === currentValue)) {
            this.element.value = currentValue;
        }
        
        // Aplicar fonte no próprio select
        this.updateSelectFont();
        
        // Preview opcional
        if (this.options.showPreview) {
            this.createPreview();
        }
        
        // Carregar Google Fonts se solicitado
        if (this.options.loadGoogleFonts) {
            this.loadGoogleFonts();
        }
        
        // Eventos
        this.attachEvents();
    }
    
    populateSelect() {
        // Agrupar fontes por categoria
        const categories = {};
        this.options.fonts.forEach(font => {
            if (!categories[font.category]) {
                categories[font.category] = [];
            }
            categories[font.category].push(font);
        });
        
        // Limpar select
        this.element.innerHTML = '';
        
        // Criar optgroups e options
        Object.entries(categories).forEach(([category, fonts]) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = this.getCategoryLabel(category);
            
            fonts.forEach(font => {
                const option = document.createElement('option');
                option.value = font.family;
                option.textContent = font.family;
                option.style.fontFamily = `"${font.family}", ${font.category}`;
                optgroup.appendChild(option);
            });
            
            this.element.appendChild(optgroup);
        });
    }
    
    getCategoryLabel(category) {
        const labels = {
            'sans-serif': 'Sans Serif',
            'serif': 'Serif',
            'monospace': 'Monoespaçada',
            'display': 'Display',
            'handwriting': 'Manuscrita'
        };
        return labels[category] || category;
    }
    
    createPreview() {
        this.preview = document.createElement('div');
        this.preview.className = 'font-selector-preview';
        this.preview.textContent = this.options.previewText;
        
        // Inserir após o select
        this.element.parentNode.insertBefore(this.preview, this.element.nextSibling);
        
        this.updatePreview();
    }
    
    attachEvents() {
        this.element.addEventListener('change', () => {
            this.updateSelectFont();
            this.updatePreview();
            
            if (this.options.onChange) {
                this.options.onChange(this.element.value);
            }
        });
    }
    
    updateSelectFont() {
        const selectedFont = this.element.value;
        const font = this.options.fonts.find(f => f.family === selectedFont);
        
        if (font) {
            this.element.style.fontFamily = `"${font.family}", ${font.category}`;
        }
    }
    
    updatePreview() {
        if (!this.preview) return;
        
        const selectedFont = this.element.value;
        const font = this.options.fonts.find(f => f.family === selectedFont);
        
        if (font) {
            this.preview.style.fontFamily = `"${font.family}", ${font.category}`;
        }
    }
    
    loadGoogleFonts() {
        const googleFonts = [
            { family: 'Open Sans', category: 'sans-serif' },
            { family: 'Roboto', category: 'sans-serif' },
            { family: 'Lato', category: 'sans-serif' },
            { family: 'Montserrat', category: 'sans-serif' },
            { family: 'Poppins', category: 'sans-serif' },
            { family: 'Playfair Display', category: 'serif' },
            { family: 'Merriweather', category: 'serif' },
            { family: 'Dancing Script', category: 'handwriting' },
            { family: 'Lobster', category: 'display' }
        ];
        
        // Criar link do Google Fonts
        const fontNames = googleFonts.map(f => f.family.replace(/ /g, '+')).join('|');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontNames}:wght@400;700&display=swap`;
        document.head.appendChild(link);
        
        // Adicionar fontes e repopular
        googleFonts.forEach(font => this.addFont(font));
    }
    
    addFont(font) {
        if (!this.options.fonts.find(f => f.family === font.family)) {
            this.options.fonts.push(font);
            this.populateSelect();
            this.updateSelectFont();
        }
    }
    
    removeFont(fontFamily) {
        this.options.fonts = this.options.fonts.filter(f => f.family !== fontFamily);
        this.populateSelect();
        
        if (this.element.value === fontFamily && this.options.fonts.length > 0) {
            this.element.value = this.options.fonts[0].family;
            this.updateSelectFont();
            this.updatePreview();
        }
    }
    
    setValue(fontFamily) {
        if (this.options.fonts.find(f => f.family === fontFamily)) {
            this.element.value = fontFamily;
            this.updateSelectFont();
            this.updatePreview();
        }
    }
    
    getValue() {
        return this.element.value;
    }
    
    destroy() {
        this.preview?.remove();
        this.element.classList.remove('font-selector');
        this.element.style.fontFamily = '';
        delete this.element.fontSelectorInstance;
    }
}