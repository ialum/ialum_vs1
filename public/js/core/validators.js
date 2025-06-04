/**
 * validators.js
 * Sistema de validação e máscaras de formulários
 * Documentação: /docs/0_16-sistemas-core.md#validators
 * Localização: /js/core/validators.js
 * 
 * COMO USAR:
 * 1. Importar: import { validators, masks } from '/js/core/validators.js'
 * 2. Validar: const erro = validators.email(valor)
 * 3. Mascarar: const formatado = masks.cpf('12345678900')
 * 4. Combinar: combineValidators(validators.required, validators.email)
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
    },

    // CPF válido
    cpf: (value) => {
        if (!value) return null;
        
        const cpf = value.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return 'CPF deve ter 11 dígitos';
        
        // Validação básica
        if (/^(\d)\1+$/.test(cpf)) return 'CPF inválido';
        
        // Cálculo dos dígitos verificadores
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return 'CPF inválido';
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return 'CPF inválido';
        
        return null;
    },

    // CNPJ válido
    cnpj: (value) => {
        if (!value) return null;
        
        const cnpj = value.replace(/[^\d]/g, '');
        if (cnpj.length !== 14) return 'CNPJ deve ter 14 dígitos';
        
        // Validação básica
        if (/^(\d)\1+$/.test(cnpj)) return 'CNPJ inválido';
        
        // TODO: Implementar cálculo completo
        return null;
    },

    // Telefone brasileiro
    phone: (value) => {
        if (!value) return null;
        
        const phone = value.replace(/\D/g, '');
        if (phone.length < 10 || phone.length > 11) {
            return 'Telefone inválido';
        }
        return null;
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

// Máscaras para formatação
export const masks = {
    // Máscara de CPF
    cpf: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    // Máscara de CNPJ
    cnpj: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },
    
    // Máscara de telefone
    phone: (value) => {
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    },
    
    // Máscara de CEP
    cep: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{5})(\d{3})/, '$1-$2');
    },
    
    // Máscara de data
    date: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    },
    
    // Máscara de moeda
    currency: (value) => {
        value = value.replace(/\D/g, '');
        value = (value / 100).toFixed(2);
        return `R$ ${value}`.replace('.', ',');
    }
};