import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import session from "express-session";
import cookieParser from "cookie-parser";

import userRouter from "./resources/user/user.router";
import productRouter from "./resources/product/product.router";
import purchaseRouter from "./resources/purchase/purchase.router";
import languageRouter from "./resources/language/language.router";
import { requireLogin, requireAdmin } from "./middlewares/auth";
import { setLangCookie } from "./middlewares/setLangCookie";

import Config from "./config/setting";
import { initUserTypes } from "./services/initUserTypes.service";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(setLangCookie);

// --- SESSÃO (Obrigatório entre os middlewares e as rotas) ---
app.use(
  session({
    secret: Config.security.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hora
    },
  }),
);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Loja Virtual API",
      version: "1.0.0",
      description:
        "Documentação da API da Loja Virtual (Node + Express + Swagger)",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
  },
  apis:
    process.env.NODE_ENV === "production"
      ? ["./dist/**/*.js"]
      : ["./src/**/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Loja Virtual Backend - OK" });
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
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", uptime: process.uptime() });
});

// Rotas de usuário (login, registro etc.)
app.use("/api/users", userRouter);

// Rotas de produtos
app.use("/api/products", productRouter);

// Rotas de compras
app.use("/api/purchases", purchaseRouter);

// Rotas de idioma
app.use("/language", languageRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📘 Swagger disponível em http://localhost:${PORT}/api-docs`);

    // Inicializa os tipos de usuário no banco de dados
    await initUserTypes();
  });
}

export default app;
