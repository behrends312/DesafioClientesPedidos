Desafio Técnico – API REST + Frontend em React

Este repositório contém a implementação de um desafio técnico cujo objetivo é criar uma API REST em .NET para gerenciamento de clientes e pedidos, juntamente com um frontend em React responsável por consumir e operar essa API.

O foco do projeto é demonstrar organização de código, boas práticas, modelagem simples de dados, integração frontend/backend e testes unitários básicos.

Visão Geral

O sistema permite:

Cadastro, edição, listagem e exclusão de clientes
Cadastro, edição, listagem e exclusão de pedidos
Associação de pedidos a clientes
Consulta de clientes com seus respectivos pedidos (join)
Consumo completo da API pelo frontend
Feedback visual de ações (sucesso e erro)
Confirmação de ações destrutivas
Testes unitários na camada de serviços

Tecnologias Utilizadas:

Backend
.NET 8
ASP.NET Core Web API
Entity Framework Core
SQLite (para desenvolvimento)
xUnit (testes unitários)

Frontend:

React + Vite
JavaScript
Axios
Tailwind CSS
shadcn/ui

Estrutura do Projeto:
DesafioClientesPedidos/
│
├── api/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── DTOs/
│   ├── Entities/
│   ├── Data/
│   └── Api.csproj
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
│
├── Api.Tests/
│   ├── Services/
│   ├── Infrastructure/
│   └── Api.Tests.csproj
│
└── README.md

Backend – API
Endpoints principais:

Clientes:

GET /api/v1/clients
GET /api/v1/clients/{id}
POST /api/v1/clients
PUT /api/v1/clients/{id}
DELETE /api/v1/clients/{id}
GET /api/v1/clients/with-orders

Pedidos:

GET /api/v1/orders
GET /api/v1/orders/{id}
POST /api/v1/orders
PUT /api/v1/orders/{id}
DELETE /api/v1/orders/{id}

Validações implementadas:

Nome do cliente obrigatório
Email obrigatório e em formato válido
Email único
Cliente obrigatório para criação de pedido
Valores inválidos geram erros no backend

Frontend – React
O frontend consome exclusivamente a API para todas as operações.

Funcionalidades:

Listagem de clientes
Seleção de cliente
Visualização dos pedidos vinculados ao cliente selecionado
Criação de clientes e pedidos
Edição de clientes e pedidos via modal centralizado
Exclusão com confirmação
Toasts para feedback de sucesso e erro

Organização:

Componentes funcionais
Hooks (useState, useEffect, useMemo)
Separação por responsabilidade
Uso de shadcn/ui para modais, cards e feedbacks

Testes Unitários:

Os testes foram implementados com xUnit e cobrem a camada de serviços.
O que é testado:

Criação de cliente válida
Validação de email inválido
Criação de pedido com cliente existente
Falha ao criar pedido com cliente inexistente

Execução dos testes
Na raiz do projeto:
dotnet test

Como Executar o Projeto:
Backend:
Acesse a pasta da API:
cd api
Execute a aplicação:
dotnet run
A API ficará disponível em:
http://localhost:5074

Frontend:

Acesse a pasta do frontend:
cd web
Instale as dependências:
npm install
Inicie o servidor:
npm run dev
O frontend ficará disponível em:
http://localhost:5173

Decisões Técnicas:

Separação em camadas (Controllers, Services, Repositories) para facilitar manutenção e testes
DTOs para evitar exposição direta das entidades
Validações críticas feitas no backend, não apenas no frontend
Uso de modais para edição para melhorar a experiência do usuário
Confirmação explícita para ações destrutivas
Testes focados na regra de negócio, não em infraestrutura

Observações Finais

O projeto não possui autenticação por não ser requisito do desafio
O foco foi clareza, organização e boas práticas
O banco SQLite foi utilizado apenas para facilitar execução local
Todo o fluxo de CRUD é feito exclusivamente via frontend
