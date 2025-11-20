import prisma from "../prisma/prisma.client";

async function fixUserTypes() {
  try {
    console.log("🔧 Corrigindo tipos de usuário...");

    // Atualiza o tipo com ID 1 para 'admin'
    const type1 = await prisma.userType.findUnique({ where: { id: 1 } });
    if (type1 && type1.name !== "admin") {
      await prisma.userType.update({
        where: { id: 1 },
        data: { name: "admin" },
      });
      console.log(`✅ Tipo ID 1 corrigido: '${type1.name}' → 'admin'`);
    }

    // Atualiza o tipo com ID 2 para 'user' se necessário
    const type2 = await prisma.userType.findUnique({ where: { id: 2 } });
    if (type2 && type2.name !== "user") {
      await prisma.userType.update({
        where: { id: 2 },
        data: { name: "user" },
      });
      console.log(`✅ Tipo ID 2 corrigido: '${type2.name}' → 'user'`);
    }

    console.log("✅ Tipos de usuário corrigidos com sucesso!");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Erro ao corrigir tipos:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixUserTypes();
