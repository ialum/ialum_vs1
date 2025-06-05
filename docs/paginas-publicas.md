# Páginas Públicas - Sistema Ialum

Este documento detalha as páginas públicas do sistema Ialum, incluindo Landing Page, páginas de erro e outras páginas acessíveis sem autenticação.

## 🏠 LANDING PAGE

**Rota**: `/` (raiz do domínio)

### **Estrutura da Página**

#### **1. Header**
- Logo Ialum (esquerda)
- Menu de navegação:
  - Funcionalidades
  - Planos
  - Sobre
  - Blog (futuro)
- Botões de ação (direita):
  - "Entrar" → `/login`
  - "Começar Grátis" → `/cadastro`

#### **2. Hero Section**
```
Headline Principal:
"Transforme seu Escritório Jurídico em uma Máquina de Conteúdo Digital"

Subheadline:
"IA especializada que cria publicações jurídicas personalizadas para todas as redes sociais, mantendo sua identidade e tom profissional"

CTA Principal: [Começar Teste Grátis de 7 Dias]
CTA Secundário: [Ver Demonstração]

Imagem/Vídeo: Dashboard do sistema em ação
```

#### **3. Seção de Benefícios**
Cards com ícones:
- **Economia de Tempo**: "Crie 30 publicações em 10 minutos"
- **Multi-plataforma**: "Instagram, LinkedIn, TikTok e mais"
- **IA Jurídica**: "Treinada em linguagem jurídica brasileira"
- **Compliance**: "LGPD e segurança de dados garantidas"

#### **4. Seção de Funcionalidades**
Layout em grid 2x3:

**Tópicos Inteligentes**
- Organize ideias por temas jurídicos
- Embasamento automático com IA
- Reutilização inteligente de conteúdo

**Criação Automatizada**
- Adapta conteúdo para cada rede
- Gera imagens com sua identidade
- Templates profissionais inclusos

**Agendamento Integrado**
- Publique em todas as redes
- Calendário visual intuitivo
- Horários otimizados por IA

**Banco de Imagens (image-bank)**
- Imagens temáticas jurídicas
- Geração via IA incluída
- Organização por tema

**Relatórios Completos**
- Métricas de engajamento
- ROI de conteúdo
- Insights acionáveis

**Múltiplos Usuários**
- Equipe colaborativa
- Aprovações e revisões
- Controle de acesso

#### **5. Seção Como Funciona**
Timeline em 4 passos:
1. **Crie um Tópico** → "Insira sua ideia jurídica"
2. **IA Embase** → "Nossa IA adiciona fundamentos"
3. **Gere Publicações** → "Crie para todas as redes"
4. **Publique** → "Agende e acompanhe resultados"

#### **6. Seção de Planos**
Cards de pricing:

**Starter**
- R$ 197/mês
- 1 usuário
- 100 publicações/mês
- 3 redes sociais
- Suporte por email

**Profissional**
- R$ 497/mês
- 5 usuários
- 500 publicações/mês
- Todas as redes
- Suporte prioritário

**Escritório**
- R$ 997/mês
- Usuários ilimitados
- Publicações ilimitadas
- API access
- Suporte dedicado

#### **7. Seção de Depoimentos**
Carrossel com cases de sucesso:
- Foto do cliente
- Nome e escritório
- Depoimento
- Métricas de resultado

#### **8. Seção FAQ**
Acordeão com perguntas frequentes:
- Como funciona a IA?
- Quais redes são suportadas?
- Posso cancelar quando quiser?
- Os dados são seguros?
- Preciso saber de tecnologia?

#### **9. CTA Final**
```
"Junte-se a 500+ Escritórios que Já Automatizaram seu Marketing Digital"
[Começar Teste Grátis] [Falar com Vendas]
```

#### **10. Footer**
- **Empresa**: Sobre, Carreiras, Contato
- **Produto**: Funcionalidades, Preços, Atualizações
- **Recursos**: Blog, Ajuda, API Docs
- **Legal**: Termos, Privacidade, LGPD
- **Social**: LinkedIn, Instagram, YouTube

---

## 🚪 PÁGINA DE CADASTRO

**Rota**: `/cadastro`

### **Estrutura em Steps**

#### **Step 1: Dados Pessoais**
```
Criar sua Conta Ialum
─────────────────────

Nome Completo: [________________]
Email Profissional: [________________]
Telefone: [________________]
Senha: [________________]
Confirmar Senha: [________________]

☐ Concordo com os Termos de Uso
☐ Aceito receber novidades (opcional)

[Continuar →]

Já tem conta? [Fazer Login]
```

#### **Step 2: Dados do Escritório**
```
Informações do Escritório
─────────────────────────

Nome do Escritório: [________________]
CNPJ (opcional): [________________]
Número OAB: [________________]
Site (opcional): [________________]

Quantos advogados? 
○ Só eu
○ 2-5
○ 6-10
○ Mais de 10

[← Voltar] [Continuar →]
```

#### **Step 3: Configuração Inicial**
```
Vamos Personalizar sua Experiência
──────────────────────────────────

Quais redes sociais você usa?
☑ Instagram
☑ LinkedIn
☐ TikTok
☐ Facebook
☐ Twitter/X

Principais áreas de atuação:
☑ Trabalhista
☐ Família
☑ Empresarial
☐ Criminal
☐ Outras: [_______]

[← Voltar] [Criar Conta]
```

#### **Step 4: Confirmação**
```
✓ Conta Criada com Sucesso!

Enviamos um email de confirmação para:
usuario@email.com

[Ir para o Dashboard]

Não recebeu? [Reenviar Email]
```

---

## ❌ PÁGINAS DE ERRO

### **403 - Acesso Negado**

**Rota**: `/403` ou qualquer acesso não autorizado

```
      🚫
   403 - Acesso Negado
   
Você não tem permissão para 
acessar esta página.

Possíveis motivos:
• Sua sessão expirou
• Você não tem as permissões necessárias
• O link está incorreto

[Voltar ao Dashboard] [Fazer Login]
```

### **404 - Página Não Encontrada**

**Rota**: `/404` ou qualquer rota inexistente

```
      🔍
   404 - Página Não Encontrada
   
A página que você está procurando
não existe ou foi movida.

Que tal tentar:
• Verificar se o endereço está correto
• Voltar à página anterior
• Ir para o início

[Ir para Home] [Reportar Problema]
```

### **500 - Erro Interno**

**Rota**: `/500` ou erros do servidor

```
      ⚠️
   500 - Erro Interno
   
Ops! Algo deu errado do nosso lado.
Já fomos notificados e estamos 
trabalhando para resolver.

Código do erro: #ERR_2024_0103_1542

Enquanto isso, você pode:
• Tentar novamente em alguns minutos
• Voltar à página anterior
• Entrar em contato com suporte

[Tentar Novamente] [Contatar Suporte]
```

### **503 - Manutenção**

**Rota**: `/manutencao`

```
      🔧
   Estamos em Manutenção
   
Estamos melhorando o Ialum para você!
Voltaremos em breve.

Previsão de retorno: 15:30 (horário de Brasília)

Siga nossas atualizações:
[@ialum.oficial no Instagram]

[Receber Aviso por Email]
```

---

## 🔐 PÁGINA DE RECUPERAÇÃO DE SENHA

**Rota**: `/recuperar-senha`

### **Step 1: Solicitar Reset**
```
Recuperar Senha
───────────────

Digite seu email cadastrado:
[_________________________]

[Enviar Link de Recuperação]

Lembrou a senha? [Fazer Login]
```

### **Step 2: Email Enviado**
```
✉️ Email Enviado!

Enviamos instruções para:
usuario@email.com

O link é válido por 15 minutos.

Não recebeu? 
[Reenviar] (disponível em 60s)

[Voltar ao Login]
```

### **Step 3: Nova Senha** 
**Rota**: `/reset-senha?token=xxx`

```
Criar Nova Senha
────────────────

Nova Senha: [________________]
(Mínimo 8 caracteres, 1 maiúscula, 1 número)

Confirmar: [________________]

Força da senha: ████████░░ Forte

[Alterar Senha]
```

---

## 📱 RESPONSIVIDADE

### **Mobile First**
Todas as páginas públicas são otimizadas para mobile:
- Menu hambúrguer no header
- CTAs em fullwidth
- Formulários em coluna única
- Imagens responsivas
- Touch-friendly (mínimo 44px)

### **Breakpoints**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🎨 IDENTIDADE VISUAL

### **Cores**
- Primária: #2563EB (Azul Ialum)
- Secundária: #10B981 (Verde Sucesso)
- Neutros: Escala de cinza
- Erro: #EF4444
- Aviso: #F59E0B

### **Tipografia**
- Headlines: Inter Bold
- Body: Inter Regular
- Monospace: JetBrains Mono (códigos)

### **Componentes**
- Botões com bordas arredondadas (8px)
- Cards com sombra sutil
- Inputs com foco azul
- Animações suaves (300ms)

---

## 📊 TRACKING E ANALYTICS

### **Eventos Rastreados**
- Page views
- Cliques em CTAs
- Início de cadastro
- Conclusão de cadastro
- Abandono por step
- Origem do tráfego

### **Integrações**
- Google Analytics 4
- Facebook Pixel
- LinkedIn Insight Tag
- Hotjar (heatmaps)

---

## 🚀 OTIMIZAÇÕES

### **Performance**
- Lazy loading de imagens
- Minificação de assets
- CDN para recursos estáticos
- Gzip compression
- Cache headers otimizados

### **SEO**
- Meta tags dinâmicas
- Schema.org markup
- Sitemap.xml
- Robots.txt
- URLs amigáveis

### **Conversão**
- A/B testing nos CTAs
- Social proof (contador de usuários)
- Urgência (oferta limitada)
- Garantia (teste grátis)
- Chat de vendas