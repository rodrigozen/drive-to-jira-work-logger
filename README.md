# SpreadsheetToJira Work Logger
Script para gravar work logs no jira, consumindo uma planilha do google drive

## Requirements
* Nodejs
* Jira Account
* Google Service Account

## Como usar

### Configurações
  * Crie uma conta de serviço no google
    1. Go to the [Google Developers Console](https://console.developers.google.com/project).
    2. Select your project, or create a new one and then select it.
    3. Enable the Drive API for your project.
      * In the sidebar on the left, expand __APIs & auth__ > __APIs__.
      * Search for "Drive".
      * Click on "Drive API".
      * Click the "Enable API" button.
    4. Create a service account for your project.
      * In the sidebar on the left, expand __APIs & auth__ > __Credentials__.
      * Click the "Add credentials" button and select the "Service account" option.
      * Select "JSON" under "Key type" and click the "Create" button.
      * Your JSON key file is generated and downloaded to your machine (__it is the only copy!__).


  * Coloque o json gerado na raiz do projeto (`google-service-account.json`)

##### conf.js
  * Preencha suas credenciais do jira em `conf.js`
  * Compatilhe a planilha por um link **com permissão de edição** e pegue o codigo da planilha..
    * Ex (a parte destacada) : docs.google.com/spreadsheets/d/**qF4PQNHqJwZFl4D7pXonChXu99zFauThYl4**/edit#gid=0
  * Coloque o código em `"planilha": "qF4..."`
  * Preecha a colunas na chave "colunas" (são o valores da 1º  linha da planilha)..
    * Obrigatórios: "issue", "data", "duracao","comentario", "logado" e "inicio"
      ("logado" é uma coluna booleana de controle do que foi lançado no jira com sucesso)

### Executar
  * `npm start` no terminal
