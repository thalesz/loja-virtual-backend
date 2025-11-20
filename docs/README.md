# Loja Virtual - Backend
## Universidade Federal do Amazonas - IC
### Programação para a Web II – 2025/02

Este repositório contém a implementação do Backend para o Trabalho Prático da disciplina. O sistema é uma API REST desenvolvida com **Node.js, Express, TypeScript e Prisma ORM**.

---

## 📚 Documentação do Projeto

A documentação foi dividida em seções para facilitar a navegação e o entendimento de cada requisito solicitado.

### 1. [Configuração e Instalação](./setup.md)
*   Como rodar o projeto.
*   Validação de variáveis de ambiente (**Requisito 2.2**).
*   Scripts de inicialização e formatação (**Requisito 2.8**).

### 2. [Arquitetura do Sistema](./architecture.md)
*   Estrutura de pastas e modularização (**Requisito 2.1**).
*   Padrões de projeto (Router, Controller, Service).
*   Uso de DTOs e Boas Práticas (**Requisito 2.8**).

### 3. [Banco de Dados (Prisma ORM)](./database.md)
*   Modelagem das tabelas (**Requisito 2.4**).
*   Relacionamentos (User, Product, Purchase).

### 4. [Autenticação e Sessão](./auth.md)
*   Criação de contas e Criptografia (**Requisito 2.6**).
*   Gerenciamento de Sessões e Cookies (**Requisito 2.7**).
*   Middlewares de Proteção.

### 5. [Funcionalidades e Regras de Negócio](./features.md)
*   Gerenciamento de Produtos e Validação Joi (**Requisito 2.3**).
*   Sistema de Compras e Status.
*   Middleware de Idioma (**Requisito 2.5**).

---

## 🚀 Resumo Tecnológico

*   **Linguagem:** TypeScript
*   **Framework:** Express
*   **ORM:** Prisma
*   **Banco de Dados:** MySQL
*   **Validação:** Joi & Envalid
*   **Autenticação:** Bcryptjs & Express-session
*   **Testes:** Jest & Supertest

[Começar pela Configuração →](./setup.md)
