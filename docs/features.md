# Funcionalidades e Regras de Negócio

[← Voltar para o Menu Principal](./README.md)

## Gerenciamento de Produtos (Requisito 2.3)

O recurso de Produtos (`/api/products`) implementa um CRUD completo:
*   **Listar**: Público, com paginação.
*   **Criar/Atualizar/Deletar**: Restrito a administradores.

### Validação
Todas as operações de escrita (Create/Update) são validadas utilizando **Joi** através do middleware `validate.ts`. Isso garante que dados inválidos (ex: preço negativo, nome vazio) nem cheguem à camada de serviço.

## Sistema de Compras

O fluxo de compras segue regras estritas:
1.  **Criação**: Cliente adiciona itens. O sistema valida estoque, calcula totais e decrementa o estoque dos produtos.
2.  **Status**: O fluxo de status é controlado: `PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED`.
3.  **Cancelamento**:
    *   Cliente pode cancelar apenas se o status for `PENDING` ou `PROCESSING`.
    *   Ao cancelar, o estoque dos produtos é devolvido automaticamente.
4.  **Relatórios**: Admin tem acesso a relatórios de vendas e receita.

## Middleware de Idioma (Requisito 2.5)

A aplicação suporta internacionalização básica via Cookies.

*   **Middleware `setLangCookie`**: Intercepta todas as requisições. Se o cookie `lang` não existir, cria-o com o valor padrão `pt-BR`.
*   **Rota `/language/change`**: Permite alterar o idioma via query param (ex: `?lang=en-US`). O cookie é atualizado e persistido por 1 ano.

---
[Voltar ao Início](./README.md)
