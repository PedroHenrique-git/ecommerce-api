import { PrismaClient } from '@prisma/client';
import seederCategory from 'src/modules/category/seed/category.seed';
import seederOrderItem from 'src/modules/order-item/seed/order-item.seed';
import seederProduct from 'src/modules/product/seed/product.seed';

const prisma = new PrismaClient();

async function mainSeeder() {
  const categories = seederCategory(3);
  const products = seederProduct(30, 1, 3);
  const orderItems = seederOrderItem(30);

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.product.createMany({
    data: products,
  });

  await prisma.orderItem.createMany({
    data: orderItems,
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
