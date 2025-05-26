# Ialum vs1 - Sistema de Marketing Jurídico

## 🎯 Sobre o Projeto

Sistema SaaS para automação de marketing educativo jurídico, permitindo que advogados criem e publiquem conteúdo automatizado para redes sociais com foco em segurança e conformidade.

## 🚀 Quick Start

```bash
# Clone o repositório
# Abra no VS Code
# Instale a extensão Live Server
# Clique em "Go Live"
```

## 🛠️ Stack Tecnológica

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** N8N + Supabase
- **IA:** 
  - Texto: OpenAI
  - Pesquisa: Perplexity + Anthropic
  - Imagens: DALL-E 3 + Gemini
  - Vídeos: Gemini
  - Templates: Bannerbear
- **Deploy:** EasyPanel com Nixpacks

## 📁 Estrutura do Projeto

```
ialum_vs1/
├── public/          # Arquivos públicos (servidos pelo Nginx)
│   ├── css/        # Estilos organizados por tipo
│   ├── js/         # Scripts modulares
│   └── assets/     # Imagens e recursos
├── app/            # Área protegida
│   └── templates/  # Templates HTML do SPA
├── nixpacks.toml   # Configuração de deploy
└── docs/           # Documentação completa
```

## 📚 Documentação

### Para Desenvolvedores
- [AI_GUIDELINES.md](./AI_GUIDELINES.md) - **LEIA PRIMEIRO!** Diretrizes arquiteturais
- [Estrutura de Páginas](./docs/vs3-estrutura-paginas.md)
- [Arquitetura do Banco](./docs/vs2-banco-arquitetura.md)
- [Segurança](./docs/vs3-seguranca.md)

### Para IAs
**⚠️ IMPORTANTE:** Antes de contribuir com código, leia COMPLETAMENTE o [AI_GUIDELINES.md](./AI_GUIDELINES.md)

## 🔒 Segurança

- Multi-tenant com RLS
- Tokens temporários para navegação
- Autenticação via Supabase
- Conformidade LGPD

## 🌐 URLs

- **Produção:** https://ialum.com.br (em breve)
- **Staging:** https://ialum-frontend-git.jedqwo.easypanel.host

## 📝 Convenções

- **SEM frameworks** de build (Webpack, Vite)
- **SEM comandos git** (use VS Code)
- Arquivos pequenos (<200 linhas)
- JavaScript modular vanilla
- CSS com BEM simplificado

## 👥 Contribuindo

1. Leia o [AI_GUIDELINES.md](./AI_GUIDELINES.md)
2. Mantenha arquivos pequenos
3. Documente dependências
4. Use caminhos absolutos
5. Teste localmente

## 📄 Licença

Proprietário - Todos os direitos reservados

---

**Para desenvolvimento com IA:** Sempre consulte [AI_GUIDELINES.md](./AI_GUIDELINES.md) primeiro!