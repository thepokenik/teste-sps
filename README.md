# Teste Técnico SPS

Aplicação full-stack de gerenciamento de usuários com autenticação JWT, controle de acesso por tipo de usuário e CRUD completo.

---

## Tecnologias

| Camada    | Stack                                                         |
|-----------|---------------------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, React Router v6, Axios, Tailwind CSS, shadcn/ui, Sonner |
| Backend   | Node.js, Express, TypeScript, JSON Web Token, dotenv          |

---

## Mudanças e Melhorias

### Frontend

1. **Modernização da Stack: CRA → Vite**

   - Substituição do `create-react-app` pelo **Vite** para otimizar o tempo de inicialização do servidor de desenvolvimento e o processo de build.
   - Remoção de dependências do CRA (`react-scripts`, `web-vitals`, libs de teste).
   - Adição de `vite` e `@vitejs/plugin-react` como devDependencies.
   - `index.html` movido para a raiz do projeto com `<script type="module">` (padrão Vite).

2. **Migração para TypeScript**

   - Adição de `typescript`, `@types/react` e `@types/react-dom`.
   - `tsconfig.json` com modo strict, target ES2020 e transform `react-jsx`.
   - `vite-env.d.ts` para tipagem do `import.meta.env`.
   - Todos os arquivos `.jsx`/`.js` convertidos para `.tsx`/`.ts`.
   - `UserService` tipado com interfaces (`User`, `CreateUserData`, `UpdateUserData`) e generics do Axios.
   - Script de build configurado para rodar `tsc` antes do `vite build`.

3. **Variáveis de Ambiente**

   - Prefixo renomeado de `REACT_APP_` para `VITE_` (ex: `VITE_SERVER_URL`).
   - Acesso via `import.meta.env.VITE_*`.

4. **Autenticação e Contexto (`AuthContext`)**

   - `AuthContext` com estado global de `token` e `user`, persistidos no `localStorage`.
   - Hook `useAuth()` expõe `login`, `logout`, `isAuthenticated`, `user` e `token`.
   - `ProtectedRoute` redireciona para `/login` se o usuário não estiver autenticado.

5. **Instância Axios com Interceptors (`api.ts`)**

   - Instância centralizada com `baseURL` via variável de ambiente.
   - **Request interceptor**: anexa automaticamente o header `Authorization: Bearer <token>` em todas as requisições.
   - **Response interceptor**: ao receber `401`, limpa o `localStorage` e redireciona para `/login`, garantindo logout automático para tokens expirados ou inválidos.
   - `AuthService` e `UserService` utilizam essa instância, eliminando duplicação de configuração.

6. **Dashboard com CRUD Completo**

   - Listagem de todos os usuários em tabela.
   - Criação de usuário via dialog com campos: nome, e-mail, senha e tipo (Usuário / Administrador).
   - Edição de usuário via dialog pré-preenchido; campo de senha opcional (só atualiza se preenchido).
   - Exclusão de usuário com dialog de confirmação exibindo o nome do usuário.
   - Toasts de sucesso e erro em todas as operações, com mensagens vindas diretamente do backend.

7. **Controle de Acesso por Tipo (`isAdmin`)**

   - Botões de criar, editar e excluir desabilitados para usuários não-administradores.
   - Tabela de usuários ocultada para não-admins, com mensagem explicativa.
   - Verificação feita via `user?.type === "admin"` do `useAuth()`.

8. **Refatoração de Componentes**

   - `Dashboard` extraído em 4 componentes reutilizáveis em `pages/Dashboard/components/`:
     - `CreateUserDialog.tsx` — formulário de criação
     - `EditUserDialog.tsx` — formulário de edição com pré-preenchimento
     - `DeleteUserDialog.tsx` — confirmação de exclusão
     - `UsersTable.tsx` — tabela com ações
   - `Dashboard.tsx` reduzido a orquestrador de estado e handlers.

9. **Página 404 (NotFound)**

   - Rota curinga `{ path: "*" }` captura URLs inexistentes.
   - Página `NotFound` com link de retorno à home.

10. **Tela Home Melhorada**

    - Mensagem de boas-vindas personalizada com o nome do usuário logado.
    - Botões responsivos com contexto diferente para usuários autenticados e não autenticados.

---

### Backend

1. **Banco de Dados em Memória**

   - Array `users` em `src/database/db.ts` simulando persistência.
   - Interface `User` tipada: `{ id, name, email, type, password }`.
   - Usuário admin pré-cadastrado: `admin@spsgroup.com.br` / `1234`.

2. **Autenticação (Login)**

   - `POST /login` valida e-mail e senha contra o array de usuários.
   - Retorna token JWT (validade de 2h) assinado com `JWT_SECRET` + dados do usuário (sem a senha).
   - Credenciais inválidas retornam `401 Unauthorized`.

3. **Middleware de Proteção (`verifyToken`)**

   - Extrai o token do header `Authorization: Bearer <token>`.
   - Valida com `jwt.verify()`; retorna `401` se ausente, mal formatado ou expirado.
   - Injeta payload decodificado (`{ id, type }`) em `req.user` via augmentation do tipo `Express.Request`.

4. **CRUD de Usuários (Protegido)**

   Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`:

   | Método   | Rota         | Descrição                                               |
   |----------|--------------|---------------------------------------------------------|
   | `GET`    | `/users`     | Lista todos os usuários (sem expor senhas)              |
   | `POST`   | `/users`     | Cria usuário; retorna `400` se o e-mail já existe       |
   | `PUT`    | `/users/:id` | Atualiza dados do usuário pelo ID                       |
   | `DELETE` | `/users/:id` | Remove o usuário; retorna `204 No Content`              |

5. **Migração para TypeScript**

   - Todos os arquivos migrados de `.js` para `.ts`.
   - Tipagem completa em controllers, middlewares e rotas.
   - `tsconfig.json` com `strict: true`, `target: ES2020`, `outDir: ./dist`.
   - `tsx` como runner de desenvolvimento; `tsc` para build de produção.
   - Scripts: `dev` com `nodemon --exec tsx`, `build` com `tsc`, `start` com `node dist/index.js`.

---

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

### 1. Instalar dependências

Na raiz do projeto, instale as dependências do monorepo, do frontend e do backend:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Configurar variáveis de ambiente

**Backend** — crie o arquivo `server/.env`:

```env
PORT=3001
JWT_SECRET=sua_chave_secreta_aqui
```

**Frontend** — crie o arquivo `client/.env`:

```env
VITE_SERVER_URL=http://localhost:3001
```

### 3. Rodar o projeto

**Opção A — Ambos simultaneamente (recomendado):**

```bash
# Na raiz do projeto
npm start
```

**Opção B — Separadamente:**

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

### 4. Acessar

| Serviço   | URL                    |
|-----------|------------------------|
| Frontend  | http://localhost:5173  |
| Backend   | http://localhost:3001  |

### Credenciais padrão

| Campo | Valor                    |
|-------|--------------------------|
| Email | admin@spsgroup.com.br    |
| Senha | 1234                     |

---

## Scripts disponíveis

### Raiz

| Script          | Descrição                                   |
|-----------------|---------------------------------------------|
| `npm start`     | Inicia frontend e backend simultaneamente   |

### Frontend (`client/`)

| Script          | Descrição                                   |
|-----------------|---------------------------------------------|
| `npm run dev`   | Inicia o servidor de desenvolvimento Vite   |
| `npm run build` | Compila TypeScript e gera build de produção |

### Backend (`server/`)

| Script          | Descrição                                        |
|-----------------|--------------------------------------------------|
| `npm run dev`   | Inicia com nodemon + tsx (hot reload)            |
| `npm run build` | Compila TypeScript para `dist/`                  |
| `npm start`     | Executa o build compilado (`node dist/index.js`) |