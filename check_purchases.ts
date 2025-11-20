import prisma from './src/prisma/prisma.client';

async function main() {
  console.log('Iniciando verificação...');
  const purchases = await prisma.purchase.findMany();
  console.log('Compras encontradas:', purchases);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
