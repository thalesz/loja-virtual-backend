# Loja Virtual API - Postman Collection

## Como Atualizar a Collection do Postman

### Método 1: Manual (Recomendado)
Sempre que adicionar novas rotas:

1. Abra o arquivo `Loja-Virtual-API.postman_collection.json`
2. Adicione a nova requisição seguindo o padrão existente
3. No Postman, reimporte o arquivo (sobrescreve a collection antiga)

### Método 2: Usando a Extensão do VS Code
Se você tem a extensão Postman instalada:

1. Instale a extensão "Postman" no VS Code
2. Clique com botão direito no arquivo `.postman_collection.json`
3. Selecione "Send to Postman"
4. A collection será atualizada automaticamente no Postman

### Método 3: Sincronização via Workspace do Postman
1. No Postman, salve a collection em um Workspace
2. Use o Postman Agent ou Desktop App
3. As alterações feitas no arquivo JSON serão sincronizadas automaticamente

### Estrutura para Adicionar Nova Requisição

```json
{
  "name": "Nome da Requisição",
  "request": {
    "method": "GET|POST|PUT|DELETE",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"campo\": \"valor\"\n}"
    },
    "url": {
      "raw": "http://localhost:3000/api/rota",
      "protocol": "http",
      "host": ["localhost"],
      "port": "3000",
      "path": ["api", "rota"]
    }
  }
}
```

### Dica
Use o Swagger (`http://localhost:3000/api-docs`) para testar as rotas primeiro e depois adicione na collection do Postman.

## Rotas Disponíveis

### Users
- POST `/api/users/register-client` - Cadastrar cliente
- POST `/api/users/register` - Cadastrar admin
- POST `/api/users/login` - Login

### Products
- GET `/api/products` - Listar produtos (público)
- GET `/api/products/:id` - Buscar produto (público)
- POST `/api/products/create` - Criar produto (admin)
- PUT `/api/products/:id` - Atualizar produto (admin)
- DELETE `/api/products/:id` - Deletar produto (admin)

### Purchases
- POST `/api/purchases` - Criar compra (autenticado)
- GET `/api/purchases/my-purchases` - Minhas compras (autenticado)

### System
- GET `/` - Root
- GET `/health` - Health check
