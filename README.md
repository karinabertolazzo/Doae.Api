# Doaê API

API para doação e reutilização de itens usados, desenvolvida como atividade do projeto Reconecta.

## ODS escolhido

**ODS 11 – Cidades e Comunidades Sustentáveis**

## Problema

Muitas pessoas têm roupas, móveis, livros e eletrodomésticos parados em casa que ainda poderiam ser usados por outras pessoas. Como não sabem onde ou para quem doar, esses itens acabam sendo descartados sem necessidade, muitas vezes em calçadas, esquinas e terrenos, formando entulhos que prejudicam a limpeza urbana, o meio ambiente e a qualidade de vida na cidade.

## Solução

O Doaê é uma plataforma em que qualquer pessoa cadastra itens que deseja doar, e outras pessoas encontram esses itens, filtram por categoria ou cidade e solicitam a retirada. O objetivo é incentivar a reutilização e contribuir para reduzir o descarte irregular de objetos em vias públicas, alinhado à meta 11.6 do ODS 11 (redução do impacto ambiental das cidades, com atenção à gestão de resíduos).

## Tecnologias

- C# e ASP.NET Core Web API (.NET 8)
- Entity Framework Core 8
- SQLite
- Swagger (Swashbuckle)

## Como executar

Pré-requisito: [.NET SDK 8](https://dotnet.microsoft.com/download).

```bash
git clone https://github.com/karinabertolazzo/Doae.Api.git
cd Doae.Api/Doae.Api
dotnet tool install --global dotnet-ef --version 8.0.11
dotnet ef database update
dotnet run
```

O comando `dotnet ef database update` cria o banco `doae.db` (SQLite) já com as 5 categorias iniciais.

Com a API rodando, a documentação Swagger fica em `http://localhost:5053/swagger` (a porta pode variar, confira no terminal).

## Endpoints

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/categorias` | Lista as categorias |
| GET | `/api/categorias/{id}` | Busca uma categoria |

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/usuarios` | Lista os usuários |
| GET | `/api/usuarios/{id}` | Busca um usuário |
| POST | `/api/usuarios` | Cadastra um usuário |
| PUT | `/api/usuarios/{id}` | Atualiza um usuário |
| DELETE | `/api/usuarios/{id}` | Remove um usuário sem vínculos |

### Itens

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/itens` | Lista itens (filtros: `categoriaId`, `cidade`, `status`, `busca`) |
| GET | `/api/itens/{id}` | Busca um item |
| POST | `/api/itens` | Cadastra um item para doação |
| PUT | `/api/itens/{id}` | Atualiza um item disponível |
| DELETE | `/api/itens/{id}` | Remove um item sem solicitações |

### Solicitações

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/solicitacoes` | Lista solicitações (filtros: `itemId`, `solicitanteId`, `status`) |
| GET | `/api/solicitacoes/{id}` | Busca uma solicitação |
| POST | `/api/solicitacoes` | Solicita um item disponível |
| PATCH | `/api/solicitacoes/{id}/aceitar` | Aceita a solicitação |
| PATCH | `/api/solicitacoes/{id}/recusar` | Recusa a solicitação |
| PATCH | `/api/solicitacoes/{id}/cancelar` | Cancela a solicitação |

## Regras de negócio

- Todo item nasce como `Disponivel` e passa para `Doado` quando uma solicitação é aceita.
- Só é possível solicitar itens disponíveis.
- O dono do item não pode solicitar o próprio item.
- Um usuário não pode ter duas solicitações pendentes para o mesmo item.
- Ao aceitar uma solicitação, as outras pendentes do mesmo item são recusadas automaticamente.
- Recusar, cancelar e aceitar só funcionam em solicitações pendentes.
- Não é possível remover usuário com itens ou solicitações, nem item com solicitações.
- E-mails são únicos e salvos em minúsculas.

## Códigos HTTP

`200` OK, `201` criado, `204` removido, `400` dados inválidos, `404` não encontrado, `409` conflito com regra de negócio.

## Modelo de dados

- **Usuario** tem vários **Itens** e faz várias **Solicitações**.
- **Categoria** tem vários **Itens**.
- **Item** recebe várias **Solicitações**.

## Testes realizados

Os endpoints foram testados manualmente pelo Swagger, incluindo os cenários de erro:

- Categorias: listagem, busca por id e `404` para id inexistente.
- Usuários: cadastro (`201`), e-mail duplicado (`409`), dados inválidos (`400`), atualização, listagem e `404`.
- Itens: cadastro (`201`), usuário inexistente (`400`), atualização, filtros por categoria, busca por texto e status, e `404`.
- Solicitações: cadastro (`201`), solicitação duplicada (`409`), dono solicitando o próprio item (`400`), aceite com recusa automática das demais pendentes, item passando para `Doado`, solicitar item já doado (`409`) e aceitar novamente (`409`).

## Melhorias futuras

- Testes automatizados com xUnit (testes de unidade das regras de negócio e testes de integração dos endpoints).
- Cadastro de usuário com Estado (lista de seleção), CEP e CPF (com validação e proteção dos dados, conforme a LGPD).
- Preenchimento automático de cidade e estado a partir do CEP.
- Autenticação e autorização (login com JWT), para que apenas o dono do item possa aceitar ou recusar solicitações.
- Imagens dos itens.
- Favoritos e avaliações.
- Busca por localização e mapa de itens disponíveis.
- Frontend.

## Autora

Karina da Mota Santana