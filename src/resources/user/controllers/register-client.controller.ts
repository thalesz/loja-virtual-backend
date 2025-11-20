import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { registerClientService } from "../services/register-client.service";
import type { RegisterClientDTO } from "../types/register-client.dto";

export async function registerClientController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    // Protege contra req.body undefined
    const { name, email, password } = (req.body ?? {}) as RegisterClientDTO;

    // Validações básicas
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email e password são obrigatórios." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "E-mail inválido." });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ message: "A senha deve ter pelo menos 6 caracteres." });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await registerClientService({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(user);
  } catch (err: any) {
    console.error(err);

    // Verifica se é erro de e-mail duplicado
    if (err?.message === "E-mail já cadastrado.") {
      return res.status(409).json({ message: err.message });
    }

    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
