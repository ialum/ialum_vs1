export class MarkdownEditor {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.element) {
            throw new Error('MarkdownEditor: elemento não encontrado');
        }
        
        if (this.element.markdownEditorInstance) {
            return this.element.markdownEditorInstance;
        }
        
        this.options = {
            showPreview: options.showPreview !== false,
            showToolbar: options.showToolbar !== false,
            autoPreview: options.autoPreview || false,
            toolbar: options.toolbar || ['bold', 'italic', 'heading', 'link', 'list', 'quote'],
            placeholder: options.placeholder || 'Digite seu texto em Markdown...',
            height: options.height || '300px',
            ...options
        };
        
        this.isPreviewMode = false;
        this.init();
        this.element.markdownEditorInstance = this;
    }
    
    init() {
        this.createStructure();
        this.attachEvents();
        this.updatePreview();
    }
    
    createStructure() {
        const wrapper = this.element.parentNode;
        
        if (!wrapper) {
            throw new Error('MarkdownEditor: elemento deve ter um parent node');
        }
        
        this.container = document.createElement('div');
        this.container.className = 'markdown-editor';
        
        if (this.options.showToolbar) {
            this.toolbar = document.createElement('div');
            this.toolbar.className = 'markdown-toolbar';
            this.toolbar.innerHTML = this.createToolbarHTML();
            this.container.appendChild(this.toolbar);
        }
        
        this.editorWrapper = document.createElement('div');
        this.editorWrapper.className = 'markdown-editor-wrapper';
        this.editorWrapper.style.height = this.options.height;
        
        // Criar novo editor mantendo propriedades do elemento original
        this.editor = document.createElement('textarea');
        this.editor.className = 'markdown-editor-input';
        this.editor.placeholder = this.options.placeholder;
        this.editor.name = this.element.name;
        this.editor.id = this.element.id;
        this.editor.value = this.element.value;
        this.editor.rows = this.element.rows || 6;
        
        if (this.options.showPreview) {
            this.preview = document.createElement('div');
            this.preview.className = 'markdown-preview';
            this.preview.innerHTML = '<div class="markdown-preview-content"></div>';
            
            this.previewContent = this.preview.querySelector('.markdown-preview-content');
            
            if (this.options.autoPreview) {
                this.editorWrapper.classList.add('split-view');
                this.editorWrapper.appendChild(this.editor);
                this.editorWrapper.appendChild(this.preview);
            } else {
                this.toggleButton = document.createElement('button');
                this.toggleButton.type = 'button';
                this.toggleButton.className = 'markdown-toggle btn btn-sm btn-outline';
                this.toggleButton.textContent = 'Preview';
                
                if (this.toolbar) {
                    this.toolbar.appendChild(this.toggleButton);
                } else {
                    this.container.appendChild(this.toggleButton);
                }
                
                this.editorWrapper.appendChild(this.editor);
                this.editorWrapper.appendChild(this.preview);
                this.preview.style.display = 'none';
            }
        } else {
            this.editorWrapper.appendChild(this.editor);
        }
        
        this.container.appendChild(this.editorWrapper);
        
        // Substituir o elemento original pelo container
        wrapper.replaceChild(this.container, this.element);
    }
    
    createToolbarHTML() {
        const buttons = {
            bold: { icon: 'B', title: 'Negrito', action: () => this.insertMarkdown('**', '**') },
            italic: { icon: 'I', title: 'Itálico', action: () => this.insertMarkdown('*', '*') },
            heading: { icon: 'H', title: 'Título', action: () => this.insertMarkdown('## ', '') },
            link: { icon: '🔗', title: 'Link', action: () => this.insertLink() },
            list: { icon: '•', title: 'Lista', action: () => this.insertMarkdown('- ', '') },
            quote: { icon: '"', title: 'Citação', action: () => this.insertMarkdown('> ', '') },
            code: { icon: '{ }', title: 'Código', action: () => this.insertMarkdown('`', '`') },
            hr: { icon: '—', title: 'Linha horizontal', action: () => this.insertMarkdown('\n---\n', '') }
        };
        
        return this.options.toolbar.map(buttonKey => {
            const button = buttons[buttonKey];
            if (!button) return '';
            
            return `
                <button type="button" class="markdown-btn" data-action="${buttonKey}" title="${button.title}">
                    <span style="font-weight: ${buttonKey === 'bold' ? 'bold' : buttonKey === 'italic' ? 'italic' : 'normal'}">
                        ${button.icon}
                    </span>
                </button>
            `;
        }).join('');
    }
    
    attachEvents() {
        if (this.toolbar) {
            this.toolbar.addEventListener('click', (e) => {
                if (e.target.closest('.markdown-btn')) {
                    const action = e.target.closest('.markdown-btn').dataset.action;
                    this.handleToolbarAction(action);
                }
            });
        }
        
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.togglePreview());
        }
        
        this.editor.addEventListener('input', () => {
            if (this.options.autoPreview || this.isPreviewMode) {
                this.updatePreview();
            }
        });
        
        this.editor.addEventListener('keydown', (e) => {
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
    
    handleToolbarAction(action) {
        const actions = {
            bold: () => this.insertMarkdown('**', '**'),
            italic: () => this.insertMarkdown('*', '*'),
            heading: () => this.insertMarkdown('## ', ''),
            link: () => this.insertLink(),
            list: () => this.insertMarkdown('- ', ''),
            quote: () => this.insertMarkdown('> ', ''),
            code: () => this.insertMarkdown('`', '`'),
            hr: () => this.insertMarkdown('\n---\n', '')
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    insertMarkdown(before, after = '') {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const selectedText = this.editor.value.substring(start, end);
        const beforeText = this.editor.value.substring(0, start);
        const afterText = this.editor.value.substring(end);
        
        this.editor.value = beforeText + before + selectedText + after + afterText;
        
        const newCursorPos = start + before.length + selectedText.length + after.length;
        this.editor.setSelectionRange(newCursorPos, newCursorPos);
        this.editor.focus();
        
        this.editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    insertLink() {
        const url = prompt('Digite a URL do link:');
        if (url) {
            const text = this.getSelectedText() || 'texto do link';
            this.insertMarkdown(`[${text}](`, `${url})`);
        }
    }
    
    getSelectedText() {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        return this.editor.value.substring(start, end);
    }
    
    togglePreview() {
        if (!this.options.showPreview || this.options.autoPreview) return;
        
        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            this.editor.style.display = 'none';
            this.preview.style.display = 'block';
            this.toggleButton.textContent = 'Editar';
            this.updatePreview();
        } else {
            this.editor.style.display = 'block';
            this.preview.style.display = 'none';
            this.toggleButton.textContent = 'Preview';
            this.editor.focus();
        }
    }
    
    updatePreview() {
        if (!this.preview) return;
        
        const markdown = this.editor.value;
        const html = this.markdownToHtml(markdown);
        this.previewContent.innerHTML = html;
    }
    
    markdownToHtml(markdown) {
        return markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            .replace(/^---$/gim, '<hr>')
            .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
            .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
            .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
            .replace(/<\/ul>\s*<ul>/g, '')
            .replace(/<\/ol>\s*<ol>/g, '')
            .replace(/\n/gim, '<br>');
    }
    
    getValue() {
        return this.editor.value;
    }
    
    setValue(value) {
        this.editor.value = value;
        this.updatePreview();
        this.editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    clear() {
        this.setValue('');
    }
    
    focus() {
        if (!this.isPreviewMode) {
            this.editor.focus();
        }
    }
    
    insertAtCursor(text) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const beforeText = this.editor.value.substring(0, start);
        const afterText = this.editor.value.substring(end);
        
        this.editor.value = beforeText + text + afterText;
        
        const newCursorPos = start + text.length;
        this.editor.setSelectionRange(newCursorPos, newCursorPos);
        this.editor.focus();
        
        this.editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    destroy() {
        this.container?.remove();
        this.editor.className = 'form-input';
        this.editor.placeholder = '';
        delete this.element.markdownEditorInstance;
    }
}