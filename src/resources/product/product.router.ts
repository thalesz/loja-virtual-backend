import { Router } from "express";
import { createProductController } from "./controllers/product-create.controller";
import { updateProductController } from "./controllers/product-update.controller";
import { listProductsController } from "./controllers/product-list.controller";
import { getProductByIdController } from "./controllers/product-get.controller";
import { deleteProductController } from "./controllers/product-delete.controller";
import { createProductSchema } from "./types/product-create.dto";
import { updateProductSchema } from "./types/product-update.dto";
import { listProductsSchema } from "./types/product-list.dto";
import { validate } from "../../middlewares/validate";
import { validateQuery } from "../../middlewares/validateQuery";
import { requireLogin, requireAdmin } from "../../middlewares/auth";

const router = Router();

/**
 * @openapi
 * /api/products/create:
 *   post:
 *     summary: Cria um novo produto (requer autenticação e perfil admin)
 *     tags:
 *       - Produtos
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Notebook Dell Inspiron
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: Notebook Dell Inspiron 15 com processador Intel Core i5
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 2999.90
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto criado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Notebook Dell Inspiron
 *                     description:
 *                       type: string
 *                       example: Notebook Dell Inspiron 15 com processador Intel Core i5
 *                     price:
 *                       type: number
 *                       example: 2999.90
 *                     stock:
 *                       type: integer
 *                       example: 10
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-17T10:30:00.000Z
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro de validação
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: name
 *                       message:
 *                         type: string
 *                         example: O nome é obrigatório
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Você precisa estar logado
 *       403:
 *         description: Acesso negado (não é admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Acesso permitido somente para admin
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao criar produto
 */
router.post(
  "/create",
  requireLogin,
  requireAdmin,
  validate(createProductSchema),
  createProductController,
);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente (requer autenticação e perfil admin)
 *     description: Permite atualização parcial - envie apenas os campos que deseja atualizar
 *     tags:
 *       - Produtos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser atualizado
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Notebook Dell Inspiron 15 - Atualizado
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: Notebook Dell Inspiron 15 com processador Intel Core i7
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 3299.90
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto atualizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Notebook Dell Inspiron 15 - Atualizado
 *                     description:
 *                       type: string
 *                       example: Notebook Dell Inspiron 15 com processador Intel Core i7
 *                     price:
 *                       type: number
 *                       example: 3299.90
 *                     stock:
 *                       type: integer
 *                       example: 15
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-17T10:30:00.000Z
 *       400:
 *         description: Erro de validação ou ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pelo menos um campo deve ser fornecido para atualização
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Você precisa estar logado
 *       403:
 *         description: Acesso negado (não é admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Acesso permitido somente para admin
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto não encontrado
 *       409:
 *         description: Conflito - nome duplicado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Já existe outro produto com este nome
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao atualizar produto
 */
router.put(
  "/:id",
  requireLogin,
  requireAdmin,
  validate(updateProductSchema),
  updateProductController,
);

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Lista produtos com paginação (acesso público)
 *     description: Retorna uma lista paginada de produtos, 10 por página por padrão
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de itens por página
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produtos listados com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Notebook Dell Inspiron
 *                       description:
 *                         type: string
 *                         example: Notebook Dell Inspiron 15 com processador Intel Core i5
 *                       price:
 *                         type: number
 *                         example: 2999.90
 *                       stock:
 *                         type: integer
 *                         example: 10
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-17T10:30:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-17T10:30:00.000Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Erro de validação nos parâmetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro de validação nos parâmetros
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: page
 *                       message:
 *                         type: string
 *                         example: O número da página deve ser no mínimo 1
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao listar produtos
 */
router.get("/", validateQuery(listProductsSchema), listProductsController);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Busca um produto específico por ID (acesso público)
 *     description: Retorna todos os detalhes do produto incluindo descrição completa
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto encontrado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Notebook Dell Inspiron
 *                     description:
 *                       type: string
 *                       example: Notebook Dell Inspiron 15 com processador Intel Core i5, 8GB RAM, SSD 256GB
 *                     price:
 *                       type: number
 *                       example: 2999.90
 *                     stock:
 *                       type: integer
 *                       example: 10
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-17T10:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-17T10:30:00.000Z
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID do produto inválido
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao buscar produto
 */
router.get("/:id", getProductByIdController);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Deleta um produto (requer autenticação e perfil admin)
 *     description: Remove permanentemente um produto do sistema. Não é possível deletar produtos com compras associadas.
 *     tags:
 *       - Produtos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser deletado
 *         example: 1
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto deletado com sucesso
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID do produto inválido
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Você precisa estar logado
 *       403:
 *         description: Acesso negado (não é admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Acesso permitido somente para admin
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto não encontrado
 *       409:
 *         description: Conflito - produto possui compras associadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não é possível deletar o produto pois ele possui compras associadas
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao deletar produto
 */
router.delete("/:id", requireLogin, requireAdmin, deleteProductController);

export default router;
