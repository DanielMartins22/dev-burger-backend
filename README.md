# Dev Burguer API

> **Status: em desenvolvimento.** Esta API ainda está sendo construída e pode sofrer alterações.

Este repositório contém a API back-end do Dev Burguer, projeto do DevClub. O front-end correspondente está no repositório [dev-burguer-frontend](https://github.com/DanielMartins22/dev-burguer-frontend) e faz parte do meu portfólio de desenvolvimento front-end, que estou preparando para buscar minha primeira oportunidade profissional. A API fornece autenticação, usuários, produtos, categorias, pedidos e arquivos de imagem.

## Tecnologias

- Node.js com JavaScript e módulos ES.
- Express para a API HTTP e CORS.
- Sequelize e PostgreSQL para usuários, produtos e categorias.
- Mongoose e MongoDB para pedidos.
- JSON Web Token (JWT) e bcrypt para autenticação e senhas.
- Yup para validação de dados.
- Multer para receber imagens, armazenadas localmente em `uploads/`.
- pnpm para dependências e Biome para análise e formatação.

Os arquivos enviados para `uploads/` são dados de runtime e não são versionados. Em uma instalação nova, envie as imagens pela API; em produção, use armazenamento persistente para evitar perder uploads ao reiniciar ou substituir a aplicação.

## Pré-requisitos

- Node.js e pnpm.
- PostgreSQL em execução e um banco de dados criado.
- MongoDB em execução no endereço configurado em `MONGO_URL`.

## Instalação e configuração

Na pasta do projeto, instale as dependências:

```powershell
pnpm install
```

Crie seu arquivo de configuração local a partir do exemplo:

```powershell
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
} else {
    Write-Output ".env já existe; mantendo a configuração local."
}
```

Edite `.env` com os valores da sua máquina. Os valores de `DB_PASS` e `JWT_SECRET` no exemplo são marcadores, não credenciais funcionais; substitua-os antes de iniciar. Não compartilhe nem envie o arquivo `.env`.

| Variável | Uso |
| --- | --- |
| `APP_PORT` | Porta HTTP da API. O front-end está configurado para `3001`. |
| `APP_URL` | URL base usada para montar os endereços de imagens retornados pela API. |
| `DB_DIALECT` | Dialeto usado pelo Sequelize; o projeto inclui o driver PostgreSQL (`postgres`). |
| `DB_HOST`, `DB_PORT` | Endereço e porta do PostgreSQL. |
| `DB_USER`, `DB_PASS`, `DB_NAME` | Usuário, senha e nome do banco PostgreSQL. |
| `MONGO_URL` | URI de conexão com MongoDB. O exemplo aponta para uma instância local sem autenticação. |
| `JWT_SECRET` | Chave local usada para assinar e verificar tokens. |
| `JWT_EXPIRES_IN` | Prazo de validade dos tokens. |

Em produção, mantenha a URI real do MongoDB e suas credenciais somente em variáveis de ambiente; não as coloque no README, no código nem no `.env.example`.

## Banco de dados

Com o PostgreSQL configurado e o banco criado, aplique as migrações:

```powershell
pnpm exec sequelize-cli db:migrate
```

Os pedidos são persistidos no MongoDB. A conexão usa a URI configurada em `MONGO_URL`.

## Execução

```powershell
pnpm dev
```

O servidor lê a porta de `APP_PORT`; configure `APP_PORT=3001` para usar o endereço esperado pelo front-end: `http://localhost:3001`.

## Rotas disponíveis

As rotas abaixo são montadas sem prefixo adicional. As rotas protegidas exigem um token JWT no cabeçalho `Authorization: Bearer <token>`; operações administrativas também exigem usuário administrador.

| Método | Rota | Acesso |
| --- | --- | --- |
| `POST` | `/users` | Público; cadastro |
| `POST` | `/sessions` | Público; login e emissão de token |
| `GET` | `/products` | Autenticado; lista produtos |
| `POST` | `/products` | Administrador; cria produto com arquivo `file` |
| `PUT` | `/products/:id` | Administrador; atualiza produto, opcionalmente com arquivo `file` |
| `GET` | `/categories` | Autenticado; lista categorias |
| `POST` | `/categories` | Administrador; cria categoria com arquivo `file` |
| `PUT` | `/categories/:id` | Administrador; atualiza categoria, opcionalmente com arquivo `file` |
| `POST` | `/orders` | Autenticado; cria pedido |
| `GET` | `/orders` | Autenticado; lista pedidos |
| `PUT` | `/orders/:id` | Administrador; atualiza o status do pedido |
| `GET` | `/product-file/:arquivo` | Público; serve arquivos de `uploads/` |
| `GET` | `/category-file/:arquivo` | Público; serve arquivos de `uploads/` |

## Integração com o front-end

O arquivo `.env.example` do front-end define `VITE_API_URL=http://localhost:3001`, e os caminhos de cadastro, login, produtos e categorias usados pelo front-end correspondem às rotas desta API.

Há uma diferença de autorização a considerar: a página pública de cardápio do front-end solicita `GET /products` e `GET /categories`, mas esta API aplica autenticação a ambas as rotas. Portanto, os caminhos e o endereço coincidem, mas essas chamadas não funcionam sem um token válido. O cadastro também responde `400` quando o e-mail já existe, enquanto o front-end atualmente trata `409` como esse caso.

## Verificações

O projeto disponibiliza estes scripts:

| Comando | Descrição |
| --- | --- |
| `pnpm lint` | Executa `biome check`. |
| `pnpm lint:fix` | Aplica correções do Biome. |
| `pnpm format` | Formata os arquivos com o Biome. |

Não há script `test` nem suíte de testes automatizados configurados no `package.json` neste momento.
