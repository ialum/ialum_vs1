/**
 * validators.js
 * Validadores modulares reutilizáveis
 * Dependências: Nenhuma
 * Localização: public/js/utils/validators.js
 * Tamanho alvo: <100 linhas
 */

// Validadores genéricos reutilizáveis
export const validators = {
    // Campo obrigatório
    required: (value) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return 'Campo obrigatório';
        }
        return null;
    },

    // Tamanho máximo
    maxLength: (max) => (value) => {
        if (value && value.length > max) {
            return `Máximo ${max} caracteres`;
        }
        return null;
    },

    // Tamanho mínimo
    minLength: (min) => (value) => {
        if (value && value.length < min) {
            return `Mínimo ${min} caracteres`;
        }
        return null;
    },

    // Deve começar com emoji
    startsWithEmoji: (value) => {
        if (!value) return null;
        
        // Regex mais abrangente para detectar emojis
        const emojiRegex = /^[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]/u;
        
        if (!emojiRegex.test(value)) {
            return 'Deve começar com emoji';
        }
        return null;
    },

    // Formato de cor RGB
    rgbColor: (value) => {
        if (!value) return null;
        
        const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
        if (!rgbRegex.test(value)) {
            return 'Formato RGB inválido (ex: rgb(255, 0, 0))';
        }
        
        // Validar se os valores estão entre 0-255
        const values = value.match(/\d{1,3}/g);
        if (values && values.some(v => parseInt(v) > 255)) {
            return 'Valores RGB devem estar entre 0 e 255';
        }
        
        return null;
    },

    // Formato de cor hexadecimal
    hexColor: (value) => {
        if (!value) return null;
        
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexRegex.test(value)) {
            return 'Formato hexadecimal inválido (ex: #FF0000)';
        }
        return null;
    },

    // Email válido
    email: (value) => {
        if (!value) return null;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Email inválido';
        }
        return null;
    },

    // URL válida
    url: (value) => {
        if (!value) return null;
        
        try {
            new URL(value);
            return null;
        } catch {
            return 'URL inválida';
        }
    }
};

// Função para combinar múltiplos validadores
export function combineValidators(...validatorFns) {
    return (value) => {
        for (const validator of validatorFns) {
            const error = validator(value);
            if (error) return error;
        }
        return null;
    };
}

// Função para validar objeto completo
export function validateObject(obj, validationRules) {
    const errors = {};
    
    for (const [field, validator] of Object.entries(validationRules)) {
        const error = validator(obj[field]);
        if (error) {
            errors[field] = error;
        }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
}