import bcrypt from "bcryptjs";
import prisma from "../../../prisma/prisma.client";
import type { RegisterClientDTO } from "../types/register-client.dto";

export async function registerClientService({
  name,
  email,
  password,
}: RegisterClientDTO) {
  // Verifica se o e-mail já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  // Busca o UserType 'cliente' (deve existir após initUserTypes)
  const clientUserType = await prisma.userType.findFirst({
    where: { name: "user" },
  });

  if (!clientUserType) {
    throw new Error('Tipo de usuário "cliente" não encontrado.');
  }

  // Cria o usuário como cliente
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password, // já vem criptografada do controller
      userType: { connect: { id: clientUserType.id } },
    },
    include: {
      userType: {
        select: {
          name: true,
        },
      },
    },
  });

  // Remove o campo password e userTypeId antes de retornar
  const {
    password: _,
    userTypeId: __,
    userType,
    ...userWithoutPassword
  } = user;
  return {
    ...userWithoutPassword,
    userType: userType.name,
  };
}
