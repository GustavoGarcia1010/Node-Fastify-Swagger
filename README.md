# node-swagger

API REST desenvolvida com **Node.js**, **Fastify**, **TypeScript** e **Zod**, seguindo os padrões REST (recursos identificados por URL, verbos HTTP semânticos, códigos de status apropriados). A documentação da API é gerada automaticamente via **Swagger/OpenAPI**.

## Stack utilizada

- **Node.js** — runtime JavaScript
- **Fastify** — framework web
- **TypeScript** — tipagem estática
- **Zod** — validação de schemas e tipagem de requisições/respostas
- **@fastify/swagger** + **@fastify/swagger-ui** — documentação interativa da API
- **@fastify/cors** — controle de CORS
- **pnpm** — gerenciador de pacotes

## Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior
- [pnpm](https://pnpm.io) instalado (`npm install -g pnpm`, caso ainda não tenha)

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd node-swagger
pnpm install
```

## Rodando a aplicação

### Modo desenvolvimento

Sobe o servidor com recarregamento automático a cada alteração de arquivo:

```bash
pnpm dev
```

O servidor estará disponível em:

```
http://localhost:3333
```

### Documentação interativa (Swagger UI)

Com o servidor rodando, acesse:

```
http://localhost:3333/docs
```

Lá é possível visualizar todos os endpoints, seus schemas de entrada/saída e testar as requisições diretamente pelo navegador.

## Endpoints disponíveis

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar |
| `GET` | `/users` | Lista todos os usuários |
| `POST` | `/users` | Cria um novo usuário |
| `GET` | `/users/:id` | Busca um usuário pelo ID (UUID) |
| `PUT` | `/usuarios/:id` | Atualiza os dados de um usuário pelo ID (UUID) |
| `DELETE` | `/users/:id` | Remove um usuário pelo ID (UUID) |

> **Nota:** a rota de atualização está registrada como `/usuarios/:id` (em português), enquanto as demais usam `/users/:id` (em inglês). Vale padronizar para um único idioma de rota — ver observação na seção de padrões REST abaixo.

### Exemplo de requisição — criar usuário

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Silva", "email": "maria@exemplo.com"}'
```

Resposta (`201 Created`):

```json
{
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "name": "Maria Silva",
  "email": "maria@exemplo.com"
}
```

### Exemplo de requisição — atualizar usuário

```bash
curl -X PUT http://localhost:3333/usuarios/d290f1ee-6c54-4b01-90e6-d701748f0851 \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Souza", "email": "maria.souza@exemplo.com"}'
```

Resposta (`200 OK`):

```json
{
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "name": "Maria Souza",
  "email": "maria.souza@exemplo.com"
}
```

## Sobre os padrões REST adotados

Este projeto segue os princípios de uma API REST:

- **Recursos identificados por URL**: `/users` representa a coleção de usuários; `/users/:id` representa um usuário específico.
- **Verbos HTTP com significado semântico**: `GET` para leitura, `POST` para criação, `DELETE` para remoção — sem verbos na própria URL (nunca `/getUsers` ou `/deleteUser`).
- **Códigos de status apropriados**: `200` para sucesso em leitura, `201` para criação bem-sucedida, `204` para remoção sem conteúdo de retorno, `404` para recurso não encontrado.
- **Contrato de dados validado**: toda entrada (`body`, `params`) e saída (`response`) é validada por schemas Zod, garantindo que a API sempre responda no formato documentado.
- **Sem estado (stateless)**: cada requisição contém todas as informações necessárias para ser processada, sem depender de sessão no servidor.
- **Nomenclatura consistente de rotas** *(pendência)*: a rota de atualização (`/usuarios/:id`) está em português enquanto as demais (`/users/:id`) estão em inglês. O recomendado é escolher um único idioma para todos os recursos — o ajuste é trocar `/usuarios/:id` para `/users/:id` no `app.put(...)`.

> **Observação sobre o PUT**: a implementação atual aceita `name` e `email` no body e mantém o valor antigo caso um dos dois não seja enviado (`usuarioSelecionado.name || usuarioSelecionado.name`). Esse comportamento é, na prática, mais parecido com um `PATCH` (atualização parcial) do que com um `PUT` tradicional (que, pelos padrões REST, normalmente espera o recurso completo substituído). Se a intenção é permitir atualização parcial, considere renomear a rota para `PATCH /users/:id` e tornar os campos do `userUpdateSchema` opcionais com `.partial()`.

## Estrutura do projeto

```
src/
├── routes.ts   # Definição das rotas e schemas de validação
├── server.ts   # Configuração do Fastify, plugins e inicialização do servidor
└── types.ts    # Tipo compartilhado da instância do Fastify com o Zod Type Provider
```

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `pnpm dev` | Roda o servidor em modo desenvolvimento com watch |
| `pnpm install` | Instala todas as dependências do projeto |
