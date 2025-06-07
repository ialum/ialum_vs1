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
            format: options.format || 'rgb', // 'rgb', 'hex', 'hsl'
            showPreview: options.showPreview !== false,
            presetColors: options.presetColors || [
                '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                '#000000', '#FFFFFF', '#808080', '#800000', '#008000', '#000080'
            ],
            allowCustom: options.allowCustom !== false,
            ...options
        };
        
        this.isOpen = false;
        this.currentColor = this.parseColor(this.element.value) || { r: 255, g: 0, b: 0 };
        
        this.init();
        this.element.colorPickerInstance = this;
    }
    
    init() {
        this.createStructure();
        this.attachEvents();
        this.updateDisplay();
    }
    
    createStructure() {
        const wrapper = this.element.parentNode;
        
        this.container = document.createElement('div');
        this.container.className = 'color-picker-container';
        
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.className = 'color-picker-trigger';
        this.trigger.innerHTML = `
            <span class="color-picker-preview"></span>
            <span class="color-picker-arrow">▼</span>
        `;
        
        this.picker = document.createElement('div');
        this.picker.className = 'color-picker-dropdown';
        this.picker.style.display = 'none';
        this.picker.innerHTML = `
            ${this.options.allowCustom ? this.createCustomPickerHTML() : ''}
            ${this.createPresetColorsHTML()}
            <div class="color-picker-actions">
                <button type="button" class="btn btn-sm btn-primary color-picker-apply">Aplicar</button>
                <button type="button" class="btn btn-sm btn-secondary color-picker-cancel">Cancelar</button>
            </div>
        `;
        
        this.container.appendChild(this.trigger);
        this.container.appendChild(this.picker);
        
        wrapper.insertBefore(this.container, this.element);
        this.element.style.display = 'none';
        
        this.preview = this.trigger.querySelector('.color-picker-preview');
        this.setupCustomPicker();
    }
    
    createCustomPickerHTML() {
        return `
            <div class="color-picker-custom">
                <div class="color-picker-saturation">
                    <div class="color-picker-saturation-cursor"></div>
                </div>
                <div class="color-picker-hue">
                    <div class="color-picker-hue-cursor"></div>
                </div>
                <div class="color-picker-inputs">
                    <input type="number" class="color-picker-input" data-channel="r" min="0" max="255" placeholder="R">
                    <input type="number" class="color-picker-input" data-channel="g" min="0" max="255" placeholder="G">
                    <input type="number" class="color-picker-input" data-channel="b" min="0" max="255" placeholder="B">
                </div>
            </div>
        `;
    }
    
    createPresetColorsHTML() {
        return `
            <div class="color-picker-presets">
                <div class="color-picker-presets-title">Cores predefinidas:</div>
                <div class="color-picker-presets-grid">
                    ${this.options.presetColors.map(color => `
                        <button type="button" class="color-picker-preset" style="background-color: ${color}" data-color="${color}"></button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    setupCustomPicker() {
        if (!this.options.allowCustom) return;
        
        this.saturationArea = this.picker.querySelector('.color-picker-saturation');
        this.saturationCursor = this.picker.querySelector('.color-picker-saturation-cursor');
        this.hueArea = this.picker.querySelector('.color-picker-hue');
        this.hueCursor = this.picker.querySelector('.color-picker-hue-cursor');
        this.inputs = this.picker.querySelectorAll('.color-picker-input');
        
        this.updateCustomPicker();
    }
    
    attachEvents() {
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        this.picker.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-picker-preset')) {
                const color = e.target.dataset.color;
                this.currentColor = this.parseColor(color);
                this.updateDisplay();
            }
            
            if (e.target.classList.contains('color-picker-apply')) {
                this.apply();
            }
            
            if (e.target.classList.contains('color-picker-cancel')) {
                this.close();
            }
        });
        
        if (this.options.allowCustom) {
            this.inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const channel = e.target.dataset.channel;
                    const value = parseInt(e.target.value) || 0;
                    this.currentColor[channel] = Math.max(0, Math.min(255, value));
                    this.updateDisplay();
                    this.updateCustomPicker();
                });
            });
            
            if (this.saturationArea) {
                this.saturationArea.addEventListener('mousedown', this.handleSaturationMouseDown.bind(this));
            }
            
            if (this.hueArea) {
                this.hueArea.addEventListener('mousedown', this.handleHueMouseDown.bind(this));
            }
        }
        
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });
    }
    
    handleSaturationMouseDown(e) {
        const handleMouseMove = (e) => {
            const rect = this.saturationArea.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            
            const hsv = this.rgbToHsv(this.currentColor.r, this.currentColor.g, this.currentColor.b);
            hsv.s = x;
            hsv.v = 1 - y;
            
            this.currentColor = this.hsvToRgb(hsv.h, hsv.s, hsv.v);
            this.updateDisplay();
            this.updateInputs();
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        handleMouseMove(e);
    }
    
    handleHueMouseDown(e) {
        const handleMouseMove = (e) => {
            const rect = this.hueArea.getBoundingClientRect();
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            
            const hsv = this.rgbToHsv(this.currentColor.r, this.currentColor.g, this.currentColor.b);
            hsv.h = y * 360;
            
            this.currentColor = this.hsvToRgb(hsv.h, hsv.s, hsv.v);
            this.updateDisplay();
            this.updateInputs();
            this.updateSaturationBackground();
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        handleMouseMove(e);
    }
    
    updateDisplay() {
        const colorString = this.formatColor(this.currentColor);
        this.preview.style.backgroundColor = colorString;
        this.element.value = colorString;
    }
    
    updateCustomPicker() {
        if (!this.options.allowCustom) return;
        
        this.updateInputs();
        this.updateSaturationBackground();
        this.updateCursors();
    }
    
    updateInputs() {
        if (!this.inputs) return;
        
        this.inputs.forEach(input => {
            const channel = input.dataset.channel;
            input.value = this.currentColor[channel];
        });
    }
    
    updateSaturationBackground() {
        if (!this.saturationArea) return;
        
        const hsv = this.rgbToHsv(this.currentColor.r, this.currentColor.g, this.currentColor.b);
        const baseColor = this.hsvToRgb(hsv.h, 1, 1);
        const baseColorString = this.formatColor(baseColor);
        
        this.saturationArea.style.backgroundColor = baseColorString;
    }
    
    updateCursors() {
        if (!this.saturationCursor || !this.hueCursor) return;
        
        const hsv = this.rgbToHsv(this.currentColor.r, this.currentColor.g, this.currentColor.b);
        
        this.saturationCursor.style.left = `${hsv.s * 100}%`;
        this.saturationCursor.style.top = `${(1 - hsv.v) * 100}%`;
        
        this.hueCursor.style.top = `${(hsv.h / 360) * 100}%`;
    }
    
    parseColor(colorString) {
        if (!colorString) return null;
        
        colorString = colorString.trim();
        
        if (colorString.startsWith('#')) {
            return this.hexToRgb(colorString);
        }
        
        if (colorString.startsWith('rgb')) {
            const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                return {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3])
                };
            }
        }
        
        return null;
    }
    
    formatColor(color) {
        switch (this.options.format) {
            case 'hex':
                return this.rgbToHex(color.r, color.g, color.b);
            case 'hsl':
                const hsl = this.rgbToHsl(color.r, color.g, color.b);
                return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
            default:
                return `rgb(${color.r}, ${color.g}, ${color.b})`;
        }
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const d = max - min;
        const s = max === 0 ? 0 : d / max;
        const v = max;
        
        let h;
        if (d === 0) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s, v };
    }
    
    hsvToRgb(h, s, v) {
        h /= 360;
        const c = v * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = v - c;
        
        let r, g, b;
        if (h < 1/6) { r = c; g = x; b = 0; }
        else if (h < 2/6) { r = x; g = c; b = 0; }
        else if (h < 3/6) { r = 0; g = c; b = x; }
        else if (h < 4/6) { r = 0; g = x; b = c; }
        else if (h < 5/6) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        
        if (max === min) {
            return { h: 0, s: 0, l };
        }
        
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        let h;
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
        
        return { h: h * 360, s, l };
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.picker.style.display = 'block';
        this.trigger.classList.add('active');
    }
    
    close() {
        this.isOpen = false;
        this.picker.style.display = 'none';
        this.trigger.classList.remove('active');
    }
    
    apply() {
        this.element.dispatchEvent(new Event('change', { bubbles: true }));
        
        if (this.options.onChange) {
            this.options.onChange(this.formatColor(this.currentColor));
        }
        
        this.close();
    }
    
    setValue(color) {
        const parsed = this.parseColor(color);
        if (parsed) {
            this.currentColor = parsed;
            this.updateDisplay();
            this.updateCustomPicker();
        }
    }
    
    getValue() {
        return this.formatColor(this.currentColor);
    }
    
    destroy() {
        this.container?.remove();
        this.element.style.display = '';
        delete this.element.colorPickerInstance;
    }
}