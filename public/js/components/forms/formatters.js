/**
 * formatters.js
 * Sistema de formatação de dados para exibição
 * Documentação: /docs/0_16-sistemas-core.md#formatters
 * Localização: /js/core/formatters.js
 * 
 * COMO USAR:
 * 1. Importar: import { format } from '/js/core/formatters.js'
 * 2. Formatar: format.date(new Date()) ou format.currency(1234.56)
 * 3. Personalizar: format.date(data, 'DD/MM/YYYY HH:mm')
 */

// Formatadores de dados
export const format = {
    // Formatar data brasileira
    date(date, pattern = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return pattern
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year)
            .replace('HH', hours)
            .replace('mm', minutes);
    },
    
    // Formatar moeda brasileira
    currency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    // Formatar número com separadores
    number(value, decimals = 0) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    },
    
    // Formatar porcentagem
    percent(value, decimals = 0) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value / 100);
    },
    
    // Extrair iniciais do nome
    initials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },
    
    // Pluralizar palavra
    pluralize(count, singular, plural) {
        return count === 1 ? singular : (plural || singular + 's');
    },
    
    // Formatar tempo relativo (há 2 dias, em 3 horas, etc)
    timeAgo(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 30) return format.date(date);
        if (diffDays > 0) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
        if (diffHours > 0) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        if (diffMins > 0) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
        return 'agora mesmo';
    },
    
    // Formatar tamanho de arquivo
    fileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    },
    
    // Truncar texto com reticências
    truncate(text, maxLength = 50) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    },
    
    // Capitalizar primeira letra
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    // Formatar telefone brasileiro
    phone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    },
    
    // Formatar data e hora
    datetime(date) {
        return format.date(date, 'DD/MM/YYYY HH:mm');
    }
};

// Exporta também individualmente para conveniência
export const {
    date: formatDate,
    currency: formatCurrency,
    number: formatNumber,
    percent: formatPercent,
    initials: formatInitials,
    pluralize: formatPluralize,
    timeAgo: formatTimeAgo,
    fileSize: formatFileSize,
    truncate: formatTruncate,
    capitalize: formatCapitalize,
    phone: formatPhone,
    datetime: formatDatetime
} = format;