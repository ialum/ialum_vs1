/**
 * ui.js
 * Sistema de comportamentos e interações visuais
 * Documentação: /docs/0_16-sistemas-core.md#ui
 * Localização: /js/core/ui.js
 * 
 * COMO USAR:
 * 1. Importar: import { UI } from '/js/core/ui.js'
 * 2. Usar: UI.scrollTo('#section') ou UI.copyToClipboard(texto)
 * 3. Feedback: UI.shake(element) ou UI.highlight(element)
 */

// Interface de comportamentos visuais
export const UI = {
    // Scroll suave para elemento
    scrollTo(selector, offset = 100) {
        const element = typeof selector === 'string' 
            ? document.querySelector(selector) 
            : selector;
            
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    },
    
    // Copiar para clipboard com feedback
    async copyToClipboard(text, showFeedback = true) {
        try {
            await navigator.clipboard.writeText(text);
            if (showFeedback) {
                // TODO: Mostrar toast de sucesso quando notify.js existir
                console.log('Copiado!');
            }
            return true;
        } catch (err) {
            // Fallback para browsers antigos
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    },
    
    // Efeito de shake (chacoalhar)
    shake(element, duration = 300) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        element.style.animation = `shake ${duration}ms`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    
    // Destacar elemento temporariamente
    highlight(element, color = '#ffeb3b', duration = 1000) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        const originalBg = element.style.backgroundColor;
        element.style.transition = 'background-color 0.3s';
        element.style.backgroundColor = color;
        
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
            setTimeout(() => {
                element.style.transition = '';
            }, 300);
        }, duration);
    },
    
    // Focar elemento com destaque visual
    focusWithHighlight(selector) {
        const element = typeof selector === 'string' 
            ? document.querySelector(selector) 
            : selector;
            
        if (element) {
            element.focus();
            this.highlight(element);
        }
    },
    
    // FadeIn - mostrar elemento com animação
    fadeIn(element, duration = 300) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = '';
        element.offsetHeight; // Force reflow
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '1';
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    },

    // FadeOut - esconder elemento com animação
    fadeOut(element, duration = 300, callback = null) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.opacity = '';
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    },

    // Toggle de visibilidade com fade
    fadeToggle(element, duration = 300) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        const isVisible = window.getComputedStyle(element).display !== 'none';
        
        if (isVisible) {
            this.fadeOut(element, duration);
        } else {
            this.fadeIn(element, duration);
        }
    },
    
    // Debounce para performance
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para limitar execuções
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Gerar ID único
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// CSS necessário para animações (adicionar ao CSS base)
const styles = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Injetar CSS se ainda não existir
if (!document.getElementById('ui-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'ui-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}