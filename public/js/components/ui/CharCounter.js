export class CharCounter {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element) {
            throw new Error('CharCounter: elemento não encontrado');
        }
        
        if (this.element.charCounterInstance) {
            console.log('Campo já possui contador de caracteres, reutilizando instância');
            return this.element.charCounterInstance;
        }
        
        this.options = {
            maxLength: parseInt(this.element.getAttribute('maxlength')) || options.maxLength || 500,
            showRemaining: options.showRemaining !== false,
            warningThreshold: options.warningThreshold || 0.8,
            errorThreshold: options.errorThreshold || 0.9,
            ...options
        };
        
        this.init();
        this.element.charCounterInstance = this;
    }
    
    init() {
        this.createCounter();
        this.attachEvents();
        this.updateCounter();
    }
    
    createCounter() {
        const wrapper = this.element.parentNode;
        
        if (wrapper.querySelector('.char-counter')) {
            console.log('Contador já existe no DOM');
            return;
        }
        
        this.counter = document.createElement('div');
        this.counter.className = 'char-counter';
        this.counter.style.cssText = `
            position: absolute;
            bottom: 0.5rem;
            right: 0.75rem;
            font-size: 0.75rem;
            color: var(--theme-text-tertiary);
            pointer-events: none;
            transition: color 0.2s ease;
            z-index: 10;
        `;
        
        if (getComputedStyle(wrapper).position === 'static') {
            wrapper.style.position = 'relative';
        }
        
        wrapper.appendChild(this.counter);
    }
    
    attachEvents() {
        this.updateHandler = this.updateCounter.bind(this);
        this.focusHandler = () => this.counter.style.opacity = '1';
        this.blurHandler = () => this.counter.style.opacity = '0.7';
        
        this.element.addEventListener('input', this.updateHandler);
        this.element.addEventListener('focus', this.focusHandler);
        this.element.addEventListener('blur', this.blurHandler);
    }
    
    updateCounter() {
        const current = this.element.value.length;
        const remaining = this.options.maxLength - current;
        const percentage = current / this.options.maxLength;
        
        if (this.options.showRemaining) {
            this.counter.textContent = `${remaining} restantes`;
        } else {
            this.counter.textContent = `${current}/${this.options.maxLength}`;
        }
        
        this.updateStyle(percentage, current);
        
        if (this.options.onChange) {
            this.options.onChange({
                current,
                remaining,
                percentage,
                isOverLimit: current > this.options.maxLength
            });
        }
    }
    
    updateStyle(percentage, current) {
        if (current > this.options.maxLength) {
            this.counter.style.color = 'var(--error)';
            this.element.style.borderColor = 'var(--error)';
        } else if (percentage >= this.options.errorThreshold) {
            this.counter.style.color = 'var(--error)';
            this.element.style.borderColor = 'var(--warning)';
        } else if (percentage >= this.options.warningThreshold) {
            this.counter.style.color = 'var(--warning)';
            this.element.style.borderColor = '';
        } else {
            this.counter.style.color = 'var(--theme-text-tertiary)';
            this.element.style.borderColor = '';
        }
    }
    
    setMaxLength(maxLength) {
        this.options.maxLength = maxLength;
        this.updateCounter();
    }
    
    destroy() {
        this.element.removeEventListener('input', this.updateHandler);
        this.element.removeEventListener('focus', this.focusHandler);
        this.element.removeEventListener('blur', this.blurHandler);
        
        this.counter?.remove();
        delete this.element.charCounterInstance;
        this.element.style.borderColor = '';
    }
    
    show() {
        if (this.counter) {
            this.counter.style.display = '';
        }
    }
    
    hide() {
        if (this.counter) {
            this.counter.style.display = 'none';
        }
    }
    
    getValue() {
        return {
            current: this.element.value.length,
            remaining: this.options.maxLength - this.element.value.length,
            percentage: this.element.value.length / this.options.maxLength,
            isOverLimit: this.element.value.length > this.options.maxLength
        };
    }
}