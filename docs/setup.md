# Configuração e Instalação

[← Voltar para o Menu Principal](./README.md)

## Pré-requisitos

*   Node.js (v18+)
*   MySQL
*   NPM

## Instalação

1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```

## Variáveis de Ambiente (Requisito 2.2)

O sistema utiliza a biblioteca `envalid` para garantir que todas as variáveis necessárias estejam presentes antes de iniciar o servidor. O arquivo de configuração está em `src/utils/getEnv.ts`.

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/loja_virtual"
PORT=3333
NODE_ENV="development"
SECRET_KEY="sua_chave_secreta_para_sessao"
```

Caso alguma variável esteja faltando, o servidor **não iniciará** e exibirá um erro no console.

## Scripts Disponíveis (Requisito 2.8)

O `package.json` foi configurado com scripts para facilitar o desenvolvimento e manutenção:

*   **`npm run dev`**: Inicia o servidor em modo de desenvolvimento (com hot-reload).
*   **`npm run build`**: Compila o TypeScript para JavaScript na pasta `dist`.
*   **`npm start`**: Inicia o servidor de produção (a partir da pasta `dist`).
*   **`npm run typecheck`**: Verifica erros de tipagem no TypeScript.
*   **`npm run format`**: Formata todo o código usando **Prettier**.
*   **`npm test`**: Executa a suíte de testes automatizados (Jest).

## Banco de Dados

Para configurar o banco de dados com Prisma:

1.  Gere o cliente Prisma:
    ```bash
    npx prisma generate
    ```
2.  Execute as migrações para criar as tabelas:
    ```bash
    npx prisma migrate dev
    ```

---
[Próximo: Arquitetura do Sistema →](./architecture.md)
