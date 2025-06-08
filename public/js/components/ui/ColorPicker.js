/**
 * ColorPicker - Componente simplificado de seleção de cor
 * Tipo: Enhancer - Melhora um input existente
 * 
 * Seguindo os princípios de design:
 * - Sem eventos globais
 * - Estrutura DOM mínima
 * - Estado local apenas
 */
export class ColorPicker {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element) {
            throw new Error('ColorPicker: elemento não encontrado');
        }
        
        if (this.element.colorPickerInstance) {
            return this.element.colorPickerInstance;
        }
        
        this.options = {
            format: options.format || 'rgb', // 'rgb', 'hex', 'native'
            showPreview: options.showPreview !== false,
            useNative: options.useNative !== false, // Usar input type="color" nativo
            ...options
        };
        
        this.init();
        this.element.colorPickerInstance = this;
    }
    
    init() {
        if (this.options.useNative) {
            this.initNativeColorPicker();
        } else {
            this.initCustomColorInput();
        }
    }
    
    initNativeColorPicker() {
        // Opção 1: Usar input color nativo do HTML5 com CSS customizado
        const wrapper = document.createElement('div');
        wrapper.className = 'color-picker-wrapper color-picker-native-wrapper';
        
        // Configurar o input original como color picker
        this.element.type = 'color';
        this.element.className += ' color-picker-native';
        this.element.value = this.getInitialColor();
        
        // Criar label para mostrar o valor
        this.valueDisplay = document.createElement('span');
        this.valueDisplay.className = 'color-picker-value';
        this.valueDisplay.textContent = this.formatColor(this.element.value);
        
        // Evento para atualizar o display quando a cor mudar
        this.element.addEventListener('input', this.handleNativeColorChange.bind(this));
        
        // Estrutura simples: wrapper com input e label
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
        wrapper.appendChild(this.valueDisplay);
    }
    
    initCustomColorInput() {
        // Opção 2: Input de texto com validação de formato
        const wrapper = document.createElement('div');
        wrapper.className = 'color-picker-wrapper';
        
        // Preview de cor
        if (this.options.showPreview) {
            this.preview = document.createElement('span');
            this.preview.className = 'color-picker-preview';
            this.preview.style.backgroundColor = this.element.value || '#000000';
            wrapper.appendChild(this.preview);
        }
        
        // Configurar input
        this.element.className += ' color-picker-input';
        this.element.placeholder = this.getPlaceholder();
        this.element.pattern = this.getPattern();
        
        // Eventos locais apenas
        this.element.addEventListener('input', this.handleInputChange.bind(this));
        this.element.addEventListener('blur', this.validateAndFormat.bind(this));
        
        // Inserir wrapper
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
    }
    
    handleNativeColorChange(e) {
        const color = e.target.value;
        const formatted = this.formatColor(color);
        
        // Atualizar display do valor
        this.valueDisplay.textContent = formatted;
        
        // Disparar evento customizado
        this.element.dispatchEvent(new CustomEvent('colorchange', { 
            detail: { color: formatted },
            bubbles: true 
        }));
    }
    
    handleInputChange(e) {
        const value = e.target.value;
        
        if (this.isValidColor(value)) {
            if (this.preview) {
                this.preview.style.backgroundColor = value;
            }
            
            this.element.dispatchEvent(new CustomEvent('colorchange', { 
                detail: { color: value },
                bubbles: true 
            }));
        }
    }
    
    validateAndFormat(e) {
        const value = e.target.value;
        
        if (value && !this.isValidColor(value)) {
            // Tentar corrigir formato comum
            const corrected = this.tryCorrectFormat(value);
            if (corrected) {
                this.element.value = corrected;
                if (this.preview) {
                    this.preview.style.backgroundColor = corrected;
                }
            } else {
                // Valor inválido - resetar para anterior ou padrão
                this.element.value = this.lastValidValue || this.getDefaultColor();
            }
        }
        
        this.lastValidValue = this.element.value;
    }
    
    isValidColor(value) {
        if (!value) return false;
        
        switch (this.options.format) {
            case 'hex':
                return /^#[0-9A-Fa-f]{6}$/.test(value);
            case 'rgb':
                return /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(value);
            default:
                return this.isValidHex(value) || this.isValidRgb(value);
        }
    }
    
    isValidHex(value) {
        return /^#[0-9A-Fa-f]{6}$/.test(value);
    }
    
    isValidRgb(value) {
        return /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(value);
    }
    
    tryCorrectFormat(value) {
        // Tentar corrigir formatos comuns
        value = value.trim();
        
        // Hex sem #
        if (/^[0-9A-Fa-f]{6}$/.test(value)) {
            return '#' + value;
        }
        
        // RGB sem parênteses
        const rgbMatch = value.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
        if (rgbMatch) {
            return `rgb(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]})`;
        }
        
        return null;
    }
    
    formatColor(color) {
        if (!color) return this.getDefaultColor();
        
        // Se for hex e queremos rgb
        if (this.options.format === 'rgb' && color.startsWith('#')) {
            return this.hexToRgb(color);
        }
        
        // Se for rgb e queremos hex
        if (this.options.format === 'hex' && color.startsWith('rgb')) {
            return this.rgbToHex(color);
        }
        
        return color;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    rgbToHex(rgb) {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return rgb;
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    getInitialColor() {
        const value = this.element.value;
        if (value && this.isValidColor(value)) {
            return this.options.format === 'hex' ? this.formatColor(value) : value;
        }
        return this.getDefaultColor();
    }
    
    getDefaultColor() {
        return this.options.format === 'hex' ? '#000000' : 'rgb(0, 0, 0)';
    }
    
    getPlaceholder() {
        switch (this.options.format) {
            case 'hex':
                return '#000000';
            case 'rgb':
                return 'rgb(0, 0, 0)';
            default:
                return '#000000 ou rgb(0, 0, 0)';
        }
    }
    
    getPattern() {
        switch (this.options.format) {
            case 'hex':
                return '#[0-9A-Fa-f]{6}';
            case 'rgb':
                return 'rgb\\(\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*\\)';
            default:
                return '(#[0-9A-Fa-f]{6})|(rgb\\(\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*\\))';
        }
    }
    
    getValue() {
        if (this.options.useNative) {
            return this.formatColor(this.colorInput.value);
        }
        return this.element.value;
    }
    
    setValue(color) {
        if (this.isValidColor(color)) {
            const formatted = this.formatColor(color);
            
            if (this.options.useNative) {
                this.colorInput.value = color.startsWith('#') ? color : this.rgbToHex(color);
                this.preview.style.backgroundColor = this.colorInput.value;
                this.valueDisplay.textContent = formatted;
            } else {
                this.element.value = formatted;
                if (this.preview) {
                    this.preview.style.backgroundColor = formatted;
                }
            }
            
            this.element.value = formatted;
        }
    }
    
    destroy() {
        if (this.options.useNative) {
            // Remover evento
            this.element.removeEventListener('input', this.handleNativeColorChange);
            
            // Restaurar tipo original se necessário
            this.element.type = 'text';
            
            // Remover wrapper
            const wrapper = this.element.parentNode;
            if (wrapper && wrapper.className.includes('color-picker-wrapper')) {
                wrapper.parentNode.insertBefore(this.element, wrapper);
                wrapper.remove();
            }
            
            // Limpar classes
            this.element.className = this.element.className.replace(' color-picker-native', '');
        } else {
            // Remover eventos
            this.element.removeEventListener('input', this.handleInputChange);
            this.element.removeEventListener('blur', this.validateAndFormat);
            
            // Limpar classes
            this.element.className = this.element.className.replace(' color-picker-input', '');
            
            // Remover wrapper se existir
            const wrapper = this.element.parentNode;
            if (wrapper && wrapper.className.includes('color-picker-wrapper')) {
                wrapper.parentNode.insertBefore(this.element, wrapper);
                wrapper.remove();
            }
        }
        
        delete this.element.colorPickerInstance;
    }
}