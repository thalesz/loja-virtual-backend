import { Router } from "express";
import { changeLanguageController } from "./controllers/change-language.controller";

const router = Router();

/**
 * @openapi
 * /language/change:
 *   get:
 *     summary: Altera o idioma da aplicação
 *     description: Atualiza o cookie 'lang' com o idioma fornecido via query param.
 *     tags:
 *       - Idioma
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           example: en-US
 *         required: true
 *         description: "Código do idioma desejado (ex: pt-BR, en-US)"
 *     responses:
 *       200:
 *         description: Idioma alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Idioma alterado para en-US
 *       400:
 *         description: Idioma não fornecido
 */
router.get("/change", changeLanguageController);

export default router;
