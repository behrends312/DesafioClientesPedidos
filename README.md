# Desafio Técnico – API REST + Frontend em React

Este repositório contém a implementação de um desafio técnico cujo objetivo é criar uma API REST em .NET para gerenciamento de clientes e pedidos, juntamente com um frontend em React responsável por consumir e operar essa API.

O foco do projeto é demonstrar organização de código, boas práticas, modelagem simples de dados, integração frontend/backend e testes unitários básicos.

## Visão geral

O sistema permite:

- Cadastro, edição, listagem e exclusão de clientes
- Cadastro, edição, listagem e exclusão de pedidos
- Associação de pedidos a clientes
- Consulta de clientes com seus respectivos pedidos (join)
- Consumo completo da API pelo frontend
- Feedback visual de ações (sucesso e erro)
- Confirmação de ações destrutivas
- Testes unitários na camada de serviços

## Tecnologias utilizadas

### Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQLite (para desenvolvimento)
- xUnit (testes unitários)

### Frontend
- React + Vite
- JavaScript
- Axios
- Tailwind CSS
- shadcn/ui

## Estrutura do projeto

DesafioClientesPedidos/
├─ Api/
│ ├─ Controllers/
│ ├─ Services/
│ ├─ Repositories/
│ ├─ DTOs/
│ ├─ Entities/
│ └─ Data/
├─ Api.Tests/
│ ├─ Infrastructure/
│ └─ Services/
└─ web/
└─ src/
├─ components/
├─ pages/
└─ api.js  

## Backend – API

Base URL:
- `http://localhost:5074`

### Endpoints principais

#### Clientes
- `GET /api/v1/clients`
- `GET /api/v1/clients/{id}`
- `POST /api/v1/clients`
- `PUT /api/v1/clients/{id}`
- `DELETE /api/v1/clients/{id}`
- `GET /api/v1/clients/with-orders`

#### Pedidos
- `GET /api/v1/orders`
- `GET /api/v1/orders/{id}`
- `POST /api/v1/orders`
- `PUT /api/v1/orders/{id}`
- `DELETE /api/v1/orders/{id}`

### Validações implementadas
- Nome do cliente obrigatório
- Email obrigatório e em formato válido
- Email único
- Cliente obrigatório para criação de pedido

## Frontend – React

URL:
- `http://localhost:5173`

O frontend realiza todas as operações via API, incluindo criação, edição e exclusão.

Funcionalidades implementadas:
- Listagem de clientes
- Seleção de cliente
- Visualização de pedidos do cliente selecionado
- Criação de cliente e pedido
- Edição via modal centralizado
- Exclusão com confirmação
- Toasts para feedback de ações

## Testes unitários

Os testes cobrem a camada de serviços.

Execução na raiz do projeto:

```bash
dotnet test

Como executar
Pré-requisitos

.NET SDK 8

Node.js (recomendado LTS)

npm

Backend
cd api
dotnet ef database update
dotnet run


API disponível em:

http://localhost:5074

Frontend
cd web
npm install
npm run dev


Frontend disponível em:

http://localhost:5173

Decisões técnicas

Separação em camadas (Controllers / Services / Repositories) para facilitar manutenção e testes
Uso de DTOs/ViewModels para não expor entidades diretamente
Validações críticas no backend, não apenas no frontend
Edição via modal e confirmação para exclusão para melhorar a experiência e reduzir erros
Testes focados em regras de negócio (services)
