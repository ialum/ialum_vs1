# Agentes de IA - Sistema Ialum

Este documento detalha todos os agentes de IA disponíveis no sistema Ialum, suas capacidades, integração com frontend e backend, e como funcionam em cada contexto.

## 🤖 VISÃO GERAL DO SISTEMA DE AGENTES

### **Arquitetura de Agentes**

O sistema Ialum utiliza agentes especializados de IA que trabalham de forma integrada em diferentes pontos do fluxo de criação de conteúdo:

1. **Agentes no Dashboard**: Cards explicativos para descoberta de funcionalidades
2. **Agentes de Contexto**: Disponíveis no header de cada página, recebendo dados automáticos
3. **Agentes de Pipeline**: Integrados aos workflows de automação N8N
4. **Integração Inteligente**: Cada agente conhece o contexto atual e se adapta

### **Fluxo de Integração**

```
Frontend (Usuário) → Agente IA → Backend (N8N) → Processamento → Retorno ao Frontend
```

- **Frontend**: Interface visual com botões/cards para ativar agentes
- **Contexto**: Dados da página atual enviados automaticamente
- **Backend**: Workflows N8N processam solicitações via webhooks
- **Resposta**: Conteúdo gerado retorna para a interface

### **Pontos de Integração no Pipeline**

1. **Pré-Pipeline (Ideação)**: Editor Chefe sugere → Usuário aprova → Pipeline inicia
2. **Durante Pipeline (Enriquecimento)**: Transformação → Pesquisador → Redação → Criação de Mídia
3. **Pós-Pipeline (Otimização)**: Processamento de Templates → Instagram Agent → Publicador

---

## 📍 AGENTES DISPONÍVEIS E SUAS FUNÇÕES

### **1. 🧠 iAlum Editor Chefe**

**Responsabilidade Principal**: Sugerir tópicos e manter linha editorial consistente

**Localização no Sistema**:
- Dashboard: Card de descoberta
- Página de Tópicos: Botão no header para sugestões rápidas

**Funcionamento**:
- Analisa histórico de publicações da banca
- Considera calendário comemorativo e atualidades jurídicas
- Sugere tópicos alinhados com linhas narrativas configuradas
- Avalia performance anterior para otimizar sugestões

**Integração Backend**:
- Trigger semanal automático ou ativação sob demanda
- Acessa dados de configuração da banca (temas, narrativas, tom de voz)
- Consulta métricas de engajamento histórico
- Retorna lista priorizada de sugestões

**Contexto Recebido**:
- Configurações da banca (temas jurídicos, linhas narrativas)
- Últimos 30 tópicos publicados
- Métricas de performance
- Calendário de eventos/feriados

---

### **2. 🔎 iAlum Pesquisador (Jurídico)**

**Responsabilidade Principal**: Pesquisar e embasar juridicamente os tópicos

**Localização no Sistema**:
- Página de Embasamentos: Botão principal no header
- Integrado automaticamente quando tópico muda para "em pesquisa"

**Funcionamento**:
- Recebe tópico e realiza pesquisa jurídica completa
- Busca jurisprudência em tribunais superiores
- Localiza legislação vigente e doutrinas relevantes
- Compila embasamento estruturado com referências

**Integração Backend**:
- APIs de pesquisa jurídica (configuradas no N8N)
- Filtros por tribunais e período temporal
- Compilação via IA para texto coeso
- Formatação ABNT automática

**Contexto Recebido**:
- Tópico atual com título e área jurídica
- Embasamento existente (se houver)
- Preferências de pesquisa da banca
- Histórico de fontes utilizadas

**Capacidades Específicas**:
- Pesquisar legislação atualizada
- Buscar jurisprudências relevantes
- Criar embasamento estruturado
- Adicionar referências formatadas
- Melhorar texto existente

---

### **3. 📱 iAlum Redator Instagram**

**Responsabilidade Principal**: Especialista em formatação e estratégia Instagram

**Localização no Sistema**:
- Página de Redação Instagram: Header com acesso rápido
- Modal/chat contextualizado com dados da publicação

**Funcionamento**:
- Cria conteúdo otimizado para Instagram
- Gera múltiplos formatos (carrossel, stories, reels)
- Sugere prompts visuais para imagens
- Inclui CTAs e hashtags estratégicas

**Integração Backend**:
- Templates visuais pré-configurados
- Integração com geradores de imagem
- Análise de trends e hashtags
- Preview em tempo real

**Capacidades API Instagram**:
- **Localização**: Adicionar geotags de estabelecimentos e cidades
- **Música**: Buscar e adicionar trilhas sonoras para Reels/Stories
- **Stickers**: Enquetes, perguntas, quiz, contagem regressiva, localização
- **Menções**: Tag de perfis relevantes (@mentions)
- **Hashtags**: Análise de relevância e volume de busca
- **Efeitos**: Sugestão de filtros AR populares
- **Colaborações**: Configurar posts colaborativos
- **Produtos**: Tags de produtos para Instagram Shopping

**Contexto Recebido**:
- Tópico e embasamento atual
- Identidade visual (cores, fontes, logo)
- Publicações existentes do tópico
- Preferências de narrativa

**Capacidades Múltiplas**:
- **Carrossel**: Até 10 slides com textos e descrições visuais
- **Stories**: Sequência interativa com enquetes e perguntas
- **Reels**: Roteiro completo com timing e sugestões de áudio
- **Geração em Lote**: Todos os formatos de uma vez

---

### **4. 💼 iAlum Redator LinkedIn**

**Responsabilidade Principal**: Conteúdo profissional para networking B2B

**Localização no Sistema**:
- Página de Redação LinkedIn: Header dedicado
- Integração com calendário corporativo

**Funcionamento**:
- Adapta embasamento para tom executivo
- Cria artigos longos estruturados
- Desenvolve posts concisos de alto impacto
- Otimiza para algoritmo e SEO do LinkedIn

**Contexto Recebido**:
- Embasamento jurídico completo
- Perfil do público-alvo B2B
- Histórico de performance no LinkedIn
- Objetivos de conversão

**Formatos Disponíveis**:
- **Artigo Completo**: 1500+ palavras estruturadas
- **Post Executivo**: Conteúdo conciso e impactante
- **Documento/Slides**: Material para download
- **Newsletter**: Versão para LinkedIn Newsletter

**Capacidades API LinkedIn**:
- **Menções**: Tag de pessoas e empresas relevantes
- **Hashtags**: Até 5 hashtags otimizadas para descoberta
- **Documentos**: Upload de PDFs, apresentações e infográficos
- **Eventos**: Criação e divulgação de eventos corporativos
- **Enquetes**: Polls com até 4 opções e duração customizável
- **Vídeos Nativos**: Upload direto de vídeos até 10 minutos
- **LinkedIn Live**: Configuração de transmissões ao vivo
- **Analytics**: Métricas detalhadas de visualizações e engajamento

---

### **5. 🎬 iAlum Redator TikTok**

**Responsabilidade Principal**: Conteúdo viral para público jovem

**Localização no Sistema**:
- Página de Redação TikTok: Acesso via header
- Dashboard de trends integrado

**Funcionamento**:
- Simplifica linguagem jurídica para Gen Z
- Identifica trends aplicáveis ao conteúdo
- Cria roteiros dinâmicos e envolventes
- Sugere áudios e efeitos populares

**Contexto Recebido**:
- Tópico simplificado
- Trends atuais da plataforma
- Métricas de vídeos anteriores
- Preferências de formato

**Capacidades**:
- **Roteiro de Vídeo**: 15-60 segundos com timing
- **Carrossel TikTok**: Até 35 imagens verticais
- **Série de Vídeos**: Conteúdo episódico
- **Adaptação de Trends**: Aplicação a conteúdo jurídico

**Capacidades API TikTok**:
- **Áudios Virais**: Biblioteca de sons populares e trends musicais
- **Efeitos**: Filtros AR, transições e efeitos visuais nativos
- **Duetos/Reações**: Configuração para conteúdo colaborativo
- **Localização**: Geotags para descoberta local
- **Hashtags Challenges**: Participação em desafios virais
- **Stickers Interativos**: Enquetes, perguntas e quiz
- **Legendas Automáticas**: Transcrição e timing de falas
- **TikTok Shop**: Links para produtos e serviços
- **Analytics**: Visualizações, compartilhamentos e taxa de conclusão

---

### **6. 📅 iAlum Publicador (Agendador)**

**Responsabilidade Principal**: Organizar agenda e otimizar horários de publicação

**Localização no Sistema**:
- Página de Agendamentos: Assistente principal
- Widget de calendário inteligente

**Funcionamento**:
- Analisa métricas históricas de engajamento
- Sugere melhores horários por plataforma
- Distribui conteúdo equilibradamente
- Evita conflitos e saturação

**Integração Backend**:
- Análise de dados via N8N
- Algoritmos de otimização temporal
- Consideração de fusos horários
- Publicação automática programada

**Contexto Recebido**:
- Publicações prontas para agendamento
- Calendário com slots disponíveis
- Histórico de engajamento por horário
- Feriados e eventos especiais

**Inteligência de Agendamento**:
- Intervalo mínimo entre publicações
- Máximo de posts por dia
- Variação de tipos de conteúdo
- Ajustes para fins de semana

---

### **7. 📊 iAlum Relatórios**

**Responsabilidade Principal**: Análise de performance e insights estratégicos

**Localização no Sistema**:
- Página de Relatórios: Análise sob demanda
- Dashboards automatizados

**Funcionamento**:
- Analisa padrões de sucesso
- Identifica conteúdos de alto desempenho
- Sugere melhorias específicas
- Cria planos de ação baseados em dados

**Contexto Recebido**:
- Métricas do período selecionado
- Top publicações e piores performances
- Comparativos temporais
- Benchmarks do segmento

**Análises Disponíveis**:
- Performance por tipo de conteúdo
- Melhores horários e dias
- Temas mais engajadores
- ROI de campanhas

---

### **8. 🧑‍🏫 iAlum Ajuda**

**Responsabilidade Principal**: Guiar usuários e oferecer suporte contextual

**Localização no Sistema**:
- Overlay em toda aplicação
- Botão flutuante de ajuda
- Tooltips contextuais

**Funcionamento**:
- Detecta página e ação atual do usuário
- Oferece ajuda proativa em caso de erros
- Guia passo a passo em tarefas complexas
- Responde dúvidas sobre funcionalidades

**Contexto Recebido**:
- Página atual e ação sendo executada
- Erros recentes (se houver)
- Nível de experiência do usuário
- Histórico de interações

**Tipos de Ajuda**:
- Tutorial inicial para novos usuários
- Dicas contextuais por página
- Resolução de erros comum
- Guias de melhores práticas

---

## 🔄 FLUXO DE USO INTEGRADO

### **1. Descoberta e Ativação**
```
Dashboard (Cards) → Página Específica → Botão no Header → Modal/Chat Abre
```

### **2. Processamento Inteligente**
```
Contexto Automático → Agente Processa → Backend N8N → Resposta Gerada
```

### **3. Integração com Pipeline**
```
Criação → Pesquisa → Redação → Formatação → Agendamento → Publicação
```

### **4. Feedback e Otimização**
```
Métricas Coletadas → Análise de Performance → Ajustes → Melhoria Contínua
```

---


## 💰 SISTEMA DE CRÉDITOS

### **Consumo por Operação**

| Agente | Operação | Créditos |
|--------|----------|----------|
| Editor Chefe | Sugestão de 10 tópicos | 1 |
| Pesquisador | Embasamento completo | 1 |
| Redator Instagram | Lote completo | 2 |
| Redator LinkedIn | Lote completo | 2 |
| Redator TikTok | Lote completo | 2 |
| Instagram | Carrossel (10 slides) | 1 |
| Instagram | Stories (até 5) | 1 |
| Instagram | Roteiro Reels | 1 |
| Instagram | Pacote completo | 2.5 |
| LinkedIn | Artigo completo | 2 |
| LinkedIn | Post executivo | 1 |
| TikTok | Roteiro vídeo | 1 |
| TikTok | Carrossel (35 imgs) | 2 |
| Relatórios | Análise completa | 1 |
| Ajuda | Ilimitado | 0 |

### **Pacotes e Otimizações**
- Geração em lote tem desconto de 20%
- Créditos não utilizados acumulam
- Planos com créditos mensais fixos
- Créditos extras sob demanda

---

## 📈 GOVERNANÇA E LIMITES

### **Controles de Uso**
- **Rate Limiting**: Limites diários por agente
- **Aprovações**: Publicação final sempre requer aprovação humana
- **Auditoria**: Todos os usos são registrados
- **Qualidade**: Revisão automática de conteúdo gerado

### **Limites por Agente**
- Editor Chefe: 100 sugestões/dia
- Pesquisador: 100 pesquisas/dia
- Redação: 200 textos/dia
- Agendador: Só limite de segurança
- Ajuda: Só limite de segurança

### **Segurança e Privacidade**
- Dados isolados por banca (multi-tenant)
- Sem compartilhamento entre clientes
- Conformidade LGPD
- Logs com retenção de 90 dias

---

## 🚀 EVOLUÇÃO E ROADMAP

### **Métricas Coletadas**
- Taxa de uso por agente e página
- Tipos de conteúdo mais solicitados
- Taxa de aproveitamento (usado vs gerado)
- Tempo economizado por operação
- Satisfação e feedback dos usuários

### **Melhorias Planejadas**

**Fase 1 - Agentes Básicos** (Atual)
- 🔄 Editor Chefe para sugestões
- 🔄 Pesquisador jurídico
- 🔄 Redação multi-formato

**Fase 2 - Inteligência Avançada**
- 📋 Análise preditiva de performance
- 📋 Agentes conversando entre si
- 📋 Aprendizado com feedback

**Fase 3 - Automação Total**
- 📋 Pipeline 100% autônomo
- 📋 Aprovação por exceção
- 📋 Personalização por usuário

---

## 🔗 INTEGRAÇÕES EXTERNAS

### **APIs e Serviços**
- **Pesquisa Jurídica**: Integração com bases de jurisprudência
- **Geração de Imagens**: Bannerbear e similares
- **Análise de Trends**: APIs de redes sociais
- **Publicação**: APIs oficiais das plataformas

### **Webhooks e Automações**
- Entrada via webhook central do N8N
- Roteamento inteligente por tipo de agente
- Processamento assíncrono
- Notificações de conclusão

---

**Nota**: Para especificações técnicas detalhadas, variáveis de configuração e exemplos de código, consulte a documentação técnica específica de cada componente.