/**
 * utils.js
 * Funções auxiliares reutilizáveis
 * Dependências: nenhuma
 * Localização: public/js/core/utils.js
 * Tamanho alvo: <150 linhas
 */

// Exportar objeto com todas as utilidades
export const Utils = {
    
    // Formatar data brasileira
    formatDate(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year)
            .replace('HH', hours)
            .replace('mm', minutes);
    },
    
    // Formatar moeda brasileira
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    // Debounce para evitar múltiplas chamadas
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
    
    // Validar CPF
    validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        
        // Validação básica
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Cálculo dos dígitos verificadores
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    },
    
    // Validar CNPJ
    validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, '');
        if (cnpj.length !== 14) return false;
        
        // Validação básica
        if (/^(\d)\1+$/.test(cnpj)) return false;
        
        // Cálculo (simplificado)
        return true; // TODO: Implementar cálculo completo
    },
    
    // Validar email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Máscara de telefone
    maskPhone(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    },
    
    // Máscara de CPF
    maskCPF(value) {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    // Máscara de CNPJ
    maskCNPJ(value) {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },
    
    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Local Storage seguro
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(`ialum_${key}`, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Erro ao salvar no storage:', e);
                return false;
            }
        },
        
        get(key) {
            try {
                const item = localStorage.getItem(`ialum_${key}`);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Erro ao ler do storage:', e);
                return null;
            }
        },
        
        remove(key) {
            localStorage.removeItem(`ialum_${key}`);
        },
        
        clear() {
            Object.keys(localStorage)
                .filter(key => key.startsWith('ialum_'))
                .forEach(key => localStorage.removeItem(key));
        }
    },
    
    // Copiar para clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    },
    
    // Scroll suave para elemento
    scrollToElement(selector, offset = 100) {
        const element = document.querySelector(selector);
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    },
    
    // Extrair iniciais do nome
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },
    
    // Pluralizar palavra simples
    pluralize(count, singular, plural) {
        return count === 1 ? singular : (plural || singular + 's');
    }
};