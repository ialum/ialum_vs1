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
  - Seletor de tema no topo com a visualização tipo icones dos temas da banca
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

**3.1 Biblioteca de Templates por rede social/publicação**
os templates são configurados pelo bannerbeer, pelo editor visual dele, pela equipe ialum. uma biblioteca de templates fica disponível para que o cliente escolha, ou solicite criação de templates personalizados para a equipe Ialum.

ususario escolhe o tipo de publicação, exemplo: carrossel do instagram: este possui 4 templates distintos em sua estrturua, um de capa, um de citação para o slide 2 e 9, um de conteudos para slides de 3 a 8 e um de cta para slide 10.

ususario pode apenas escolher qual template será usado para cada slide especifico do carrossel: escolhe um template para cada slide.

- **cabeçario seletor**
  - Seletor de rede social que ao clicar na rede espande os tipo de publicação

- **grid de templates do tipo de publicação**
  - templates possuem tamanho e variaveis:
    - Instagram Carrossel
    - Instagram Stories
    - Instagram Reels Cover
    - LinkedIn Post
    - LinkedIn Article
    - Facebook Post
    - TikTok Cover
  - **Usuario pode criar um**: 
- Preview em hover

**3.4 Elementos de Template**
- Textos (título, corpo) - será preenchido pelo conteudo da publicação ao gerar a midia de publicação
- Imagens de fundo - será preenchido pela imagem seleionada para o slide ao gerar a midia de publicação
- Fonte - fontes da banca
- Gradientes - cores da banca
- logo - logos da banca

Ver api do bannerbeer se é possivel mudar tipo de fonte, cores etc via api


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

### **5. SISTEMA**

**Rota**: `/app/configuracoes/sistema`

#### **Seções da Página**

**5.1 Preferências Gerais**
- Idioma da interface
- Fuso horário
- Formato de data/hora
- Tema (claro/escuro)

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

**5.3 Backup e Dados**
- Backup automático
- Frequência (diário/semanal)
- Retenção (30/60/90 dias)
- Exportar dados (LGPD)
- Importar dados

**5.4 Modo Avançado**
- API Rate Limits
- Cache settings
- Debug mode
- Logs do sistema
- Performance metrics

**5.5 Ações Globais**
- Limpar cache
- Reindexar busca
- Verificar integridade
- Modo manutenção
