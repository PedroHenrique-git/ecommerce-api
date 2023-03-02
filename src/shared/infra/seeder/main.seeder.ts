import { PrismaClient } from '@prisma/client';
import seederCategory from 'src/modules/category/seed/category.seed';

const prisma = new PrismaClient();

async function mainSeeder() {
  const categories = seederCategory(3);

  await prisma.category.createMany({
    data: categories,
  });
}

mainSeeder()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
