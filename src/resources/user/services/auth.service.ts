import bcrypt from "bcryptjs";
import prisma from "../../../prisma/prisma.client";
import type { AuthUserDTO } from "../types/auth-user.dto";

export async function authUserService({ email, password }: AuthUserDTO) {
  // Busca o usuário pelo e-mail
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userType: true,
    },
  });

  if (!user) {
    throw new Error("Credenciais inválidas.");
  }

  // Verifica a senha
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas.");
  }

  // Remove o campo password antes de retornar
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
