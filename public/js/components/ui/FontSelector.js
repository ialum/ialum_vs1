export class FontSelector {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element) {
            throw new Error('FontSelector: elemento não encontrado');
        }
        
        if (this.element.fontSelectorInstance) {
            return this.element.fontSelectorInstance;
        }
        
        this.options = {
            fonts: options.fonts || this.getDefaultFonts(),
            showPreview: options.showPreview !== false,
            previewText: options.previewText || 'Amostra de texto ABC 123',
            searchable: options.searchable !== false,
            loadGoogleFonts: options.loadGoogleFonts || false,
            categories: options.categories || ['all', 'serif', 'sans-serif', 'display', 'handwriting'],
            ...options
        };
        
        this.isOpen = false;
        this.filteredFonts = [...this.options.fonts];
        this.selectedFont = this.element.value || this.options.fonts[0]?.family || 'Arial';
        
        this.init();
        this.element.fontSelectorInstance = this;
    }
    
    init() {
        this.createStructure();
        this.attachEvents();
        this.updateDisplay();
        
        if (this.options.loadGoogleFonts) {
            this.loadGoogleFonts();
        }
    }
    
    getDefaultFonts() {
        return [
            { family: 'Arial', category: 'sans-serif', variants: ['regular', 'bold'] },
            { family: 'Georgia', category: 'serif', variants: ['regular', 'bold'] },
            { family: 'Times New Roman', category: 'serif', variants: ['regular', 'bold'] },
            { family: 'Helvetica', category: 'sans-serif', variants: ['regular', 'bold'] },
            { family: 'Verdana', category: 'sans-serif', variants: ['regular', 'bold'] },
            { family: 'Courier New', category: 'monospace', variants: ['regular', 'bold'] },
            { family: 'Impact', category: 'display', variants: ['regular'] },
            { family: 'Comic Sans MS', category: 'handwriting', variants: ['regular', 'bold'] },
            { family: 'Trebuchet MS', category: 'sans-serif', variants: ['regular', 'bold'] },
            { family: 'Tahoma', category: 'sans-serif', variants: ['regular', 'bold'] }
        ];
    }
    
    createStructure() {
        const wrapper = this.element.parentNode;
        
        this.container = document.createElement('div');
        this.container.className = 'font-selector-container';
        
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.className = 'font-selector-trigger';
        this.trigger.innerHTML = `
            <span class="font-selector-preview"></span>
            <span class="font-selector-arrow">▼</span>
        `;
        
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'font-selector-dropdown';
        this.dropdown.style.display = 'none';
        this.dropdown.innerHTML = `
            ${this.options.searchable ? this.createSearchHTML() : ''}
            ${this.createCategoriesHTML()}
            <div class="font-selector-list"></div>
            ${this.options.showPreview ? this.createPreviewHTML() : ''}
        `;
        
        this.container.appendChild(this.trigger);
        this.container.appendChild(this.dropdown);
        
        wrapper.insertBefore(this.container, this.element);
        this.element.style.display = 'none';
        
        this.preview = this.trigger.querySelector('.font-selector-preview');
        this.list = this.dropdown.querySelector('.font-selector-list');
        this.searchInput = this.dropdown.querySelector('.font-selector-search');
        this.categoryButtons = this.dropdown.querySelectorAll('.font-category-btn');
        this.previewArea = this.dropdown.querySelector('.font-preview-area');
        
        this.renderFontList();
    }
    
    createSearchHTML() {
        return `
            <div class="font-selector-search-wrapper">
                <input type="text" class="font-selector-search" placeholder="Buscar fonte...">
            </div>
        `;
    }
    
    createCategoriesHTML() {
        return `
            <div class="font-categories">
                ${this.options.categories.map(category => `
                    <button type="button" class="font-category-btn ${category === 'all' ? 'active' : ''}" data-category="${category}">
                        ${this.getCategoryLabel(category)}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    createPreviewHTML() {
        return `
            <div class="font-preview-area">
                <div class="font-preview-text">${this.options.previewText}</div>
            </div>
        `;
    }
    
    getCategoryLabel(category) {
        const labels = {
            all: 'Todas',
            serif: 'Serif',
            'sans-serif': 'Sans Serif',
            monospace: 'Monospace',
            display: 'Display',
            handwriting: 'Script'
        };
        return labels[category] || category;
    }
    
    attachEvents() {
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterFonts(e.target.value);
            });
        }
        
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(btn.dataset.category);
                this.updateActiveCategory(btn);
            });
        });
        
        this.list.addEventListener('click', (e) => {
            const fontItem = e.target.closest('.font-item');
            if (fontItem) {
                this.selectFont(fontItem.dataset.font);
            }
        });
        
        this.list.addEventListener('mouseover', (e) => {
            const fontItem = e.target.closest('.font-item');
            if (fontItem && this.options.showPreview) {
                this.updatePreview(fontItem.dataset.font);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });
    }
    
    renderFontList() {
        this.list.innerHTML = this.filteredFonts.map(font => `
            <div class="font-item ${font.family === this.selectedFont ? 'selected' : ''}" 
                 data-font="${font.family}" 
                 style="font-family: '${font.family}', ${font.category};">
                <span class="font-name">${font.family}</span>
                <span class="font-category">${this.getCategoryLabel(font.category)}</span>
            </div>
        `).join('');
        
        if (this.filteredFonts.length === 0) {
            this.list.innerHTML = '<div class="font-no-results">Nenhuma fonte encontrada</div>';
        }
    }
    
    filterFonts(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredFonts = this.options.fonts.filter(font => 
            font.family.toLowerCase().includes(term)
        );
        this.renderFontList();
    }
    
    filterByCategory(category) {
        if (category === 'all') {
            this.filteredFonts = [...this.options.fonts];
        } else {
            this.filteredFonts = this.options.fonts.filter(font => font.category === category);
        }
        
        if (this.searchInput && this.searchInput.value) {
            this.filterFonts(this.searchInput.value);
        } else {
            this.renderFontList();
        }
    }
    
    updateActiveCategory(activeButton) {
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    updateDisplay() {
        this.preview.textContent = this.selectedFont;
        this.preview.style.fontFamily = `'${this.selectedFont}', ${this.getFontCategory(this.selectedFont)}`;
        this.element.value = this.selectedFont;
    }
    
    updatePreview(fontFamily) {
        if (this.previewArea) {
            const previewText = this.previewArea.querySelector('.font-preview-text');
            previewText.style.fontFamily = `'${fontFamily}', ${this.getFontCategory(fontFamily)}`;
        }
    }
    
    getFontCategory(fontFamily) {
        const font = this.options.fonts.find(f => f.family === fontFamily);
        return font ? font.category : 'sans-serif';
    }
    
    selectFont(fontFamily) {
        this.selectedFont = fontFamily;
        this.updateDisplay();
        this.renderFontList();
        
        this.element.dispatchEvent(new Event('change', { bubbles: true }));
        
        if (this.options.onChange) {
            this.options.onChange(fontFamily);
        }
        
        this.close();
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.dropdown.style.display = 'block';
        this.trigger.classList.add('active');
        
        if (this.searchInput) {
            this.searchInput.focus();
        }
    }
    
    close() {
        this.isOpen = false;
        this.dropdown.style.display = 'none';
        this.trigger.classList.remove('active');
    }
    
    loadGoogleFonts() {
        const googleFonts = [
            { family: 'Open Sans', category: 'sans-serif' },
            { family: 'Roboto', category: 'sans-serif' },
            { family: 'Lato', category: 'sans-serif' },
            { family: 'Montserrat', category: 'sans-serif' },
            { family: 'Oswald', category: 'sans-serif' },
            { family: 'Source Sans Pro', category: 'sans-serif' },
            { family: 'Raleway', category: 'sans-serif' },
            { family: 'Poppins', category: 'sans-serif' },
            { family: 'Playfair Display', category: 'serif' },
            { family: 'Merriweather', category: 'serif' },
            { family: 'Lora', category: 'serif' },
            { family: 'Dancing Script', category: 'handwriting' },
            { family: 'Pacifico', category: 'handwriting' },
            { family: 'Lobster', category: 'display' }
        ];
        
        const fontFamilies = googleFonts.map(font => font.family.replace(/ /g, '+')).join('|');
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        this.options.fonts = [...this.options.fonts, ...googleFonts];
        this.filteredFonts = [...this.options.fonts];
        this.renderFontList();
    }
    
    addFont(font) {
        if (!this.options.fonts.find(f => f.family === font.family)) {
            this.options.fonts.push(font);
            this.filteredFonts = [...this.options.fonts];
            this.renderFontList();
        }
    }
    
    removeFont(fontFamily) {
        this.options.fonts = this.options.fonts.filter(f => f.family !== fontFamily);
        this.filteredFonts = [...this.options.fonts];
        this.renderFontList();
        
        if (this.selectedFont === fontFamily && this.options.fonts.length > 0) {
            this.selectFont(this.options.fonts[0].family);
        }
    }
    
    setValue(fontFamily) {
        if (this.options.fonts.find(f => f.family === fontFamily)) {
            this.selectedFont = fontFamily;
            this.updateDisplay();
            this.renderFontList();
        }
    }
    
    getValue() {
        return this.selectedFont;
    }
    
    destroy() {
        this.container?.remove();
        this.element.style.display = '';
        delete this.element.fontSelectorInstance;
    }
}