export const masks = {
    cpf: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    cnpj: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },
    
    phone: (value) => {
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    },
    
    cep: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{5})(\d{3})/, '$1-$2');
    },
    
    date: (value) => {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    },
    
    currency: (value) => {
        value = value.replace(/\D/g, '');
        value = (value / 100).toFixed(2);
        return `R$ ${value}`.replace('.', ',');
    }
};

export function applyMask(input, maskType) {
    if (!masks[maskType]) {
        console.error(`Máscara '${maskType}' não encontrada`);
        return;
    }
    
    let previousLength = 0;
    
    const handler = (e) => {
        const value = e.target.value;
        const currentLength = value.replace(/\D/g, '').length;
        
        if (currentLength !== previousLength) {
            const masked = masks[maskType](value);
            if (masked !== value) {
                const cursorPos = e.target.selectionStart;
                const diff = masked.length - value.length;
                
                e.target.value = masked;
                
                const newPos = Math.max(0, cursorPos + diff);
                e.target.setSelectionRange(newPos, newPos);
            }
            previousLength = currentLength;
        }
    };
    
    input.addEventListener('input', handler);
    
    if (input.value) {
        input.value = masks[maskType](input.value);
    }
    
    return () => input.removeEventListener('input', handler);
}