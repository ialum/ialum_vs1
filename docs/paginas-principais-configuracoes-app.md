# Configurações - Detalhamento das Páginas

Este documento detalha todas as páginas de configurações do sistema Ialum, incluindo a estrutura, componentes e funcionalidades de cada uma.

## 🔧 ESTRUTURA GERAL DE CONFIGURAÇÕES

### **Layout Padrão**
Todas as páginas de configurações seguem o mesmo layout:
- **Sidebar esquerda**: Menu de navegação entre configurações
- **Área principal**: Conteúdo específico da configuração
- **Header**: Título e descrição da seção
- **Footer**: Botões de ação (Salvar, Cancelar, Restaurar Padrões)

### **Menu de Configurações**
```
Configurações/
├── Banca
├── Banco de Imagens (image-bank)
├── Templates
├── Integrações
└── Sistema
```

---

## 📋 PÁGINAS DE CONFIGURAÇÕES

### **1. CONFIGURAÇÕES DA BANCA**

**Rota**: `/app/configuracoes/banca`

#### **Seções da Página**


**1.1 Linhas Narrativas**
- Lista de narrativas salvas
- Para cada narrativa:
  - Nome da linha narrativa começando com icone (max 25 caracteres deve iniciar com emoji)
  - Descrição detalhada de como aplicar (max de 1000 caracteres com contador de digitos) 
  - Botão "Salvar Narrativa"
- Botão "Criar nova Narrativa"
- Exemplos de narrativas:
  - **Jornada do Herói**: "onde o advogado é o herói que irá salvar o cliente das garras do problema abordado no tópico"
  - **Crítica ao Sistema**: "crítica dura ao sistema e questões abordadas no tópico, com justificativas embasadas, ponderando o certo e o errado do ponto de vista da população em geral"

**1.2 Temas Jurídicos**
- Lista de temas salvas
- Para cada tema:
  - Nome do tema começando com ícone (max 25 caracteres deve iniciar com emoji)
  - Descrição detalhada (max de 1000 caracteres com contador de digitos) 
  - Botão "Salvar Tema"
- Botão "Criar novo Tema"
- Exemplos de temas:
  - **Compra e Venda**: "problemas que pessoas fisicas enfrentam ao assinar contratos de compra e venda de bens de alto valor como veiculos, casas, terrenos, maquinas etc, que acabam criando inumetos problemas no menor deslize de uma das partes"
  - **Empres. Trabalhista**: "Protocolos mais importantes que as empresas devem adotar e prever ao contratar, mantes e demitir funcionarios ou serviços pj em suas empresas."

**1.3 Identidade Visual**
- **logotipos**
  - Upload de logo principal (PNG com fundo transparente 1024x1024px max 1mg)
  - Upload de logo principal horizontal (variação)
  - Upload de logo clara (variação)
  - Upload de logo clara horizontal (variação)
  - Upload de logo escura (variação)
  - Upload de logo escura horizontal (variação)
  - Preview visual das cores de fundo aplicada ao fundo das logos
- **Cores da marca:**
  - Cor principal (RGB - será usado como fundo para a logo secundária)
  - Cor secundária (RGB - será usado como fundo para a logo primária)
  - Cor clara (RGB - fundos contrasta com logo escura)
  - Cor escura (RGB - fundos contrasta com logo clara)
  - Preview visual das cores
- **Nome e Descrição**
  - Nome da banca (como aparecerá nas publicações)
  - Descrição do posicionamento da banca (textarea max 1000 caracteres com editor de markdown)
-
- **Fontes:**
  - Fonte principal - titulos
  - Fonte para textos - facil leitura
- Botão "Salvar Identidade Visual"

---

### **2. BANCO DE IMAGENS (image-bank)**

**Rota**: `/app/configuracoes/image-bank`

#### **Seções da Página**

**2.1 Banco de Imagens por Tema (image-bank)**
- **cabeçario seletor**
  - Seletor de tema no topo com osuma visualização tipo icones dos temas da banca
  - Texto descrição do tema dinamico conforme seleciona o tema
- **grid das imagens do tema selecionado com abas**
  - Abas de imagens ja filtradas pelo tema selecionado:
    - **Presets**: Imagens padrão do tema ( que irão aparecer por primeiro nas páginas de redação para uso rapido)
    - **Geradas IA**: Imagens criadas com IA ( imagens geradas por ia durante a redação podem ser arquivadas, excluidas ou promovidas a pressets)
    - **Upload**: Imagens enviadas pelo usuario ( mesmo comportamento das geradas por ia )
  - Grid visual das imagens com opções de gerenciar com botões sobrepostos as imagens ( visualizar, arquivar ou presset)
  - Aba carrega até 12 imagens no mobile e aparece botão carregar mais / todas 
  - carregaemnto inteligente para não sobrecarregar a página

- **2.2 card de geração de imagem a partir de prompt contextual**
  - Botão "iAlum Designer" para geração de prompts via IA (abre chat para que a ia preencha os campos depois da conversa com o usuario)
    - Promt da geração de imagem: (maximo de 1000 caracteres)
    - Nome da imagem: até 70 caracteres
    - Descrição da Imagem: até 200 caracteres 
    - Checkboxes:
      - Usar identidade visual (ia irá conciderar a identidade visual ao criar a imagem)
      - Usar contexto do tema (ia irá usar a descrição do tema para criar a imagem)
    - Botão "Gerar nova imagem" (1 crédito por imagem gerada)
  - precisaria estudar uma forma de vincular os dois cards, para que a geração de imagem soubesse qual dos temas está selecionado no cabeçario do seletor

---

### **3. TEMPLATES**

**Rota**: `/app/configuracoes/templates`

#### **Seções da Página**

**3.1 Biblioteca de Templates por rede social/ublicação**
- **cabeçario seletor**
  - Seletor de rede social que ao clicar na rede espande os tipo de publicação
- **grid de templates do tipo de publicação**
  - templates possuem tamanho e variaveis
    - **Usuario pode criar um**: Im
- Preview em hover
- Estatísticas de uso

**3.2 Editor de Templates**
- Canvas visual
- Elementos arrastáveis
- Propriedades editáveis
- Variáveis dinâmicas
- Preview responsivo

**3.3 Categorias**
- Instagram Carrossel
- Instagram Stories
- Instagram Reels Cover
- LinkedIn Post
- LinkedIn Article
- Facebook Post
- TikTok Cover

**3.4 Elementos de Template**
- Textos (título, corpo, CTA)
- Imagens (principal, logo, ícones)
- Formas e fundos
- Gradientes
- Padrões

**3.5 Configurações Avançadas**
- Variáveis customizadas
- Condicionais
- Loops para carrossel
- Integração com dados

#### **Integração Bannerbear**
- Sincronização de templates
- Mapeamento de variáveis
- Preview antes de salvar
- Histórico de versões

---

### **4. INTEGRAÇÕES**

**Rota**: `/app/configuracoes/integracoes`

#### **Seções da Página**

**4.1 Redes Sociais**
```
Instagram Business
├── Status: Conectado/Desconectado
├── Conta: @nome_da_banca
├── Permissões: Publicar, Ler insights
├── Última sincronização: data/hora
└── Ações: Reconectar, Desconectar, Testar

LinkedIn
├── Status: Conectado/Desconectado
├── Perfil: Nome da Página
├── Permissões: Publicar, Analytics
└── Ações: Conectar, Configurar

Facebook
├── Status: Conectado/Desconectado
├── Página: Nome da Página
├── Permissões: Publicar, Moderar
└── Ações: Conectar, Selecionar Página

TikTok Business
├── Status: Em breve
└── Notificar quando disponível
```

**4.2 Ferramentas de IA**
```
OpenAI (ChatGPT)
├── API Key: ****hidden****
├── Modelo: GPT-4
├── Limite mensal: 1000 requisições
├── Uso atual: 234/1000
└── Ações: Atualizar key, Ver logs

DALL-E / Midjourney
├── Status: Ativo
├── Créditos: 500 imagens
├── Qualidade padrão: HD
└── Ações: Comprar créditos

Bannerbear
├── API Key: ****hidden****
├── Projetos sincronizados: 3
├── Templates: 15 ativos
└── Ações: Sincronizar, Logs
```

**4.3 Analytics e Monitoramento**
```
Google Analytics
├── ID de acompanhamento
├── Eventos customizados
└── Dashboard integrado

Pixel Facebook
├── ID do Pixel
├── Eventos de conversão
└── Teste de eventos
```

**4.4 Pagamentos**
```
Stripe
├── Modo: Produção/Teste
├── Webhooks configurados
└── Logs de transação

PagSeguro
├── Email cadastrado
├── Token de produção
└── Notificações ativas
```

**4.5 Webhooks e APIs**
- Endpoints cadastrados
- Logs de requisições
- Teste de webhook
- Documentação da API

#### **Segurança**
- Todas as API keys criptografadas
- Logs de acesso
- Renovação automática de tokens
- Alertas de expiração

---

### **5. SISTEMA**

**Rota**: `/app/configuracoes/sistema`

#### **Seções da Página**

**5.1 Preferências Gerais**
- Idioma da interface
- Fuso horário
- Formato de data/hora
- Tema (claro/escuro)
- Densidade da interface

**5.2 Notificações**
```
Email
├── Publicação agendada
├── Falha na publicação
├── Novo usuário
├── Limite de créditos
└── Resumo semanal

Push (Browser)
├── Ativado/Desativado
├── Sons
└── Tipos permitidos

WhatsApp Business
├── Número cadastrado
├── Notificações críticas
└── Limites diários
```

**5.3 Segurança**
- Sessão única
- Tempo de inatividade
- 2FA obrigatório
- IPs permitidos
- Logs de acesso

**5.4 Backup e Dados**
- Backup automático
- Frequência (diário/semanal)
- Retenção (30/60/90 dias)
- Exportar dados (LGPD)
- Importar dados

**5.5 Limites e Cotas**
- Usuários simultâneos
- Armazenamento usado
- Limite de publicações/mês
- Uso de IA/mês
- Upgrade de plano

**5.6 Modo Avançado**
- API Rate Limits
- Cache settings
- Debug mode
- Logs do sistema
- Performance metrics

#### **Ações Globais**
- Limpar cache
- Reindexar busca
- Verificar integridade
- Modo manutenção
- Reset de fábrica

---

## 🔐 PERMISSÕES POR PÁGINA

### **Níveis de Acesso**

**Admin (Proprietário)**
- Acesso total a todas as configurações
- Pode adicionar/remover usuários
- Gerencia billing e planos
- Acesso aos logs de segurança

**Editor**
- Configurações de conteúdo
- Banco de imagens (image-bank)
- Templates
- Integrações (visualizar)

**Reviewer**
- Apenas visualização
- Sem edição de configurações
- Acesso ao banco de imagens (image-bank)

**Viewer**
- Sem acesso às configurações
- Apenas páginas operacionais

---

## 🎯 FLUXOS ESPECIAIS

### **Primeiro Acesso**
1. Wizard de configuração inicial
2. Dados da banca (obrigatório)
3. Upload de logo (opcional)
4. Conectar primeira rede social
5. Criar primeiro tema jurídico

### **Mudança de Plano**
1. Notificação de limite próximo
2. Link direto para upgrade
3. Comparativo de planos
4. Processo de pagamento
5. Ativação imediata

### **Integração de Nova Rede**
1. Selecionar rede social
2. Autorização OAuth
3. Selecionar páginas/perfis
4. Configurar permissões
5. Teste de publicação

---

## 📱 RESPONSIVIDADE

### **Desktop (>1024px)**
- Layout em duas colunas
- Menu lateral fixo
- Formulários expandidos

### **Tablet (768-1024px)**
- Menu lateral colapsável
- Formulários adaptados
- Modais em fullscreen

### **Mobile (<768px)**
- Menu hambúrguer
- Uma seção por vez
- Botões maiores
- Formulários verticais

---

## 💾 SALVAMENTO E VALIDAÇÃO

### **Auto-save**
- Rascunho a cada 30 segundos
- Indicador visual de salvamento
- Recuperação de dados não salvos

### **Validações em Tempo Real**
- Campos obrigatórios
- Formatos específicos
- Limites de caracteres
- Verificação de duplicatas

### **Confirmações**
- Mudanças críticas pedem confirmação
- Preview antes de salvar
- Opção de desfazer (30 segundos)
- Log de alterações