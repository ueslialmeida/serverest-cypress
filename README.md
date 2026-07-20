
# 🧪 ServeRest Automation Framework - Cypress

Este projeto é uma suíte de testes automatizados ponta a ponta (E2E) e de API desenvolvida em **Cypress** para validar as funcionalidades da plataforma **ServeRest**.

---

## 🚀 Tecnologias Utilizadas

* **Cypress**: Framework de testes automatizados para a web e APIs.
* **@faker-js/faker**: Biblioteca utilizada para geração dinâmica de massa de dados aleatória e isolada.
* **Dotenv**: Gerenciamento seguro de variáveis de ambiente.
* **JavaScript (ES6+)**: Linguagem base do projeto.

---

## 📁 Estrutura do Projeto

    cypress/
    ├── e2e/
    │   ├── api/ 
    │   └──── auth.api.cy.js		# Testes de API para a rota /login (POST)
    │   └──── users.api.cy.js       # Testes de API para a rota /usuarios (GET, POST, PUT, DELETE)
    │   └──── products.api.cy.js    # Testes de API para a rota /produtos (Controle de acesso e regras de carrinho)
    │   ├── ui/
    │   └──── authentication.ui.cy.js    
    │   └──── products.api.cy.js    
    │   └──── users.api.cy.js    
    ├── support/
    │   ├── commands.js           # Custom Commands e extensões globais do Cypress
    │   ├── utils.js              # Fábricas de dados puras em JS (generateUserPayload, etc.)
    │   └── e2e.js                # Configurações de inicialização do Cypress
    ├── .env                      # Arquivo de variáveis locais (não commitado)
    ├── .env.example              # Modelo das variáveis de ambiente necessárias
    ├── cypress.config.js         # Arquivo principal de configuração do Cypress
    └── package.json              # Scripts e dependências do projeto

---

## 🛠️ Configuração do Ambiente

### 1. Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

 - **Node.js**: Versão 18 ou superior.
 -  **npm** ou **yarn**.


### 2. Instalação de Dependências

Instale as dependências do projeto executando o comando abaixo no terminal da raiz do projeto:

    npm install

### 3. Configuração do Arquivo `.env`

O projeto utiliza variáveis de ambiente para gerenciar URLs de infraestrutura e credenciais sem expor dados sensíveis no repositório.

1.  Crie uma cópia do arquivo `.env.example` na raiz do projeto nomeando-a como `.env`:

```
cp .env.example .env
```
    
2.  Abra o arquivo `.env` recém-criado e preencha com os dados do ambiente:

```
API_URL=[https://serverest.dev](https://serverest.dev)
ADMIN_EMAIL=seu_admin@email.com
ADMIN_PASSWORD=sua_senha_aqui
```

## 🏃 Como Executar os Testes

Disponibilizamos scripts prontos no `package.json` para facilitar a execução local ou em ambiente headless:

### Execução em Modo Interativo (Interface Gráfica)

Abre o Test Runner visual do Cypress para acompanhar e depurar a execução passo a passo:

    npm run cy:open

### Execução em Modo Headless (Linha de Comando / CI)

Roda toda a suíte de testes diretamente no terminal de forma otimizada para esteiras de build:

    npm run cy:run

### Execução em Modo Headless Testes de UI (Linha de Comando / CI)

Roda todos a suíte de testes de UI diretamente no terminal de forma otimizada para esteiras de build:

    npm run cy:ui:run

### Execução em Modo Headless Testes de API (Linha de Comando / CI)

Roda toda a suíte de testes de API diretamente no terminal de forma otimizada para esteiras de build:

    npm run cy:api:run

