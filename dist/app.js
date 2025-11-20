"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const user_router_1 = __importDefault(require("./resources/user/user.router"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loja Virtual API',
            version: '1.0.0',
            description: 'Documentação da API da Loja Virtual (Node + Express + Swagger)',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local',
            },
        ],
    },
    // Use JS files in production (dist) and TS files in development so swagger-jsdoc
    // can find the JSDoc/OpenAPI comments regardless of how the app is run.
    apis: process.env.NODE_ENV === 'production' ? ['./dist/**/*.js'] : ['./src/**/*.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
/**
 * @openapi
 * /:
 *   get:
 *     summary: Retorna mensagem de status do backend
 *     tags:
 *       - Sistema
 *     responses:
 *       200:
 *         description: Mensagem de confirmação do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Loja Virtual Backend - OK
 */
app.get('/', (_req, res) => {
    res.json({ message: 'Loja Virtual Backend - OK' });
});
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Verifica o status de saúde do servidor
 *     tags:
 *       - Sistema
 *     responses:
 *       200:
 *         description: Status do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 */
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});
/**
 * @openapi
 * /produto:
 *   post:
 *     summary: Cadastra um novo produto
 *     tags:
 *       - Produtos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Camiseta Azul
 *               preco:
 *                 type: number
 *                 example: 49.90
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto criado com sucesso!
 */
app.post('/produto', (req, res) => {
    const { nome, preco } = req.body;
    if (!nome || preco === undefined) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }
    res.status(201).json({ message: 'Produto criado com sucesso!', produto: { nome, preco } });
});
// Routes
// Mount userRouter under /api/users so the registration endpoint is POST /api/users
app.use('/api/users', user_router_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
});
// Start server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
        console.log(`📘 Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
}
exports.default = app;
