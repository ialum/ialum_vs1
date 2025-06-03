# Agentes de IA - Sistema Ialum

Este documento detalha todos os agentes de IA disponíveis no sistema Ialum, suas capacidades e como são integrados em cada página.

## 🤖 VISÃO GERAL DO SISTEMA DE AGENTES

### **Arquitetura de Agentes**

1. **Agentes no Dashboard**: Cards explicativos para descoberta
2. **Agentes de Contexto**: No header de cada página, recebendo dados automáticos
3. **Integração Inteligente**: Cada agente conhece o contexto da página atual

### **Apresentação Visual**
- **Dashboard**: Cards com descrição e link para página apropriada
- **Headers das Páginas**: Botão do agente específico no canto superior direito
- **Ativação**: Clique abre chat/modal com o agente contextualizado

### **Arquitetura Técnica**
- Implementação via MCP (Model Context Protocol) servers
- Contexto automático baseado na página e dados sendo visualizados
- Integração com OpenAI GPT-4
- Acesso completo aos dados da banca (temas, identidade, narrativas)

---

## 📍 AGENTES POR PÁGINA (CONTEXTO AUTOMÁTICO)

### **1. iAlum Jurídico - Página de Embasamentos**

**Localização**: Header da página de Embasamentos

**Contexto Automático Recebido**:
```json
{
  "topico_atual": {
    "id": "12345",
    "titulo": "Contrato de energia solar",
    "assunto": "Direitos do consumidor",
    "tema": "energia_solar",
    "status": "rascunho",
    "advogado": "Dr. Silva"
  },
  "embasamento_atual": "texto atual se houver",
  "temas_banca": ["energia_solar", "trabalhista"],
  "narrativas": ["jornada_heroi", "critica_sistema"]
}
```

**Capacidades**:
- Pesquisar legislação e jurisprudências
- Criar embasamento completo
- Melhorar texto existente
- Adicionar referências ABNT
- Estruturar argumentação jurídica

**Prompt Inicial do Agente**:
"Vejo que você está trabalhando no tópico '[título]' sobre [tema]. Posso ajudar a pesquisar legislação, criar o embasamento ou melhorar o que já existe. Como posso auxiliar?"

---

### **2. iAlum Instagram - Página de Redação Instagram**

**Localização**: Header da página Instagram

**Contexto Automático Recebido**:
```json
{
  "topico": {
    "titulo": "Contrato de energia solar",
    "embasamento": "conteúdo completo do embasamento"
  },
  "publicacoes_existentes": {
    "carrossel": null,
    "stories": null,
    "reels": null
  },
  "identidade_visual": {
    "cores": ["#2563EB", "#10B981"],
    "fontes": ["Inter", "Roboto"],
    "logo": "url_logo"
  },
  "tema_juridico": "energia_solar",
  "narrativa_preferida": "jornada_heroi"
}
```

**Capacidades Múltiplas**:
- **Criar Carrossel**: Até 10 slides com textos e prompts de imagem
- **Criar Stories**: Sequência de stories com elementos interativos
- **Criar Reels**: Roteiro completo com sugestões de áudio

**Prompt Inicial do Agente**:
"Posso criar conteúdo para Instagram baseado no tópico '[título]'. Você prefere que eu crie um carrossel educativo, stories interativos ou um roteiro para reels? Posso criar todos de uma vez também!"

**Exemplo de Saída Múltipla**:
```json
{
  "carrossel": {
    "slides": [
      {
        "numero": 1,
        "tipo": "capa",
        "titulo": "Seus Direitos na Energia Solar",
        "subtitulo": "O que você precisa saber",
        "prompt_imagem": "advogado moderno explicando painéis solares, cores #2563EB e #10B981",
        "texto_acessibilidade": "Capa sobre direitos do consumidor em energia solar"
      },
      // ... até 10 slides
    ],
    "legenda": "📍 Você sabia que...",
    "hashtags": ["#direitosolar", "#advocacia", "#energialimpa"]
  },
  "stories": [
    {
      "numero": 1,
      "tipo": "pergunta",
      "texto": "Você tem painéis solares em casa?",
      "opcoes": ["Sim", "Não, mas quero"],
      "prompt_fundo": "casa moderna com painéis solares"
    },
    // ... 3-5 stories
  ],
  "reels": {
    "duracao": 30,
    "roteiro": [
      {
        "segundo": "0-3",
        "texto": "Comprou painéis solares e teve problema?",
        "acao": "Aparecer com expressão de dúvida"
      },
      // ... roteiro completo
    ],
    "audio_sugerido": "Trending audio sobre direitos",
    "hashtags": ["#reels", "#advocacia", "#direitosolar"]
  }
}
```

---

### **3. iAlum LinkedIn - Página de Redação LinkedIn**

**Localização**: Header da página LinkedIn

**Contexto Automático Recebido**:
```json
{
  "topico": "dados completos do tópico",
  "embasamento": "embasamento jurídico",
  "publicacoes_existentes": {
    "artigo": null,
    "post": null
  },
  "tom_profissional": "formal",
  "publico_alvo": "empresários e gestores"
}
```

**Capacidades**:
- **Criar Artigo**: Texto longo estruturado (1500+ palavras)
- **Criar Post**: Conteúdo conciso e impactante
- Sugerir imagens profissionais
- Otimizar para SEO LinkedIn
- Incluir CTAs corporativos

**Prompt Inicial do Agente**:
"Vou criar conteúdo profissional sobre '[título]' para LinkedIn. Posso desenvolver um artigo completo para posicionar você como autoridade ou um post conciso para gerar engajamento. Qual prefere?"

---

### **4. iAlum TikTok - Página de Redação TikTok**

**Localização**: Header da página TikTok

**Contexto Automático Recebido**:
```json
{
  "topico": "dados do tópico",
  "embasamento": "versão simplificada",
  "trends_atuais": ["trend1", "trend2"],
  "publico_jovem": true,
  "formatos": ["video", "carrossel"]
}
```

**Capacidades**:
- **Criar Roteiro de Vídeo**: 15-60 segundos
- **Criar Carrossel**: Até 35 imagens verticais
- Adaptar linguagem para Gen Z
- Sugerir trends aplicáveis
- Incluir elementos virais

---

### **5. iAlum Publicações - Página de Publicações**

**Localização**: Header da página de Publicações

**Contexto Automático Recebido**:
```json
{
  "topicos_embasados": ["lista de tópicos"],
  "redes_ativas": ["instagram", "linkedin", "tiktok"],
  "calendario_atual": "datas com poucas publicações",
  "temas_em_alta": ["temas trending"]
}
```

**Capacidades**:
- Sugerir publicações para múltiplos tópicos
- Criar calendário editorial
- Identificar gaps de conteúdo
- Propor séries temáticas
- Distribuir conteúdo estrategicamente

---

### **6. iAlum Relatórios - Página de Relatórios**

**Localização**: Header da página de Relatórios

**Contexto Automático Recebido**:
```json
{
  "metricas_periodo": {
    "publicacoes": 45,
    "engajamento_medio": 5.2,
    "crescimento_seguidores": 120
  },
  "top_publicacoes": ["lista das melhores"],
  "publicacoes_baixo_desempenho": ["lista das piores"],
  "comparativo_anterior": "dados do período anterior"
}
```

**Capacidades**:
- Analisar padrões de sucesso
- Identificar horários ideais
- Sugerir melhorias específicas
- Criar plano de ação
- Comparar com benchmarks

---

### **7. iAlum Agendador - Página de Agendamentos**

**Localização**: Header da página de Agendamentos

**Contexto Automático Recebido**:
```json
{
  "publicacoes_prontas": ["lista de publicações"],
  "calendario": "slots disponíveis",
  "historico_engajamento": "melhores horários",
  "feriados_eventos": ["datas importantes"]
}
```

**Capacidades**:
- Sugerir melhores horários por rede
- Distribuir conteúdo equilibradamente
- Evitar conflitos de publicação
- Considerar fusos horários
- Otimizar para algoritmos

---

## 🎯 FLUXO DE USO DOS AGENTES

### **1. Descoberta (Dashboard)**
```
Usuário vê cards → Entende função → Clica para explorar
```

### **2. Contexto Automático (Página Específica)**
```
Entra na página → Agente recebe contexto → Botão ativo no header
```

### **3. Ativação Inteligente**
```
Clica no agente → Modal/Chat abre → Agente já sabe o contexto
```

### **4. Interação Produtiva**
```
Agente sugere ações → Usuário escolhe → Resultado integrado
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA MCP

### **Estrutura do Agente de Contexto**

```javascript
// Exemplo: iAlum Instagram
const ialumInstagram = {
  name: "ialum-instagram",
  version: "1.0.0",
  
  // Recebe contexto automaticamente
  onPageLoad: async (context) => {
    return {
      greeting: `Posso criar conteúdo para Instagram baseado no tópico '${context.topico.titulo}'.`,
      suggestions: [
        "Criar carrossel completo",
        "Criar stories interativos", 
        "Criar roteiro para reels",
        "Criar todos de uma vez"
      ]
    }
  },
  
  tools: [
    {
      name: "criar_carrossel",
      description: "Cria carrossel com até 10 slides",
      handler: async (context) => {
        // Usa embasamento + tema + narrativa + identidade
        return generateCarrossel(context);
      }
    },
    {
      name: "criar_stories",
      description: "Cria sequência de stories",
      handler: async (context) => {
        return generateStories(context);
      }
    },
    {
      name: "criar_reels",
      description: "Cria roteiro para reels",
      handler: async (context) => {
        return generateReels(context);
      }
    },
    {
      name: "criar_tudo",
      description: "Cria todos os formatos de uma vez",
      handler: async (context) => {
        const carrossel = await generateCarrossel(context);
        const stories = await generateStories(context);
        const reels = await generateReels(context);
        return { carrossel, stories, reels };
      }
    }
  ]
}
```

### **Contexto Compartilhado Global**

```javascript
// Disponível para TODOS os agentes
const contextoBanca = {
  // Identidade
  nome: "Banca Silva Advogados",
  logo: "url_do_logo",
  cores: ["#primaria", "#secundaria"],
  fontes: ["principal", "texto"],
  
  // Temas jurídicos
  temas: [
    {
      id: "energia_solar",
      nome: "Energia Solar",
      descricao: "Contratos e direitos do consumidor",
      icone: "☀️"
    }
  ],
  
  // Narrativas
  narrativas: [
    {
      id: "jornada_heroi",
      nome: "Jornada do Herói",
      descricao: "Advogado como salvador"
    }
  ],
  
  // Configurações
  config: {
    tom_voz: "Profissional mas acessível",
    publico: "Empresários de pequeno e médio porte",
    objetivos: ["Educar", "Gerar confiança", "Converter leads"]
  }
}
```

---

## 💰 CONSUMO DE CRÉDITOS

### **Por Tipo de Geração**

| Agente | Ação | Créditos |
|--------|------|----------|
| Instagram | Carrossel (10 slides) | 1 |
| Instagram | Stories (até 5) | 1 |
| Instagram | Roteiro Reels | 1 |
| Instagram | Pacote completo | 2.5 |
| LinkedIn | Artigo completo | 2 |
| LinkedIn | Post | 1 |
| TikTok | Roteiro vídeo | 1 |
| TikTok | Carrossel (35 imgs) | 2 |
| Jurídico | Embasamento | 1 |
| Relatórios | Análise completa | 1 |

---

## 📊 MÉTRICAS E EVOLUÇÃO

### **Dados Coletados por Agente**
- Taxa de uso por página
- Tipos de conteúdo mais solicitados
- Taxa de aproveitamento (conteúdo usado vs gerado)
- Tempo economizado
- Satisfação do usuário

### **Melhorias Contínuas**
- Aprendizado com feedback
- Ajuste de prompts baseado em sucessos
- Novas capacidades por demanda
- Integração com mais redes sociais