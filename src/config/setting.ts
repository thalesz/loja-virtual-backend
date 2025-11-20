import dotenv from "dotenv";
dotenv.config();

class Config {
  // Lê variável do .env com fallback opcional
  private static getEnv(key: string, fallback?: string): string {
    const value = process.env[key];
    if (!value && fallback === undefined) {
      throw new Error(`❌ Variável de ambiente ausente: ${key}`);
    }
    return value || fallback!;
  }

  // --- GROUP: DATABASE ---
  static readonly database = {
    url: this.getEnv("DATABASE_URL"),
  };

  // --- GROUP: SECURITY ---
  static readonly security = {
    secretKey: this.getEnv("SECRET_KEY"),
  };
}

export default Config;
