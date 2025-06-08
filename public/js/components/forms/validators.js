import { masks } from './masks.js';

export { masks };

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

    // Deve começar com emoji (formato: emoji + espaço + texto)
    startsWithEmoji: (value) => {
        if (!value) return 'Campo obrigatório';
        
        // Regex para detectar exatamente 1 emoji + espaço + texto
        // Formato: [EMOJI] [ESPAÇO] [TEXTO de 1-25 caracteres]
        const emojiTextRegex = /^([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F980}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|\u{2328}|\u{23CF}|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|\u{1F201}|[\u{1F21A}]|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6D2}]|[\u{1F6D5}-\u{1F6D7}]|[\u{1F6DC}-\u{1F6DF}]|[\u{1F6E0}-\u{1F6EC}]|[\u{1F6F0}-\u{1F6FC}]|[\u{1F7E0}-\u{1F7EB}]|[\u{1F7F0}]|[\u{1F90C}-\u{1F93A}]|[\u{1F93C}-\u{1F945}]|[\u{1F947}-\u{1F9FF}]|[\u{231A}-\u{231B}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE0F}]?)[\u{FE0F}]?\s.{1,25}$/u;
        
        if (!emojiTextRegex.test(value)) {
            // Verificações específicas para dar feedback melhor
            const emojiAtStart = /^([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F980}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|\u{2328}|\u{23CF}|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|\u{1F201}|[\u{1F21A}]|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6D2}]|[\u{1F6D5}-\u{1F6D7}]|[\u{1F6DC}-\u{1F6DF}]|[\u{1F6E0}-\u{1F6EC}]|[\u{1F6F0}-\u{1F6FC}]|[\u{1F7E0}-\u{1F7EB}]|[\u{1F7F0}]|[\u{1F90C}-\u{1F93A}]|[\u{1F93C}-\u{1F945}]|[\u{1F947}-\u{1F9FF}]|[\u{231A}-\u{231B}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE0F}]?)[\u{FE0F}]?/u;
            
            if (!emojiAtStart.test(value)) {
                return 'Deve começar com um emoji';
            }
            
            const hasSpaceAfterEmoji = /^([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F980}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|\u{2328}|\u{23CF}|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|\u{1F201}|[\u{1F21A}]|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6D2}]|[\u{1F6D5}-\u{1F6D7}]|[\u{1F6DC}-\u{1F6DF}]|[\u{1F6E0}-\u{1F6EC}]|[\u{1F6F0}-\u{1F6FC}]|[\u{1F7E0}-\u{1F7EB}]|[\u{1F7F0}]|[\u{1F90C}-\u{1F93A}]|[\u{1F93C}-\u{1F945}]|[\u{1F947}-\u{1F9FF}]|[\u{231A}-\u{231B}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE0F}]?)[\u{FE0F}]?\s/u;
            
            if (!hasSpaceAfterEmoji.test(value)) {
                return 'Deve ter um espaço após o emoji';
            }
            
            // Verificar tamanho do texto após emoji + espaço
            const textAfterEmoji = value.replace(/^([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F980}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|\u{2328}|\u{23CF}|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|\u{1F201}|[\u{1F21A}]|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6D2}]|[\u{1F6D5}-\u{1F6D7}]|[\u{1F6DC}-\u{1F6DF}]|[\u{1F6E0}-\u{1F6EC}]|[\u{1F6F0}-\u{1F6FC}]|[\u{1F7E0}-\u{1F7EB}]|[\u{1F7F0}]|[\u{1F90C}-\u{1F93A}]|[\u{1F93C}-\u{1F945}]|[\u{1F947}-\u{1F9FF}]|[\u{231A}-\u{231B}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE0F}]?)[\u{FE0F}]?\s/u, '');
            
            if (textAfterEmoji.length === 0) {
                return 'Deve ter texto após o emoji e espaço';
            }
            
            if (textAfterEmoji.length > 25) {
                return 'Texto após emoji deve ter no máximo 25 caracteres';
            }
            
            return 'Formato: emoji + espaço + texto (até 25 caracteres)';
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
    
    for (const [field, rules] of Object.entries(validationRules)) {
        const value = obj[field];
        let error = null;
        
        // Suportar diferentes formatos de validação
        if (Array.isArray(rules)) {
            // Formato: [validator1, validator2, ...]
            for (const validator of rules) {
                if (typeof validator === 'function') {
                    error = validator(value);
                    if (error) break; // Para no primeiro erro
                }
            }
        } else if (typeof rules === 'function') {
            // Formato: validator
            error = rules(value);
        } else if (typeof rules === 'object' && rules !== null) {
            // Formato: {required: true, minLength: 5, maxLength: 100}
            if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
                error = 'Campo obrigatório';
            } else if (value) {
                if (rules.minLength && value.length < rules.minLength) {
                    error = `Mínimo ${rules.minLength} caracteres`;
                } else if (rules.maxLength && value.length > rules.maxLength) {
                    error = `Máximo ${rules.maxLength} caracteres`;
                } else if (rules.type === 'email' && !validators.email(value)) {
                    error = 'Email inválido';
                } else if (rules.type === 'cpf' && !validators.cpf(value)) {
                    error = 'CPF inválido';
                }
            }
        }
        
        if (error) {
            errors[field] = error;
        }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
}

