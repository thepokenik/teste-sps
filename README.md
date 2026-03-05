## Mudanças Gerais

### Frontend

1. **Modernização da Stack: CRA → Vite**

   - Substituição do `create-react-app` pelo **Vite** para otimizar o tempo de inicialização do servidor de desenvolvimento e o processo de build.
   - Remoção de dependências do CRA (`react-scripts`, `web-vitals`, libs de teste).
   - Adição de `vite` e `@vitejs/plugin-react` como devDependencies.
   - Criação do arquivo `vite.config.js` com configuração do plugin React e porta 3000.

2. **Refatoração de Arquivos**

   - Conversão de arquivos `.js` para `.jsx`, garantindo suporte nativo ao HMR (Hot Module Replacement).
   - Movimentação do `index.html` de `public/` para a raiz do projeto, com adição da tag `<script type="module">` (padrão Vite).
   - Remoção de referências `%PUBLIC_URL%` (não utilizado pelo Vite).

3. **Atualização de Variáveis de Ambiente**

   - Prefixo renomeado de `REACT_APP_` para `VITE_` (ex: `VITE_SERVER_URL`).
   - Acesso via `import.meta.env.VITE_*` em vez de `process.env.REACT_APP_*`.

4. **Migração para TypeScript**

   - Adição de `typescript`, `@types/react` e `@types/react-dom` como devDependencies.
   - Criação do `tsconfig.json` com modo strict, target ES2020 e transform `react-jsx`.
   - Criação do `vite-env.d.ts` para tipagem do `import.meta.env`.
   - Conversão de todos os arquivos `.jsx` para `.tsx` e `.js` para `.ts`.
   - Tipagem do `UserService` com interfaces (`User`, `CreateUserData`, `UpdateUserData`) e generics do Axios (`AxiosResponse<T>`).
   - Tipagem do `UserEdit` com `LoaderFunctionArgs` e interface `User`.
   - Script de build atualizado para rodar `tsc` antes do `vite build`.

---

### Backend

1. **Configuração Inicial e Banco "Fake"**

   - Criação do arquivo `src/database/db.js` com um array `users` simulando um banco de dados.
   - Usuário admin padrão pré-cadastrado: `admin@spsgroup.com.br` / `1234`.
   - Carregamento do `dotenv` no início do `src/index.js` para leitura das variáveis `PORT` e `JWT_SECRET`.

2. **Autenticação (Login)**

   - Rota `POST /login` implementada em `src/routes/authRoutes.js` + `src/controllers/authController.js`.
   - Recebe `email` e `password`, valida contra o array de usuários.
   - Retorna um token JWT (validade de 2h) assinado com `JWT_SECRET`, junto dos dados do usuário (sem a senha).
   - Credenciais inválidas retornam `401 Unauthorized`.

3. **Middleware de Proteção (`verifyToken`)**

   - Criado em `src/middlewares/verifyToken.js`.
   - Extrai o token do cabeçalho `Authorization: Bearer <token>`.
   - Valida com `jwt.verify()`; retorna `401` se ausente, mal formatado ou expirado.
   - Injeta os dados decodificados em `req.user` para uso nas rotas protegidas.

4. **CRUD de Usuários (Protegido)**

   Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`:

   | Método   | Rota            | Descrição                                                    |
   |----------|-----------------|--------------------------------------------------------------|
   | `GET`    | `/users`        | Lista todos os usuários (sem expor senhas)                   |
   | `POST`   | `/users`        | Cria usuário; bloqueia com `400` se o e-mail já existe       |
   | `PUT`    | `/users/:id`    | Atualiza dados do usuário pelo ID                            |
   | `DELETE` | `/users/:id`    | Remove o usuário do array; retorna `204 No Content`          |