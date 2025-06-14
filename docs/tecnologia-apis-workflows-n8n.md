# Workflows n8n - IALUM

## 🎯 Resumo Executivo

N8n como backend do sistema SAAS IALUM foi desenvolvido para um mvp e agora está sendo melhorado e componentizado.
 - @ialum_vs1/backend/n8n/backup/ILAUM_dados_index.json
 - @ialum_vs1/backend/n8n/backup/IALUM_imgs_advogado___Jonas_Massaia.json
 - @ialum_vs1/backend/n8n/backup/IALUM_publica___Jonas_Massaia.json

## 🚀 Otimizações Propostas para componentização experimental

### 1. Workflow Principal

 - @ialum_vs1/backend/n8n/WORKFLOW_CENTRAL_IALUM.json

### 2. Sub-workflows Modulares

1. **DataTransforming** - @ialum_vs1/backend/n8n/WORKFLOW_GoogleSheetsOperations.json
 - manipulação dos dados.
 - Normalização dos dados para processamento
 - Um por rede social

2. **GoogleSheetsOperations** - @ialum_vs1/backend/n8n/WORKFLOW_GoogleSheetsOperations.json
 - arvazena e acessa dados textuais das publicações, datas de agendamentos etc.
 - atualiza dados dos procesamentos na planilha
 - notifica o usuario sobre as mudanças

3. **MidiaCreateIa** - não criado
 - Geração de prompts para criar imagens com base nos dados da Banca  e do pouts
 - Geração de imagens e videos base para usar nos Templates


4. **TemplateProcessing** - @ialum_vs1/backend/n8n/WORKFLOW_Insta-TemplateProcessing.json
 - Processamento do template para criar a(s)imagens/vidoes para publicações.
 - Basicamente onde o texto, as imagens de base (fundo) são compiladas em uma midia publicável dentro da estrutura especifica
 - um por rede social, que reune todos os tipos de publicação daquela rede social

5. **CronPublisher** - @ialum_vs1/backend/n8n/WORKFLOW_Insta-CronPublisher.json
 - Cron que publica na hora certa os agendamentos.