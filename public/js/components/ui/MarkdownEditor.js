import { CharCounter } from './CharCounter.js';

export class MarkdownEditor {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element || this.element.tagName !== 'TEXTAREA') {
            throw new Error('MarkdownEditor: elemento deve ser textarea');
        }
        
        if (this.element.markdownEditorInstance) {
            return this.element.markdownEditorInstance;
        }
        
        this.options = {
            showPreview: options.showPreview !== false,
            showToolbar: options.showToolbar !== false,
            toolbar: options.toolbar || ['bold', 'italic', 'heading', 'link', 'list'],
            maxLength: options.maxLength || this.element.maxLength || null,
            ...options
        };
        
        this.isPreviewMode = false;
        this.enhance();
        this.element.markdownEditorInstance = this;
    }
    
    enhance() {
        // Adicionar classe ao textarea
        this.element.classList.add('markdown-input');
        
        // Criar wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'markdown-editor';
        
        // Inserir wrapper
        this.element.parentNode.insertBefore(this.wrapper, this.element);
        
        // Toolbar opcional
        if (this.options.showToolbar) {
            this.createToolbar();
        }
        
        // Container para editor e preview
        this.container = document.createElement('div');
        this.container.className = 'markdown-wrapper';
        this.wrapper.appendChild(this.container);
        
        // Mover textarea para dentro do container
        this.container.appendChild(this.element);
        
        // Preview opcional
        if (this.options.showPreview) {
            this.preview = document.createElement('div');
            this.preview.className = 'markdown-preview';
            this.preview.style.display = 'none';
            this.container.appendChild(this.preview);
        }
        
        // Adicionar CharCounter se maxLength definido
        if (this.options.maxLength) {
            this.charCounter = new CharCounter(this.element, {
                maxLength: this.options.maxLength,
                showRemaining: true
            });
        }
        
        this.attachEvents();
    }
    
    createToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'markdown-toolbar';
        
        const tools = {
            bold: { icon: 'B', title: 'Negrito (Ctrl+B)', before: '**', after: '**' },
            italic: { icon: 'I', title: 'Itálico (Ctrl+I)', before: '*', after: '*' },
            heading: { icon: 'H', title: 'Título', before: '## ', after: '' },
            link: { icon: '🔗', title: 'Link (Ctrl+K)', action: () => this.insertLink() },
            list: { icon: '•', title: 'Lista', before: '- ', after: '' },
            quote: { icon: '"', title: 'Citação', before: '> ', after: '' },
            code: { icon: '{ }', title: 'Código', before: '`', after: '`' }
        };
        
        this.options.toolbar.forEach(key => {
            if (!tools[key]) return;
            
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'markdown-btn';
            button.title = tools[key].title;
            button.innerHTML = `<span class="markdown-btn-icon">${tools[key].icon}</span>`;
            
            if (tools[key].action) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    tools[key].action();
                });
            } else {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.insertMarkdown(tools[key].before, tools[key].after);
                });
            }
            
            this.toolbar.appendChild(button);
        });
        
        // Botão de preview se habilitado
        if (this.options.showPreview) {
            const separator = document.createElement('span');
            separator.className = 'markdown-toolbar-separator';
            this.toolbar.appendChild(separator);
            
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.type = 'button';
            this.toggleBtn.className = 'markdown-btn markdown-toggle';
            this.toggleBtn.title = 'Alternar Preview';
            this.toggleBtn.innerHTML = '<span class="markdown-btn-icon">👁</span>';
            this.toggleBtn.addEventListener('click', () => this.togglePreview());
            this.toolbar.appendChild(this.toggleBtn);
        }
        
        this.wrapper.insertBefore(this.toolbar, this.container);
    }
    
    attachEvents() {
        // Eventos do textarea
        this.element.addEventListener('input', () => {
            if (this.isPreviewMode && this.preview) {
                this.updatePreview();
            }
        });
        
        // Atalhos de teclado
        this.element.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        this.insertMarkdown('**', '**');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.insertMarkdown('*', '*');
                        break;
                    case 'k':
                        e.preventDefault();
                        this.insertLink();
                        break;
                }
            }
        });
    }
    
    insertMarkdown(before, after = '') {
        const start = this.element.selectionStart;
        const end = this.element.selectionEnd;
        const selectedText = this.element.value.substring(start, end);
        const beforeText = this.element.value.substring(0, start);
        const afterText = this.element.value.substring(end);
        
        this.element.value = beforeText + before + selectedText + after + afterText;
        
        // Posicionar cursor
        const cursorPos = selectedText ? 
            start + before.length + selectedText.length + after.length :
            start + before.length;
        
        this.element.setSelectionRange(cursorPos, cursorPos);
        this.element.focus();
        
        // Disparar evento input para atualizar CharCounter
        this.element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    insertLink() {
        const url = prompt('Digite a URL do link:');
        if (url) {
            const start = this.element.selectionStart;
            const end = this.element.selectionEnd;
            const selectedText = this.element.value.substring(start, end) || 'texto do link';
            this.insertMarkdown(`[${selectedText}](`, `${url})`);
        }
    }
    
    togglePreview() {
        if (!this.preview) return;
        
        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            this.updatePreview();
            this.element.style.display = 'none';
            this.preview.style.display = 'block';
            this.toggleBtn?.classList.add('active');
        } else {
            this.element.style.display = 'block';
            this.preview.style.display = 'none';
            this.toggleBtn?.classList.remove('active');
            this.element.focus();
        }
    }
    
    updatePreview() {
        if (!this.preview) return;
        
        const html = this.parseMarkdown(this.element.value);
        this.preview.innerHTML = html;
    }
    
    parseMarkdown(markdown) {
        // Parser simplificado mas funcional
        let html = markdown
            // Escapar HTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold e Italic
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Links e imagens
            .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img alt="$1" src="$2">')
            .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
            // Code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Blockquote
            .replace(/^\> (.+)/gim, '<blockquote>$1</blockquote>')
            // Listas
            .replace(/^\* (.+)/gim, '<li>$1</li>')
            .replace(/^\- (.+)/gim, '<li>$1</li>')
            .replace(/^\d+\. (.+)/gim, '<li>$1</li>')
            // HR
            .replace(/^---$/gim, '<hr>')
            // Quebras de linha
            .replace(/\n/g, '<br>');
        
        // Envolver listas em ul
        html = html.replace(/(<li>.*<\/li>)/s, (match) => {
            return '<ul>' + match + '</ul>';
        });
        
        return html;
    }
    
    getValue() {
        return this.element.value;
    }
    
    setValue(value) {
        this.element.value = value;
        this.element.dispatchEvent(new Event('input', { bubbles: true }));
        if (this.isPreviewMode) {
            this.updatePreview();
        }
    }
    
    focus() {
        if (!this.isPreviewMode) {
            this.element.focus();
        }
    }
    
    destroy() {
        // Destruir CharCounter se existir
        if (this.charCounter) {
            this.charCounter.destroy();
        }
        
        // Mover textarea de volta
        this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
        
        // Remover wrapper
        this.wrapper.remove();
        
        // Limpar referências
        this.element.classList.remove('markdown-input');
        delete this.element.markdownEditorInstance;
    }
}