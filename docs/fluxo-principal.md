# Pipeline de Fluxo de Dados v2 - Sistema IALUM

## 🎯 Visão Geral

Este documento mapeia o fluxo completo de dados através do sistema IALUM, incluindo configurações iniciais, produção de conteúdo, publicações e comportamento dos agentes de IA de contexto.

Este documento tem um propósito resumido, como um esqueleto que sustentará a refatoração das demais documentações do projeto. Ser resumida auxilia o humano responsavel pelas revisões a ler e ter uma visão geral do escopo.

Ao editar este documento seja estremamente cautelo-so, uma linha pode ter grande impacto estrutural e efeitos em cadeia.

# 📐 Arquitetura do Pipeline

```
SEGURANÇA: ialum_vs1/docs/paginas-app-contas.md

FASE 1: CONFIGURAÇÃO INICIAL (setup único por banca)
    ├── Config. Básica da Banca
    ├── Banco de Imagens
    ├── Biblioteca de Templates
    ├── Integrações e Sistema
    └── ialum_vs1/docs/paginas-app-configuracoes.md

FASE 2: PRODUÇÃO CONTÍNUA (ciclo de conteúdo)
    ├── Ideação e Tópicos
    ├── Embasamento Jurídico e Estatistico
    ├── Geração Multiformato
    ├── Processamento Visual
    ├── Agendamento e Publicação
    ├── ialum_vs1/docs/paginas-app-publicacoes.md
    └── ialum_vs1/docs/paginas-app-componentes.md

AGENTES IA: Disponíveis em cada etapa via chat lateral
    └── Ver detalhes em: /docs/fluxo-agentes-ia.md
```

---

## 🔧 FASE 1: CONFIGURAÇÃO INICIAL ⏳

### ETAPA 0.1: Configuração Básica da Banca ✅
```
ENTRADA: Dados do escritório de advocacia
├── Página: /configuracoes-banca
├── Componente: CardList (modo: "config") - Linhas Narrativas
│   └── Lista até 20 items: nome (25 char + emoji), descricao (500 char)
├── Componente: CardList (modo: "config") - Temas Jurídicos
│   └── Lista até 20 items: nome (25 char + emoji), descricao (500 char), numero de publicações mensais (inteiro)
├── Componente: CardForm (modo: "config")
│   └── Upload: 6 logos, 4 cores, 2 fontes, posicionamento
└── SAÍDA: {
      banca_config: {
        // Linhas Narrativas
        narrativas: [{
          id: "uuid",
          nome: "🦸 Jornada do Herói",
          descricao: "O advogado como salvador...1000 caracteres",
          ativa: true
        }],
        // Temas Jurídicos  
        temas: [{
          id: "uuid",
          nome: "🏠 Compra e Venda",
          descricao: "Problemas em contratos...1000 caracteres",
          quantidade_mes: "3",
          ativo: true
        }],
        // Identidade Visual
        identidade: {
          logos: {
            principal: "url", // 1024x1024 PNG
            principal_h: "url", // horizontal
            clara: "url",
            clara_h: "url",
            escura: "url",
            escura_h: "url"
          },
          cores: {
            principal: "#2563EB", // fundo logo secundária
            secundaria: "#10B981", // fundo logo principal
            clara: "#F3F4F6", // contraste logo escura
            escura: "#1F2937" // contraste logo clara
          },
          fontes: {
            titulo: "Montserrat",
            texto: "Inter"
          },
          nome_banca: "Silva & Associados",
          posicionamento: "Advocacia humanizada...500 caracteres" // markdown
        }
      }
    }

VALIDAÇÃO: Mínimo 1 narrativa e 1 tema ativos, máximo 20 cada
ARMAZENAMENTO: Supabase → tabela 'bancas_configuracao'
CACHE: Sistema de cache em camadas:
  - Frontend: State global com todas narrativas/temas (até 40 itens)
  - Atualização: Ao fazer login e ao salvar alterações
  - Expiração: Persiste durante toda sessão do usuário
  - Uso: Dropdowns em tópicos sempre mostram lista completa
IMPACTO: Disponível globalmente em todas as etapas
```

### ETAPA 0.2: Banco de Imagens por Tema ✅
```
ENTRADA: Tema selecionado + imagens (upload/IA/presets)
├── Página: /configuracoes-banco-imagens
├── Componente: CardGrid (modo: "image-bank-grid")
│   └── Abas: presets | geradas_ia | uploads
│   └── Ações: selecionar | visualizar | arquivar | promover_preset
├── Componente: CardForm (modo: "gerar-imagem-ia")
│   └── Campos: prompt (1000), nome (70), descricao (200)
│   └── Checks: usar_identidade, usar_contexto_tema
├── Agente: iAlum Designer
│   └── Contexto: { tema_selecionado, img_selecionada, todas_imgs_tema, identidade_visual }
│   └── Objetivo: Criar prompts e gerar novas imagens via chat, se img_selecionada, pode usar como referência de ambiente por exemplo.
└── SAÍDA: {
      banco_imagens: {
        tema_id: "uuid",
        imagens: [{
          id: "uuid",
          tipo: "preset", // gerada_ia, upload, ambientes
          url: "cdn.ialum/banco/tema_id/img.jpg",
          thumb: "cdn.ialum/banco/tema_id/img_thumb.jpg",
          nome: "Advogado sentado olhando em moderno escritório",
          descricao: "Profissional em ambiente...200 caracteres",
          prompt_original: "Create a modern lawyer...",
          metadata: {
            dimensoes: "1024x1536 (retrato)",
            tamanho_kb: 245,
            formato: "jpg",
            data_criacao: "ISO8601"
          }
        }],
        total_imagens: 47,
        limite_tema: 100
      }
    }

VALIDAÇÃO: Max 5MB/imagem, formatos: jpg/png/webp
PROCESSAMENTO: Gera thumbnail automático (200x160px vertical)
ARMAZENAMENTO: CDN → /bancas/{id}/temas/{tema_id}/
LAZY LOADING: Carrega 12 imgs/vez no mobile
CUSTO: 1 crédito por imagem gerada com IA
```


### ETAPA 0.3: Biblioteca de Templates Bannerbear ✅
```
ENTRADA: Tipo de publicação + configuração de grupos de templates
  ├── Página: /configuracoes-templates
  ├── Componente: CardList (modo: "template-groups")
  │   └── Lista grupos por rede social (Instagram, LinkedIn, TikTok)
  │   └── Expansível para mostrar configuração de cada tipo
  ├── Componente: CardForm (modo: "template-selector")
  │   └── Para cada posição/slide: dropdown com tipos disponíveis
  │   └── Preview dinâmico ao selecionar template
  └── SAÍDA: {
        grupos_templates: {
          instagram: {
            carrossel: {
              nome: "Grupo Padrão Carrossel",
              descricao: "Modelo padrão para carrosséis de 10 slides",
              slides: [
                {
                  posicao: 1,
                  tipo: "capa",
                  template_id: "bb_insta_capa_modern_123",
                  opcoes_disponiveis: [
                    { id: "bb_insta_capa_modern_123", nome: "Capa Moderna" },
                    { id: "bb_insta_capa_classic_456", nome: "Capa Clássica" },
                    { id: "bb_insta_capa_minimal_789", nome: "Capa Minimalista" }
                  ]
                },
                {
                  posicao: 2,
                  tipo: "citacao",
                  template_id: "bb_insta_quote_elegant_234",
                  opcoes_disponiveis: [
                    { id: "bb_insta_quote_elegant_234", nome: "Citação Elegante" },
                    { id: "bb_insta_quote_bold_567", nome: "Citação Impacto" }
                  ]
                },
                {
                  posicao: [3, 4, 5, 6, 7, 8],
                  tipo: "conteudo",
                  template_id: "bb_insta_content_clean_345",
                  opcoes_disponiveis: [
                    { id: "bb_insta_content_clean_345", nome: "Conteúdo Limpo" },
                    { id: "bb_insta_content_visual_678", nome: "Conteúdo Visual" },
                    { id: "bb_insta_content_text_901", nome: "Conteúdo Textual" }
                  ]
                },
                {
                  posicao: 9,
                  tipo: "citacao",
                  template_id: "bb_insta_quote_final_456"
                },
                {
                  posicao: 10,
                  tipo: "cta",
                  template_id: "bb_insta_cta_action_567",
                  opcoes_disponiveis: [
                    { id: "bb_insta_cta_action_567", nome: "CTA Ação" },
                    { id: "bb_insta_cta_contact_890", nome: "CTA Contato" },
                    { id: "bb_insta_cta_link_123", nome: "CTA Link Bio" }
                  ]
                }
              ]
            },
            stories: {
              nome: "Grupo Padrão Stories",
              sequencia: [
                {
                  posicao: 1,
                  tipo: "sticker",
                  template_id: "bb_story_sticker_fun_111"
                },
                {
                  posicao: 2,
                  tipo: "cotidiano",
                  template_id: "bb_story_daily_222"
                },
                {
                  posicao: 3,
                  tipo: "pergunta",
                  template_id: "bb_story_question_333"
                }
              ]
            },
            post: {
              tipo: "imagem_unica",
              template_id: "bb_insta_single_444"
            }
          },
          linkedin: {
            post: {
              tipo: "artigo",
              template_id: "bb_linkd_article_555"
            },
            documento: {
              tipo: "pdf_carrossel",
              template_id: "bb_linkd_doc_666"
            }
          },
          tiktok: {
            cover: {
              tipo: "thumbnail",
              template_id: "bb_tiktok_thumb_777"
            }
          }
        },
        tipos_disponveis: {
          instagram_carrossel: ["capa", "citacao", "conteudo", "cta", "transicao"],
          instagram_stories: ["sticker", "cotidiano", "pergunta", "quiz", "swipe_up"],
          instagram_post: ["imagem_unica", "antes_depois"],
          linkedin_post: ["artigo", "infografico", "citacao"],
          tiktok_cover: ["thumbnail", "preview"]
        },
        elementos_customizaveis: {
          textos: ["titulo", "subtitulo", "corpo", "cta", "creditos"],
          imagens: ["fundo", "overlay", "icone", "moldura"],
          marca: ["logo", "cores", "fontes", "assinatura"]
        }
      }

  INTERFACE:
  - Ao selecionar rede social, mostra tipos de publicação disponíveis
  - Para cada tipo, permite criar/editar grupos de templates
  - Cada grupo tem nome e descrição personalizável
  - Para carrossel: interface visual mostrando 10 slides
  - Cada slide tem dropdown para selecionar tipo (capa, citação, etc)
  - Ao selecionar tipo, mostra templates disponíveis com preview
  - Permite salvar múltiplos grupos como presets

  VALIDAÇÃO:
  - Carrossel Instagram sempre 10 slides
  - Slide 1 sempre tipo "capa", Slide 10 sempre "cta"
  - Mínimo 1 template por tipo de publicação
  CUSTOMIZAÇÃO: Aplica identidade visual via API Bannerbear
  REUTILIZAÇÃO: Grupos salvos aparecem como opção rápida
```

### ETAPA 0.4: Integrações e Sistema ✅
```
ENTRADA: Credenciais e preferências do usuário
├── Página: /configuracoes-integracoes
├── Componente: CardForm (modo: "oauth-connect")
│   └── Redes: Instagram, LinkedIn, TikTok, Facebook
├── Componente: CardForm (modo: "config-sistema")
│   └── Timezone, notificações, webhooks, limites
└── SAÍDA: {
      integracoes: {
        instagram: {
          access_token: "encrypted_token",
          account_id: "17841400000000",
          username: "@silvaadvogados",
          status: "conectado",
          expires_in: "60 dias"
        },
        linkedin: {
          access_token: "encrypted_token",
          organization_id: "urn:li:organization:123",
          status: "conectado"
        },
        bannerbear: {
          api_key: "encrypted_key",
          project_id: "proj_123",
          status: "ativo"
        }
      },
      sistema: {
        timezone: "America/Sao_Paulo",
        notificacoes: {
          email: true,
          browser: true,
          whatsapp: false
        },
        limites_alertas: {
          creditos_minimos: 10,
          posts_dia_max: 5
        }
      }
    }

SEGURANÇA: Tokens encriptados com rotação
VALIDAÇÃO: OAuth2 flow para redes sociais
MONITORAMENTO: Status de conexão em tempo real
```

---


## 🚀 FASE 2: PRODUÇÃO DE CONTEÚDO ⏳

### ETAPA 1: Ideação e Criação de Tópicos ⏳
```
ENTRADA: Sugestões IA + Input manual + Contexto banca
├── Página: /topicos
├── Componente: baseSearch (modo: "topicos-grid")
│   └── Placeholder: "título, assunto ou id"
│   └── Filtros: status do tópico, temas
├── Componente: CardDisplay (modo: "topicos-grid")
│   └── Tópico: titulo, status, id, ultima_modificacao, advogado, tema, assunto.
│   └── Tópico_publicacoes: 
├── Componente: CardForm (modo: "topico-rapido")
│   └── Herda: temas e narrativas da config
├── Agente: iAlum Editor Chefe
└── SAÍDA: {
      topico: {
        id: "uuid",
        base_id: "12345", // identificador humano
        titulo: "Pensão Alimentícia pós-Divórcio",
        tema: { 
          id: "uuid",
          nome: "🏛️ Direito de Família" // da config
        },
        narrativa: {
          id: "uuid", 
          nome: "🦸 Jornada do Herói" // da config
        },
        assunto: "Direitos e deveres após separação",
        advogado: { id: "uuid", nome: "Dr. Silva" },
        status: "ideia",
        origem: "sugestao_ia", // ou "manual"
        score_relevancia: 8.5
      }
    }

ENRIQUECIMENTO: Temas e narrativas da configuração
VALIDAÇÃO: Título único + tema/narrativa existentes
WORKFLOW N8N: CENTRAL → SugestaoTopicos → ValidaTopico
```

### ETAPA 2: Embasamento Jurídico Contextualizado ⏳
```
ENTRADA: Topico completo + Pesquisas + Uploads
├── Página: /embasamentos
├── Componente: CardDisplay (modo: "embasamento-tabs")
│   └── Abas: resumo | legislação | jurisprudência | arquivos
├── Componente: MarkdownEditor (modo: "juridico-abnt")
├── Agente: iAlum Pesquisador
└── SAÍDA: {
      embasamento: {
        id: "uuid",
        topico_id: "uuid", // EXCLUSIVO 1:1
        conteudo_estruturado: {
          resumo_executivo: "Síntese do tema...",
          fundamentacao_legal: {
            legislacao: [
              { artigo: "Art. 1.694 CC", texto: "..." },
              { lei: "Lei 5.478/68", texto: "..." }
            ],
            jurisprudencia: [
              { tribunal: "STJ", numero: "REsp 123456", ementa: "..." }
            ]
          },
          argumentacao: {
            tese_principal: "...",
            argumentos: ["arg1", "arg2", "arg3"],
            contra_argumentos: ["contra1", "contra2"]
          },
          conclusao: "Portanto, conclui-se que..."
        },
        arquivos_anexos: [
          { tipo: "pdf", nome: "acordao.pdf", url: "..." }
        ],
        creditos_pesquisa: 1,
        qualidade_score: 9.2
      }
    }

CONTEXTO HERDADO: Tema jurídico completo da config
PROCESSAMENTO: Estruturação automática do conteúdo
WORKFLOW N8N: DataTransform → PesquisaJuridica → Estrutura
```

### ETAPA 3: Geração Multiformato com Templates ⏳
```
ENTRADA: Embasamento + Templates selecionados + Identidade
├── Página: /publicacoes
├── Componente: CardGrid (modo: "publicacoes-multirede")
│   └── Cards: preview por rede/formato
├── Agente: iAlum Redator Instagram
├── Agente: iAlum Redator LinkedIn
└── SAÍDA: {
      publicacoes_geradas: [{
        // Instagram Carrossel
        id: "uuid",
        topico_id: "uuid",
        rede: "instagram",
        tipo: "carrossel",
        estrutura: {
          slides: [
            {
              numero: 1,
              template: "bb_template_id_123", // da config
              tipo: "capa",
              conteudo: {
                titulo: "PENSÃO ALIMENTÍCIA",
                subtitulo: "Seus direitos após o divórcio",
                visual: "advogado_mesa_moderna" // ref banco imgs
              }
            },
            // ... slides 2-10 com templates específicos
          ],
          legenda: "📍 Você sabia que a pensão...",
          hashtags: ["#direito", "#família", "#pensão"],
          mencoes: ["@oab", "@cnj"]
        },
        metadados: {
          caracteres_legenda: 145,
          tempo_leitura: "3 min",
          complexidade: "média"
        }
      }]
    }

HERANÇA: Templates e identidade das configurações
OTIMIZAÇÃO: Adapta tom/formato por rede social
WORKFLOW N8N: MidiaCreateIA → AdaptaConteudo → Formata
```

### ETAPA 4: Processamento Visual com Assets ⏳
```
ENTRADA: Publicação estruturada + Banco imagens + Identidade
├── Página: /redacao-instagram (por rede)
├── Componente: CardDisplay (modo: "editor-visual")
│   └── Preview real-time + ajustes visuais
├── Componente: ImagePicker (modo: "banco-contextual")
│   └── Mostra imagens do tema primeiro (presets)
└── SAÍDA: {
      publicacao_processada: {
        id: "uuid",
        midias_finais: [{
          slide: 1,
          tipo: "imagem",
          url_final: "cdn.ialum/pub/123/slide1_final.jpg",
          url_preview: "cdn.ialum/pub/123/slide1_thumb.jpg",
          composicao: {
            template: "bb_template_id_123",
            imagem_fundo: "cdn.ialum/banco/tema/img.jpg", // do banco
            textos: {
              titulo: "PENSÃO ALIMENTÍCIA",
              subtitulo: "Seus direitos após o divórcio"
            },
            elementos_marca: {
              logo: "logo_clara", // da identidade
              cores: ["#2563EB", "#10B981"], // da identidade
              fonte_titulo: "Montserrat", // da identidade
              fonte_texto: "Inter" // da identidade
            }
          },
          bannerbear_job_id: "job_xyz123"
        }],
        tempo_processamento: 45,
        status: "pronto_publicar"
      }
    }

PIPELINE VISUAL: Seleciona imagem → Aplica template → Renderiza
OTIMIZAÇÃO: Cache de imagens processadas por 30 dias
API: Bannerbear com modificações dinâmicas
WORKFLOW N8N: TemplateProcessing → BannerbearAPI → CDN
```

### ETAPA 5: Agendamento Inteligente Contextual ⏳
```
ENTRADA: Publicações prontas + Histórico + Calendário
├── Página: /agendamentos
├── Componente: CardList (modo: "calendario-posts")
│   └── Visualização: mensal/semanal com slots
├── Agente: iAlum Publicador
└── SAÍDA: {
      agendamentos: [{
        id: "uuid",
        publicacao_id: "uuid",
        programacao: {
          data_hora: "2024-01-20T14:30:00",
          timezone: "America/Sao_Paulo", // da config
          horario_otimizado: true,
          justificativa: "Sábado tarde, maior engajamento"
        },
        restricoes: {
          intervalo_minimo: "4h", // entre posts
          limite_diario: 5, // da config
          evitar_conflito: ["uuid_outro_post"]
        },
        notificacoes: {
          pre_publicacao: "30min",
          pos_publicacao: "instantly"
        }
      }]
    }

INTELIGÊNCIA: Análise de melhores horários por tipo
HERANÇA: Timezone e limites das configurações
WORKFLOW N8N: CronPublisher → AnalisaAgenda → Programa
```

### ETAPA 6: Publicação com Credenciais Integradas ⏳
```
ENTRADA: Agendamento + Mídias + Tokens OAuth
├── Página: /dashboard (monitoramento real-time)
├── Componente: CardDisplay (modo: "status-live")
│   └── Status: fila → publicando → publicado → métricas
└── SAÍDA: {
      resultado: {
        agendamento_id: "uuid",
        execucao: {
          inicio: "2024-01-20T14:30:00Z",
          fim: "2024-01-20T14:30:47Z",
          duracao_ms: 47000
        },
        publicacao_rede: {
          instagram: {
            post_id: "17854785478547854",
            permalink: "instagram.com/p/ABC123",
            media_ids: ["18547854785478547", "..."]
          }
        },
        metricas_iniciais: {
          alcance: 0,
          impressoes: 0,
          salvamentos: 0
        },
        status: "publicado_sucesso",
        proxima_coleta_metricas: "2024-01-20T15:30:00Z"
      }
    }

AUTENTICAÇÃO: Usa tokens OAuth da configuração
RETRY: 3 tentativas com backoff exponencial
FALLBACK: Notifica falha e reagenda
WORKFLOW N8N: CronPublisher → PublishAPI → Analytics
```

---


## 🤖 ARQUITETURA DE COMUNICAÇÃO IA  ✅

### **Como os Agentes se Integram ao Sistema**  ✅

```
FRONTEND                    IA (Chat)                    BACKEND
─────────                   ─────────                    ─────────
Contexto da Página    →    Agente Recebe          →    Workflows N8N
Cache/Estado Global   →    Processa com MCP       →    APIs Externas  
Formulários          ←    Preenche/Sugere        ←    Retorna Dados
Interface Atualiza   ←    Responde no Chat       ←    Processa Ações
```

### **Fluxo do Chat Lateral com IA**  ✅

1. **Abertura Contextualizada**
   - Usuário clica no botão do agente (ex: "iAlum Designer")
   - Chat abre na lateral direita
   - Agente já recebe todo contexto da página atual
   - Primeira mensagem mostra que entende onde usuário está

2. **Conversa Natural**
   - Usuário faz pedido em linguagem natural
   - IA analisa contexto + pedido + dados existentes
   - IA sugere ação específica e pede confirmação
   - Usuário pode ajustar ou confirmar

3. **Execução via MCP**
   - IA usa ferramentas MCP para executar ações
   - Pode preencher formulários automaticamente
   - Pode buscar dados adicionais no backend
   - Pode gerar conteúdo, pesquisar na internet
   - Listar demais ferramentas

4. **Resultado Integrado**
   - Ação executada aparece imediatamente na interface
   - Chat confirma sucesso e oferece próximas ações
   - Dados são salvos no estado apropriado
   - Interface reflete mudanças em tempo real


