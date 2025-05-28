# 🤖 AI_GUIDELINES.md - Diretrizes para IAs do Projeto Ialum
📋 SOBRE ESTE DOCUMENTO
Este documento orienta IAs futuras sobre as decisões arquiteturais do projeto Ialum. Leia COMPLETAMENTE antes de sugerir mudanças.

🎯 CONTEXTO DO PROJETO
Sobre o Ialum

Tipo: SaaS brasileiro para automação de marketing jurídico educativo
Público: Advogados e escritórios de advocacia
Objetivo: Criar e publicar conteúdo automatizado em redes sociais
Diferencial: Foco em segurança e conteúdo jurídico especializado

Stack Tecnológico

Frontend: HTML/CSS/JavaScript com ES6 Modules
Backend: N8N (automação) + Supabase (banco + auth)
IA:

Texto: OpenAI (conteúdo principal)
Pesquisa: Perplexity + Anthropic
Imagens: OpenAI DALL-E 3 + Google Gemini
Vídeos: Google Gemini
Templates: Bannerbear (montagem final)


Deploy: EasyPanel com Nixpacks
Pagamento: Stripe + PagSeguro

Ambiente de Desenvolvimento

Editor: Visual Studio Code
Versionamento: GitHub (via interface VS Code)
Deploy: Automático via EasyPanel
Git: NÃO fornecer comandos git


🏗️ DECISÕES ARQUITETURAIS CRÍTICAS
1. SISTEMA DE MÓDULOS ES6 ✨

✅ Usar export/import ES6 nativo
✅ Scripts com type="module" no HTML
❌ NÃO usar bundlers (Webpack, Vite, Rollup)
Motivo: Modernidade sem complexidade de build

2. ESTRUTURA DE PASTAS DEFINITIVA
ialum_vs1/
├── public/              # Raiz servida pelo Nginx (TUDO aqui)
│   ├── css/
│   │   ├── base/       # reset.css, variables.css
│   │   ├── components/ # buttons.css, forms.css, cards.css
│   │   └── pages/      # landing.css, dashboard.css, etc
│   │
│   ├── js/
│   │   ├── core/       # api.js, router.js, utils.js, config.js
│   │   ├── components/ # notifications.js, sidebar.js
│   │   └── pages/      # controllers específicos
│   │       ├── configuracoes/  # main.js + abas
│   │       ├── dashboard/      # main.js
│   │       ├── landing.js
│   │       └── login.js
│   │
│   ├── app/            # Área do SPA
│   │   └── views/      # Templates HTML das páginas
│   │       ├── dashboard.html
│   │       ├── topicos.html
│   │       ├── configuracoes.html
│   │       └── ...
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── index.html      # Landing page
│   ├── login.html      # Login
│   └── app.html        # Container SPA
│
├── docs/               # Documentação
│   └── AI_GUIDELINES.md (este arquivo)
│
├── nixpacks.toml      # Deploy config
└── README.md
⚠️ IMPORTANTE: Por limitações do Nixpacks, TUDO precisa estar dentro de /public/
3. CONFIGURAÇÃO NIXPACKS
toml# nixpacks.toml
providers = ["staticfile"]
[staticDirs]
"/" = "public"
Isso faz o Nginx servir /public/ como raiz do site.
4. SISTEMA DE SEGURANÇA

Autenticação: Supabase Auth + JWT
Multi-tenant: RLS com tenant_id
Navegação: Tokens temporários para ações sensíveis
Views: Protegidas por autenticação no router


📏 REGRAS PARA ARQUIVOS
TAMANHOS MÁXIMOS

CSS: ~150 linhas
JS: ~200 linhas
HTML: ~300 linhas
Excedeu? Dividir em múltiplos arquivos

NOMENCLATURA
[contexto]-[função].[ext]

Exemplos:
- dashboard-widgets.css
- topicos-validation.js
- auth-utils.js
CABEÇALHO OBRIGATÓRIO
javascript/**
 * dashboard/main.js
 * Controlador principal do Dashboard
 * Dependências: api.js, utils.js
 * Localização: public/js/pages/dashboard/main.js
 * Tamanho alvo: <150 linhas
 */
 
CAMINHOS DE ARQUIVOS
html<!-- CSS - sempre absoluto -->
<link rel="stylesheet" href="/css/pages/landing.css">

<!-- JS com modules -->
<script type="module" src="/js/core/app.js"></script>

<!-- Views no Router -->
const routes = {
    'dashboard': {
        view: '/app/views/dashboard.html',
        controller: '/js/pages/dashboard/main.js'
    }
};

🔧 PADRÕES DE CÓDIGO
SISTEMA DE MÓDULOS ES6
Exportar
javascript// Exportar objeto/classe
export const API = {
    login() { ... }
};

// Exportar função
export function init() { ... }

// Exportar múltiplos
export { auth, data, actions };
Importar
javascript// SEMPRE com extensão .js
import { API } from './api.js';
import { Utils } from '../core/utils.js';

// Import dinâmico para controllers
const module = await import('./conta.js');
ESTRUTURA DE PÁGINA COM ABAS
javascript// configuracoes/main.js
export async function init() {
    // Carrega aba inicial
    await loadTab('conta');
}

async function loadTab(tabName) {
    // Import dinâmico da aba
    const module = await import(`./${tabName}.js`);
    module.init();
}
CARREGAMENTO NO HTML
html<!-- app.html - apenas o essencial -->
<script type="module" src="/js/core/app.js"></script>

<!-- login.html - sem modules (compatibilidade) -->
<script src="/js/core/config.js"></script>
<script src="/js/core/utils.js"></script>
<script src="/js/core/api.js"></script>
<script src="/js/pages/login.js"></script>
CONVENÇÕES CSS
css/* BEM simplificado */
.component {}
.component__element {}
.component--modifier {}

/* Variáveis no :root */
:root {
    --primary: #2563eb;
    --spacing-sm: 8px;
}

/* Ordem de carregamento */
1. base/reset.css
2. base/variables.css
3. components/*.css
4. pages/specific.css

🗄️ BANCO DE DADOS
Multi-tenant com tenant_id

Banco compartilhado
RLS em todas as tabelas
UUID para tenant_id

Sistema de IDs

user_id: Integer auto-increment
base_id: 5 dígitos aleatórios
full_id: base_id + plataforma (ex: "12345-IGcars")

Fluxo de Status
Topics: ideia → rascunho → embasado
Publications: rascunho → aprovado → agendado → publicado

🚫 O QUE NÃO FAZER

❌ Sugerir frameworks ou bundlers
❌ Criar arquivos >200 linhas
❌ Esquecer extensão .js nos imports
❌ Criar pastas fora de /public/
❌ Usar window.IalumModules (obsoleto)
❌ Fornecer comandos git
❌ Misturar padrões antigos com ES6


✅ CHECKLIST PARA IA
Antes de criar/modificar código:

 Arquivo dentro de /public/?
 Tamanho <200 linhas?
 Cabeçalho com localização correta?
 Imports com extensão .js?
 Exports no padrão ES6?
 type="module" no HTML?
 Views em /app/views/?
 Controllers em /js/pages/?


📝 EXEMPLO DE RESPOSTA IDEAL
"Vou criar o módulo de validação:

📄 /public/js/components/form-validator.js (120 linhas)
- Localização: public/js/components/
- Exporta: validateForm, validateField
- Importa: Utils de '../core/utils.js'
- Usar em: import { validateForm } from '/js/components/form-validator.js'

Segue padrão ES6 modules com caminhos corretos."

🔄 FLUXO DE NAVEGAÇÃO SPA

Usuário clica em link → #topicos
Router detecta mudança → handleRoute()
Carrega view HTML → /app/views/topicos.html
Carrega controller → /js/pages/topicos/main.js
Executa init() → Página pronta

Importante:

Views são apenas HTML (sem JS)
Controllers têm a lógica
Router gerencia tudo


📱 COMPATIBILIDADE

Módulos ES6: Chrome 61+, Firefox 60+, Safari 11+
Área pública: Funciona sem modules (landing, login)
Área logada: Requer navegador moderno
Mobile: iOS 11+, Android Chrome 61+


Última atualização: Janeiro 2025
Localização: /docs/AI_GUIDELINES.md
</artifact>
Principais atualizações no AI_GUIDELINES.md:

✅ Estrutura correta - Tudo dentro de /public/
✅ Localização atualizada - Agora em /docs/
✅ Views corretas - Em /app/views/
✅ Arquivos duplicados - Mencionados como removidos
✅ Nixpacks explicado - Por que tudo está em public
✅ Exemplos atualizados - Com caminhos corretos
✅ Checklist melhorada - Inclui verificação de localização