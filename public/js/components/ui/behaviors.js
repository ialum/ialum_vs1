export const behaviors = {
    scrollTo(selector, offset = 100) {
        const element = typeof selector === 'string' 
            ? document.querySelector(selector) 
            : selector;
            
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    },
    
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
    
    focusWithHighlight(selector) {
        const element = typeof selector === 'string' 
            ? document.querySelector(selector) 
            : selector;
            
        if (element) {
            element.focus();
            this.highlight(element);
        }
    },
    
    fadeIn(element, duration = 300) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = '';
        element.offsetHeight;
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '1';
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    },

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
    
    async copyToClipboard(text, showFeedback = true) {
        try {
            await navigator.clipboard.writeText(text);
            if (showFeedback) {
                console.log('Copiado!');
            }
            return true;
        } catch (err) {
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

    slideDown(element, duration = 300) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease-out`;
        element.style.maxHeight = element.scrollHeight + 'px';
        
        setTimeout(() => {
            element.style.transition = '';
            element.style.overflow = '';
        }, duration);
    },

    slideUp(element, duration = 300) {
        element = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (!element) return;
        
        element.style.overflow = 'hidden';
        element.style.maxHeight = element.scrollHeight + 'px';
        element.offsetHeight; // Force reflow
        element.style.transition = `max-height ${duration}ms ease-out`;
        element.style.maxHeight = '0';
        
        setTimeout(() => {
            element.style.transition = '';
            element.style.overflow = '';
        }, duration);
    }
};

const styles = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

if (!document.getElementById('ui-behaviors-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'ui-behaviors-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}