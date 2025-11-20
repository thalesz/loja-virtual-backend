// Carrega .env se o pacote `dotenv` estiver disponível (opcional).
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
} catch (e) {
  // dotenv não está instalado — tudo bem, assumimos que as variáveis
  // já estão disponíveis em process.env em ambientes de produção.
}

import { cleanEnv, str, url, port } from "envalid";

// Validação das variáveis de ambiente da aplicação.
// Caso alguma variável esteja ausente ou com tipo incorreto, `cleanEnv`
// lançará um erro (e o processo deverá encerrar) — comportamento
// exigido pelo enunciado.
const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  PORT: port({ default: 3000 }),
  DATABASE_URL: url(),
  // Se quiser, adicione aqui outras variáveis obrigatórias como:
  // SESSION_SECRET: str(),
  // JWT_SECRET: str(),
});

// Exporta as variáveis validadas para uso na aplicação.
export const NODE_ENV = env.NODE_ENV;
export const PORT = env.PORT;
export const DATABASE_URL = env.DATABASE_URL;

export default env;
