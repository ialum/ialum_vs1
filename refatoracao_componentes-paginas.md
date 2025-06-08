
# Lições Aprendidas sobre Refatoração e Criação de Componentes e Páginas para que a ia evite erros quando reiniciar seu contexto


## **Componentes**
  1. Simplicidade sobre Complexidade ex.

  - ❌ Antes: Componentes com dropdowns, eventos globais, múltiplos níveis DOM
  - ✅ Depois: Inputs nativo HTML5 estilizado com CSS

  2. Isolamento Total

    - ❌ Evitar: document.addEventListener, acessar elementos externos
    - ✅ Preferir: Eventos apenas no próprio elemento, CustomEvent para comunicação

  4. Hierarquia de Componentes

    1. Enhancers: Melhoram elemento existente (mais simples) ver js/components
    2. Wrappers: Envolvem com funcionalidade extra
    3. Builders: Criam estrutura nova (último recurso)

  5. Consistência com Design System

    - Usar variáveis CSS do sistema (--spacing-lg, --radius-lg) ver css/base
    - Seguir comportamentos padrão (hover, focus, disabled)
    - Reutilizar classes e padrões existentes

  6. Documentação Clara

    - Adicionar princípios de design em tecnologia-js.md e tecnologia-css.md
    - Comentários explicando tipo de componente (Enhancer, Wrapper, etc)
    - Exemplos de uso correto vs incorreto

  7. DOM Mínimo

    - Máximo 2 níveis de profundidade
    - Evitar criar/destruir elementos dinamicamente
    - Preferir mostrar/ocultar com CSS

  8. Teste de Conflitos

    - Verificar se componente interfere com outros ( ex.EmojiPicker vs ColorPicker)
    - Usar ferramentas de busca para encontrar document.addEventListener
    - Testar isoladamente e em conjunto


## **Páginas**

coisas para melhorar aqui sobre a criação refatoração de páginas: precisei reiteradas vezes mencionar arquivos especificos dos componentes, do css base, variables mesmo pedindo para ia ler a documentação, tenho percebido que é melhor uma orientação em linguagem natural curta e direta como primeiro elemento de contexto do que centezas de linhas e arquivos, a menos que peça para ela ler todos, um por um, o que custa caro.

precisamos de um pequeno esqueleto fundamental do uso das classes dos cards para seguir em uma nova página para que fique elegante e animada como as primeiras desenvolvidas: configuração da banca.

e muito mais, mas de maneira simples.    


  🏗️ Estrutura Final Simplificada:

  1. variables/ - Átomos do sistema (NUNCA usar inline)
  2. base/ - Estruturas maiores e tema (evitar inline, mas pode em casos específicos)
  3. components/ - Classes finais que aparecem no código

  /css/
  ├── variables/           (Átomos do sistema (NUNCA usar inline))
  │   ├── colors.css       (--blue-500, --red-300, etc)
  │   ├── dimensions.css   (--spacing-*, --radius-*, etc)
  │   ├── spacing.css
  │   ├── display.css
  │   ├── borders.css
  │   ├── ... todos os utilities
  │   └── index.css        (importa todos)
  │
  ├── base/                (Estruturas maiores e tema (evitar inline, mas pode em casos específicos))
  │   ├── reset.css
  │   ├── theme.css        (--theme-bg-*, --theme-text-*)
  │   ├── typography.css
  │   ├── buttons.css
  │   └── forms.css
  │
  └── components/          (Classes finais que aparecem no código)
      └── layout/
          ├── layout-app.css   (inclui TUDO de layout)
          ├── layout-public.css   
          ├── header.css
          └── sidebar.css



  ✅ Por que é melhor:

  1. Hierarquia clara: Variables → Base → Utilities → Components
  2. Import simples: @import './variables/index.css'
  3. Fácil de explicar: "Não use nada de /variables diretamente, exceto theme.css"
  4. Separação lógica:
    - colors.css = cores brutas
    - theme.css = cores semânticas (podem usar!)

  📝 Regra simples:

  ❌ NÃO USE: --blue-500, --spacing-lg (direto de variables)
  ✅ USE: --theme-bg-primary, --primary (de theme.css)
  ✅ USE: Classes utilitárias: .mb-lg, .text-blue

  Muito mais limpo e intuitivo! Vamos implementar?

> é vai doer, mas vamos mudar sim, vai ser melhor crie um plano de ação rapido para esta mudança e nossos proximos passos depois disso: acertar o pagebuilder e depois 
  refatorar o configurações da banca com o pagebuilder e ai sim ter o nosso manual de novos componentes css e js e paginas mais simples e funcionar possivel

● 🚀 Plano de Ação - Refatoração CSS

  Fase 1: Reorganizar Estrutura CSS (20 min)

● Update Todos
  ⎿  ☐ Criar pasta /css/variables/ e mover arquivos
     ☐ Separar variables.css em colors.css, dimensions.css e theme.css
     ☐ Mover conteúdo de 04-layouts.css para app-layout.css
     ☐ Deletar 04-layouts.css e atualizar imports
     ☐ Testar se tudo continua funcionando

● Fase 2: Acertar PageBuilder (10 min)

  - Remover classes duplicadas do app-layout.css
  - Garantir que page-header não tenha background
  - Testar visual com configurações-sistema

  Fase 3: Refatorar Configurações-Banca (15 min)

  - Migrar HTML estático para PageBuilder
  - Manter componentes CardList existentes
  - Verificar visual idêntico ao atual

  Fase 4: Documentação Final 

  ## 📚 Manual de Criação de Páginas e componentes

