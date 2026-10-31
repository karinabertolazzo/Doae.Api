
# 🌱 Doaê

### Doe o que não usa. Transforme vidas.

🔗 **[Acessar o Doaê](https://doaebr.netlify.app/)**

Plataforma web de doação e reutilização de itens, desenvolvida como parte do projeto **Reconecta**, com foco na sustentabilidade, na solidariedade e na redução do descarte irregular de objetos.

O repositório reúne o back-end desenvolvido em C#/.NET e o front-end desenvolvido em React.

> **Status do projeto:** front-end publicado na Netlify. A API e o banco SQLite ainda são executados localmente. Por isso, cadastro, login, listagem dinâmica de itens e solicitações precisam da API em execução para funcionar.

---

## 🌍 ODS 11 — Cidades e Comunidades Sustentáveis

O Doaê está alinhado ao Objetivo de Desenvolvimento Sustentável 11 da ONU, especialmente à **meta 11.6**, relacionada à redução do impacto ambiental das cidades, incluindo a gestão de resíduos.

### Problema

Muitas pessoas possuem roupas, móveis, livros e eletrodomésticos em bom estado que não utilizam mais.

Por falta de informação sobre onde ou para quem doar, esses objetos podem acabar sendo descartados de maneira inadequada, contribuindo para o acúmulo de resíduos e prejudicando a qualidade de vida urbana.

### Solução

O Doaê conecta pessoas que desejam doar objetos a pessoas interessadas em reutilizá-los.

Na plataforma, o usuário pode cadastrar itens, encontrar doações disponíveis, enviar solicitações e combinar a retirada após a aprovação do doador.

A proposta incentiva a economia circular, a reutilização de recursos e a solidariedade entre pessoas da comunidade.

---

## ✨ Funcionalidades

### Autenticação e usuários

- Cadastro de usuários com validação de dados.
- Nome, e-mail, telefone, cidade e senha obrigatórios.
- Validação do formato de e-mail e telefone.
- Proteção contra cadastros com dados inválidos.
- Verificação de e-mails duplicados.
- Armazenamento protegido de senhas por hash.
- Login com autenticação JWT.
- Recuperação dos dados do usuário autenticado.
- Controle de sessão no front-end.
- Proteção de operações que exigem autenticação.
- Atualização e exclusão da própria conta por endpoints autorizados.

### Itens para doação

- Cadastro de itens.
- Listagem de itens disponíveis, reservados e doados.
- Busca por título ou texto.
- Filtros por categoria, cidade e status.
- Visualização dos detalhes de cada item.
- Identificação do doador.
- Acompanhamento dos próprios itens.
- Edição e exclusão de itens conforme as regras da API.

### Solicitações de doação

- Solicitação de itens disponíveis.
- Bloqueio de solicitação do próprio item.
- Prevenção de solicitações pendentes duplicadas.
- Aceitação e recusa pelo doador.
- Cancelamento pelo solicitante.
- Reserva automática do item após a aceitação.
- Recusa automática de outras solicitações pendentes do mesmo item.
- Consulta dos contatos para combinar a entrega ou retirada.
- Confirmação da entrega pelo doador.
- Atualização dos status do item e da solicitação.
- Histórico de pedidos realizados e recebidos.

### Interface web

- Página inicial com apresentação da plataforma.
- Categorias ilustradas.
- Página Sobre o Doaê.
- Exploração de itens com filtros.
- Tela de detalhes dos itens.
- Formulário de cadastro de doações.
- Login e cadastro de usuários.
- Página Minha conta com pedidos recebidos e realizados.
- Indicadores visuais dos status.
- Navbar responsiva com menu hambúrguer no celular.
- Footer com navegação e referência à ODS 11.
- Identidade visual verde-escura inspirada em sustentabilidade.

---

## 🛠️ Tecnologias utilizadas

### Back-end

- C#
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core 8
- SQLite
- JWT (JSON Web Token)
- Data Annotations para validação
- Swagger / Swashbuckle

### Front-end

- React
- JavaScript
- Vite
- React Router
- CSS responsivo
- Fetch API
- Context API para gerenciamento da sessão

### Ferramentas

- Visual Studio / Visual Studio Code
- Git e GitHub
- GitHub Desktop
- Swagger UI
- Netlify (hospedagem do front-end)

---

## 📁 Estrutura do projeto

```text
Doae.Api/
├── Doae.Api/
│   ├── Controllers/
│   ├── Models/
│   ├── Dtos/
│   ├── Data/
│   ├── Migrations/
│   └── Program.cs
│
├── Doae.Web/
│   ├── public/
│   │   └── imagens/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Menu.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── SolicitacaoCard.jsx
│   │   │   └── Aviso.jsx
│   │   │
│   │   ├── contexts/
│   │   │   └── SessaoContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── SobrePage.jsx
│   │   │   ├── ItensPage.jsx
│   │   │   ├── ItemDetalhePage.jsx
│   │   │   ├── DoarPage.jsx
│   │   │   ├── MinhaContaPage.jsx
│   │   │   └── EntrarPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

## 🚀 Como executar localmente

### Pré-requisitos

- .NET SDK 8
- Node.js (versão LTS)
- npm
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/karinabertolazzo/Doae.Api.git
cd Doae.Api
```

### 2. Executar o back-end

Em um terminal, a partir da raiz do repositório:

```bash
cd Doae.Api
dotnet restore
dotnet ef database update
dotnet run
```

Caso o comando `dotnet ef` não esteja disponível, instale a ferramenta compatível com o EF Core 8:

```bash
dotnet tool install --global dotnet-ef --version 8.0.11
```

O Entity Framework Core aplica as migrations e prepara o banco SQLite.

A API utiliza as configurações do projeto para conexão com o banco e autenticação JWT. Configure os valores necessários no ambiente local e não publique chaves secretas no GitHub.

A documentação Swagger pode ser acessada em:

**http://localhost:5053/swagger**

A porta poderá variar conforme a configuração local.

### 3. Executar o front-end

Abra outro terminal, a partir da raiz do repositório:

```bash
cd Doae.Web
npm install
npm run dev
```

Acesse:

**http://localhost:5173**

Por padrão, o front-end tenta conectar à API em:

```text
http://localhost:5053/api
```

Se sua API utilizar outra porta, crie um arquivo `.env.local` dentro de `Doae.Web` com:

```env
VITE_API_URL=http://localhost:SUA_PORTA/api
```

O front-end precisa da API em execução para realizar autenticação, consultar itens e processar solicitações.

---

## 🖥️ Páginas do front-end

| Página | Rota | Descrição |
|---|---|---|
| Início | `/` | Apresentação, categorias e itens em destaque |
| Sobre | `/sobre` | Objetivo e proposta do Doaê |
| Explorar itens | `/itens` | Listagem com filtros e pesquisa |
| Detalhes do item | `/itens/:id` | Informações e solicitação do item |
| Quero doar | `/doar` | Cadastro de novos itens |
| Minha conta | `/minha-conta` | Pedidos recebidos, realizados e meus itens |
| Entrar / Criar conta | `/entrar` | Autenticação e cadastro de usuários |

---

## 🔌 API — Principais endpoints

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Autentica o usuário e retorna JWT |
| GET | `/api/auth/me` | Retorna os dados do usuário autenticado |

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/usuarios` | Lista usuários |
| GET | `/api/usuarios/{id}` | Busca usuário por ID |
| POST | `/api/usuarios` | Cadastra usuário |
| PUT | `/api/usuarios/{id}` | Atualiza usuário conforme autorização |
| DELETE | `/api/usuarios/{id}` | Exclui usuário conforme autorização e regras de negócio |

### Categorias

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/categorias` | Lista categorias |
| GET | `/api/categorias/{id}` | Busca categoria por ID |

### Itens

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/itens` | Lista itens com filtros |
| GET | `/api/itens/{id}` | Busca item por ID |
| POST | `/api/itens` | Cadastra item |
| PUT | `/api/itens/{id}` | Atualiza item |
| DELETE | `/api/itens/{id}` | Remove item conforme as regras |

### Solicitações

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/solicitacoes` | Lista solicitações |
| POST | `/api/solicitacoes` | Cria solicitação |
| PATCH | `/api/solicitacoes/{id}/aceitar` | Aceita pedido |
| PATCH | `/api/solicitacoes/{id}/recusar` | Recusa pedido |
| PATCH | `/api/solicitacoes/{id}/cancelar` | Cancela pedido |
| GET | `/api/solicitacoes/{id}/contatos` | Obtém contatos quando autorizado |
| PATCH | `/api/solicitacoes/{id}/concluir` | Confirma conclusão da doação |

As requisições do front-end são centralizadas em:

`Doae.Web/src/services/api.js`

---

## 🔄 Fluxo de uma doação

O Doaê utiliza estados para acompanhar o ciclo de vida dos itens e das solicitações.

### Status dos itens

| Status | Significado |
|---|---|
| `Disponivel` | Item disponível para solicitação |
| `Reservado` | Existe uma solicitação aceita |
| `Doado` | A entrega foi confirmada |

### Status das solicitações

| Status | Significado |
|---|---|
| `Pendente` | Aguardando decisão do doador |
| `Aceita` | Pedido aprovado |
| `Recusada` | Pedido recusado |
| `Cancelada` | Pedido cancelado |
| `Concluida` | Doação entregue e finalizada |

### Exemplo de fluxo

```text
Doador cadastra um item
          |
          v
    Item disponível
          |
          v
Interessado solicita
          |
          v
 Solicitação pendente
          |
          v
  Doador aceita pedido
          |
          v
     Item reservado
          |
          v
Contatos são disponibilizados
aos participantes autorizados
          |
          v
   Entrega combinada
          |
          v
Doador confirma a entrega
          |
          v
      Item doado
          |
          v
 Solicitação concluída
```

A aceitação de uma solicitação não conclui imediatamente a doação. O item permanece reservado até a confirmação da entrega.

---

## 🔐 Autenticação e regras de acesso

O sistema utiliza JWT para identificar o usuário autenticado.

As senhas não são armazenadas em texto puro, e operações protegidas exigem autenticação.

O fluxo de solicitações contempla verificações de autorização, incluindo:

- O solicitante não pode pedir seu próprio item.
- O doador controla a aceitação e a recusa dos pedidos recebidos.
- O solicitante pode cancelar solicitações conforme as regras.
- A conclusão da entrega é realizada pelo doador.
- Os dados de contato de outra pessoa só são retornados pelo endpoint específico quando a solicitação está aceita e o usuário é participante autorizado.

A aplicação foi desenvolvida para fins acadêmicos e de portfólio. Antes de uma disponibilização pública completa, são necessárias verificações adicionais de segurança, privacidade e infraestrutura.

---

## ✅ Testes realizados

Foram realizados testes manuais no Swagger e no navegador.

### API

- Cadastro de usuários com dados válidos e inválidos.
- Rejeição de nome numérico e telefone inválido.
- Verificação de campos obrigatórios.
- Rejeição de e-mail duplicado.
- Login e autenticação JWT.
- Consulta de dados do usuário autenticado.
- Cadastro e consulta de itens.
- Filtros por categoria, cidade e status.
- Criação e cancelamento de solicitações.
- Aceitação e recusa de pedidos.
- Reserva do item após a aceitação.
- Recusa automática de outras solicitações pendentes.
- Consulta autorizada dos contatos.
- Confirmação de entrega e conclusão da doação.

### Front-end

- Navegação entre páginas.
- Login e cadastro.
- Exibição das informações da conta.
- Busca e filtros de itens.
- Solicitação de doações.
- Indicador de item já solicitado.
- Acompanhamento de pedidos realizados e recebidos.
- Exibição dos detalhes das solicitações.
- Ações de aceitar, recusar e cancelar.
- Exibição dos contatos após a aceitação.
- Confirmação da entrega.
- Navbar responsiva com menu hambúrguer.
- Navegação pelo footer.
- Layout adaptado para dispositivos móveis.

Os testes realizados até o momento são manuais. Testes automatizados permanecem como melhoria futura.

---

## 🌐 Publicação

### Front-end

O front-end está publicado na Netlify:

**https://doaebr.netlify.app/**

A versão publicada permite visualizar a interface, as páginas institucionais e os elementos visuais estáticos, incluindo as categorias ilustradas.

### Back-end

A API ASP.NET Core ainda não está hospedada publicamente.

Atualmente, a API e o banco SQLite são executados no ambiente local de desenvolvimento.

Portanto, funcionalidades dinâmicas como cadastro, autenticação, consulta de doações e solicitações ainda não estão disponíveis para visitantes do site público.

---

## 📌 Melhorias futuras

- Hospedagem da API e do banco de dados.
- Testes automatizados com xUnit e Vitest.
- Melhorias adicionais nas regras de autorização.
- Confirmação de e-mail e recuperação de senha.
- Upload de fotografias reais dos itens.
- Cadastro de CEP e localização mais detalhada.
- Integração com serviço de consulta de endereço.
- Favoritos e avaliações.
- Busca por proximidade e mapa de doações.
- Melhorias contínuas de acessibilidade e experiência mobile.

---

## 👩‍💻 Autora

**Karina da Mota Santana**

Projeto desenvolvido como atividade do **Reconecta**, utilizando desenvolvimento web full stack para propor uma solução tecnológica relacionada à sustentabilidade urbana e à reutilização de recursos.

---

**Doaê — Doe. Compartilhe. Transforme. 💚**
