"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserService = registerUserService;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma.client"));
async function registerUserService({ name, email, password, userType = 'cliente', }) {
    // Verifica se o e-mail já existe
    const existingUser = await prisma_client_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error('E-mail já cadastrado.');
    }
    // (Opcional) se quiser garantir que a senha esteja criptografada aqui também:
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Cria o usuário
    // Garante que exista um UserType correspondente (procura por nome; cria se não existir)
    let userTypeRecord = await prisma_client_1.default.userType.findFirst({ where: { name: userType } });
    if (!userTypeRecord) {
        userTypeRecord = await prisma_client_1.default.userType.create({ data: { name: userType } });
    }
    const user = await prisma_client_1.default.user.create({
        data: {
            name,
            email,
            password, // já vem criptografada do controller
            userType: { connect: { id: userTypeRecord.id } },
        },
    });
    // Remove o campo password antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
