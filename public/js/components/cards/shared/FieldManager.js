import { EmojiPicker } from '../../ui/EmojiPicker.js';
import { ColorPicker } from '../../ui/ColorPicker.js';
import { FileUpload } from '../../ui/FileUpload.js';
import { MarkdownEditor } from '../../ui/MarkdownEditor.js';
import { FontSelector } from '../../ui/FontSelector.js';
import { CharCounter } from '../../ui/CharCounter.js';

export default class FieldManager {
    constructor(container) {
        this.container = container;
        this.fields = new Map();
        this.fieldTypes = new Map();
        
        this.registerDefaults();
    }

    registerDefaults() {
        this.registerFieldType('emoji-text', EmojiPicker);
        this.registerFieldType('color-picker', ColorPicker);
        this.registerFieldType('color', ColorPicker);
        this.registerFieldType('file-upload', FileUpload);
        this.registerFieldType('file', FileUpload);
        this.registerFieldType('image', FileUpload);
        this.registerFieldType('markdown', MarkdownEditor);
        this.registerFieldType('font-selector', FontSelector);
        this.registerFieldType('font', FontSelector);
    }

    registerFieldType(type, ComponentClass, defaultOptions = {}) {
        this.fieldTypes.set(type, { ComponentClass, defaultOptions });
    }

    async autoInitFields() {
        const specialFields = this.container.querySelectorAll('[data-field-type], [data-emoji-text], [data-color-picker], [data-file-upload], [data-markdown], [data-font-selector]');
        
        for (const field of specialFields) {
            const fieldType = this.detectFieldType(field);
            if (fieldType) {
                await this.initField(field, fieldType);
            }
        }

        // CharCounter para textareas
        const textareas = this.container.querySelectorAll('textarea[maxlength]');
        for (const textarea of textareas) {
            if (!textarea.closest('[data-markdown]') && !this.fields.has(this.getFieldId(textarea))) {
                new CharCounter(textarea);
            }
        }

        // CharCounter para inputs de texto com maxlength
        const inputs = this.container.querySelectorAll('input[type="text"][maxlength]');
        for (const input of inputs) {
            if (!this.fields.has(this.getFieldId(input))) {
                new CharCounter(input);
            }
        }
    }

    detectFieldType(element) {
        if (element.dataset.fieldType) return element.dataset.fieldType;
        if (element.dataset.emojiText !== undefined) return 'emoji-text';
        if (element.dataset.colorPicker !== undefined) return 'color-picker';
        if (element.dataset.fileUpload !== undefined) return 'file-upload';
        if (element.dataset.markdown !== undefined) return 'markdown';
        if (element.dataset.fontSelector !== undefined) return 'font-selector';
        
        if (element.classList.contains('emoji-text')) return 'emoji-text';
        if (element.classList.contains('color-picker')) return 'color-picker';
        if (element.classList.contains('file-upload')) return 'file-upload';
        if (element.classList.contains('markdown-editor')) return 'markdown';
        if (element.classList.contains('font-selector')) return 'font-selector';
        
        return null;
    }

    async initField(element, type, options = {}) {
        const fieldId = this.getFieldId(element);
        
        if (this.fields.has(fieldId)) {
            return this.fields.get(fieldId);
        }

        const config = this.fieldTypes.get(type);
        if (!config) {
            console.warn(`Unknown field type: ${type}`);
            return null;
        }

        const { ComponentClass, defaultOptions } = config;
        const mergedOptions = { ...defaultOptions, ...options };

        // Encontrar o elemento correto dentro do container baseado no tipo
        let targetElement = element;
        
        switch (type) {
            case 'file-upload':
                targetElement = element.querySelector('input[type="file"]') || element;
                break;
            case 'markdown':
                targetElement = element.querySelector('textarea') || element;
                break;
            case 'font-selector':
                targetElement = element.querySelector('select') || element;
                break;
            case 'color-picker':
            case 'color':
                targetElement = element.querySelector('input[type="color"], input[type="text"]') || element;
                break;
            case 'emoji-text':
                targetElement = element.querySelector('input[type="text"], textarea') || element;
                break;
        }

        await new Promise(resolve => setTimeout(resolve, 0));

        try {
            const instance = new ComponentClass(targetElement, mergedOptions);
            this.fields.set(fieldId, { instance, element: targetElement, type });
            return instance;
        } catch (error) {
            console.error(`Failed to initialize field type ${type}:`, error);
            return null;
        }
    }

    getFieldId(element) {
        if (!element.id) {
            element.id = `field-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        }
        return element.id;
    }

    destroyField(fieldId) {
        const field = this.fields.get(fieldId);
        if (field) {
            if (field.instance && typeof field.instance.destroy === 'function') {
                field.instance.destroy();
            }
            this.fields.delete(fieldId);
        }
    }

    destroyAll() {
        for (const [, field] of this.fields) {
            if (field.instance && typeof field.instance.destroy === 'function') {
                field.instance.destroy();
            }
        }
        this.fields.clear();
    }

    getField(fieldId) {
        const field = this.fields.get(fieldId);
        return field ? field.instance : null;
    }

    getAllFields() {
        const result = {};
        for (const [fieldId, field] of this.fields) {
            result[fieldId] = field.instance;
        }
        return result;
    }

    getFieldsByType(type) {
        const result = [];
        for (const [, field] of this.fields) {
            if (field.type === type) {
                result.push(field.instance);
            }
        }
        return result;
    }
}