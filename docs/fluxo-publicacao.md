# Fluxo Completo de Publicação - Sistema Ialum

Este documento detalha todo o fluxo de criação, edição, agendamento e publicação de conteúdo no sistema Ialum, desde a concepção do tópico até a publicação final nas redes sociais.

## 🎯 VISÃO GERAL DO FLUXO

```
TÓPICO (Base Jurídica)
  ↓
EMBASAMENTO (Pesquisa e Desenvolvimento)
  ↓
PUBLICAÇÕES (Adaptação por Rede Social)
  ↓
AGENDAMENTO (Programação)
  ↓
PUBLICAÇÃO (Execução Automática)
  ↓
ANÁLISE (Métricas e Relatórios)
```

---

## 📝 FASE 1: CRIAÇÃO DO TÓPICO

### **1.1 Entrada de Ideias**

**Página:** `/app/topicos`

**Processo:**
1. Usuário clica em "Novo Tópico"
2. Preenche dados básicos:
   - Título (obrigatório)
   - Assunto (descrição breve)
   - Tema jurídico (seleção)
   - Advogado responsável (auto-preenchido)
3. Sistema gera ID único (5 dígitos)
4. Status inicial: "ideia"

**Validações:**
- Título único por tenant
- Tema jurídico deve existir
- Usuário deve ter permissão `can_create_topics`

### **1.2 Busca de Tópicos Similares**

**Funcionalidade:** Antes de salvar, sistema sugere tópicos similares

```javascript
// Algoritmo de similaridade
- Busca por palavras-chave no título
- Compara tema jurídico
- Analisa assunto
- Se similaridade > 70%: sugere duplicação
```

**Ações disponíveis:**
- Continuar com novo tópico
- Duplicar tópico existente
- Editar tópico existente

---

## 🔬 FASE 2: DESENVOLVIMENTO DO EMBASAMENTO

### **2.1 Pesquisa e Escrita**

**Página:** `/app/embasamentos`

**Processo Manual:**
1. Seleciona tópico via busca
2. Adiciona embasamento jurídico:
   - Texto rico (formatação completa)
   - Referências legais
   - Jurisprudências
   - Notas e observações
3. Status evolui: "ideia" → "rascunho"

**Processo com IA:**
1. Clica em "iAlum Jurídico"
2. Seleciona tipo de pesquisa:
   - Completa (leis + jurisprudência + doutrina)
   - Legal (apenas legislação)
   - Jurisprudencial (casos práticos)
3. Escolhe narrativa (configurada na banca)
4. IA gera embasamento (1 crédito)
5. Usuário revisa e edita

### **2.2 Aprovação do Embasamento**

**Validações para status "embasado":**
- Mínimo 500 caracteres
- Pelo menos 1 referência legal
- Revisão por usuário com `can_approve`
- Status final: "embasado"

**Controle de Versão Simplificado:**
- Sistema mantém última versão
- Log de quem/quando alterou
- Duplicação para nova versão

---

## 📱 FASE 3: CRIAÇÃO DE PUBLICAÇÕES

### **3.1 Seleção de Plataformas**

**Página:** `/app/publicacoes`

**Processo:**
1. Busca tópico embasado
2. Clica em "Adicionar Publicações"
3. Seleciona redes sociais:
   - Instagram (Carrossel, Stories, Reels)
   - LinkedIn (Post, Artigo)
   - TikTok (Carrossel, Vídeo)
   - Facebook (Post)
   - Twitter/X (Thread)

**Regra:** 1 publicação por tipo/plataforma por tópico

### **3.2 Desenvolvimento por Plataforma**

**Páginas específicas:** `/app/redacao/[rede]`

#### **Instagram Carrossel**
```javascript
Processo:
1. Define número de slides (até 10)
2. Para cada slide:
   - Seleciona template (Bannerbear)
   - Preenche campos do template:
     * Título
     * Conteúdo
     * Cores (herda da identidade visual)
   - Gera imagem via Bannerbear
   - Ou seleciona do banco de imagens
3. Escreve legenda (até 2.200 caracteres)
4. Adiciona hashtags (até 30)
5. Define localização e marcações

IA Assistente:
- "iAlum Carrossel": gera slides completos
- "iAlum Designer": gera imagens por prompt
- 1 crédito por geração
```

#### **LinkedIn Artigo**
```javascript
Processo:
1. Define título do artigo
2. Escreve/gera corpo do texto
3. Adiciona imagem de capa
4. Insere imagens no corpo
5. Define tags (até 5)
6. Configura visibilidade

IA Assistente:
- "iAlum Articulista": gera artigo completo
- Adapta tom para profissional
- Inclui CTAs apropriados
```

### **3.3 Templates e Bannerbear**

**Fluxo de Geração de Imagens:**
```
1. Frontend envia dados do slide
2. N8N recebe requisição
3. Bannerbear API:
   - Usa template_uid configurado
   - Preenche variáveis dinâmicas
   - Gera imagem
4. URL da imagem retorna
5. Salva em publication_elements
```

**Cache de Imagens:**
- Imagens geradas são permanentes
- Organizadas por tema no banco
- Reutilizáveis em novas publicações

---

## 📅 FASE 4: AGENDAMENTO

### **4.1 Interface de Agendamento**

**Página:** `/app/agendamentos`

**Visualizações:**
- Calendário mensal
- Lista por semana
- Publicações não agendadas

**Processo:**
1. Arrasta publicação para data
2. Define horário específico
3. Sistema valida:
   - Horários ótimos por rede
   - Conflitos de agendamento
   - Limite diário (se configurado)
4. Status: "concluido" → "agendado"

### **4.2 Regras de Agendamento**

**Por Plataforma:**
```javascript
INSTAGRAM:
- Melhor: 11h-13h, 19h-21h
- Evitar: 23h-6h
- Stories: qualquer horário

LINKEDIN:
- Melhor: 7h-9h, 12h, 17h-18h
- Apenas dias úteis
- Fuso: horário comercial

TIKTOK:
- Melhor: 6h-10h, 19h-23h
- Público jovem: noite
- Fins de semana ok
```

### **4.3 Fila de Publicação**

**N8N Workflow:**
```
1. Cron job a cada 5 minutos
2. Busca publicações agendadas
3. Filtra por horário <= now()
4. Para cada publicação:
   - Valida credenciais da rede
   - Prepara conteúdo
   - Envia via API da rede
   - Atualiza status
   - Registra resultado
```

---

## 🚀 FASE 5: PUBLICAÇÃO AUTOMÁTICA

### **5.1 Processo de Publicação**

**Instagram (via Meta API):**
```javascript
// Carrossel
1. Upload de cada imagem
2. Cria media container
3. Publica com legenda
4. Retorna post_id

// Stories
1. Upload da mídia
2. Publica no stories
3. Adiciona stickers/links
```

**LinkedIn (via API):**
```javascript
// Post
1. Autentica com OAuth
2. Upload de mídia (se houver)
3. Cria post com texto
4. Retorna share_id

// Artigo
1. Cria artigo draft
2. Adiciona conteúdo
3. Publica artigo
```

### **5.2 Tratamento de Erros**

**Tipos de Erro:**
```javascript
ERRO_CREDENCIAL:
- Token expirado
- Permissões revogadas
- Ação: notifica admin

ERRO_LIMITE:
- Rate limit atingido
- Ação: reagenda +1h

ERRO_CONTEUDO:
- Imagem muito grande
- Texto com palavras bloqueadas
- Ação: notifica editor

ERRO_REDE:
- API fora do ar
- Timeout
- Ação: retry 3x, depois notifica
```

**Status de Erro:**
- Status principal mantido
- action_status = "erro"
- Mensagem de erro salva
- Notificação enviada

### **5.3 Confirmação e Métricas**

**Pós-publicação:**
1. Salva ID da publicação na rede
2. Status: "agendado" → "publicado"
3. Webhook para frontend
4. Inicia coleta de métricas

**Métricas Iniciais (1h após):**
- Alcance
- Impressões
- Engajamento inicial

---

## 📊 FASE 6: ANÁLISE E OTIMIZAÇÃO

### **6.1 Coleta de Métricas**

**N8N Workflow Diário:**
```javascript
// Para cada publicação dos últimos 30 dias
1. Consulta API da rede
2. Coleta métricas:
   - Views/Impressões
   - Likes/Reações
   - Comentários
   - Compartilhamentos
   - Cliques em link
3. Calcula taxa de engajamento
4. Salva em analytics_metrics
```

### **6.2 Relatórios**

**Página:** `/app/relatorios`

**Visualizações:**
- Performance por publicação
- Comparativo entre redes
- Evolução temporal
- Top publicações
- Temas mais engajados

**Insights Automáticos:**
- Melhores horários
- Tipos de conteúdo
- Hashtags efetivas
- Comprimento ideal

### **6.3 Ciclo de Melhoria**

**Com base nas métricas:**
1. Identifica padrões de sucesso
2. Sugere duplicação de tops
3. Recomenda ajustes:
   - Horários de publicação
   - Tipos de conteúdo
   - Temas prioritários
4. Alimenta IA com dados

---

## 🔄 FLUXOS ESPECIAIS

### **Duplicação de Tópico**

**Quando duplicar:**
- Nova abordagem do tema
- Atualização legal
- Novo mês/período
- Teste A/B

**Processo:**
1. Seleciona tópico original
2. Clica em "Duplicar"
3. Sistema cria novo:
   - Novo ID (5 dígitos)
   - Copia embasamento
   - source_topic_id referencia original
   - Status volta para "ideia"
4. Publicações não são copiadas

### **Publicação Manual**

**Para casos especiais:**
1. Marca publicação como "manual"
2. Sistema gera checklist:
   - Conteúdo preparado
   - Links incluídos
   - Hashtags corretas
3. Usuário publica manualmente
4. Confirma publicação no sistema
5. Cola link/ID da publicação

### **Campanhas Coordenadas**

**Multi-plataforma:**
1. Cria tópico base
2. Gera publicações para todas redes
3. Agenda em sequência:
   - LinkedIn (manhã)
   - Instagram (almoço)
   - TikTok (noite)
4. Monitora performance cruzada

---

## ⚡ OTIMIZAÇÕES E PERFORMANCE

### **Cache e Pré-processamento**

```javascript
CACHE LOCAL:
- 200 tópicos mais recentes
- Imagens do banco por tema
- Templates Bannerbear
- Sugestões de hashtags

PRÉ-PROCESSAMENTO:
- Geração de imagens em batch
- Validação antecipada
- Compressão automática
```

### **Filas e Prioridades**

```javascript
FILA PUBLICAÇÃO:
├── Alta: agendamentos próximos
├── Média: geração de imagens
├── Baixa: coleta de métricas
└── Background: otimizações

LIMITES:
├── 10 publicações simultâneas
├── 50 gerações de imagem/hora
└── 100 consultas métricas/hora
```

### **Monitoramento**

**Alertas Críticos:**
- Falha em publicação agendada
- Credenciais expiradas
- Fila travada > 10min
- Erro em massa (>5 seguidos)

**Métricas de Saúde:**
- Taxa de sucesso: >95%
- Tempo médio publicação: <2min
- Uptime workflows: >99%

---

## 🎯 MELHORES PRÁTICAS

### **Para Conteúdo**

1. **Consistência Visual**
   - Usar sempre templates da banca
   - Manter identidade visual
   - Cores e fontes padrão

2. **Otimização por Rede**
   - Adaptar linguagem
   - Respeitar limites
   - Usar recursos nativos

3. **Engajamento**
   - CTAs claros
   - Perguntas abertas
   - Valor educacional

### **Para Agendamento**

1. **Distribuição**
   - Evitar múltiplas no mesmo horário
   - Espaçar por pelo menos 2h
   - Considerar fuso do público

2. **Frequência**
   - Instagram: 1-2/dia
   - LinkedIn: 3-4/semana
   - TikTok: 1-3/dia

3. **Planejamento**
   - Agendar com 1 semana de antecedência
   - Revisar calendário semanalmente
   - Deixar espaço para trending

### **Para Análise**

1. **Métricas Importantes**
   - Taxa de engajamento > vanity metrics
   - Conversões > curtidas
   - Comentários qualitativos

2. **Testes A/B**
   - Horários diferentes
   - Tipos de conteúdo
   - Comprimento de texto
   - Estilos visuais

3. **Iteração**
   - Revisar semanalmente
   - Ajustar estratégia mensalmente
   - Documentar aprendizados