import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { OrderItemModule } from 'src/modules/order-item/order-item.module';
import { InMemoryOrderItemRepository } from 'src/modules/order-item/repository/in-memory/in-memory.order-item.repository';
import { OrderItemRepository } from 'src/modules/order-item/repository/order-item.repository';
import * as request from 'supertest';

describe('OrderItem', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [OrderItemModule],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(OrderItemRepository)
      .useClass(InMemoryOrderItemRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /order-item should insert a new order item', () => {
    return request(app.getHttpServer())
      .post('/order-item')
      .send({ quantity: 10, productId: 1 })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.quantity).toBeDefined();
        expect(body.productId).toBeDefined();
        expect(body.orders).toBeDefined();
        expect(body.product).toBeDefined();
      });
  });

  it('PATCH /order-item/:id should update order item', () => {
    return request(app.getHttpServer())
      .patch('/order-item/1')
      .send({ quantity: 0 })
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.quantity).toBeDefined();
        expect(body.productId).toBeDefined();
        expect(body.orders).toBeDefined();
        expect(body.product).toBeDefined();
      });
  });

  it('GET /order-item/find/:id should get a order item by id', () => {
    return request(app.getHttpServer())
      .get('/order-item/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.quantity).toBeDefined();
        expect(body.productId).toBeDefined();
        expect(body.orders).toBeDefined();
        expect(body.product).toBeDefined();
      });
  });

  it('GET /order-item/find should get all order items', () => {
    return request(app.getHttpServer())
      .get('/order-item/find')
      .expect(200)
      .expect(({ body }) => {
        expect(body.info.nextPageUrl).toBeDefined();
        expect(body.info.prevPageUrl).toBeDefined();
        expect(body.info.totalOfItems).toBeDefined();
        expect(body.info.totalOfPages).toBeDefined();
        expect(body.results).toBeDefined();
        expect(Array.isArray(body.results)).toBe(true);
      });
  });

  it('DELETE /order-item/:id should delete a order item', () => {
    return request(app.getHttpServer())
      .delete('/order-item/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.quantity).toBeDefined();
        expect(body.productId).toBeDefined();
        expect(body.orders).toBeDefined();
        expect(body.product).toBeDefined();
      });
  });

  it('GET /order-item/find/:id should return a not found message', () => {
    return request(app.getHttpServer())
      .get('/order-item/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('DELETE /order-item/:id should return a error object', () => {
    return request(app.getHttpServer())
      .delete('/order-item/1')
      .send({ quantity: 0 })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('PATCH /order-item/:id should return a error object', () => {
    return request(app.getHttpServer())
      .patch('/order-item/1')
      .send({ quantity: 0 })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
