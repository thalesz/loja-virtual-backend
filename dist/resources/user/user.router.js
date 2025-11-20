"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controller_1 = require("./controllers/register.controller");
const userRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Registra um novo usuário
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
 *       '409':
 *         description: E-mail já cadastrado
 */
userRouter.post('/', register_controller_1.registerUserController); // POST /users/
exports.default = userRouter;
