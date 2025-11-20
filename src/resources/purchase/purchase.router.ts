import { Router } from "express";
import { createPurchaseController } from "./controllers/purchase-create.controller";
import { listMyPurchasesController } from "./controllers/purchase-list-my.controller";
import { listAllPurchasesController } from "./controllers/purchase-list-all.controller";
import { getPurchaseController } from "./controllers/purchase-get.controller";
import { cancelPurchaseController } from "./controllers/purchase-cancel.controller";
import { updatePurchaseStatusController } from "./controllers/purchase-update-status.controller";
import { getPurchaseReportController } from "./controllers/purchase-report.controller";
import { createPurchaseSchema } from "./types/purchase-create.dto";
import { listMyPurchasesSchema } from "./types/purchase-list-my.dto";
import { listAllPurchasesSchema } from "./types/purchase-list-all.dto";
import { updatePurchaseStatusSchema } from "./types/purchase-update-status.dto";
import { validate } from "../../middlewares/validate";
import { validateQuery } from "../../middlewares/validateQuery";
import { requireLogin, requireAdmin } from "../../middlewares/auth";

const router = Router();

/**
 * @openapi
 * /api/purchases:
 *   post:
 *     summary: Cria uma nova compra (requer autenticação)
 *     description: Cliente autenticado pode criar um pedido. Valida estoque, calcula total e atualiza estoque dos produtos
 *     tags:
 *       - Compras
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *           example:
 *             items:
 *               - productId: 1
 *                 quantity: 2
 *               - productId: 3
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Compra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra realizada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productName:
 *                             type: string
 *                             example: Notebook Dell
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 2999.90
 *                           subtotal:
 *                             type: number
 *                             example: 5999.80
 *                     total:
 *                       type: number
 *                       example: 5999.80
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-20T10:30:00.000Z
 *       400:
 *         description: Erro de validação ou estoque insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estoque insuficiente para o produto "Notebook Dell". Disponível 5, Solicitado 10
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você precisa estar logado para realizar uma compra
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produtos não encontrados 10, 15
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao criar compra
 */
/**
 * @openapi
 * /api/purchases/all:
 *   get:
 *     summary: Lista todas as compras (apenas admin)
 *     description: Retorna uma lista paginada de todas as compras com suporte a filtros por status, usuário e intervalo de datas
 *     tags:
 *       - Compras
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *         description: Filtrar por status da compra
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial do intervalo (ISO 8601)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final do intervalo (ISO 8601)
 *     responses:
 *       200:
 *         description: Lista de compras retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compras listadas com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: João Silva
 *                           email:
 *                             type: string
 *                             example: joao@example.com
 *                       totalAmount:
 *                         type: number
 *                         example: 5999.80
 *                       itemCount:
 *                         type: integer
 *                         example: 3
 *                       status:
 *                         type: string
 *                         example: PENDING
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (não é admin)
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/all",
  requireLogin,
  requireAdmin,
  validateQuery(listAllPurchasesSchema),
  listAllPurchasesController,
);

router.post(
  "/",
  requireLogin,
  validate(createPurchaseSchema),
  createPurchaseController,
);

/**
 * @openapi
 * /api/purchases/my-purchases:
 *   get:
 *     summary: Busca uma compra específica por ID
 *     description: Retorna detalhes completos de uma compra. Apenas o dono da compra ou admin pode visualizar.
 *     tags:
 *       - Compras
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da compra
 *         example: 1
 *     responses:
 *       200:
 *         description: Compra encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra encontrada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: Notebook Dell
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           unitPrice:
 *                             type: number
 *                             example: 2999.90
 *                           totalPrice:
 *                             type: number
 *                             example: 5999.80
 *                     totalAmount:
 *                       type: number
 *                       example: 5999.80
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-20T10:30:00.000Z
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você precisa estar logado para visualizar compras
 *       403:
 *         description: Sem permissão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você não tem permissão para visualizar esta compra
 *       404:
 *         description: Compra não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra não encontrada
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: O ID deve ser um número inteiro
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao listar compras
 */
router.get(
  "/my-purchases",
  requireLogin,
  validateQuery(listMyPurchasesSchema),
  listMyPurchasesController,
);

/**
 * @openapi
 * /api/purchases/reports/summary:
 *   get:
 *     summary: Relatório de vendas (Admin)
 *     description: Retorna um resumo das vendas, incluindo receita total, quantidade de compras, ticket médio e produtos mais vendidos. Exclui compras canceladas.
 *     tags:
 *       - Compras
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   description: Receita total de vendas (excluindo canceladas)
 *                   example: 15000.50
 *                 totalPurchases:
 *                   type: integer
 *                   description: Quantidade total de compras (excluindo canceladas)
 *                   example: 150
 *                 averageTicket:
 *                   type: number
 *                   description: Valor médio por compra
 *                   example: 100.00
 *                 topSellingProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       productName:
 *                         type: string
 *                         example: "Smartphone XYZ"
 *                       totalQuantity:
 *                         type: integer
 *                         example: 50
 *                       totalRevenue:
 *                         type: number
 *                         example: 5000.00
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (não é Admin)
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/reports/summary", requireAdmin, getPurchaseReportController);

/**
 * @openapi
 * /api/purchases/{id}:
 *   get:
 *     summary: Lista as compras do usuário autenticado
 *     description: Retorna uma lista paginada das compras do usuário logado, ordenadas por data (mais recente primeiro)
 *     tags:
 *       - Compras
 *     security:
 *       - cookieAuth: []
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
 *         description: Lista de compras retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compras listadas com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       total:
 *                         type: number
 *                         example: 5999.80
 *                       itemCount:
 *                         type: integer
 *                         example: 3
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-20T10:30:00.000Z
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
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você precisa estar logado para visualizar suas compras
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
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao buscar compra
 */
router.get("/:id", requireLogin, getPurchaseController);

/**
 * @openapi
 * /api/purchases/{id}/cancel:
 *   patch:
 *     summary: Cancela uma compra específica
 *     description: Cancela uma compra e devolve o estoque dos produtos. Apenas o dono pode cancelar. Cancelamento permitido apenas para status PENDING ou PROCESSING.
 *     tags:
 *       - Compras
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da compra
 *         example: 1
 *     responses:
 *       200:
 *         description: Compra cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra cancelada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: Notebook Dell
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           totalPrice:
 *                             type: number
 *                             example: 5999.80
 *                     totalAmount:
 *                       type: number
 *                       example: 5999.80
 *                     status:
 *                       type: string
 *                       example: CANCELLED
 *                     cancelledAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-20T10:30:00.000Z
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-20T10:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-20T10:30:00.000Z
 *       400:
 *         description: Status não permite cancelamento ou ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra com status COMPLETED não pode ser cancelada. Apenas compras com status PENDING ou PROCESSING podem ser canceladas.
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você precisa estar logado para cancelar compras
 *       403:
 *         description: Sem permissão (não é o dono)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você não tem permissão para cancelar esta compra
 *       404:
 *         description: Compra não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra não encontrada
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor ao cancelar compra
 */
router.patch("/:id/cancel", requireLogin, cancelPurchaseController);

/**
 * @openapi
 * /api/purchases/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma compra (Admin)
 *     description: Admin pode alterar o status de uma compra seguindo o fluxo permitido (PENDING -> PROCESSING -> SHIPPED -> DELIVERED) ou cancelar.
 *     tags:
 *       - Compras
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *                 description: Novo status da compra
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status da compra atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Purchase'
 *       400:
 *         description: Dados inválidos ou transição de status não permitida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transição de status inválida de PENDING para DELIVERED
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (não é Admin)
 *       404:
 *         description: Compra não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch(
  "/:id/status",
  requireAdmin,
  validate(updatePurchaseStatusSchema),
  updatePurchaseStatusController,
);

export default router;
