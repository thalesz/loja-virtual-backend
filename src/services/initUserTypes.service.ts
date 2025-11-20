import prisma from "../prisma/prisma.client";
import userType from "../types/usertype";

/**
 * Serviço que inicializa os tipos de usuário no banco de dados
 * Executado automaticamente ao iniciar o servidor
 */
export async function initUserTypes(): Promise<void> {
  try {
    console.log("🔍 Verificando tipos de usuário no banco de dados...");

    // Percorre todos os tipos definidos no userType
    for (const key of Object.keys(userType)) {
      const id = Number(key);
      const name = userType[id as keyof typeof userType];

      // Verifica se o tipo já existe
      const existingType = await prisma.userType.findUnique({
        where: { id },
      });

      if (!existingType) {
        // Se não existe, cria o tipo
        await prisma.userType.create({
          data: {
            id,
            name,
          },
        });
        console.log(`✅ Tipo de usuário criado: ${name} (ID: ${id})`);
      } else {
        console.log(`ℹ️  Tipo de usuário já existe: ${name} (ID: ${id})`);
      }
    }

    console.log("✅ Inicialização dos tipos de usuário concluída!");
  } catch (error) {
    console.error("❌ Erro ao inicializar tipos de usuário:", error);
    throw error;
  }
}
