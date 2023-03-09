import { PrismaClient } from '@prisma/client';
import seederCategory from 'src/modules/category/seed/category.seed';
import seederClient from 'src/modules/client/seed/client.seed';
import seederOrderItem from 'src/modules/order-item/seed/order-item.seed';
import seederOrderItems from 'src/modules/order-items/seed/order-items.seed';
import seederOrder from 'src/modules/order/seed/order.seed';
import seederProduct from 'src/modules/product/seed/product.seed';

const prisma = new PrismaClient();

async function mainSeeder() {
  const categories = seederCategory(3);
  const products = seederProduct(30, 1, 3);
  const orderItem = seederOrderItem(30);
  const orderItems = seederOrderItems(30);
  const orders = seederOrder(30);
  const clients = seederClient(30);

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.product.createMany({
    data: products,
  });

  await prisma.orderItem.createMany({
    data: orderItem,
  });

  await prisma.client.createMany({
    data: clients,
  });

  await prisma.order.createMany({
    data: orders,
  });

  await prisma.orderItems.createMany({
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
