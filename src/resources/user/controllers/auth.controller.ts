import type { Request, Response } from "express";
import { authUserService } from "../services/auth.service";
import type { AuthUserDTO } from "../types/auth-user.dto";

export async function authUserController(req: Request, res: Response) {
  try {
    const { email, password } = req.body as AuthUserDTO;

    // Validação básica
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios." });
    }

    // Autentica o usuário
    const user = await authUserService({ email, password });

    // Salva o usuário na sessão
    req.session.userId = user.id;
    req.session.userType = user.userType.name;

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType.name,
      },
    });
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    return res
      .status(401)
      .json({ error: error.message || "Erro ao fazer login." });
  }
}
