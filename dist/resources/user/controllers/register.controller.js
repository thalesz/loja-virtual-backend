"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserController = registerUserController;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register_service_1 = require("../services/register.service");
async function registerUserController(req, res) {
    try {
        // Protege contra req.body undefined (ex: requisição sem Content-Type: application/json)
        const { name, email, password, userType } = (req.body ?? {});
        // Validações básicas
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email e password são obrigatórios.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'E-mail inválido.' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
        }
        // Criptografa a senha antes de enviar ao service (service também faz verificação/criptografia se necessário)
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await (0, register_service_1.registerUserService)({
            name,
            email,
            password: hashedPassword,
            userType,
        });
        return res.status(201).json(user);
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error && /already exists|exists/i.test(err.message)) {
            return res.status(409).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}
