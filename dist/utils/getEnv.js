"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URL = exports.PORT = exports.NODE_ENV = void 0;
// Carrega .env se o pacote `dotenv` estiver disponível (opcional).
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("dotenv").config();
}
catch (e) {
    // dotenv não está instalado — tudo bem, assumimos que as variáveis
    // já estão disponíveis em process.env em ambientes de produção.
}
const envalid_1 = require("envalid");
// Validação das variáveis de ambiente da aplicação.
// Caso alguma variável esteja ausente ou com tipo incorreto, `cleanEnv`
// lançará um erro (e o processo deverá encerrar) — comportamento
// exigido pelo enunciado.
const env = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)({
        choices: ["development", "production", "test"],
        default: "development",
    }),
    PORT: (0, envalid_1.port)({ default: 3000 }),
    DATABASE_URL: (0, envalid_1.url)(),
    // Se quiser, adicione aqui outras variáveis obrigatórias como:
    // SESSION_SECRET: str(),
    // JWT_SECRET: str(),
});
// Exporta as variáveis validadas para uso na aplicação.
exports.NODE_ENV = env.NODE_ENV;
exports.PORT = env.PORT;
exports.DATABASE_URL = env.DATABASE_URL;
exports.default = env;
