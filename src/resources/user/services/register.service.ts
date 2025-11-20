import prisma from "../../../prisma/prisma.client";
import type { RegisterUserDTO } from "../types/register-user.dto";

export async function registerUserService({
  name,
  email,
  password,
  userTypeId,
}: RegisterUserDTO) {
  // Verifica se o e-mail já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  // verifica se o userTypeId é válido, se fornecido
  if (userTypeId) {
    const userType = await prisma.userType.findUnique({
      where: { id: userTypeId },
    });

    // Se o userTypeId não for válido, lança um erro
    if (!userType) {
      throw new Error("Tipo de usuário inválido.");
    }
  }

  const id_client = await prisma.userType.findFirst({
    where: { name: "user" },
  });

  if (!userTypeId && !id_client) {
    throw new Error("Tipo de usuário padrão não encontrado.");
  }

  // Determina o userTypeId a ser usado
  const finalUserTypeId = userTypeId ?? id_client!.id;

  // Cria o usuário com o userTypeId diretamente
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password, // já vem criptografada do controller
      userTypeId: finalUserTypeId,
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
