# Autenticação e Sessão

[← Voltar para o Menu Principal](./README.md)

## Criação de Contas (Requisito 2.6)

O sistema permite o cadastro de novos usuários através de rotas específicas:
*   `POST /api/users/register-client`: Para usuários comuns (público).
*   `POST /api/users/register`: Para administradores (requer autenticação admin).

### Segurança
*   **Criptografia**: As senhas **nunca** são salvas em texto puro. Utilizamos a biblioteca `bcryptjs` para gerar um hash seguro antes de persistir no banco.
*   **Login**: No momento da autenticação, o hash da senha fornecida é comparado com o hash armazenado no banco.

## Gerenciamento de Sessões (Requisito 2.7)

O controle de estado é feito via **Sessões no Servidor** utilizando o middleware `express-session`.

### Funcionamento
1.  Ao fazer login com sucesso, uma sessão é criada no servidor.
2.  Um cookie `connect.sid` é enviado ao navegador do usuário.
3.  A sessão armazena os seguintes dados críticos:
    *   `userId`: ID do usuário logado.
    *   `userType`: Tipo do usuário (ex: 'admin', 'client').

### Middlewares de Proteção
Para proteger as rotas, utilizamos middlewares que verificam a existência e o conteúdo da sessão:
*   `requireLogin`: Garante que `req.session.userId` existe.
*   `requireAdmin`: Garante que `req.session.userType` é igual a 'admin'.

---
[Próximo: Funcionalidades e Regras de Negócio →](./features.md)
