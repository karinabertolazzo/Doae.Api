# Doaê
https://doaebr.netlify.app/

Plataforma para doação e reutilização de itens usados, desenvolvida como atividade do projeto Reconecta. O repositório reúne a **API (back-end)** e a **interface web (front-end)**.

## ODS escolhido

**ODS 11 – Cidades e Comunidades Sustentáveis**

## Problema

Muitas pessoas têm roupas, móveis, livros e eletrodomésticos parados em casa que ainda poderiam ser usados por outras pessoas. Como não sabem onde ou para quem doar, esses itens acabam sendo descartados sem necessidade, muitas vezes em calçadas, esquinas e terrenos, formando entulhos que prejudicam a limpeza urbana, o meio ambiente e a qualidade de vida na cidade.

## Solução

O Doaê é uma plataforma em que qualquer pessoa cadastra itens que deseja doar, e outras pessoas encontram esses itens, filtram por categoria ou cidade e solicitam a retirada. O objetivo é incentivar a reutilização e contribuir para reduzir o descarte irregular de objetos em vias públicas, alinhado à meta 11.6 do ODS 11 (redução do impacto ambiental das cidades, com atenção à gestão de resíduos).

## Estrutura do repositório

```
Doae.Api/                  (repositório)
├── Doae.Api/              back-end: API em C# (.NET 8)
│   ├── Controllers/
│   ├── Models/
│   ├── Dtos/
│   ├── Data/
│   └── Migrations/
└── Doae.Web/              front-end: React (Vite)
    └── src/
        ├── components/    Menu, Aviso, ItemCard, SolicitacaoCard, SolicitarForm
        ├── pages/         ItensPage, ItemDetalhePage, DoarPage, SolicitacoesPage, UsuariosPage
        └── services/      api.js (comunicação com a API)
```

## Tecnologias

**Back-end**
- C# e ASP.NET Core Web API (.NET 8)
- Entity Framework Core 8
- SQLite
- Swagger (Swashbuckle)

**Front-end**
- React com Vite (JavaScript)
- React Router
- `fetch` nativo para consumir a API

## Como executar

Pré-requisitos: [.NET SDK 8](https://dotnet.microsoft.com/download) e [Node.js](https://nodejs.org) (versão LTS).

```bash
git clone https://github.com/karinabertolazzo/Doae.Api.git
cd Doae.Api
```

São dois terminais, um para a API e outro para o front. A API precisa estar rodando para o front exibir dados.

### 1. API (back-end)

```bash
cd Doae.Api
dotnet tool install --global dotnet-ef --version 8.0.11
dotnet ef database update
dotnet run
```

O comando `dotnet ef database update` cria o banco `doae.db` (SQLite) já com as 5 categorias iniciais. A documentação Swagger fica em `http://localhost:5053/swagger` (a porta pode variar, confira no terminal).

### 2. Front-end

```bash
cd Doae.Web
npm install
npm run dev
```

Abra `http://localhost:5173`. O front espera a API em `http://localhost:5053/api`. Se a sua porta for outra, crie o arquivo `Doae.Web/.env.local` com:

```
VITE_API_URL=http://localhost:SUA_PORTA/api
```

## Front-end

### Telas

| Tela | Rota | O que faz |
|---|---|---|
| Itens | `/` | Lista itens com filtros (busca, categoria, cidade, status); permite editar, excluir e abrir o detalhe |
| Detalhe do item | `/itens/:id` | Dados completos do item, destinatário da doação (quando doado) e solicitações com aceitar, recusar e cancelar |
| Doar um item | `/doar` | Formulário para cadastrar um item para doação |
| Solicitações | `/solicitacoes` | Formulário para solicitar um item; lista com filtro por status e ações de aceitar, recusar e cancelar |
| Usuários | `/usuarios` | Cadastro, listagem, edição e exclusão de usuários |

### Integração com a API

Todas as chamadas HTTP ficam em `src/services/api.js`, agrupadas por recurso. As telas nunca escrevem URL.

| Operação | Método | Onde é usada |
|---|---|---|
| Listar itens, categorias, usuários e solicitações | GET | Várias telas |
| Buscar um item pelo id | GET | Detalhe do item |
| Cadastrar item, usuário e solicitação | POST | Doar um item, Usuários, Solicitações |
| Aceitar, recusar e cancelar solicitação | PATCH | Solicitações, Detalhe do item |
| Editar item e usuário | PUT | Itens, Usuários |
| Excluir item e usuário | DELETE | Itens, Usuários |

Erros da API (400, 404, 409) são traduzidos em mensagens exibidas no componente `Aviso`, assim como as mensagens de sucesso.

## API

### Endpoints

#### Categorias

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/categorias` | Lista as categorias |
| GET | `/api/categorias/{id}` | Busca uma categoria |

#### Usuários

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/usuarios` | Lista os usuários |
| GET | `/api/usuarios/{id}` | Busca um usuário |
| POST | `/api/usuarios` | Cadastra um usuário |
| PUT | `/api/usuarios/{id}` | Atualiza um usuário |
| DELETE | `/api/usuarios/{id}` | Remove um usuário sem vínculos |

#### Itens

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/itens` | Lista itens (filtros: `categoriaId`, `cidade`, `status`, `busca`) |
| GET | `/api/itens/{id}` | Busca um item |
| POST | `/api/itens` | Cadastra um item para doação |
| PUT | `/api/itens/{id}` | Atualiza um item disponível |
| DELETE | `/api/itens/{id}` | Remove um item sem solicitações |

#### Solicitações

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/solicitacoes` | Lista solicitações (filtros: `itemId`, `solicitanteId`, `status`) |
| GET | `/api/solicitacoes/{id}` | Busca uma solicitação |
| POST | `/api/solicitacoes` | Solicita um item disponível |
| PATCH | `/api/solicitacoes/{id}/aceitar` | Aceita a solicitação |
| PATCH | `/api/solicitacoes/{id}/recusar` | Recusa a solicitação |
| PATCH | `/api/solicitacoes/{id}/cancelar` | Cancela a solicitação |

### Regras de negócio

- Todo item nasce como `Disponivel` e passa para `Doado` quando uma solicitação é aceita.
- Só é possível solicitar itens disponíveis.
- O dono do item não pode solicitar o próprio item.
- Um usuário não pode ter duas solicitações pendentes para o mesmo item.
- Ao aceitar uma solicitação, as outras pendentes do mesmo item são recusadas automaticamente.
- Recusar, cancelar e aceitar só funcionam em solicitações pendentes.
- Não é possível remover usuário com itens ou solicitações, nem item com solicitações.
- E-mails são únicos e salvos em minúsculas.

### Códigos HTTP

`200` OK, `201` criado, `204` removido, `400` dados inválidos, `404` não encontrado, `409` conflito com regra de negócio.

### Modelo de dados

- **Usuario** tem vários **Itens** e faz várias **Solicitações**.
- **Categoria** tem vários **Itens**.
- **Item** recebe várias **Solicitações**.

## Testes realizados

A API foi testada manualmente pelo Swagger, incluindo os cenários de erro:

- Categorias: listagem, busca por id e `404` para id inexistente.
- Usuários: cadastro (`201`), e-mail duplicado (`409`), dados inválidos (`400`), atualização, listagem e `404`.
- Itens: cadastro (`201`), usuário inexistente (`400`), atualização, filtros por categoria, busca por texto e status, e `404`.
- Solicitações: cadastro (`201`), solicitação duplicada (`409`), dono solicitando o próprio item (`400`), aceite com recusa automática das demais pendentes, item passando para `Doado`, solicitar item já doado (`409`) e aceitar novamente (`409`).

O front-end foi testado manualmente no navegador com a API rodando: listagem e filtros de itens, cadastro de item e de usuário, solicitação de item (incluindo o erro do dono solicitando o próprio item), aceite de solicitação, detalhe do item com o destinatário da doação e mensagens de erro vindas da API.

## Melhorias futuras

- Testes automatizados com xUnit (API) e Vitest (front).
- Autenticação e autorização (login com JWT), para que apenas o dono do item possa aceitar ou recusar solicitações e para que o contato do destinatário da doação só apareça ao doador autenticado (hoje não há login).
- Cadastro de usuário com Estado (lista de seleção), CEP e CPF (com validação e proteção dos dados, conforme a LGPD).
- Preenchimento automático de cidade e estado a partir do CEP.
- Imagens dos itens.
- Favoritos e avaliações.
- Busca por localização e mapa de itens disponíveis.

## Autora

Karina da Mota Santana
