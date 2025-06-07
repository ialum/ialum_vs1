import { create, on } from '../../core/dom.js';

export class EmojiPicker {
    constructor(input, options = {}) {
        this.input = input;
        this.isOpen = false;
        this.selectedCategory = 'popular';
        
        this.options = {
            buttonText: '😊',
            placeholder: 'Buscar emoji...',
            categories: {
                popular: {
                    name: 'Populares',
                    emojis: ['⚖️', '📜', '🏛️', '👨‍⚖️', '📋', '💼', '🔍', '📊', '💡', '🎯', '✅', '❌', '⭐', '🔥', '💎', '🚀']
                },
                juridico: {
                    name: 'Jurídico',
                    emojis: ['⚖️', '📜', '🏛️', '👨‍⚖️', '👩‍⚖️', '🔨', '📋', '💼', '🏦', '📑', '🗂️', '📂', '🔏', '🔐', '🛡️', '⚠️']
                },
                negocios: {
                    name: 'Negócios',
                    emojis: ['💼', '💰', '💵', '💳', '📊', '📈', '📉', '🎯', '🏢', '🏦', '💹', '🤝', '✍️', '📝', '📌', '📍']
                },
                comunicacao: {
                    name: 'Comunicação',
                    emojis: ['💬', '💭', '🗨️', '📢', '📣', '📞', '📱', '📧', '✉️', '📨', '📩', '🔔', '🔕', '📡', '📻', '🎙️']
                },
                emocoes: {
                    name: 'Emoções',
                    emojis: ['😊', '😎', '🤔', '😮', '😲', '😤', '😡', '😰', '😨', '😱', '🤗', '🤝', '👏', '💪', '🙏', '❤️']
                },
                objetos: {
                    name: 'Objetos',
                    emojis: ['📱', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📷', '📹', '🎥', '📡', '🔦', '💡', '🔌', '🔋', '⏰', '⏱️']
                }
            },
            onChange: null,
            ...options
        };
        
        this.filteredEmojis = [];
        this.init();
    }
    
    init() {
        console.log('🎭 Inicializando EmojiPicker com categorias:', Object.keys(this.options.categories));
        this.createButton();
        this.createPicker();
        this.bindEvents();
        this.updateButtonEmoji();
    }
    
    createButton() {
        this.button = create('button', {
            type: 'button',
            class: 'emoji-picker-button',
            'aria-label': 'Escolher emoji',
            'aria-expanded': 'false'
        }, this.options.buttonText);
        
        // Verificar se já existe um input-group
        const existingGroup = this.input.closest('.input-group');
        let wrapper, prepend;
        
        if (existingGroup) {
            // Se já existe input-group, verificar se já tem emoji button
            const existingEmojiButton = existingGroup.querySelector('.emoji-picker-button');
            if (existingEmojiButton) {
                console.log('Emoji picker já existe, reutilizando...');
                this.button = existingEmojiButton;
                return;
            }
            
            // Se não há emoji button, usar o input-group existente
            wrapper = existingGroup;
            prepend = wrapper.querySelector('.input-group-prepend');
            
            if (!prepend) {
                // Se não há prepend, criar um
                prepend = create('div', { class: 'input-group-prepend' });
                wrapper.insertBefore(prepend, this.input);
            }
        } else {
            // Se não existe, criar nova estrutura
            wrapper = create('div', { class: 'input-group' });
            this.input.parentNode.insertBefore(wrapper, this.input);
            
            prepend = create('div', { class: 'input-group-prepend' });
            wrapper.appendChild(prepend);
            wrapper.appendChild(this.input);
        }
        
        prepend.appendChild(this.button);
        this.input.classList.add('has-emoji-prepend');
    }
    
    createPicker() {
        this.picker = create('div', {
            class: 'emoji-picker-dropdown',
            'aria-hidden': 'true'
        });
        
        const search = create('input', {
            type: 'text',
            class: 'form-control form-control-sm emoji-picker-search',
            placeholder: this.options.placeholder
        });
        
        const categories = create('div', { class: 'emoji-picker-categories' });
        
        Object.entries(this.options.categories).forEach(([key, category]) => {
            const tab = create('button', {
                type: 'button',
                class: `emoji-picker-category ${key === this.selectedCategory ? 'active' : ''}`
            }, category.name);
            
            // Definir data-category manualmente
            tab.setAttribute('data-category', key);
            categories.appendChild(tab);
        });
        
        const grid = create('div', { class: 'emoji-picker-grid' });
        
        this.picker.appendChild(search);
        this.picker.appendChild(categories);
        this.picker.appendChild(grid);
        
        document.body.appendChild(this.picker);
        
        this.searchInput = search;
        this.grid = grid;
        this.renderEmojis();
    }
    
    renderEmojis(searchTerm = '') {
        this.grid.innerHTML = '';
        
        const category = this.options.categories[this.selectedCategory];
        if (!category) {
            console.error('Categoria não encontrada:', this.selectedCategory);
            this.selectedCategory = 'popular'; // Fallback para categoria padrão
            return this.renderEmojis(searchTerm);
        }
        
        let emojis = category.emojis;
        
        if (searchTerm) {
            const allEmojis = Object.values(this.options.categories)
                .filter(cat => cat && cat.emojis) // Filtrar categorias válidas
                .flatMap(cat => cat.emojis);
            const uniqueEmojis = [...new Set(allEmojis)];
            
            emojis = uniqueEmojis.filter(emoji => {
                const categoryName = Object.entries(this.options.categories)
                    .find(([_, cat]) => cat && cat.emojis && cat.emojis.includes(emoji))?.[1]?.name || '';
                return categoryName.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }
        
        emojis.forEach(emoji => {
            const item = create('button', {
                type: 'button',
                class: 'emoji-picker-item'
            }, emoji);
            
            // Definir data-emoji manualmente para garantir que funciona
            item.setAttribute('data-emoji', emoji);
            this.grid.appendChild(item);
        });
        
        if (emojis.length === 0) {
            this.grid.appendChild(
                create('div', { class: 'emoji-picker-empty' }, 'Nenhum emoji encontrado')
            );
        }
    }
    
    bindEvents() {
        on(this.button, 'click', () => this.toggle());
        
        on(this.searchInput, 'input', (e) => {
            this.renderEmojis(e.target.value);
        });
        
        on(this.picker, 'click', (e) => {
            if (e.target.classList.contains('emoji-picker-category')) {
                const newCategory = e.target.dataset.category;
                console.log('Categoria selecionada:', newCategory);
                this.selectedCategory = newCategory;
                this.picker.querySelectorAll('.emoji-picker-category').forEach(cat => {
                    cat.classList.toggle('active', cat === e.target);
                });
                this.renderEmojis();
            }
            
            if (e.target.classList.contains('emoji-picker-item')) {
                const selectedEmoji = e.target.dataset.emoji;
                console.log('Emoji selecionado:', selectedEmoji);
                this.selectEmoji(selectedEmoji);
            }
        });
        
        on(document, 'click', (e) => {
            if (!this.picker.contains(e.target) && !this.button.contains(e.target)) {
                this.close();
            }
        });
        
        on(this.input, 'input', () => this.updateButtonEmoji());
    }
    
    selectEmoji(emoji) {
        if (!emoji) {
            console.error('Emoji não definido');
            return;
        }
        
        const currentValue = this.input.value;
        
        // Abordagem mais simples e robusta: encontrar onde termina o primeiro emoji + espaço
        let textPart = '';
        if (currentValue.length > 0) {
            // Procurar o primeiro espaço após um emoji
            const firstSpaceIndex = currentValue.indexOf(' ');
            if (firstSpaceIndex > 0) {
                // Se há espaço, pegar tudo após o primeiro espaço
                textPart = currentValue.substring(firstSpaceIndex + 1);
            } else {
                // Se não há espaço, verificar se começa com emoji
                const startsWithEmoji = /^[\u{1F000}-\u{1F9FF}]|^[\u{2600}-\u{27BF}]/u.test(currentValue);
                if (!startsWithEmoji) {
                    // Se não começa com emoji, manter tudo como texto
                    textPart = currentValue;
                }
            }
        }
        
        // Formato: emoji + espaço + texto (se houver)
        this.input.value = emoji + ' ' + textPart.trim();
        
        // Posicionar cursor após o espaço se não há texto
        if (!textPart) {
            // Posicionar cursor após "emoji "
            setTimeout(() => {
                this.input.setSelectionRange(2, 2);
            }, 0);
        }
        
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        this.input.focus();
        
        if (this.options.onChange) {
            this.options.onChange(emoji);
        }
        
        this.close();
    }
    
    updateButtonEmoji() {
        const value = this.input.value;
        const emojiMatch = value.match(/^([\p{Emoji_Presentation}\p{Emoji}\uFE0F])/u);
        
        if (emojiMatch) {
            this.button.textContent = emojiMatch[1];
        } else {
            this.button.textContent = this.options.buttonText;
        }
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.picker.setAttribute('aria-hidden', 'false');
        this.button.setAttribute('aria-expanded', 'true');
        
        const rect = this.button.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        this.picker.style.position = 'absolute';
        this.picker.style.left = `${rect.left}px`;
        
        if (spaceBelow < 320 && spaceAbove > spaceBelow) {
            this.picker.style.bottom = `${window.innerHeight - rect.top}px`;
            this.picker.style.top = 'auto';
        } else {
            this.picker.style.top = `${rect.bottom + 4}px`;
            this.picker.style.bottom = 'auto';
        }
        
        this.picker.classList.add('show');
        this.searchInput.focus();
    }
    
    close() {
        this.isOpen = false;
        this.picker.setAttribute('aria-hidden', 'true');
        this.button.setAttribute('aria-expanded', 'false');
        this.picker.classList.remove('show');
        this.searchInput.value = '';
        this.renderEmojis();
    }
    
    destroy() {
        this.picker.remove();
        const wrapper = this.input.parentNode;
        if (wrapper.classList.contains('input-group')) {
            wrapper.parentNode.insertBefore(this.input, wrapper);
            wrapper.remove();
        }
        this.input.classList.remove('has-emoji-prepend');
    }
}