# Arquitetura do Sistema

[← Voltar para o Menu Principal](./README.md)

## Estrutura Modular (Requisito 2.1)

O servidor foi desenvolvido seguindo uma arquitetura em camadas para garantir organização, reuso e manutenibilidade. A estrutura de pastas segue o padrão exigido:

```
src/
├── config/         # Configurações globais
├── generated/      # Arquivos gerados (Prisma)
├── middlewares/    # Middlewares globais (Auth, Validação, Idioma)
├── prisma/         # Cliente do Prisma
├── resources/      # Módulos da aplicação (User, Product, Purchase)
│   ├── product/
│   │   ├── controllers/  # Tratam requisição/resposta
│   │   ├── services/     # Lógica de negócio
│   │   ├── types/        # DTOs e Interfaces
│   │   └── product.router.ts # Definição de rotas
├── services/       # Serviços compartilhados
├── types/          # Definições de tipos globais
├── utils/          # Utilitários (ex: getEnv)
└── app.ts          # Ponto de entrada da aplicação
```

### Camadas

1.  **Roteadores (`*.router.ts`)**: Definem os endpoints e aplicam middlewares específicos.
2.  **Controladores (`controllers/`)**: Recebem a requisição (`req`), extraem dados, chamam o serviço e retornam a resposta (`res`).
3.  **Serviços (`services/`)**: Contêm toda a regra de negócio e comunicação com o banco de dados via Prisma.
4.  **DTOs (`types/`)**: Definem o formato dos dados trafegados (Data Transfer Objects), garantindo tipagem forte.

## Boas Práticas (Requisito 2.8)

*   **Prettier**: Todo o código segue um padrão de formatação consistente.
*   **ESLint**: Configurado para garantir qualidade de código.
*   **Tratamento de Erros**: O sistema possui um handler global de erros em `app.ts` e blocos `try/catch` nos controllers para retornar status HTTP adequados (400, 401, 403, 404, 500).

---
[Próximo: Banco de Dados →](./database.md)
