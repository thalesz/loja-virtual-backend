import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { registerClientController } from "./controllers/register-client.controller";
import { authUserController } from "./controllers/auth.controller";
import { requireLogin, requireAdmin } from "../../middlewares/auth";

const userRouter = Router();

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário (somente admin)
 *     tags:
 *       - Usuários
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userType:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Não autenticado
 *       '403':
 *         description: Sem permissão (não é admin)
 *       '409':
 *         description: E-mail já cadastrado
 */
userRouter.post(
  "/register",
  requireLogin,
  requireAdmin,
  registerUserController,
);

/**
 * @openapi
 * /api/users/register-client:
 *   post:
 *     summary: Registra um novo cliente (público)
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               password:
 *                 type: string
 *                 example: senha123
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: Cliente cadastrado com sucesso
 *       '400':
 *         description: Dados inválidos
 *       '409':
 *         description: E-mail já cadastrado
 */
userRouter.post("/register-client", registerClientController);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Realiza login de usuário
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@exemplo.com
 *               password:
 *                 type: string
 *                 example: senha123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userType:
 *                       type: string
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Credenciais inválidas
 */
userRouter.post("/login", authUserController); // POST /users/login

export default userRouter;
